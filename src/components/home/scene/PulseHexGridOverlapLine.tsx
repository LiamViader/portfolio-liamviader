"use client";

import * as THREE from "three";
import React, { useLayoutEffect, useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export type HexGridParams = {
  pixelsPerHex: number; // width flat-to-flat in px
  hue: number;          // base hue (0..360)
  hueJitter: number;    // ±deg around base hue
  s: number;            // saturation %
  l: number;            // lightness % (no efecto en el shader original, se mantiene para compat)
};

type HexData = {
  id: string;
  position: [number, number, number];
  baseScale: number;
  phase: number;
  depthOffset: number;
  hue: number;      // 0..1
  rotation: number; // radians
  baseOpacity: number;
};

export default function PulseHexGridOverlapLine({ params }: { params: HexGridParams }) {
  const { size, camera, gl } = useThree();
  const dpr = gl.getPixelRatio();
  const width = size.width / dpr;
  const height = size.height / dpr;

  useLayoutEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
    }
  }, [camera, width, height]);

  const { pixelsPerHex, hue, s, l, hueJitter } = params;

  const hexes = useMemo(
    () =>
      generateHexGrid(Math.floor(width), Math.floor(height), { pixelsPerHex, hue, s, l, hueJitter } as HexGridParams),
    [width, height, pixelsPerHex, hue, s, l, hueJitter]
  );

  const baseGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const pts: number[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 6 + (i * Math.PI) / 3;
      pts.push(Math.cos(angle), Math.sin(angle), 0);
    }
    const pos = new Float32Array(pts);
    const idx = new Uint16Array([0,1, 1,2, 2,3, 3,4, 4,5, 5,0]);
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3).setUsage(THREE.StaticDrawUsage));
    geom.setIndex(new THREE.BufferAttribute(idx, 1).setUsage(THREE.StaticDrawUsage));
    return geom;
  }, []);

  const instanced = useMemo(() => {
    if (!hexes.length) return null as unknown as {
      geom: THREE.InstancedBufferGeometry;
      mat: THREE.ShaderMaterial;
    };

    const geom = new THREE.InstancedBufferGeometry();
    geom.index = baseGeom.index!;
    geom.attributes.position = baseGeom.attributes.position;
    geom.instanceCount = hexes.length;

    const n = hexes.length;

    const STRIDE = 10;
    const data = new Float32Array(n * STRIDE);
    for (let i = 0; i < n; i++) {
      const h = hexes[i];
      const base = i * STRIDE;
      const rotC = Math.cos(h.rotation);
      const rotS = Math.sin(h.rotation);
      data[base + 0] = h.position[0];
      data[base + 1] = h.position[1];
      data[base + 2] = h.position[2];
      data[base + 3] = h.baseScale;
      data[base + 4] = h.hue;
      data[base + 5] = h.phase;
      data[base + 6] = h.depthOffset;
      data[base + 7] = h.baseOpacity;
      data[base + 8] = rotC;
      data[base + 9] = rotS;
    }
    const ib = new THREE.InstancedInterleavedBuffer(data, STRIDE).setUsage(THREE.StaticDrawUsage);

    geom.setAttribute("aOffset",  new THREE.InterleavedBufferAttribute(ib, 3, 0));
    geom.setAttribute("aScale",   new THREE.InterleavedBufferAttribute(ib, 1, 3));
    geom.setAttribute("aHue",     new THREE.InterleavedBufferAttribute(ib, 1, 4));
    geom.setAttribute("aPhase",   new THREE.InterleavedBufferAttribute(ib, 1, 5));
    geom.setAttribute("aDepth",   new THREE.InterleavedBufferAttribute(ib, 1, 6));
    geom.setAttribute("aOpacity", new THREE.InterleavedBufferAttribute(ib, 1, 7));
    geom.setAttribute("aRotC",    new THREE.InterleavedBufferAttribute(ib, 1, 8));
    geom.setAttribute("aRotS",    new THREE.InterleavedBufferAttribute(ib, 1, 9));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSPct01: { value: params.s / 100 }, 
        uLPct: { value: params.l },         
      },
      vertexShader: lineVertGLSL_Optimized,
      fragmentShader: lineFragGLSL_Optimized,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });

    geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), Math.hypot(width, height));

    return { geom, mat };
  }, [hexes, baseGeom, width, height, params.s, params.l]);

  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!instanced) return;
    const t = clock.getElapsedTime();
    instanced.mat.uniforms.uTime.value = t;

    const g = groupRef.current;
    if (g) {
      g.rotation.z = Math.sin(t * 0.18) * 0.04;
      g.position.z = Math.sin(t * 0.25) * 6;
    }
  });

  useEffect(() => {
    if (!instanced) return;
    instanced.mat.uniforms.uSPct01.value = params.s / 100;
    instanced.mat.uniforms.uLPct.value = params.l; 
  }, [instanced, params.s, params.l]);

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

function generateHexGrid(width: number, height: number, p: HexGridParams): HexData[] {
  if (width === 0 || height === 0) return [];

  const radius = p.pixelsPerHex / Math.sqrt(3);
  const hexWidth = Math.sqrt(3) * radius;
  const vSpacing = (3 / 2) * radius;
  const hSpacing = hexWidth;
  const margin = Math.ceil((width / hSpacing) * 0.05);
  const columns = Math.ceil(width / hSpacing) + margin;
  const rows = Math.ceil(height / vSpacing) + margin;

  const baseHue01 = (((p.hue % 360) + 360) % 360) / 360;
  const jitter01 = Math.abs(p.hueJitter) / 360;

  const hexes: HexData[] = [];
  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < columns; c++) {
      const offsetX = r % 2 !== 0 ? hSpacing / 2 : 0;
      const x = -width / 2 + c * hSpacing + offsetX;
      const y = -height / 2 + r * vSpacing - (margin * hexWidth * 0.5);
      const z = (Math.random() - 0.5) * 80;

      const hue = wrap01(baseHue01 + (Math.random() * 2 - 1) * jitter01);

      hexes.push({
        id: `${r}-${c}-${hexes.length}`,
        position: [x, y, z],
        baseScale: radius * (0.9 + Math.random() * 0.4),
        phase: Math.random() * Math.PI * 2,
        depthOffset: Math.random() * 6,
        hue,
        rotation: (Math.random() - 0.5) * 0.15,
        baseOpacity: 0.3 + Math.random() * 0.14,
      });
    }
  }
  return hexes;
}

function wrap01(n: number) {
  return (n % 1 + 1) % 1;
}


const lineVertGLSL_Optimized = /* glsl */`
  attribute vec3  aOffset;
  attribute float aScale;
  attribute float aHue;
  attribute float aPhase;
  attribute float aDepth;
  attribute float aOpacity;
  attribute float aRotC;
  attribute float aRotS;

  uniform float uTime;

  varying float vHue;
  varying float vAlpha;
  varying float vBright;

  void main(){
    float pulse = 1.0 + 0.08 * sin(uTime * 2.2 + aPhase);

    // rotación aplicada sin construir mat2
    vec2 v = position.xy * (aScale * pulse);
    vec2 p = vec2(v.x * aRotC - v.y * aRotS, v.x * aRotS + v.y * aRotC);

    float z = aOffset.z + sin(uTime * 1.4 + aPhase) * aDepth;

    // mismos valores que antes, pero ya listos para el fragment
    vBright = clamp(0.45 + 0.18 * sin(uTime * 1.7 + aPhase), 0.3, 0.7);
    vAlpha  = clamp(aOpacity + 0.25 * sin(uTime * 1.9 + aPhase), 0.15, 0.55);
    vHue    = aHue;

    vec3 world = vec3(aOffset.xy + p, z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
  }
`;

const lineFragGLSL_Optimized = /* glsl */`
  precision highp float;

  varying float vHue;
  varying float vAlpha;
  varying float vBright;

  uniform float uSPct01; // 0..1 (igual que uSPct/100.0)
  uniform float uLPct;   // mantenido para compat (no usado, como antes)

  vec3 hsl2rgb(vec3 hsl){
    float H = hsl.x;
    float S = clamp(hsl.y, 0.0, 1.0);
    float L = clamp(hsl.z, 0.0, 1.0);
    float C = (1.0 - abs(2.0*L - 1.0)) * S;
    float Hp = H * 6.0;
    float X = C * (1.0 - abs(mod(Hp, 2.0) - 1.0));
    vec3 rgb;
    if(Hp < 1.0) rgb = vec3(C, X, 0.0);
    else if(Hp < 2.0) rgb = vec3(X, C, 0.0);
    else if(Hp < 3.0) rgb = vec3(0.0, C, X);
    else if(Hp < 4.0) rgb = vec3(0.0, X, C);
    else if(Hp < 5.0) rgb = vec3(X, 0.0, C);
    else rgb = vec3(C, 0.0, X);
    float m = L - 0.5 * C;
    return rgb + m;
  }

  void main(){
    vec3 rgb = hsl2rgb(vec3(vHue, uSPct01, vBright));
    gl_FragColor = vec4(rgb, vAlpha);
  }
`;
