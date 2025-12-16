"use client";

import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { HexGridParams } from "./PulseHexGridOverlapLine";

export type StrataMode = "rows" | "cols" | "diagA" | "diagB";
export type StrataOptions = {
  mode?: StrataMode;     // (default "rows")
  amplitude?: number;    // (default 10)
  speed?: number;        // (default 0.3)
  phaseStep?: number;    // (default 0.6)
  jitter?: number;       // (default 0.25)
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
  rot: number;
  hue: number;  // 0..1
  phase: number;
  stripe: number; 
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

  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
    }
  }, [camera, width, height]);

  const instances = useMemo<HexInstance[]>(() => {
    const radius = params.pixelsPerHex / Math.sqrt(3);
    const hexWidth = Math.sqrt(3) * radius;
    const vSpacing = (3 / 2) * radius;
    const hSpacing = hexWidth;
    const margin = Math.ceil((width / hSpacing) * 0.05);
    const columns = Math.ceil(width / hSpacing) + + margin;
    const rows = Math.ceil(height / vSpacing) + + margin;

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

        const stripe = r;
        list.push({ x, y, z, scale, rot, hue, phase, stripe, row: r, col: c });
      }
    }
    return list;
  }, [width, height, params.pixelsPerHex, params.hue, params.hueJitter]);

  const baseGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const pts: number[] = [];
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 6 + (i * Math.PI) / 3;
      pts.push(Math.cos(a), Math.sin(a), 0);
    }
    const pos = new Float32Array(pts);
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const idx = new Uint16Array([0,1, 1,2, 2,3, 3,4, 4,5, 5,0]);
    geom.setIndex(new THREE.BufferAttribute(idx, 1));
    return geom;
  }, []);

  const instanced = useMemo(() => {
    if (instances.length === 0) return null as unknown as {
      geom: THREE.InstancedBufferGeometry;
      mat: THREE.ShaderMaterial;
    };
    const geom = new THREE.InstancedBufferGeometry();
    geom.index = baseGeom.index!;
    geom.attributes.position = baseGeom.attributes.position;
    geom.instanceCount = instances.length;

    const n = instances.length;
    const offsets = new Float32Array(n * 3);
    const scales = new Float32Array(n);
    const rotations = new Float32Array(n);
    const hues = new Float32Array(n);
    const phases = new Float32Array(n);
    const stripes = new Float32Array(n);
    const rows = new Float32Array(n);
    const cols = new Float32Array(n);

    for (let i = 0; i < n; i++) {
      const it = instances[i];
      offsets[i*3+0] = it.x;
      offsets[i*3+1] = it.y;
      offsets[i*3+2] = it.z;
      scales[i] = it.scale;
      rotations[i] = it.rot;
      hues[i] = it.hue;
      phases[i] = it.phase;
      stripes[i] = it.stripe;
      rows[i] = it.row;
      cols[i] = it.col;
    }

    geom.setAttribute("aOffset", new THREE.InstancedBufferAttribute(offsets, 3));
    geom.setAttribute("aScale", new THREE.InstancedBufferAttribute(scales, 1));
    geom.setAttribute("aRotation", new THREE.InstancedBufferAttribute(rotations, 1));
    geom.setAttribute("aHue", new THREE.InstancedBufferAttribute(hues, 1));
    geom.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));
    geom.setAttribute("aStripe", new THREE.InstancedBufferAttribute(stripes, 1));
    geom.setAttribute("aRow", new THREE.InstancedBufferAttribute(rows, 1));
    geom.setAttribute("aCol", new THREE.InstancedBufferAttribute(cols, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSPct: { value: params.s / 100 },
        uLPct: { value: params.l / 100 },
        uAmplitude: { value: opt.amplitude },
        uSpeed: { value: opt.speed },
        uPhaseStep: { value: opt.phaseStep },
        uMode: { value: modeToFloat(opt.mode) },
      },
      vertexShader: /* glsl */`
        attribute vec3 aOffset;
        attribute float aScale;
        attribute float aRotation;
        attribute float aHue;
        attribute float aPhase;
        attribute float aStripe;
        attribute float aRow;
        attribute float aCol;

        uniform float uTime;
        uniform float uAmplitude;
        uniform float uSpeed;
        uniform float uPhaseStep;
        uniform float uMode; // 0 rows, 1 cols, 2 diagA, 3 diagB

        varying float vHue;

        // Devuelve dirección de desplazamiento según modo y estrato
        vec2 stratDir(float mode){
          if (mode < 0.5) return vec2(1.0, 0.0);         // rows -> desplaza en X
          if (mode < 1.5) return vec2(0.0, 1.0);         // cols -> desplaza en Y
          if (mode < 2.5) return normalize(vec2(1.0, 1.0));   // diagA
          return normalize(vec2(1.0, -1.0));             // diagB
        }

        float stripeIndex(float mode){
          if (mode < 0.5) return aRow;             // filas
          if (mode < 1.5) return aCol;             // columnas
          if (mode < 2.5) return aRow + aCol;      // diag A
          return aRow - aCol;                      // diag B
        }

        void main(){
          float t = uTime * uSpeed;
          float s = stripeIndex(uMode);
          float phase = aPhase + s * uPhaseStep;
          float disp = sin(6.2831 * t + phase) * uAmplitude;

          // rotación leve por instancia (como tu código base)
          float cs = cos(aRotation), sn = sin(aRotation);
          mat2 R = mat2(cs, -sn, sn, cs);

          vec2 pLocal = R * (position.xy * aScale);

          // desplazamiento a lo largo de la dirección del estrato
          vec2 dir = stratDir(uMode);
          vec2 shift = dir * disp;

          vec3 world = vec3(aOffset.xy + pLocal + shift, aOffset.z);
          vHue = aHue;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
        }
      `,
      fragmentShader: /* glsl */`
        precision mediump float;
        uniform float uSPct;
        uniform float uLPct;
        varying float vHue;
        // HSL -> RGB
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
          vec3 rgb = hsl2rgb(vec3(vHue, uSPct, uLPct));
          gl_FragColor = vec4(rgb, 0.85); // contorno aditivo
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });

    return { geom, mat };
  }, [instances, baseGeom, opt.amplitude, opt.speed, opt.phaseStep, opt.mode, params.s, params.l]);

  useEffect(() => {
    if (!instanced) return;
    instanced.mat.uniforms.uAmplitude.value = opt.amplitude;
    instanced.mat.uniforms.uSpeed.value = opt.speed;
    instanced.mat.uniforms.uPhaseStep.value = opt.phaseStep;
    instanced.mat.uniforms.uMode.value = modeToFloat(opt.mode);
  }, [instanced, opt.amplitude, opt.speed, opt.phaseStep, opt.mode]);

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
      <lineSegments geometry={instanced.geom} material={instanced.mat} frustumCulled={false} renderOrder={1} />
    </group>
  );
}

function modeToFloat(m: StrataMode): number {
  return m === "rows" ? 0 : m === "cols" ? 1 : m === "diagA" ? 2 : 3;
}
function wrap01(n: number){ return (n % 1 + 1) % 1; }
