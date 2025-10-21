import * as THREE from "three";
import React, { useLayoutEffect, useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { HexGridParams } from "./PulseHexGridOverlapLine";

export type StrataMode = "rows" | "cols" | "diagA" | "diagB";
export type StrataOptions = {
  mode?: StrataMode;   // default "rows"
  amplitude?: number;  // px (default 10)
  speed?: number;      // ciclos/seg (default 0.3)
  phaseStep?: number;  // rad por estrato (default 0.6)
  jitter?: number;     // jitter extra de fase (no se usa en color, default 0.25)
};

const DEFAULTS: Required<StrataOptions> = {
  mode: "rows",
  amplitude: 10,
  speed: 0.3,
  phaseStep: 0.6,
  jitter: 0.25,
};

type HexInstance = {
  x: number; y: number; z: number;
  scale: number;
  rot: number;     // rad
  hue: number;     // 0..1
  phase: number;
  row: number; col: number;
};

export default function HexGridStrata({
  params,
  options,
}: {
  params: HexGridParams;
  options?: StrataOptions;
}) {
  const opt = { ...DEFAULTS, ...(options ?? {}) };

  const { size, camera, gl } = useThree();
  const dpr = gl.getPixelRatio();
  const width = size.width / dpr;
  const height = size.height / dpr;

  // Cámara ortográfica en px (antes del paint)
  useLayoutEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
    }
  }, [camera, width, height]);

  // Instancias del grid (posiciones, rotación, hue, fase, row/col)
  const instances = useMemo<HexInstance[]>(() => {
    const radius = params.pixelsPerHex / Math.sqrt(3);
    const hexWidth = Math.sqrt(3) * radius;
    const vSpacing = (3 / 2) * radius;
    const hSpacing = hexWidth;
    const margin = Math.ceil((width / hSpacing) * 0.05);
    const columns = Math.ceil(width / hSpacing) + margin;   // (fix del + +)
    const rows = Math.ceil(height / vSpacing) + margin;

    const baseHue01 = (((params.hue % 360) + 360) % 360) / 360;
    const jitter01 = Math.abs(params.hueJitter) / 360;

    const list: HexInstance[] = [];
    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < columns; c++) {
        const offsetX = r % 2 !== 0 ? hSpacing / 2 : 0;
        const x = -width / 2 + c * hSpacing + offsetX;
        const y = -height / 2 + r * vSpacing - (margin * hexWidth * 0.5);
        const z = (Math.random() - 0.5) * 6.0;

        const hue = wrap01(baseHue01 + (Math.random() * 2 - 1) * jitter01);
        const scale = radius * (0.92 + Math.random() * 0.16);
        const phase = Math.random() * Math.PI * 2;
        const rot = (Math.random() - 0.5) * 0.08;

        list.push({ x, y, z, scale, rot, hue, phase, row: r, col: c });
      }
    }
    return list;
  }, [width, height, params.pixelsPerHex, params.hue, params.hueJitter]);

  // Geometría base: contorno del hex (6 vértices) como LineSegments
  const baseGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const pts: number[] = [];
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 6 + (i * Math.PI) / 3;
      pts.push(Math.cos(a), Math.sin(a), 0);
    }
    const pos = new Float32Array(pts);
    const idx = new Uint16Array([0,1, 1,2, 2,3, 3,4, 4,5, 5,0]);
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3).setUsage(THREE.StaticDrawUsage));
    geom.setIndex(new THREE.BufferAttribute(idx, 1).setUsage(THREE.StaticDrawUsage));
    return geom;
  }, []);

  // Instanced + Shader optimizado
  const instanced = useMemo(() => {
    if (instances.length === 0) return null as unknown as {
      geom: THREE.InstancedBufferGeometry;
      mat: THREE.ShaderMaterial;
    };

    const geom = new THREE.InstancedBufferGeometry();
    geom.index = baseGeom.index!;
    // @ts-ignore
    geom.attributes.position = baseGeom.attributes.position;
    geom.instanceCount = instances.length;

    // Interleaved: [off.x, off.y, off.z, scale, hue, phase, row, col, rotC, rotS]
    const n = instances.length;
    const STRIDE = 10;
    const data = new Float32Array(n * STRIDE);
    for (let i = 0; i < n; i++) {
      const it = instances[i];
      const base = i * STRIDE;
      const rotC = Math.cos(it.rot);
      const rotS = Math.sin(it.rot);
      data[base + 0] = it.x;
      data[base + 1] = it.y;
      data[base + 2] = it.z;
      data[base + 3] = it.scale;
      data[base + 4] = it.hue;
      data[base + 5] = it.phase;
      data[base + 6] = it.row;
      data[base + 7] = it.col;
      data[base + 8] = rotC;
      data[base + 9] = rotS;
    }
    const ib = new THREE.InstancedInterleavedBuffer(data, STRIDE).setUsage(THREE.StaticDrawUsage);
    geom.setAttribute("aOffset", new THREE.InterleavedBufferAttribute(ib, 3, 0));
    geom.setAttribute("aScale",  new THREE.InterleavedBufferAttribute(ib, 1, 3));
    geom.setAttribute("aHue",    new THREE.InterleavedBufferAttribute(ib, 1, 4));
    geom.setAttribute("aPhase",  new THREE.InterleavedBufferAttribute(ib, 1, 5));
    geom.setAttribute("aRow",    new THREE.InterleavedBufferAttribute(ib, 1, 6));
    geom.setAttribute("aCol",    new THREE.InterleavedBufferAttribute(ib, 1, 7));
    geom.setAttribute("aRotC",   new THREE.InterleavedBufferAttribute(ib, 1, 8));
    geom.setAttribute("aRotS",   new THREE.InterleavedBufferAttribute(ib, 1, 9));

    // Shader: sin ramas de modo; color calculado en VERTEX (mismo look)
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:       { value: 0 },
        uSPct:       { value: params.s / 100 },
        uLPct:       { value: params.l / 100 },
        uAmplitude:  { value: opt.amplitude },
        uSpeed:      { value: opt.speed },
        uPhaseStep:  { value: opt.phaseStep },
        uModeW:      { value: modeWeights(opt.mode) }, // vec4 filas/cols/diagA/diagB
        uDir:        { value: modeDir(opt.mode) },     // vec2
      },
      vertexShader: /* glsl */`
        attribute vec3  aOffset;
        attribute float aScale;
        attribute float aHue;
        attribute float aPhase;
        attribute float aRow;
        attribute float aCol;
        attribute float aRotC;
        attribute float aRotS;

        uniform float uTime;
        uniform float uAmplitude;
        uniform float uSpeed;
        uniform float uPhaseStep;
        uniform vec4  uModeW; // pesos para rows, cols, diagA, diagB (one-hot)
        uniform vec2  uDir;   // dirección de desplazamiento
        uniform float uSPct;  // 0..1
        uniform float uLPct;  // 0..1

        varying vec3 vRGB;

        vec3 hsl2rgb(vec3 hsl){
          float H=hsl.x, S=clamp(hsl.y,0.,1.), L=clamp(hsl.z,0.,1.);
          float C=(1.-abs(2.*L-1.))*S;
          float Hp=H*6.0;
          float X=C*(1.-abs(mod(Hp,2.)-1.));
          vec3 rgb;
          if (Hp<1.) rgb=vec3(C,X,0.);
          else if (Hp<2.) rgb=vec3(X,C,0.);
          else if (Hp<3.) rgb=vec3(0.,C,X);
          else if (Hp<4.) rgb=vec3(0.,X,C);
          else if (Hp<5.) rgb=vec3(X,0.,C);
          else rgb=vec3(C,0.,X);
          float m=L-0.5*C;
          return rgb+m;
        }

        void main(){
          float t = uTime * uSpeed;

          // Estrato según pesos: dot([row, col, row+col, row-col], uModeW)
          float sRow   = aRow;
          float sCol   = aCol;
          float sDiagA = aRow + aCol;
          float sDiagB = aRow - aCol;
          float stripe = dot(vec4(sRow, sCol, sDiagA, sDiagB), uModeW);

          float phase = aPhase + stripe * uPhaseStep;
          float disp  = sin(6.2831853 * t + phase) * uAmplitude; // TWO_PI

          // rotación precomputada (sin mat2)
          vec2 v = position.xy * aScale;
          vec2 p = vec2(v.x * aRotC - v.y * aRotS, v.x * aRotS + v.y * aRotC);

          // desplazamiento por dirección del modo
          vec2 shift = uDir * disp;

          vec3 world = vec3(aOffset.xy + p + shift, aOffset.z);
          vRGB = hsl2rgb(vec3(aHue, uSPct, uLPct));

          gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
        }
      `,
      fragmentShader: /* glsl */`
        precision highp float;
        varying vec3 vRGB;
        void main(){
          gl_FragColor = vec4(vRGB, 0.85); // mismo alpha/look aditivo
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });

    geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), Math.hypot(width, height) + opt.amplitude);

    return { geom, mat };
  }, [instances, baseGeom, width, height, opt.amplitude, opt.speed, opt.phaseStep, opt.mode, params.s, params.l]);

  // Actualizar uniforms en runtime (sin recrear material)
  useEffect(() => {
    if (!instanced) return;
    instanced.mat.uniforms.uAmplitude.value = opt.amplitude;
    instanced.mat.uniforms.uSpeed.value = opt.speed;
    instanced.mat.uniforms.uPhaseStep.value = opt.phaseStep;
    instanced.mat.uniforms.uModeW.value = modeWeights(opt.mode);
    instanced.mat.uniforms.uDir.value = modeDir(opt.mode);
  }, [instanced, opt.amplitude, opt.speed, opt.phaseStep, opt.mode]);

  useEffect(() => {
    if (!instanced) return;
    instanced.mat.uniforms.uSPct.value = params.s / 100;
    instanced.mat.uniforms.uLPct.value = params.l / 100;
  }, [instanced, params.s, params.l]);

  // Animación global (idéntica)
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!instanced) return;
    const t = clock.getElapsedTime();
    instanced.mat.uniforms.uTime.value = t;
    const g = groupRef.current;
    if (g) {
      g.rotation.z = Math.sin(t * 0.18) * 0.04;
      g.position.z = Math.sin(t * 0.16) * 2.0;
    }
  });

  useEffect(() => () => {
    if (instanced) {
      instanced.geom.dispose();
      instanced.mat.dispose();
    }
    baseGeom.dispose();
  }, [instanced, baseGeom]);

  if (!instanced) return null;

  return (
    <group ref={groupRef} frustumCulled={false}>
      {/* @ts-ignore */}
      <lineSegments geometry={instanced.geom} material={instanced.mat} frustumCulled={false} renderOrder={1} />
    </group>
  );
}

/* ===== utils ===== */
function wrap01(n: number){ return (n % 1 + 1) % 1; }

function modeWeights(mode: StrataMode) {
  // filas, columnas, diagA, diagB
  switch (mode) {
    case "rows":  return new THREE.Vector4(1, 0, 0, 0);
    case "cols":  return new THREE.Vector4(0, 1, 0, 0);
    case "diagA": return new THREE.Vector4(0, 0, 1, 0);
    case "diagB": return new THREE.Vector4(0, 0, 0, 1);
  }
}

function modeDir(mode: StrataMode) {
  switch (mode) {
    case "rows":  return new THREE.Vector2(1, 0);
    case "cols":  return new THREE.Vector2(0, 1);
    case "diagA": return new THREE.Vector2(1, 1).normalize();
    case "diagB": return new THREE.Vector2(1,-1).normalize();
  }
}
