"use client";

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { animated } from '@react-spring/three';
import * as THREE from 'three';
import { SceneProps } from './SceneTypes';


const AnimatedStandardMaterial = animated('meshStandardMaterial');
const ASTEROID_COUNT = 50;
const ASTEROID_FIELD_SIZE = 100;

const Asteroid = ({ position, rotation, scale, opacity }: { position: THREE.Vector3, rotation: THREE.Euler, scale: number, opacity: SceneProps['opacity'] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeOffset = useMemo(() => Math.random() * 100, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime() + timeOffset;
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.003;

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
      <dodecahedronGeometry args={[1, 0]} />
      <AnimatedStandardMaterial
        color="#3e3241"
        transparent={true}
        opacity={opacity}
        flatShading={true}
        depthWrite={false}
      />
    </animated.mesh>
  );
};


const DESKTOP_BASELINE = 1080;

export default function SceneAI(props: SceneProps) {
  const { opacity } = props;
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();

  // Initial stable width
  const [stableWidth, setStableWidth] = useState(size.width);

  // Update stableWidth only if difference > 10px to avoid frequent re-calculation
  useEffect(() => {
    if (Math.abs(size.width - stableWidth) > 10) {
      setStableWidth(size.width);
    }
  }, [size.width, stableWidth]);

  // Responsive scale factor based on window width, capped at 1.0 for desktop
  const scaleFactor = Math.min(1, stableWidth / DESKTOP_BASELINE);

  const currentAsteroidCount = Math.floor(ASTEROID_COUNT * scaleFactor);
  const currentSpreadX = ASTEROID_FIELD_SIZE * scaleFactor;

  const asteroidProps = useMemo(() => {
    return Array(currentAsteroidCount).fill(0).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * currentSpreadX,
        (Math.random() - 0.5) * ASTEROID_FIELD_SIZE,
        -Math.random() * (ASTEROID_FIELD_SIZE / 2)
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      scale: 0.5 + Math.random() * 1.5,
    }));
  }, [currentAsteroidCount, currentSpreadX]);

  useFrame(() => {

    if (groupRef.current) {
      groupRef.current.scale.setScalar(1);
      groupRef.current.rotation.z += 0.0005;
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