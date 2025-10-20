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
      <meshBasicMaterial transparent opacity={0.8} toneMapped={false} vertexColors />
    </instancedMesh>
  );
}

export default function FlowFieldCanvas() {
  return (
    <Canvas
      className="pointer-events-none absolute inset-0"
      dpr={[1, 1.5]}
      orthographic
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 20], zoom: 70, near: 0.1, far: 100 }}
      frameloop="always"
    >
      <FlowField />
    </Canvas>
  );
}
