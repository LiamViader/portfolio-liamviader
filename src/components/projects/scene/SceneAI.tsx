"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { animated } from '@react-spring/three';
import * as THREE from 'three';
import { SceneProps } from './SceneTypes';

export default function SceneAI({ opacity, transitionProgress, isVisible }: SceneProps) {
  const lineRef = useRef<THREE.LineSegments>(null);

  const { edges } = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(9, 2); 
    const edges = new THREE.EdgesGeometry(geometry);
    return { edges };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (lineRef.current) {
      lineRef.current.rotation.y = t * 0.08; 
      lineRef.current.rotation.x = t * 0.02;
      lineRef.current.position.y = -1; 
    }

    const progress = transitionProgress.get();
    

    if (lineRef.current) {
      lineRef.current.scale.setScalar(1);
    }
  });

  return (
    <>
      <animated.lineSegments ref={lineRef}>
        <primitive object={edges} />
        <animated.lineBasicMaterial 
          color="#22d3ee"
          linewidth={1} 
          transparent={true}
          opacity={opacity} 
          depthWrite={false} 
          toneMapped={false}
        />
      </animated.lineSegments>
    </>
  );
}