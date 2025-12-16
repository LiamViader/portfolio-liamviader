"use client";

import * as THREE from "three";
import React, { useLayoutEffect, useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { HexGridParams } from "./PulseHexGridOverlapLine";

// CACHÉ GLOBAL: Creamos la forma del hexágono UNA sola vez en la vida de la app.
// Esto evita picos de CPU al recargar el componente.
const GLOBAL_HEX_GEOM_CACHE = new Map<number, THREE.ShapeGeometry>();

function getGlobalHexGeometry(radius: number) {
  const key = Math.round(radius * 1000); // Identificador único por tamaño
  if (!GLOBAL_HEX_GEOM_CACHE.has(key)) {
    const angles = new Array(6).fill(0).map((_, i) => Math.PI / 6 + (i * Math.PI) / 3);
    const shape = new THREE.Shape();
    shape.moveTo(Math.cos(angles[0]) * radius, Math.sin(angles[0]) * radius);
    for (let i = 1; i < 6; i++) shape.lineTo(Math.cos(angles[i]) * radius, Math.sin(angles[i]) * radius);
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
  // 1. DESESTRUCTURACIÓN DE PROPS
  // Extraemos los valores primitivos. Usaremos ESTAS variables en el useMemo.
  // Esto evita usar "params" (el objeto entero) como dependencia.
  const { pixelsPerHex, hue, s, l, hueJitter } = params;

  // Hacemos lo mismo con tuning para asegurar estabilidad
  const tBaseFreq = userTuning?.baseFreq ?? DEFAULT_TUNING.baseFreq;
  const tFillScaleMin = userTuning?.fillScaleMin ?? DEFAULT_TUNING.fillScaleMin;
  const tFillScaleMax = userTuning?.fillScaleMax ?? DEFAULT_TUNING.fillScaleMax;
  const tFillAlphaMin = userTuning?.fillAlphaMin ?? DEFAULT_TUNING.fillAlphaMin;
  const tFillAlphaMax = userTuning?.fillAlphaMax ?? DEFAULT_TUNING.fillAlphaMax;
  const tFreqJitter = userTuning?.freqJitter ?? DEFAULT_TUNING.freqJitter;
  const tPhaseJitter = userTuning?.phaseJitter ?? DEFAULT_TUNING.phaseJitter;
  const tLightnessAmp = userTuning?.lightnessAmp ?? DEFAULT_TUNING.lightnessAmp;
  const tInvertAtMax = userTuning?.invertAtMax ?? DEFAULT_TUNING.invertAtMax;

  const { size, camera, gl } = useThree();
  
  // SOLUCIÓN AL CALENTAMIENTO (THERMAL THROTTLING):
  // Limitamos la resolución máxima a 1.5. Los móviles modernos tienen 3.0 o 4.0.
  // Renderizar transparencias a 4.0 calienta el móvil en 2 minutos.
  // 1.5 se ve igual de bien pero consume la mitad de energía.
  useEffect(() => {
    const currentPixelRatio = gl.getPixelRatio();
    if (currentPixelRatio > 1.5) {
      gl.setPixelRatio(1.5);
    }
  }, [gl]);

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

  const instanced = useMemo(() => {
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
    const wrap01 = (n: number) => (n % 1 + 1) % 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const offsetX = r % 2 !== 0 ? hSpacing / 2 : 0;
        const cx = -width / 2 + c * hSpacing + offsetX;
        const cy = -height / 2 + r * vSpacing - (margin * hexWidth * 0.5);
        
        const phase = Math.random() * Math.PI * 2 + (Math.random() - 0.5) * tPhaseJitter;
        const speed = 1 + (Math.random() * 2 - 1) * tFreqJitter;
        const hVal = wrap01(baseHue01 + (Math.random() * 2 - 1) * hueJitter01);
        
        cells.push({ cx, cy, phase, speed, hVal });
      }
    }

    const n = cells.length;
    if (n === 0) return null;

    // Usamos la geometría de la caché global
    const baseGeom = getGlobalHexGeometry(radius);

    const geom = new THREE.InstancedBufferGeometry();
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

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        // Pasamos las variables primitivas desestructuradas
        uBaseFreq: { value: tBaseFreq },
        uFillScaleMin: { value: tFillScaleMin },
        uFillScaleMax: { value: tFillScaleMax },
        uFillAlphaMin: { value: tFillAlphaMin },
        uFillAlphaMax: { value: tFillAlphaMax },
        uBaseL: { value: l / 100 },
        uLightnessAmp: { value: tLightnessAmp },
        uSaturation: { value: s / 100 },
        uInvert: { value: tInvertAtMax ? 1.0 : 0.0 },
      },
      vertexShader: fillVertGLSL,
      fragmentShader: fillFragGLSL,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });

    return { geom, mat };

  // DEPENDENCIAS DEL MEMO:
  // Solo usamos las primitivas que extrajimos arriba.
  // NO usamos "params" ni "tuning" completos.
  }, [
    width, height, 
    pixelsPerHex, hue, s, l, hueJitter, // params primitivos
    tBaseFreq, tFillScaleMin, tFillScaleMax, tFillAlphaMin, tFillAlphaMax, 
    tFreqJitter, tPhaseJitter, tLightnessAmp, tInvertAtMax // tuning primitivos
  ]);


  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!instanced) return;
    const t = clock.getElapsedTime();
    
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