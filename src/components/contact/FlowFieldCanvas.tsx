"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

interface FlowFieldProps {
  columns?: number;
  rows?: number;
  amplitude?: number;
  speed?: number;
}

const palette = [
  new THREE.Color("#4f46e5"),
  new THREE.Color("#0ea5e9"),
  new THREE.Color("#14b8a6"),
  new THREE.Color("#38bdf8"),
];

const auroraVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const auroraFragmentShader = /* glsl */ `
  varying vec2 vUv;

  uniform float uTime;
  uniform vec3 uColorPrimary;
  uniform vec3 uColorSecondary;
  uniform vec3 uColorAccent;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p += dot(p, p.yzx + 19.19);
    return fract(p.x * p.y * p.z);
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    vec3 u = f * f * (3.0 - 2.0 * f);

    float n = mix(
      mix(
        mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), u.x),
        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), u.x),
        u.y
      ),
      mix(
        mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), u.x),
        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), u.x),
        u.y
      ),
      u.z
    );

    return n * n;
  }

  void main() {
    vec2 uv = vUv;
    vec2 centered = (uv - 0.5) * 2.2;
    float time = uTime * 0.35;

    float layers = 0.0;
    float frequency = 1.4;
    float amplitude = 0.7;

    for (int i = 0; i < 4; i++) {
      layers += noise(vec3(centered * frequency, time)) * amplitude;
      frequency *= 1.7;
      amplitude *= 0.55;
    }

    float ribbons = sin((centered.y + layers * 0.4) * 3.2 + time * 2.6);
    float glow = smoothstep(-0.6, 0.8, ribbons) * 0.6 + layers * 0.35;

    vec3 base = mix(uColorSecondary, uColorPrimary, clamp(centered.y * 0.45 + 0.55, 0.0, 1.0));
    vec3 highlight = mix(base, uColorAccent, clamp(layers * 0.85 + 0.35, 0.0, 1.0));
    vec3 color = highlight + vec3(0.05, 0.07, 0.12) * (0.6 + layers * 0.25);

    float alpha = clamp(glow, 0.08, 0.85);

    gl_FragColor = vec4(color, alpha);
  }
`;

function AuroraPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorPrimary: { value: new THREE.Color("#2563eb") },
      uColorSecondary: { value: new THREE.Color("#0ea5e9") },
      uColorAccent: { value: new THREE.Color("#38bdf8") },
    }),
    []
  );

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh position={[0, 0, -6]} scale={[18, 12, 1]}>
      <planeGeometry args={[1, 1, 240, 240]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={auroraVertexShader}
        fragmentShader={auroraFragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function FlowField({ columns = 32, rows = 22, amplitude = 0.35, speed = 0.35 }: FlowFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const phases = useMemo(() => Float32Array.from({ length: columns * rows }, () => Math.random() * Math.PI * 2), [columns, rows]);
  const offsets = useMemo(() => Float32Array.from({ length: columns * rows }, () => 0.8 + Math.random() * 0.6), [columns, rows]);

  useEffect(() => {
    if (!meshRef.current) return;
    const color = new THREE.Color();
    let index = 0;
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        const paletteIndex = Math.floor(((x / (columns - 1 || 1)) * (palette.length - 1)) % palette.length);
        color.copy(palette[paletteIndex]);
        const saturationBias = 0.12 + (y / (rows - 1 || 1)) * 0.25;
        color.offsetHSL(0, saturationBias, 0);
        meshRef.current.setColorAt(index, color);
        index += 1;
      }
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [columns, rows]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    let index = 0;
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        const phase = phases[index];
        const offsetStrength = offsets[index];
        const wave = Math.sin(time * speed * 2 + phase + x * 0.18 + y * 0.22);
        const drift = Math.cos(time * speed + phase * 0.6 + y * 0.35);

        const px = (x - columns / 2) * 0.55;
        const py = (y - rows / 2) * 0.55 + wave * amplitude * offsetStrength;

        dummy.position.set(px, py, -1);
        const scaleX = 0.8 + Math.cos(time * speed * 1.2 + phase) * 0.12;
        const scaleY = 0.45 + (0.55 + Math.sin(time * speed * 1.6 + phase * 1.4)) * 0.32;
        dummy.scale.set(scaleX, scaleY, 1);
        dummy.rotation.z = drift * 0.25;
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(index, dummy.matrix);
        index += 1;
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, columns * rows]} frustumCulled={false}>
      <planeGeometry args={[1.1, 0.22]} />
      <meshBasicMaterial transparent opacity={0.55} toneMapped={false} vertexColors blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}

export default function FlowFieldCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden">
      <Canvas
        className="!h-full !w-full"
        style={{ width: "100%", height: "100%" }}
        dpr={[1, 1.5]}
        orthographic
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 20], zoom: 70, near: 0.1, far: 100 }}
        frameloop="always"
      >
        <AuroraPlane />
        <FlowField />
      </Canvas>
    </div>
  );
}
