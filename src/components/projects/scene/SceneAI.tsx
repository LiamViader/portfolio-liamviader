"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { animated } from '@react-spring/three';
import * as THREE from 'three';
import { SceneProps } from './SceneTypes';

export default function SceneAI({ opacity, transitionProgress, isVisible }: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  const { edges } = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(5, 2);
    const edges = new THREE.EdgesGeometry(geometry);
    return { edges };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const transitionFactor = transitionProgress.get();
    
    // Efecto de escala al entrar/salir
    let scale;
    if (isVisible) {
      scale = 1 + transitionFactor * 0.2; // Sutil zoom in
    } else {
      scale = 1.2 + (1 - transitionFactor) * 0.5; // Zoom out al irse
    }

    if (lineRef.current) {
      lineRef.current.rotation.y = t * 0.05;
      lineRef.current.rotation.x = t * 0.03;
      lineRef.current.position.y = -2;
      lineRef.current.scale.setScalar(scale);
    }
  });

  return (
    <animated.lineSegments ref={lineRef}>
      <primitive object={edges} />
      <animated.lineBasicMaterial 
        color="cyan" 
        linewidth={1} 
        transparent={true}
        opacity={opacity.to(o => o * 0.7)}
        depthWrite={false} // CLAVE: Evita glitches al mezclarse con otras escenas
      />
    </animated.lineSegments>
  );
}