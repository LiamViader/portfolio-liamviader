"use client";

import * as THREE from "three";
import React, { useLayoutEffect, useMemo, useRef, useEffect} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { HexGridParams } from "./PulseHexGridOverlapLine";

// Usamos CircleGeometry con 6 segmentos. Es idéntico a un hexágono
// pero genera una estructura de triángulos (Triangle Fan) mucho más eficiente
// para la GPU que ShapeGeometry.
const GLOBAL_HEX_GEOM_CACHE = new Map<number, THREE.CircleGeometry>();

function getGlobalHexGeometry(radius: number) {
  // Redondeamos para key de caché
  const key = Math.round(radius * 100); 
  if (!GLOBAL_HEX_GEOM_CACHE.has(key)) {
    // 6 segmentos = Hexágono. Rotamos pi/6 (30 grados) para que la punta quede arriba si es necesario
    // Ojo: CircleGeometry empieza en el eje X. Quizás necesites rotar el mesh si la orientación importa.
    // Para replicar tu shape exacto, a veces basta con rotar el mesh o la UV.
    const geom = new THREE.CircleGeometry(radius, 6);
    // Rotamos la geometría internamente para que coincida con la orientación de "puntas planas" o "puntas agudas"
    geom.rotateZ(Math.PI / 2); 
    GLOBAL_HEX_GEOM_CACHE.set(key, geom);
  }
  return GLOBAL_HEX_GEOM_CACHE.get(key)!;
}

// ... (Mantenemos tus tipos y shaders igual, son correctos) ...
const hslChunk = /* glsl */`
  vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
  }
`;

const fillVertGLSL = /* glsl */`
  precision mediump float;
  attribute vec3 aCenter;
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aHue;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uTime;
  uniform float uBaseFreq;
  uniform float uFillScaleMin;
  uniform float uFillScaleMax;
  uniform float uFillAlphaMin;
  uniform float uFillAlphaMax;
  uniform float uBaseL;
  uniform float uLightnessAmp;
  uniform float uSaturation;
  uniform float uInvert;
  ${hslChunk}
  void main() {
    float omega = 2.0 * 3.14159 * uBaseFreq * aSpeed;
    float rawSine = sin(omega * uTime + aPhase);
    float pulse = 0.5 + 0.5 * rawSine;
    float p = mix(pulse, 1.0 - pulse, uInvert);
    float scaleRel = mix(uFillScaleMin, uFillScaleMax, 1.0 - p);
    
    // Aquí usamos position directamente del CircleGeometry
    vec3 transformed = position * scaleRel + aCenter;
    vAlpha = mix(uFillAlphaMin, uFillAlphaMax, 1.0 - p);
    float L = clamp(uBaseL + (p - 0.5) * 2.0 * uLightnessAmp, 0.05, 0.95);
    vColor = hsl2rgb(vec3(aHue, uSaturation, L));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const fillFragGLSL = /* glsl */`
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(vColor, vAlpha);
  }
`;

// --- COMPONENTE PRINCIPAL ---
export default function PulseHexGridFill({
  params,
  tuning = {}, // Default vacío para evitar undefined
}: {
  params: HexGridParams;
  tuning?: any; // Simplificado para el ejemplo
}) {
  // NOTA: Asumimos que "tuning" no cambia dinámicamente.
  // Si cambia, usa el refactor de mi respuesta anterior.
  // Si es estático, esto está bien.

  const { pixelsPerHex, hue, s, l, hueJitter } = params;
  const { size, camera, gl } = useThree();

  // ELIMINADO: useEffect con gl.setPixelRatio
  // RECUERDA: Poner <Canvas dpr={[1, 1.5]}> en tu App.js

  const dpr = gl.getPixelRatio();
  const width = size.width; // En R3F moderno, width ya es viewport width
  const height = size.height;

  // Ajuste de cámara (Correcto mantenerlo)
  useLayoutEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
    }
  }, [camera, width, height]);

  const instanced = useMemo(() => {
    // Cálculos de grilla
    const radius = pixelsPerHex / Math.sqrt(3);
    const hexWidth = Math.sqrt(3) * radius;
    const vSpacing = (3 / 2) * radius;
    const hSpacing = hexWidth;
    const margin = Math.ceil((width / hSpacing) * 0.05);
    const columns = Math.ceil(width / hSpacing) + margin;
    const rows = Math.ceil(height / vSpacing) + margin;

    const cells = [];
    const baseHue01 = (((hue % 360) + 360) % 360) / 360;
    const hueJitter01 = Math.abs(hueJitter) / 360;

    // Valores por defecto seguros
    const tFreqJitter = tuning.freqJitter ?? 0.3;
    const tPhaseJitter = tuning.phaseJitter ?? 0.01;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const offsetX = r % 2 !== 0 ? hSpacing / 2 : 0;
        const cx = -width / 2 + c * hSpacing + offsetX;
        const cy = -height / 2 + r * vSpacing - (margin * hexWidth * 0.5);
        
        const phase = Math.random() * Math.PI * 2 + (Math.random() - 0.5) * tPhaseJitter;
        const speed = 1 + (Math.random() * 2 - 1) * tFreqJitter;
        const hVal = (baseHue01 + (Math.random() * 2 - 1) * hueJitter01 + 1) % 1;
        
        cells.push({ cx, cy, phase, speed, hVal });
      }
    }

    const n = cells.length;
    if (n === 0) return null;

    // OPTIMIZACIÓN: Usar CircleGeometry en lugar de ShapeGeometry
    const baseGeom = getGlobalHexGeometry(radius);

    const geom = new THREE.InstancedBufferGeometry();
    geom.index = baseGeom.index;
    geom.attributes.position = baseGeom.attributes.position;
    // IMPORTANTE: CircleGeometry genera uvs automáticamente, ShapeGeometry no siempre igual.
    // Si tu shader no usa UVs, da igual.
    geom.instanceCount = n;

    const data = new Float32Array(n * 6);
    for (let i = 0; i < n; i++) {
      const c = cells[i];
      data[i * 6 + 0] = c.cx;
      data[i * 6 + 1] = c.cy;
      data[i * 6 + 2] = 0;
      data[i * 6 + 3] = c.phase;
      data[i * 6 + 4] = c.speed;
      data[i * 6 + 5] = c.hVal;
    }

    const ib = new THREE.InstancedInterleavedBuffer(data, 6).setUsage(THREE.StaticDrawUsage);
    geom.setAttribute("aCenter", new THREE.InterleavedBufferAttribute(ib, 3, 0));
    geom.setAttribute("aPhase", new THREE.InterleavedBufferAttribute(ib, 1, 3));
    geom.setAttribute("aSpeed", new THREE.InterleavedBufferAttribute(ib, 1, 4));
    geom.setAttribute("aHue", new THREE.InterleavedBufferAttribute(ib, 1, 5));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uBaseFreq: { value: tuning.baseFreq ?? 0.25 },
        uFillScaleMin: { value: tuning.fillScaleMin ?? 0.55 },
        uFillScaleMax: { value: tuning.fillScaleMax ?? 0.95 },
        uFillAlphaMin: { value: tuning.fillAlphaMin ?? 0.10 },
        uFillAlphaMax: { value: tuning.fillAlphaMax ?? 0.95 },
        uBaseL: { value: l / 100 },
        uLightnessAmp: { value: tuning.lightnessAmp ?? 0.12 },
        uSaturation: { value: s / 100 },
        uInvert: { value: (tuning.invertAtMax ?? true) ? 1.0 : 0.0 },
      },
      vertexShader: fillVertGLSL,
      fragmentShader: fillFragGLSL,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    return { geom, mat };
  }, [width, height, pixelsPerHex, hue, s, l, hueJitter]); 
  // Nota: Quitamos 'tuning' de dependencias asumiendo que es estático, 
  // o que si cambia quieres reconstruir todo.

  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!instanced) return;
    const t = clock.getElapsedTime();
    // Actualizar uniform uTime es muy barato
    instanced.mat.uniforms.uTime.value = t;

    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.18) * 0.04;
      groupRef.current.position.z = Math.sin(t * 0.22) * 2.5;
    }
  });

  useEffect(() => {
    return () => {
      if (instanced) {
        instanced.geom.dispose();
        instanced.mat.dispose();
      }
    };
  }, [instanced]);

  if (!instanced) return null;

  return (
    <group ref={groupRef} frustumCulled={false}>
      <mesh 
        geometry={instanced.geom} 
        material={instanced.mat} 
        frustumCulled={false} 
        renderOrder={0}
      />
    </group>
  );
}