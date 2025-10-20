"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  Group,
  Points,
  ShaderMaterial,
} from "three";

function AuroraBackdrop() {
  const materialRef = useRef<ShaderMaterial | null>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new Color("#1d4ed8") },
      uColorB: { value: new Color("#0f172a") },
      uColorHighlight: { value: new Color("#38bdf8") },
      uColorAccent: { value: new Color("#a855f7") },
    }),
    []
  );

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} scale={8.4} position={[0, -0.26, 0]}>
      <planeGeometry args={[3.2, 3.2, 300, 300]} />
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
            float amplitude = 0.55;
            mat2 rotation = mat2(0.8, -0.6, 0.6, 0.8);

            for (int i = 0; i < 6; i++) {
              value += amplitude * noise(p);
              p = rotation * p * 1.55;
              amplitude *= 0.55;
            }

            return value;
          }

          void main() {
            vec2 uv = vUv;
            uv.y *= 1.75;
            uv.x *= 1.4;

            float time = uTime * 0.18;

            float base = fbm(uv * 2.8 + vec2(time * 0.6, -time * 0.45));
            float waves = fbm((uv + vec2(time * 0.4, time * 0.25)) * 3.6);
            float streaks = fbm(vec2(uv.x * 8.5 + time * 1.2, uv.y * 2.6 - time * 0.9));

            float glow = smoothstep(0.2, 0.9, base + waves * 0.7);
            float accent = smoothstep(0.55, 0.92, streaks + base * 0.6);

            vec3 gradient = mix(uColorB, uColorA, clamp(glow + waves * 0.25, 0.0, 1.0));
            vec3 aurora = mix(gradient, uColorHighlight, accent);
            aurora += (0.18 + waves * 0.12) * uColorAccent;

            float vignette = smoothstep(1.25, 0.32, distance(vUv, vec2(0.5, 0.4)));
            float horizon = smoothstep(0.85, 0.18, vUv.y + base * 0.12);

            vec3 color = mix(uColorB, aurora, vignette) + horizon * 0.1;
            float alpha = clamp(vignette * 0.92, 0.05, 0.95);

            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}

type RibbonLayerProps = {
  colorStart: string;
  colorEnd: string;
  offset: number;
  speed: number;
  opacity: number;
  y: number;
  scale: number;
  tilt: number;
};

function RibbonLayer({
  colorStart,
  colorEnd,
  offset,
  speed,
  opacity,
  y,
  scale,
  tilt,
}: RibbonLayerProps) {
  const materialRef = useRef<ShaderMaterial | null>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorStart: { value: new Color(colorStart) },
      uColorEnd: { value: new Color(colorEnd) },
      uOpacity: { value: opacity },
      uOffset: { value: offset },
      uSpeed: { value: speed },
    }),
    [colorStart, colorEnd, opacity, offset, speed]
  );

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh
      position={[0, y, 0]}
      rotation={[-Math.PI / 2.05, 0, tilt]}
      scale={scale}
    >
      <planeGeometry args={[3.6, 1, 256, 64]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        side={DoubleSide}
        vertexShader={`
          uniform float uTime;
          uniform float uSpeed;
          uniform float uOffset;

          varying vec2 vUv;
          varying float vWave;

          void main() {
            vUv = uv;
            float wave = sin((uv.x * 4.2 + uTime * uSpeed * 3.2) + cos((uv.y + uOffset) * 2.6)) * 0.25;
            vec3 transformed = position;
            transformed.y += wave * 0.18;
            transformed.z += wave * 0.22;
            vWave = wave;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
          }
        `}
        fragmentShader={`
          precision highp float;

          uniform vec3 uColorStart;
          uniform vec3 uColorEnd;
          uniform float uOpacity;

          varying vec2 vUv;
          varying float vWave;

          void main() {
            float mask = smoothstep(0.02, 0.45, 1.0 - abs(vUv.y - 0.5) * 2.0);
            float gradient = clamp(vUv.x + vWave * 0.35, 0.0, 1.0);
            vec3 color = mix(uColorStart, uColorEnd, gradient);
            float alpha = uOpacity * mask;

            if (alpha < 0.01) discard;

            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}

function HaloRings() {
  const groupRef = useRef<Group | null>(null);
  const rings = useMemo(
    () => [
      { inner: 0.62, outer: 0.7, color: new Color("#38bdf8"), opacity: 0.22 },
      { inner: 0.82, outer: 0.9, color: new Color("#a855f7"), opacity: 0.16 },
      { inner: 1.05, outer: 1.12, color: new Color("#38bdf8"), opacity: 0.12 },
    ],
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const wobble = 1 + Math.sin(t * 0.35) * 0.025;
    groupRef.current.rotation.z = Math.sin(t * 0.15) * 0.22;
    groupRef.current.scale.setScalar(wobble);
  });

  return (
    <group ref={groupRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, -0.02]}>
      {rings.map((ring, index) => (
        <mesh key={index}>
          <ringGeometry args={[ring.inner, ring.outer, 160]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={ring.opacity}
            blending={AdditiveBlending}
            side={DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function ParticleField() {
  const pointsRef = useRef<Points | null>(null);

  const { positions, speeds, offsets, drift } = useMemo(() => {
    const count = 950;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);
    const drift = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2.6;
      positions[i3 + 1] = Math.random() * 2.4 - 1.2;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.5;
      speeds[i] = 0.12 + Math.random() * 0.2;
      offsets[i] = Math.random() * Math.PI * 2;
      drift[i] = Math.random() * 0.9 + 0.4;
    }

    return { positions, speeds, offsets, drift };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const positionsArray = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const count = speeds.length;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positionsArray[i3 + 1] += speeds[i] * delta * 0.55;
      positionsArray[i3] += Math.sin(time * 0.35 + offsets[i]) * 0.0025 * drift[i];
      positionsArray[i3 + 2] = Math.sin(time * 0.6 + offsets[i] * 2.0) * 0.08;

      if (positionsArray[i3 + 1] > 1.2) {
        positionsArray[i3 + 1] = -1.2;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.z += delta * 0.03;
  });

  return (
    <points ref={pointsRef} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, 0.18, 0]}>
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
        blending={AdditiveBlending}
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
        <group position={[0, -0.08, 0]}>
          <AuroraBackdrop />
          <RibbonLayer
            colorStart="#38bdf8"
            colorEnd="#a855f7"
            offset={0.2}
            speed={0.6}
            opacity={0.42}
            y={-0.12}
            scale={1.6}
            tilt={0.12}
          />
          <RibbonLayer
            colorStart="#22d3ee"
            colorEnd="#38bdf8"
            offset={1.2}
            speed={0.9}
            opacity={0.32}
            y={0.05}
            scale={1.45}
            tilt={-0.18}
          />
          <RibbonLayer
            colorStart="#a855f7"
            colorEnd="#6366f1"
            offset={2.1}
            speed={0.45}
            opacity={0.28}
            y={0.22}
            scale={1.38}
            tilt={0.08}
          />
          <HaloRings />
          <ParticleField />
        </group>
      </Suspense>
    </Canvas>
  );
}
