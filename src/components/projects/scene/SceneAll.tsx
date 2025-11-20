"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { animated } from "@react-spring/three";
import * as THREE from "three";
import { SceneProps } from "./SceneTypes";

const AnimatedStandardMaterial = animated("meshStandardMaterial");

const PARTICLE_COUNT = 600;
const PARTICLE_RANGE = 50;
const Z_RESET_OFFSET = 15;
const CYCLE_DURATION = 30;

// CONFIGURACIÓN DEL EFECTO "CÁMARA ATRÁS + IMPLOSIÓN"
const START_SPEED = -20.0; // Velocidad fuerte hacia atrás al inicio
const END_SPEED = 0.7;     // Velocidad suave hacia adelante al final
const TRANSITION_DURATION = 3; // Cuánto tarda en estabilizarse

export default function SceneAll({ opacity, transitionProgress, isVisible }: SceneProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Acumulador para movimiento infinito suave
  const accumulatedDistance = useRef(0);
  // Marca de tiempo para reiniciar el efecto al entrar
  const sceneStartTime = useRef<number | null>(null);

  useEffect(() => {
    if (isVisible) {
      sceneStartTime.current = performance.now() / 1000;
    }
  }, [isVisible]);

  // --- Generación de Partículas ---
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

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;

    // 1. FIX DELTA: Evita saltos si cambias de pestaña
    const dt = Math.min(delta, 0.1);

    const globalTime = clock.getElapsedTime();
    const t = transitionProgress.get();
    const now = performance.now() / 1000;

    // Tiempo local desde que apareció la escena
    const localTime = (isVisible && sceneStartTime.current) 
      ? now - sceneStartTime.current 
      : TRANSITION_DURATION + 1;

    // 2. CURVA DE VELOCIDAD (El efecto de "irse para atrás")
    let currentSpeed = END_SPEED;
    if (localTime < TRANSITION_DURATION) {
      const progress = localTime / TRANSITION_DURATION;
      // Ease out cubic para suavizar el frenado
      const ease = 1 - Math.pow(1 - progress, 4);
      currentSpeed = THREE.MathUtils.lerp(START_SPEED, END_SPEED, ease);
    }

    accumulatedDistance.current += currentSpeed * dt;

    // 3. EFECTO DE CONTRACCIÓN (Implosión)
    const pulse = (Math.sin((globalTime / CYCLE_DURATION) * Math.PI * 2) + 1) / 2;
    // Fuerza de atracción constante al inicio, luego pulsante
    const attractStrength = THREE.MathUtils.lerp(0.1, 0.25, pulse); 
    
    const baseBrightness = THREE.MathUtils.lerp(0.5, 1.0, t);
    const hueBase = (globalTime * 10) % 360;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const pos = positions[i];
      const init = initialPos[i];

      // A. Movimiento Infinito Z
      const totalDistance = initialZ[i] + accumulatedDistance.current;
      const currentZ = ((totalDistance % PARTICLE_RANGE) + PARTICLE_RANGE) % PARTICLE_RANGE;
      pos.z = currentZ - PARTICLE_RANGE + Z_RESET_OFFSET;

      // B. ATRACCIÓN HACIA EL ORIGEN (Lerp suave)
      // Usamos un factor fijo (0.1) en lugar de 't' para que ocurra siempre
      pos.lerp(init.clone().multiplyScalar(1 - attractStrength), 0.1);
      
      // C. IMPLOSIÓN FÍSICA (Esta es la línea que te gustaba)
      // Reduce el radio total de la esfera de partículas
      pos.multiplyScalar(1 - attractStrength * 0.4);

      // Transformaciones finales
      tempObject.position.copy(pos);
      tempObject.rotation.z = rotations[i] + globalTime * 0.2;
      
      // Escala (se hacen pequeñas al fondo)
      const depthFactor = 1 - Math.abs(pos.z) / PARTICLE_RANGE;
      const scale = Math.max(0, 0.1 + depthFactor * 0.3);
      tempObject.scale.setScalar(scale);

      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }

    // Color dinámico
    color.setHSL((hueBase / 360) % 1, 1.0, 0.6 * baseBrightness);
    (meshRef.current.material as THREE.MeshStandardMaterial).color.copy(color);

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <animated.instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
      frustumCulled={false} // Evita parpadeos en bordes
    >
      <sphereGeometry args={[0.08, 8, 8]} />
      <AnimatedStandardMaterial
        transparent
        opacity={opacity} // Controlado por el hook de transición
        metalness={0.2}
        roughness={0.1}
        emissive={"white"}
        emissiveIntensity={0.4}
        // Evitamos escribir en el depth buffer para transiciones más suaves entre escenas transparentes
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