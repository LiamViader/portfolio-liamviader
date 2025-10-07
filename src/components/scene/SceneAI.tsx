"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { animated } from '@react-spring/three';
import * as THREE from 'three';
import { SceneProps } from './SceneTypes'; // Importación corregida

const AnimatedStandardMaterial = animated('meshStandardMaterial');

export default function SceneAI({ opacity, transitionProgress, isVisible }: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  // Geometría para el efecto de red (estructura alámbrica)
  const { edges } = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(5, 2);
    const edges = new THREE.EdgesGeometry(geometry);
    return { edges };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (meshRef.current) {
      // Rotación lenta de la esfera central
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x += 0.001;
    }
    
    // 💡 Uso de transitionProgress: El factor de escala
    const transitionFactor = transitionProgress.get();
    
    let scale;
    if (isVisible) {
      // Entrada (Scale In): escala de 0.5 a 1.0
      scale = 1 + transitionFactor * 1;
    } else {
      // Salida (Scale Out): escala de 1.0 a 0.5
      scale = 2;
    }

    if (lineRef.current) {
      // Rotación del grupo de líneas
      lineRef.current.rotation.y = t * 0.05;
      lineRef.current.rotation.x = t * 0.03;
      lineRef.current.position.y = -2;

      // Escala de entrada/salida
      lineRef.current.scale.setScalar(scale);
    }
  });
  

  return (
    <group>

      {/* Red alámbrica (Efecto de Conexiones Neuronales) */}
      <animated.lineSegments ref={lineRef}>
        <primitive object={edges} />
        <animated.lineBasicMaterial 
          color="cyan" 
          linewidth={1} 
          transparent={true}
          opacity={opacity.to(o => o * 0.7)} // Menos opaco que el núcleo
        />
      </animated.lineSegments>
    </group>
  );
}