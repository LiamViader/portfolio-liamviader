"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { animated } from '@react-spring/three';
import * as THREE from 'three';
import { SceneProps } from './SceneTypes';

const AnimatedStandardMaterial = animated('meshStandardMaterial');
const ASTEROID_COUNT = 50;
const ASTEROID_FIELD_SIZE = 90;
const ASTEROID_COLORS = ['#8f96a0', '#7a746e', '#657080', '#738a90', '#6e7862'];

const createAsteroidGeometry = () => {
  const geometry = new THREE.IcosahedronGeometry(1.05, 2);
  const positionAttribute = geometry.getAttribute('position');
  const vertex = new THREE.Vector3();
  const normal = new THREE.Vector3();

  for (let i = 0; i < positionAttribute.count; i++) {
    vertex.fromBufferAttribute(positionAttribute, i);
    normal.copy(vertex).normalize();

    const surfaceNoise = 0.02 + Math.random() * 0.05;
    const banding = Math.sin(vertex.y * 2.5) * 0.025;
    const displacement = 1 + surfaceNoise + banding;

    normal.multiplyScalar(displacement);
    positionAttribute.setXYZ(i, normal.x, normal.y, normal.z);
  }

  geometry.computeVertexNormals();
  geometry.normalizeNormals();
  return geometry;
};

type AsteroidProps = {
  basePosition: THREE.Vector3;
  scale: number;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  wobbleSpeed: number;
  spinX: number;
  spinY: number;
  phase: number;
};

const Asteroid = ({
  basePosition,
  scale,
  color,
  orbitRadius,
  orbitSpeed,
  wobbleSpeed,
  spinX,
  spinY,
  phase,
  opacity,
}: AsteroidProps & { opacity: SceneProps['opacity'] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const randomOffset = useMemo(() => Math.random() * 100, []);
  const geometry = useMemo(() => createAsteroidGeometry(), []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() + randomOffset;
      meshRef.current.rotation.x = t * spinX;
      meshRef.current.rotation.y = t * spinY;

      const x = basePosition.x + Math.cos(t * orbitSpeed + phase) * orbitRadius;
      const z = basePosition.z + Math.sin(t * orbitSpeed + phase) * orbitRadius * 0.35;
      const y = basePosition.y + Math.sin(t * wobbleSpeed) * 3;

      meshRef.current.position.set(x, y, z);
    }
  });

  return (
    <animated.mesh
      ref={meshRef}
      scale={[scale, scale, scale]}
      geometry={geometry}
    >
      <AnimatedStandardMaterial
        color={color}
        transparent={true}
        opacity={opacity.to((value) => 0.25 + value * 0.35)}
        flatShading
        depthWrite={false}
        roughness={0.82}
        metalness={0.08}
        emissive={new THREE.Color(color).multiplyScalar(0.05)}
        emissiveIntensity={0.16}
      />
    </animated.mesh>
  );
};

export default function SceneGames({ opacity }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  const asteroidProps = useMemo(() => {
    return Array(ASTEROID_COUNT)
      .fill(0)
      .map(() => ({
        basePosition: new THREE.Vector3(
          (Math.random() - 0.5) * ASTEROID_FIELD_SIZE,
          (Math.random() - 0.5) * (ASTEROID_FIELD_SIZE * 0.55),
          -40 - Math.random() * (ASTEROID_FIELD_SIZE * 0.5)
        ),
        scale: 0.6 + Math.random() * 1.0,
        color: ASTEROID_COLORS[Math.floor(Math.random() * ASTEROID_COLORS.length)],
        orbitRadius: 2 + Math.random() * 8,
        orbitSpeed: 0.1 + Math.random() * 0.25,
        wobbleSpeed: 0.8 + Math.random() * 0.6,
        spinX: 0.15 + Math.random() * 0.2,
        spinY: 0.08 + Math.random() * 0.12,
        phase: Math.random() * Math.PI * 2,
      }));
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={[new THREE.Color('#050910'), 0.018]} />
      <animated.group ref={groupRef}>
        {asteroidProps.map((props, index) => (
          <Asteroid key={index} {...props} opacity={opacity} />
        ))}
      </animated.group>
    </>
  );
}