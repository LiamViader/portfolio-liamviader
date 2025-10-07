"use client";

import { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { animated } from '@react-spring/three';
import * as THREE from 'three';
import { SceneProps } from './SceneTypes'; // Importación corregida

const AnimatedStandardMaterial = animated('meshStandardMaterial');
const PARTICLE_COUNT = 500;
const PARTICLE_RANGE = 25; // Distribución Z

export default function SceneAll({ opacity, transitionProgress, isVisible }: SceneProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Configuración de las partículas instanciadas
  const { positions, rotations } = useMemo(() => {
    const positions = Array(PARTICLE_COUNT).fill(0).map(() => 
      new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        -Math.random() * PARTICLE_RANGE - 5 // Posición detrás de la cámara
      )
    );
    const rotations = Array(PARTICLE_COUNT).fill(0).map(() => Math.random() * Math.PI * 2);
    return { positions, rotations };
  }, []);

  const tempObject = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime();
      const transitionFactor = transitionProgress.get();

      // Rotación y movimiento de cada instancia
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        tempObject.position.copy(positions[i]);

        // Movimiento sutil hacia adelante
        tempObject.position.z += (time * 0.5) % PARTICLE_RANGE;
        
        // Efecto de entrada/salida: Mover las partículas al centro cuando salen
        if (!isVisible) {
          const t = 1 - transitionFactor; // t va de 1 a 0
          tempObject.position.multiplyScalar(1 - t * 0.2); // Pequeño encogimiento
        }
        
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
      // Inicializar las matrices de las instancias
      onUpdate={(self) => self.instanceMatrix.needsUpdate = true}
    >
      {/* Geometría: Pequeñas esferas para las partículas */}
      <sphereGeometry args={[0.05, 8, 8]} /> 
      <AnimatedStandardMaterial 
        color="#AAAAAA" 
        transparent={true} 
        opacity={opacity} 
        metalness={0.5} 
        roughness={0.5} 
      />
    </animated.instancedMesh>
  );
}