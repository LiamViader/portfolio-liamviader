"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { animated } from '@react-spring/three';
import * as THREE from 'three';
import { SceneProps } from './SceneTypes';

const AnimatedStandardMaterial = animated('meshStandardMaterial');
const ASTEROID_COUNT = 50;
const ASTEROID_FIELD_SIZE = 90;
const ASTEROID_COLORS = ['#f97316', '#fcd34d', '#a855f7', '#22d3ee', '#10b981'];

const createAsteroidGeometry = () => {
  const geometry = new THREE.IcosahedronGeometry(1.2, 2);
  const positionAttribute = geometry.getAttribute('position');

  const vertex = new THREE.Vector3();
  for (let i = 0; i < positionAttribute.count; i++) {
    vertex.fromBufferAttribute(positionAttribute, i);
    const noise = 0.3 + Math.random() * 0.5;
    const stretch = 0.9 + Math.random() * 0.3;
    vertex.multiplyScalar(stretch + Math.sin(vertex.length() * 3) * noise * 0.25);
    positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  geometry.computeVertexNormals();
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
        opacity={opacity}
        flatShading
        depthWrite={false}
        roughness={0.65}
        metalness={0.25}
        emissive={new THREE.Color(color).multiplyScalar(0.2)}
        emissiveIntensity={0.9}
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
          (Math.random() - 0.5) * ASTEROID_FIELD_SIZE,
          -Math.random() * (ASTEROID_FIELD_SIZE * 0.4)
        ),
        scale: 0.5 + Math.random() * 1.2,
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
    <animated.group ref={groupRef}>
      {asteroidProps.map((props, index) => (
        <Asteroid key={index} {...props} opacity={opacity} />
      ))}
    </animated.group>
  );
}