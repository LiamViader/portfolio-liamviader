import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

/** Configurable parameters for the grid */
export type HexGridParams = {
  /** Width of each hexagon (flat-to-flat) in pixels; smaller => denser grid */
  pixelsPerHex: number;
  /** Base hue (0–360 degrees in HSL) */
  hue: number;
  /** Random hue variation ±degrees around base hue */
  hueJitter: number;
  /** Base saturation percentage */
  s: number;
  /** Base lightness percentage */
  l: number;
};

// ================
// GPU versión: **Instanced LineSegments** (sin SDF, sin quads)
// Dibuja exactamente el mismo contorno que tu versión original (6 vértices),
// pero en **un solo draw call** con atributos por instancia y shader propio.
// Evitamos recortes y conservamos el look original de LineBasicMaterial.
// ================

export default function PulseHexGridOverlapLine({ params }: { params: HexGridParams }) {
  const { size, camera, gl } = useThree();
  const dpr = gl.getPixelRatio();
  const width = size.width / dpr;
  const height = size.height / dpr;

  // Cámara ortográfica en espacio pixel
  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
    }
  }, [camera, width, height]);

  const hexes = useMemo(
    () => generateHexGrid(Math.floor(width), Math.floor(height), params),
    [width, height, params.pixelsPerHex, params.hue, params.hueJitter, params.s, params.l]
  );

  // Geometría base: hex "unit" (circunradio=1) como líneas, con índices de segmentos.
  const baseGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const pts: number[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 6 + (i * Math.PI) / 3; // mismo offset que tu código original
      pts.push(Math.cos(angle), Math.sin(angle), 0);
    }
    const pos = new Float32Array(pts);
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    // Segmentos: (0-1,1-2,2-3,3-4,4-5,5-0)
    const idx = new Uint16Array([0,1, 1,2, 2,3, 3,4, 4,5, 5,0]);
    geom.setIndex(new THREE.BufferAttribute(idx, 1));
    return geom;
  }, []);

  const instanced = useMemo(() => {
    if (!hexes.length) return null as unknown as {
      geom: THREE.InstancedBufferGeometry;
      mat: THREE.ShaderMaterial;
    };

    const geom = new THREE.InstancedBufferGeometry();
    // Copiamos atributos/index del baseGeom
    geom.index = baseGeom.index!;
    // @ts-ignore
    geom.attributes.position = baseGeom.attributes.position;
    geom.instanceCount = hexes.length;

    const n = hexes.length;
    const offsets = new Float32Array(n * 3);
    const scales = new Float32Array(n);
    const rotations = new Float32Array(n);
    const hues = new Float32Array(n);
    const phases = new Float32Array(n);
    const depths = new Float32Array(n);
    const opacities = new Float32Array(n);

    for (let i = 0; i < n; i++) {
      const h = hexes[i];
      offsets[i * 3 + 0] = h.position[0];
      offsets[i * 3 + 1] = h.position[1];
      offsets[i * 3 + 2] = h.position[2];
      scales[i] = h.baseScale;
      rotations[i] = h.rotation; // pequeña rotación aleatoria como en tu versión
      hues[i] = h.hue;
      phases[i] = h.phase;
      depths[i] = h.depthOffset;
      opacities[i] = h.baseOpacity;
    }

    geom.setAttribute("aOffset", new THREE.InstancedBufferAttribute(offsets, 3));
    geom.setAttribute("aScale", new THREE.InstancedBufferAttribute(scales, 1));
    geom.setAttribute("aRotation", new THREE.InstancedBufferAttribute(rotations, 1));
    geom.setAttribute("aHue", new THREE.InstancedBufferAttribute(hues, 1));
    geom.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));
    geom.setAttribute("aDepth", new THREE.InstancedBufferAttribute(depths, 1));
    geom.setAttribute("aOpacity", new THREE.InstancedBufferAttribute(opacities, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSPct: { value: params.s },
        uLPct: { value: params.l },
      },
      vertexShader: lineVertGLSL,
      fragmentShader: lineFragGLSL,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });

    return { geom, mat };
  }, [hexes, baseGeom, params.s, params.l]);

  // Animación global como en tu grupo original
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!instanced) return;
    const t = clock.getElapsedTime();
    instanced.mat.uniforms.uTime.value = t;

    const g = groupRef.current;
    if (g) {
      g.rotation.z = Math.sin(t * 0.18) * 0.08;
      g.position.z = Math.sin(t * 0.25) * 6;
    }
  });

  // Sync de S/L
  useEffect(() => {
    if (!instanced) return;
    instanced.mat.uniforms.uSPct.value = params.s;
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

  // Usamos LineSegments para evitar dependencia de GL_LINE_LOOP con instancing
  return (
    <group ref={groupRef} frustumCulled={false}>
      {/* @ts-ignore - three acepta ShaderMaterial en LineSegments */}
      <lineSegments geometry={instanced.geom} material={instanced.mat} frustumCulled={false} renderOrder={1} />
    </group>
  );
}

// ===== Helpers =====

type HexData = {
  id: string;
  position: [number, number, number];
  baseScale: number; // circumradius en píxeles (igual que tu escala original)
  phase: number;
  depthOffset: number;
  hue: number; // 0..1
  rotation: number;
  baseOpacity: number;
};

function generateHexGrid(width: number, height: number, p: HexGridParams): HexData[] {
  if (width === 0 || height === 0) return [];

  const radius = p.pixelsPerHex / Math.sqrt(3); // igual que tu versión
  const hexWidth = Math.sqrt(3) * radius; // == p.pixelsPerHex
  const vSpacing = (3 / 2) * radius;
  const hSpacing = hexWidth;
  const columns = Math.ceil(width / hSpacing) + 2;
  const rows = Math.ceil(height / vSpacing) + 2;

  const baseHue01 = (((p.hue % 360) + 360) % 360) / 360;
  const jitter01 = Math.abs(p.hueJitter) / 360;

  const hexes: HexData[] = [];
  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < columns; c++) {
      const offsetX = r % 2 !== 0 ? hSpacing / 2 : 0;
      const x = -width / 2 + c * hSpacing + offsetX;
      const y = -height / 2 + r * vSpacing;
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

// ===== Shaders =====

// Vertex: transformamos el hex unitario por instancia y aplicamos el pulso de escala
const lineVertGLSL = /* glsl */`
  // Nota: THREE ya declara 'attribute vec3 position;'. ¡No volver a declararlo!

  attribute vec3 aOffset;
  attribute float aScale;
  attribute float aRotation;
  attribute float aHue;
  attribute float aPhase;
  attribute float aDepth;
  attribute float aOpacity;

  uniform float uTime;

  varying float vHue;
  varying float vPhase;
  varying float vOpacity;

  void main(){
    float pulse = 1.0 + 0.08 * sin(uTime * 2.2 + aPhase);
    float cs = cos(aRotation);
    float sn = sin(aRotation);
    mat2 R = mat2(cs, -sn, sn, cs);

    // 'position' viene de THREE por defecto
    vec2 p = R * (position.xy * aScale * pulse);
    float z = aOffset.z + sin(uTime * 1.4 + aPhase) * aDepth;

    vHue = aHue;
    vPhase = aPhase;
    vOpacity = aOpacity;

    vec3 world = vec3(aOffset.xy + p, z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
  }
`;

const lineFragGLSL = /* glsl */`
  precision highp float;

  varying float vHue;
  varying float vPhase;
  varying float vOpacity;

  uniform float uTime;
  uniform float uSPct; // 0..100
  uniform float uLPct; // 0..100

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
    float bright = clamp(0.45 + 0.18 * sin(uTime * 1.7 + vPhase), 0.3, 0.7);
    float alpha  = clamp(vOpacity + 0.25 * sin(uTime * 1.9 + vPhase), 0.15, 0.55);
    vec3 rgb = hsl2rgb(vec3(vHue, uSPct/100.0, bright));
    gl_FragColor = vec4(rgb, alpha);
  }
`;
