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
  const DAMPING = 0.15;

  useEffect(() => {
    const handleAppScroll = (e: Event) => {
      const detail = (e as CustomEvent).detail as { scrollTop: number } | undefined;
      if (!detail) return;
      scrollTopRef.current = detail.scrollTop;
    };
    window.addEventListener("app-scroll", handleAppScroll as EventListener);
    return () => window.removeEventListener("app-scroll", handleAppScroll as EventListener);
  }, []);

  const getOpacity = (sceneSlug: ClientCategorySlug) => {
    return progress.to(p => {
      if (previousCategory === currentCategory && sceneSlug === currentCategory) return 1;

      if (sceneSlug === currentCategory) return p;

      if (sceneSlug === previousCategory) return 1 - p;
      
      return 0;
    });
  };


  const isSceneActive = (sceneSlug: ClientCategorySlug) => {
    return sceneSlug === currentCategory || sceneSlug === previousCategory;
  };

  useFrame(() => {
    const t = progress.get();
    
    const fromIndex = CATEGORY_INDICES[previousCategory] ?? 0;
    const toIndex = CATEGORY_INDICES[currentCategory] ?? 0;
    
    const fromColor = CATEGORY_COLORS[fromIndex] || new THREE.Color(0,0,0);
    const toColor = CATEGORY_COLORS[toIndex] || new THREE.Color(0,0,0);

    smoothScrollRef.current += (scrollTopRef.current - smoothScrollRef.current) * DAMPING;
    const targetY = smoothScrollRef.current * PX_TO_WORLD_Y;
    camera.position.lerp(new THREE.Vector3(0, targetY, TARGET_Z), 0.1);

    if (!scene.background || !(scene.background instanceof THREE.Color)) {
      scene.background = new THREE.Color();
    }
    (scene.background as THREE.Color).copy(fromColor).lerp(toColor, t);

    if (!scene.fog) {
      scene.fog = new THREE.Fog(scene.background, 5, 60);
    } else {
      (scene.fog as THREE.Fog).color.copy(scene.background);
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 7]} intensity={1.5} />

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