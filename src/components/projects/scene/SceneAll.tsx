"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { animated } from "@react-spring/three";
import * as THREE from "three";
import { SceneProps } from "./SceneTypes";

const AnimatedStandardMaterial = animated("meshStandardMaterial");

const PARTICLE_COUNT = 800;
const PARTICLE_RANGE = 50;
const Z_RESET_OFFSET = 15;
const CYCLE_DURATION = 30;

const START_SPEED = -10.0;
const END_SPEED = 0.7;
const TRANSITION_DURATION = 3;

const DESKTOP_BASELINE = 1980;

export default function SceneAll({ opacity, transitionProgress, isVisible }: SceneProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const accumulatedDistance = useRef(0);
  const sceneStartTime = useRef<number | null>(null);

  useEffect(() => {
    if (isVisible) {
      sceneStartTime.current = performance.now() / 1000;
    }
  }, [isVisible]);

  const { positions, rotations, initialZ, initialPos } = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const rotations: number[] = [];
    const initialZ: number[] = [];
    const initialPos: THREE.Vector3[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {

      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * PARTICLE_RANGE * 2,
        (Math.random() - 0.5) * PARTICLE_RANGE * 2,
        -(Math.random() * PARTICLE_RANGE) + Z_RESET_OFFSET
      );
      positions.push(pos.clone());
      initialPos.push(pos.clone());
      rotations.push(Math.random() * Math.PI * 2);
      initialZ.push(pos.z);
    }
    return { positions, rotations, initialZ, initialPos };
  }, []);

  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock, size: currentSize }, delta) => {
    if (!meshRef.current) return;

    const currentScaleFactor = Math.min(1, currentSize.width / DESKTOP_BASELINE);


    const dt = Math.min(delta, 0.1);

    const globalTime = clock.getElapsedTime();
    const t = transitionProgress.get();
    const now = performance.now() / 1000;

    const localTime = (isVisible && sceneStartTime.current)
      ? now - sceneStartTime.current
      : TRANSITION_DURATION + 1;

    let currentSpeed = END_SPEED;
    if (localTime < TRANSITION_DURATION) {
      const progress = localTime / TRANSITION_DURATION;
      const ease = 1 - Math.pow(1 - progress, 5);
      currentSpeed = THREE.MathUtils.lerp(START_SPEED, END_SPEED, ease);
    }

    accumulatedDistance.current += currentSpeed * dt;

    const pulse = (Math.sin((globalTime / CYCLE_DURATION) * Math.PI * 2) + 1) / 2;
    const attractStrength = THREE.MathUtils.lerp(0.1, 0.25, pulse);

    const baseBrightness = THREE.MathUtils.lerp(0.5, 1.0, t);
    const hueBase = (globalTime * 10) % 360;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const pos = positions[i];
      const init = initialPos[i];

      const totalDistance = initialZ[i] + accumulatedDistance.current;
      const currentZ = ((totalDistance % PARTICLE_RANGE) + PARTICLE_RANGE) % PARTICLE_RANGE;

      pos.z = currentZ - PARTICLE_RANGE + Z_RESET_OFFSET;

      pos.lerp(init.clone().multiplyScalar(1 - attractStrength), 0.1);
      pos.multiplyScalar(1 - attractStrength * 0.4);

      const renderPos = pos.clone();
      renderPos.x *= currentScaleFactor;

      tempObject.position.copy(renderPos);
      tempObject.rotation.z = rotations[i] + globalTime * 0.2;

      const depthFactor = 1 - Math.abs(pos.z) / PARTICLE_RANGE;
      const scale = Math.max(0, 0.1 + depthFactor * 0.3);
      tempObject.scale.setScalar(scale);

      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }

    color.setHSL((hueBase / 360) % 1, 1.0, 0.6 * baseBrightness);
    (meshRef.current.material as THREE.MeshStandardMaterial).color.copy(color);

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <animated.instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
      frustumCulled={false}
    >
      <sphereGeometry args={[0.08, 8, 8]} />
      <AnimatedStandardMaterial
        transparent
        opacity={opacity}
        metalness={0.2}
        roughness={0.1}
        emissive={"white"}
        emissiveIntensity={0.4}
        depthWrite={false}
        onBeforeCompile={(shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <dithering_fragment>",
            `
              float depthFactor = (vViewPosition.z + ${PARTICLE_RANGE.toFixed(1)}) / ${(
              PARTICLE_RANGE * 2
            ).toFixed(1)};
              gl_FragColor.rgb *= smoothstep(1.0, 0.0, depthFactor);
              #include <dithering_fragment>
            `
          );
        }}
      />
    </animated.instancedMesh>
  );
}