"use client";

import * as THREE from "three";
import React, { useLayoutEffect, useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { HexGridParams } from "./PulseHexGridOverlapLine";

// --- CACHÉ GLOBAL (Sin cambios, esto estaba bien) ---
const GLOBAL_HEX_GEOM_CACHE = new Map<number, THREE.ShapeGeometry>();

function getGlobalHexGeometry(radius: number) {
  // Redondeamos para evitar claves infinitas por decimales flotantes
  const safeRadius = Number(radius.toFixed(2));
  const key = Math.round(safeRadius * 1000); 

  if (!GLOBAL_HEX_GEOM_CACHE.has(key)) {
    const angles = new Array(6).fill(0).map((_, i) => Math.PI / 6 + (i * Math.PI) / 3);
    const shape = new THREE.Shape();
    shape.moveTo(Math.cos(angles[0]) * safeRadius, Math.sin(angles[0]) * safeRadius);
    for (let i = 1; i < 6; i++) shape.lineTo(Math.cos(angles[i]) * safeRadius, Math.sin(angles[i]) * safeRadius);
    shape.closePath();
    GLOBAL_HEX_GEOM_CACHE.set(key, new THREE.ShapeGeometry(shape));
  }
  return GLOBAL_HEX_GEOM_CACHE.get(key)!;
}

export type FillTuning = {
  fillScaleMin?: number;
  fillScaleMax?: number;
  fillAlphaMin?: number;
  fillAlphaMax?: number;
  baseFreq?: number;
  freqJitter?: number;
  phaseJitter?: number;
  lightnessAmp?: number;
  invertAtMax?: boolean;
};

const DEFAULT_TUNING: Required<FillTuning> = {
  fillScaleMin: 0.55,
  fillScaleMax: 0.95,
  fillAlphaMin: 0.10,
  fillAlphaMax: 0.95,
  baseFreq: 0.25,
  freqJitter: 0.3,
  phaseJitter: 0.01,
  lightnessAmp: 0.12,
  invertAtMax: true,
};

// --- SHADERS (Sin cambios importantes) ---
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
    // Interpolación suave para evitar parpadeos
    float scaleRel = mix(uFillScaleMin, uFillScaleMax, 1.0 - p);
    
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

export default function PulseHexGridFill({
  params,
  tuning: userTuning,
}: {
  params: HexGridParams;
  tuning?: FillTuning;
}) {
  const { pixelsPerHex, hue, s, l, hueJitter } = params;
  const { size, camera, gl } = useThree();
  
  // Extraemos primitivos para dependencias
  const tBaseFreq = userTuning?.baseFreq ?? DEFAULT_TUNING.baseFreq;
  const tFillScaleMin = userTuning?.fillScaleMin ?? DEFAULT_TUNING.fillScaleMin;
  const tFillScaleMax = userTuning?.fillScaleMax ?? DEFAULT_TUNING.fillScaleMax;
  const tFillAlphaMin = userTuning?.fillAlphaMin ?? DEFAULT_TUNING.fillAlphaMin;
  const tFillAlphaMax = userTuning?.fillAlphaMax ?? DEFAULT_TUNING.fillAlphaMax;
  const tFreqJitter = userTuning?.freqJitter ?? DEFAULT_TUNING.freqJitter;
  const tPhaseJitter = userTuning?.phaseJitter ?? DEFAULT_TUNING.phaseJitter;
  const tLightnessAmp = userTuning?.lightnessAmp ?? DEFAULT_TUNING.lightnessAmp;
  const tInvertAtMax = userTuning?.invertAtMax ?? DEFAULT_TUNING.invertAtMax;

  // IMPORTANTE: No usamos setPixelRatio aquí dentro.
  // El DPR debe controlarse en el <Canvas dpr={[1, 1.5]}> padre.
  
  const dpr = gl.getPixelRatio();
  const width = size.width; // En R3F v8+ size.width ya suele estar ajustado, pero mantenemos tu lógica
  const height = size.height;

  // Ajuste de cámara ortográfica
  useLayoutEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      // Calculamos los límites basados en el viewport actual
      const w = size.width;
      const h = size.height;
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width, size.height]);

  // 1. MATERIAL ESTABLE: Se crea UNA vez y sus referencias no cambian
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uBaseFreq: { value: DEFAULT_TUNING.baseFreq },
        uFillScaleMin: { value: DEFAULT_TUNING.fillScaleMin },
        uFillScaleMax: { value: DEFAULT_TUNING.fillScaleMax },
        uFillAlphaMin: { value: DEFAULT_TUNING.fillAlphaMin },
        uFillAlphaMax: { value: DEFAULT_TUNING.fillAlphaMax },
        uBaseL: { value: 0.5 },
        uLightnessAmp: { value: DEFAULT_TUNING.lightnessAmp },
        uSaturation: { value: 0.5 },
        uInvert: { value: 1.0 },
      },
      vertexShader: fillVertGLSL,
      fragmentShader: fillFragGLSL,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
  }, []); // Dependencias vacías: el material es eterno

  // 2. ACTUALIZACIÓN DE UNIFORMS: Esto es muy barato (CPU casi 0)
  // Se ejecuta cuando cambian los sliders/props, pero NO reconstruye la geometría
  useEffect(() => {
    material.uniforms.uBaseFreq.value = tBaseFreq;
    material.uniforms.uFillScaleMin.value = tFillScaleMin;
    material.uniforms.uFillScaleMax.value = tFillScaleMax;
    material.uniforms.uFillAlphaMin.value = tFillAlphaMin;
    material.uniforms.uFillAlphaMax.value = tFillAlphaMax;
    material.uniforms.uBaseL.value = l / 100;
    material.uniforms.uLightnessAmp.value = tLightnessAmp;
    material.uniforms.uSaturation.value = s / 100;
    material.uniforms.uInvert.value = tInvertAtMax ? 1.0 : 0.0;
  }, [
    material, 
    tBaseFreq, tFillScaleMin, tFillScaleMax, tFillAlphaMin, tFillAlphaMax, 
    l, tLightnessAmp, s, tInvertAtMax
  ]);

  // 3. GEOMETRÍA (PESADO): Solo depende de dimensiones y densidad (pixelsPerHex)
  // Hemos quitado todos los "tunings" de aquí, excepto los Jitters que afectan atributos.
  const geometry = useMemo(() => {
    const radius = pixelsPerHex / Math.sqrt(3);
    const hexWidth = Math.sqrt(3) * radius;
    const vSpacing = (3 / 2) * radius;
    const hSpacing = hexWidth;
    
    // Usamos size.width/height directamente para cálculos
    const margin = Math.ceil((width / hSpacing) * 0.05);
    const columns = Math.ceil(width / hSpacing) + margin;
    const rows = Math.ceil(height / vSpacing) + margin;

    const cells = [];
    const baseHue01 = (((hue % 360) + 360) % 360) / 360;
    const hueJitter01 = Math.abs(hueJitter) / 360;
    const wrap01 = (n: number) => (n % 1 + 1) % 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const offsetX = r % 2 !== 0 ? hSpacing / 2 : 0;
        const cx = -width / 2 + c * hSpacing + offsetX;
        const cy = -height / 2 + r * vSpacing - (margin * hexWidth * 0.5);
        
        // Estos valores se "queman" en el buffer. Si cambian, hay que reconstruir.
        const phase = Math.random() * Math.PI * 2 + (Math.random() - 0.5) * tPhaseJitter;
        const speed = 1 + (Math.random() * 2 - 1) * tFreqJitter;
        const hVal = wrap01(baseHue01 + (Math.random() * 2 - 1) * hueJitter01);
        
        cells.push({ cx, cy, phase, speed, hVal });
      }
    }

    const n = cells.length;
    if (n === 0) return null;

    const baseGeom = getGlobalHexGeometry(radius);
    const geom = new THREE.InstancedBufferGeometry();
    
    // Copiamos la referencia a index y position (no clonamos los datos, es rápido)
    geom.index = baseGeom.index;
    geom.attributes.position = baseGeom.attributes.position;
    geom.instanceCount = n;

    const STRIDE = 6;
    const data = new Float32Array(n * STRIDE);

    for (let i = 0; i < n; i++) {
      const cell = cells[i];
      const base = i * STRIDE;
      data[base + 0] = cell.cx;
      data[base + 1] = cell.cy;
      data[base + 2] = 0; 
      data[base + 3] = cell.phase;
      data[base + 4] = cell.speed;
      data[base + 5] = cell.hVal;
    }

    const ib = new THREE.InstancedInterleavedBuffer(data, STRIDE).setUsage(THREE.StaticDrawUsage);

    geom.setAttribute("aCenter", new THREE.InterleavedBufferAttribute(ib, 3, 0));
    geom.setAttribute("aPhase",  new THREE.InterleavedBufferAttribute(ib, 1, 3));
    geom.setAttribute("aSpeed",  new THREE.InterleavedBufferAttribute(ib, 1, 4));
    geom.setAttribute("aHue",    new THREE.InterleavedBufferAttribute(ib, 1, 5));

    return geom;

  // DEPENDENCIAS REDUCIDAS:
  // Si cambias 'fillScaleMin' NO entramos aquí. Solo si cambias el tamaño de celda o ventana.
  }, [
    width, height, 
    pixelsPerHex, hue, hueJitter, 
    tFreqJitter, tPhaseJitter 
  ]);

  // 4. ANIMACIÓN
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    material.uniforms.uTime.value = t;

    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.18) * 0.04;
      groupRef.current.position.z = Math.sin(t * 0.22) * 2.5;
    }
  });

  // 5. CLEANUP
  useEffect(() => {
    return () => {
      // Solo limpiamos la geometría instanciada, no el material (que es compartido/memoizado)
      if (geometry) {
        geometry.dispose();
      }
      // Material cleanup opcional si el componente muere definitivamente
      // material.dispose(); 
    };
  }, [geometry]);

  if (!geometry) return null;

  return (
    <group ref={groupRef} frustumCulled={false}>
      <mesh 
        geometry={geometry} 
        material={material} 
        frustumCulled={false} 
        renderOrder={0}
      />
    </group>
  );
}