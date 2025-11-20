"use client";

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { useSceneTransition } from '@/hooks/useSceneTransition';
import { ClientCategorySlug, CATEGORY_INDICES, CATEGORY_COLORS } from '@/config/projectCategories';
import SceneAll from './SceneAll';
import SceneAI from './SceneAI';
import SceneGames from './SceneGames';

import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";

interface ProjectSceneContentProps {
  category: ClientCategorySlug;
}

export default function ProjectSceneContent({ category }: ProjectSceneContentProps) {
  const { progress, previousCategory, currentCategory } = useSceneTransition(category);
  const { scene, camera } = useThree();
  const scrollTopRef = useRef(0);
  const smoothScrollRef = useRef(0);

  const PX_TO_WORLD_Y = -0.0025;
  const TARGET_Z = 5;
  const DAMPING = 0.2;

  useEffect(() => {
    const handleAppScroll = (e: Event) => {
      const detail = (e as CustomEvent).detail as { scrollTop: number } | undefined;
      if (!detail) return;
      scrollTopRef.current = detail.scrollTop;
    };
    window.addEventListener("app-scroll", handleAppScroll as EventListener);
    return () => window.removeEventListener("app-scroll", handleAppScroll as EventListener);
  }, []);

  // Lógica de Opacidad corregida para evitar saltos
  const getOpacity = (targetCategorySlug: ClientCategorySlug) =>
    progress.to((p) => {
      // Si no hay transición activa (ya terminó), solo mostramos la actual
      if (previousCategory === currentCategory) {
        return targetCategorySlug === currentCategory ? 1 : 0;
      }

      // Si somos la categoría "vieja", nos desvanecemos
      if (targetCategorySlug === previousCategory) return 1 - p;
      
      // Si somos la categoría "nueva", aparecemos
      if (targetCategorySlug === currentCategory) return p;
      
      return 0;
    });

  const isSceneActive = (targetCategorySlug: ClientCategorySlug) => {
    // Mantenemos la escena renderizada si es la previa o la actual
    return targetCategorySlug === previousCategory || targetCategorySlug === currentCategory;
  };

  useFrame(() => {
    const t = progress.get();

    const fromIndex = CATEGORY_INDICES[previousCategory];
    const toIndex = CATEGORY_INDICES[currentCategory];

    // Aseguramos que existan colores por si acaso los índices fallan
    const fromColor = CATEGORY_COLORS[fromIndex] || new THREE.Color('#000000');
    const toColor = CATEGORY_COLORS[toIndex] || new THREE.Color('#000000');

    smoothScrollRef.current += (scrollTopRef.current - smoothScrollRef.current) * DAMPING;

    const targetY = smoothScrollRef.current * PX_TO_WORLD_Y;
    camera.position.lerp(new THREE.Vector3(0, targetY, TARGET_Z), 0.9);

    if (!scene.background || !(scene.background instanceof THREE.Color)) {
      scene.background = new THREE.Color();
    }

    // Interpolación del color de fondo
    (scene.background as THREE.Color).copy(fromColor).lerp(toColor, t);

    if (!scene.fog) {
      scene.fog = new THREE.Fog(scene.background, 1, 100);
    } else {
      (scene.fog as THREE.Fog).color.copy(scene.background);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7]} intensity={1} />
 
      {/* Pasamos isVisible explícitamente para que SceneAll sepa cuándo reiniciar su efecto */}
      
      {isSceneActive('all') && (
        <SceneAll 
          opacity={getOpacity('all')} 
          transitionProgress={progress}
          isVisible={currentCategory === 'all'} 
        />
      )}

      {isSceneActive('ai') && (
        <SceneAI 
          opacity={getOpacity('ai')} 
          transitionProgress={progress}
          isVisible={currentCategory === 'ai'}
        />
      )}

      {isSceneActive('games') && (
        <SceneGames 
          opacity={getOpacity('games')} 
          transitionProgress={progress}
          isVisible={currentCategory === 'games'}
        />
      )}

      <EffectComposer>
        <Bloom intensity={2} luminanceThreshold={0.1} luminanceSmoothing={0.1} />
        <Noise opacity={0.03} />
      </EffectComposer>
    </>
  );
}