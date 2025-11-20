"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { animated } from '@react-spring/three';
import * as THREE from 'three';
import { SceneProps } from './SceneTypes';

const AnimatedStandardMaterial = animated('meshStandardMaterial');
const ASTEROID_COUNT = 50;
const ASTEROID_FIELD_SIZE = 90;

const Asteroid = ({ position, rotation, scale, opacity }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const randomOffset = useMemo(() => Math.random() * 100, []);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() + randomOffset;
      meshRef.current.rotation.x = t * 0.1;
      meshRef.current.rotation.y = t * 0.05;
      meshRef.current.position.y = position.y + Math.sin(t * 0.5) * 1.5;
    }
  });

  return (
    <animated.mesh 
      ref={meshRef} 
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
    >
      <dodecahedronGeometry args={[1, 0]} /> 
      <AnimatedStandardMaterial 
        color="#738a90"
        transparent={true} 
        opacity={opacity} 
        flatShading={true}
        depthWrite={false}
        roughness={0.6}
        metalness={0.4}
      />
    </animated.mesh>
  );
};

export default function SceneGames({ opacity, transitionProgress }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  const asteroidProps = useMemo(() => {
    return Array(ASTEROID_COUNT).fill(0).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * ASTEROID_FIELD_SIZE,
        (Math.random() - 0.5) * ASTEROID_FIELD_SIZE,
        -Math.random() * (ASTEROID_FIELD_SIZE * 0.4) 
      ),
      rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
      scale: 0.5 + Math.random() * 1.2,
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