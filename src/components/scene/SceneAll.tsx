"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { animated } from "@react-spring/three";
import * as THREE from "three";
import { EffectComposer, Bloom, DepthOfField, Noise } from "@react-three/postprocessing";
import { SceneProps } from "./SceneTypes";

const AnimatedStandardMaterial = animated("meshStandardMaterial");

const PARTICLE_COUNT = 2000;
const PARTICLE_RANGE = 50;
const PARTICLE_SPEED_BASE = 0.5;
const Z_RESET_OFFSET = 15;
const CYCLE_DURATION = 30; // segundos (15 atracción + 15 expansión)

export default function SceneAll({ opacity, transitionProgress, isVisible }: SceneProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // --- Posiciones iniciales ---
  const { positions, rotations, initialZ, initialPos } = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const rotations: number[] = [];
    const initialZ: number[] = [];
    const initialPos: THREE.Vector3[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * PARTICLE_RANGE*2,
        (Math.random() - 0.5) * PARTICLE_RANGE*2,
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

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const time = clock.getElapsedTime();
    const t = transitionProgress.get();

    // --- Pulso periódico central ---
    // oscila entre 0 (expandidas) y 1 (compactas)
    const pulse = (Math.sin((time / CYCLE_DURATION) * Math.PI * 2) + 1) / 2;
    const attractStrength = THREE.MathUtils.lerp(0.0, 0.1, pulse); // fuerza de atracción
    const speed = THREE.MathUtils.lerp(0.2, PARTICLE_SPEED_BASE * 1.5, t);
    const hueBase = (time * 10) % 360;
    const baseBrightness = THREE.MathUtils.lerp(0.5, 1.0, t);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const pos = positions[i];
      const init = initialPos[i];

      // Movimiento en Z continuo
      const totalDistance = initialZ[i] + time * speed;
      const currentZ = (totalDistance % PARTICLE_RANGE + PARTICLE_RANGE) % PARTICLE_RANGE;
      pos.z = currentZ - PARTICLE_RANGE + Z_RESET_OFFSET;

      // Atracción hacia el centro, mezclando con posición original
      pos.lerp(init.clone().multiplyScalar(1 - attractStrength), 0.05 * t);
      pos.multiplyScalar(1 - attractStrength * 0.4);

      // Rotación + escala por profundidad
      tempObject.position.copy(pos);
      tempObject.rotation.z = rotations[i] + time * 0.2;
      const depthFactor = 1 - Math.abs(pos.z) / PARTICLE_RANGE;
      const scale = 0.1 + depthFactor * 0.3;
      tempObject.scale.setScalar(scale);

      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }

    // --- Color dinámico ---
    color.setHSL((hueBase / 360) % 1, 1.0, 0.6 * baseBrightness);
    (meshRef.current.material as THREE.MeshStandardMaterial).color.copy(color);

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <animated.instancedMesh
        ref={meshRef}
        args={[undefined, undefined, PARTICLE_COUNT]}
        onUpdate={(self) => (self.instanceMatrix.needsUpdate = true)}
      >
        <sphereGeometry args={[0.08, 8, 8]} />
        <AnimatedStandardMaterial
          transparent
          opacity={opacity}
          metalness={0.2}
          roughness={0.1}
          emissive={"white"}
          emissiveIntensity={0.4}
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

      {isVisible && (
        <EffectComposer>
          <Bloom intensity={2} luminanceThreshold={0.1} luminanceSmoothing={0.5}/>
          <DepthOfField focusDistance={0.02} focalLength={0.02} bokehScale={3.0} />
          <Noise opacity={0.03} />
        </EffectComposer>
      )}
    </>
  );
}
