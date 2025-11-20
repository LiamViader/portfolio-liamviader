"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { animated } from '@react-spring/three';
import * as THREE from 'three';
import { SceneProps } from './SceneTypes';

const AnimatedStandardMaterial = animated('meshStandardMaterial');
const ASTEROID_COUNT = 30;
const ASTEROID_FIELD_SIZE = 90;

const BASE_HUE = 276 / 360;
const BASE_SAT = 0.89;
const BASE_LIGHT = 0.65;

const Asteroid = ({ position, rotation, scale, opacity }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const randomOffset = useMemo(() => Math.random() * 100, []);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const t = clock.getElapsedTime() + randomOffset;

    // Movimiento original
    meshRef.current.rotation.x = t * 0.1;
    meshRef.current.rotation.y = t * 0.05;
    meshRef.current.position.y = position.y + Math.sin(t * 0.5) * 1.5;

    // Variación muy suave de color
    const hueShift = Math.sin(t * 0.25) * 0.2;     // ±1.5% de hue
    const lightShift = Math.sin(t * 1) * 1;     // ±3% de lightness

    const hue = BASE_HUE + hueShift;
    const light = BASE_LIGHT + lightShift;

    color.setHSL(hue, BASE_SAT, light);

    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    if (!material) return;

    // Color base y emisión con esa ligera variación
    material.color.copy(color);
    material.emissive.copy(color);
    // No tocamos emissiveIntensity → se queda "fuerte" como tenías
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
        color="#a855f7"
        transparent 
        opacity={opacity} 
        flatShading
        depthWrite={false}
        roughness={0.6}
        metalness={0.4}
        emissive="#a855f7"
        // sin emissiveIntensity => se mantiene el brillo potente
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
      scale: 0.1 + Math.random() * 0.7,
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
