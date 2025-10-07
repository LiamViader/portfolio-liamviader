"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { animated } from '@react-spring/three';
import * as THREE from 'three';
import { SceneProps } from './SceneTypes'; // Importación corregida


const AnimatedStandardMaterial = animated('meshStandardMaterial');
const ASTEROID_COUNT = 60;
const ASTEROID_FIELD_SIZE = 100;

const Asteroid = ({ position, rotation, scale, opacity }: { position: THREE.Vector3, rotation: THREE.Euler, scale: number, opacity: SceneProps['opacity'] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeOffset = useMemo(() => Math.random() * 100, []);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime() + timeOffset;
      // Rotación constante
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.003;
      
      // Simular movimiento lento en el espacio
      meshRef.current.position.y = position.y + Math.sin(time * 0.1) * 0.5;
    }
  });

  return (
    <animated.mesh 
      ref={meshRef} 
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
    >
      {/* Geometría de tetraedro low-poly */}
      <dodecahedronGeometry args={[1, 0]} /> 
      <AnimatedStandardMaterial 
        color="#3e3241" // Azul violeta
        transparent={true} 
        opacity={opacity} 
        flatShading={true} // Estilo Low-Poly
      />
    </animated.mesh>
  );
};


export default function SceneGames({ opacity, transitionProgress, isVisible }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Generar las propiedades iniciales de los asteroides
  const asteroidProps = useMemo(() => {
    return Array(ASTEROID_COUNT).fill(0).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * ASTEROID_FIELD_SIZE,
        (Math.random() - 0.5) * ASTEROID_FIELD_SIZE,
        -Math.random() * (ASTEROID_FIELD_SIZE/2)
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      scale: 0.5 + Math.random() * 1.5,
    }));
  }, []);

  useFrame(() => {
    const transitionFactor = transitionProgress.get();
    
    if (groupRef.current) {
      groupRef.current.scale.setScalar(1);
      groupRef.current.rotation.z += 0.001;
    }
  });


  return (
    <>
      <animated.group ref={groupRef}>
        {asteroidProps.map((props, index) => (
          <Asteroid key={index} {...props} opacity={opacity} />
        ))}
      </animated.group>
    </>
  );
}