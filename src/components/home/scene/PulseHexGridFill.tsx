"use client";

import * as THREE from "three";
import React, { useLayoutEffect, useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { HexGridParams } from "./PulseHexGridOverlapLine";

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
  
  // Atributos manuales que pasaremos en el buffer intercalado
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
    
    // Escala relativa al centro
    float scaleRel = mix(uFillScaleMin, uFillScaleMax, 1.0 - p);
    
    // Posición final: Escalar la forma base y moverla al centro (aCenter)
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
  const tuning = useMemo<Required<FillTuning>>(
    () => ({ ...DEFAULT_TUNING, ...(userTuning ?? {}) }),
    [userTuning]
  );

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

  const baseGeom = useMemo(() => {
    const radius = params.pixelsPerHex / Math.sqrt(3);
    const angles = new Array(6).fill(0).map((_, i) => Math.PI / 6 + (i * Math.PI) / 3);
    const shape = new THREE.Shape();
    shape.moveTo(Math.cos(angles[0]) * radius, Math.sin(angles[0]) * radius);
    for (let i = 1; i < 6; i++) shape.lineTo(Math.cos(angles[i]) * radius, Math.sin(angles[i]) * radius);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [params.pixelsPerHex]);



  const instanced = useMemo(() => {
    const radius = params.pixelsPerHex / Math.sqrt(3);
    const hexWidth = Math.sqrt(3) * radius;
    const vSpacing = (3 / 2) * radius;
    const hSpacing = hexWidth;
    const margin = Math.ceil((width / hSpacing) * 0.05);
    const columns = Math.ceil(width / hSpacing) + margin;
    const rows = Math.ceil(height / vSpacing) + margin;

    const cells = [];
    const baseHue01 = (((params.hue % 360) + 360) % 360) / 360;
    const hueJitter01 = Math.abs(params.hueJitter) / 360;
    const wrap01 = (n: number) => (n % 1 + 1) % 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const offsetX = r % 2 !== 0 ? hSpacing / 2 : 0;
        const cx = -width / 2 + c * hSpacing + offsetX;
        const cy = -height / 2 + r * vSpacing - (margin * hexWidth * 0.5);

        const phase = Math.random() * Math.PI * 2 + (Math.random() - 0.5) * tuning.phaseJitter;
        const speed = 1 + (Math.random() * 2 - 1) * tuning.freqJitter;
        const hue = wrap01(baseHue01 + (Math.random() * 2 - 1) * hueJitter01);

        cells.push({ cx, cy, phase, speed, hue });
      }
    }

    const n = cells.length;
    if (n === 0) return null;

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
      data[base + 5] = cell.hue;
    }

    const ib = new THREE.InstancedInterleavedBuffer(data, STRIDE).setUsage(THREE.StaticDrawUsage);

    geom.setAttribute("aCenter", new THREE.InterleavedBufferAttribute(ib, 3, 0));
    geom.setAttribute("aPhase", new THREE.InterleavedBufferAttribute(ib, 1, 3));
    geom.setAttribute("aSpeed", new THREE.InterleavedBufferAttribute(ib, 1, 4));
    geom.setAttribute("aHue", new THREE.InterleavedBufferAttribute(ib, 1, 5));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uBaseFreq: { value: tuning.baseFreq },
        uFillScaleMin: { value: tuning.fillScaleMin },
        uFillScaleMax: { value: tuning.fillScaleMax },
        uFillAlphaMin: { value: tuning.fillAlphaMin },
        uFillAlphaMax: { value: tuning.fillAlphaMax },
        uBaseL: { value: params.l / 100 },
        uLightnessAmp: { value: tuning.lightnessAmp },
        uSaturation: { value: params.s / 100 },
        uInvert: { value: tuning.invertAtMax ? 1.0 : 0.0 },
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

  }, [width, height, params.s, params.l, params.hueJitter, params.hue, params.pixelsPerHex, tuning, baseGeom]); // Dependencias estables


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

  useEffect(() => {
    return () => {
      baseGeom.dispose();
    };
  }, [baseGeom]);


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