"use client";

import { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { animated } from '@react-spring/three';
import * as THREE from 'three';
import { SceneProps } from './SceneTypes'; 

const AnimatedStandardMaterial = animated('meshStandardMaterial');
const PARTICLE_COUNT = 1000;
const PARTICLE_RANGE = 50;
const PARTICLE_SPEED = 1.0; 
const Z_RESET_OFFSET = 5;

export default function SceneAll({ opacity, transitionProgress, isVisible }: SceneProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // 1. Configuración inicial de las partículas
  const { positions, rotations, initialZ } = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const rotations: number[] = [];
    const initialZ: number[] = []; 
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 50, 
          (Math.random() - 0.5) * 50, 
          // Posición inicial: aleatoriamente entre -55 y +5
          -(Math.random() * PARTICLE_RANGE ) + Z_RESET_OFFSET
        )
      );
      rotations.push(Math.random() * Math.PI * 2);
      initialZ.push(positions[i].z); 
    }
    return { positions, rotations, initialZ };
  }, []);

  const tempObject = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime();

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        tempObject.position.copy(positions[i]);
        const totalDistance = initialZ[i] + time * PARTICLE_SPEED;
        let currentZ = (totalDistance % PARTICLE_RANGE + PARTICLE_RANGE) % (PARTICLE_RANGE);
        
        tempObject.position.z = currentZ - PARTICLE_RANGE + Z_RESET_OFFSET;

        // Rotación sutil
        tempObject.rotation.z = rotations[i] + time * 0.1;
        
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <animated.instancedMesh 
      ref={meshRef} 
      args={[undefined, undefined, PARTICLE_COUNT]}
      onUpdate={(self) => self.instanceMatrix.needsUpdate = true}
    >
      {/* Geometría: Pequeñas esferas para las partículas */}
      <sphereGeometry args={[0.05, 8, 8]} /> 
      <AnimatedStandardMaterial 
        color="#ffffff" 
        transparent={true} 
        opacity={opacity} 
        metalness={0.0} 
        roughness={0.0} 
      />
    </animated.instancedMesh>
  );
}