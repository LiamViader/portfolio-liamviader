"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { Color, Points, ShaderMaterial } from "three";

function AuroraPlane() {
  const materialRef = useRef<ShaderMaterial | null>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new Color("#172554") },
      uColorB: { value: new Color("#0f172a") },
      uColorHighlight: { value: new Color("#38bdf8") },
      uColorAccent: { value: new Color("#a855f7") },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} scale={8} position={[0, -0.25, 0]}>
      <planeGeometry args={[2.8, 2.8, 256, 256]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          precision highp float;

          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform vec3 uColorHighlight;
          uniform vec3 uColorAccent;

          varying vec2 vUv;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);

            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));

            vec2 u = f * f * (3.0 - 2.0 * f);

            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
          }

          float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            mat2 rotation = mat2(0.8, -0.6, 0.6, 0.8);

            for (int i = 0; i < 5; i++) {
              value += amplitude * noise(p);
              p = rotation * p * 1.6;
              amplitude *= 0.5;
            }

            return value;
          }

          void main() {
            vec2 uv = vUv;
            uv.y *= 1.5;
            uv.x *= 1.3;

            float time = uTime * 0.18;

            float base = fbm(uv * 2.2 + vec2(time * 0.5, -time * 0.4));
            float waves = fbm((uv + vec2(time * 0.4, time * 0.2)) * 3.5);
            float streaks = fbm(vec2(uv.x * 6.0 + time * 1.1, uv.y * 1.4 - time * 0.7));

            float glow = smoothstep(0.2, 0.9, base + waves * 0.7);
            float accent = smoothstep(0.55, 0.9, streaks + base * 0.6);

            vec3 gradient = mix(uColorB, uColorA, clamp(glow + waves * 0.25, 0.0, 1.0));
            vec3 aurora = mix(gradient, uColorHighlight, accent);
            aurora += (0.15 + waves * 0.1) * uColorAccent;

            float vignette = smoothstep(1.2, 0.45, distance(vUv, vec2(0.5)));
            float horizon = smoothstep(0.65, 0.2, vUv.y);

            vec3 color = mix(uColorB, aurora, vignette) + horizon * 0.08;
            float alpha = clamp(vignette * 0.95, 0.05, 0.95);

            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}

function ParticleField() {
  const pointsRef = useRef<Points | null>(null);

  const { positions, speeds, offsets } = useMemo(() => {
    const count = 850;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2.4;
      positions[i3 + 1] = Math.random() * 2.4 - 1.2;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.4;
      speeds[i] = 0.1 + Math.random() * 0.15;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    return { positions, speeds, offsets };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const positionsArray = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const count = speeds.length;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positionsArray[i3 + 1] += speeds[i] * delta * 0.6;
      positionsArray[i3] += Math.sin(time * 0.35 + offsets[i]) * 0.0015;

      if (positionsArray[i3 + 1] > 1.2) {
        positionsArray[i3 + 1] = -1.2;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.z += delta * 0.035;
  });

  return (
    <points ref={pointsRef} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, 0.2, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color={"#38bdf8"}
        sizeAttenuation
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </points>
  );
}

export default function ContactAuroraCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1.8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <group position={[0, -0.1, 0]}>
          <AuroraPlane />
          <ParticleField />
        </group>
      </Suspense>
    </Canvas>
  );
}
