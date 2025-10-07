"use client";

import { useRef, useEffect } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { animated, Interpolation } from '@react-spring/three';
import * as THREE from 'three';

import { useSceneTransition } from '@/hooks/useSceneTransition';
import { ClientCategorySlug, CATEGORY_INDICES, CATEGORY_COLORS } from '@/config/projectCategories';
import SceneAll from './SceneAll';
import SceneAI from './SceneAI';
import SceneGames from './SceneGames';

const AnimatedMaterial = animated('meshStandardMaterial'); 


interface ProjectSceneContentProps {
		category: ClientCategorySlug;
}

export default function ProjectSceneContent({ category }: ProjectSceneContentProps) {
		
	const { progress, previousIndex, currentIndex } = useSceneTransition(category);
	const { scene, camera } = useThree();
	const scrollY = useRef(0);

	useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      scrollY.current = scrollTop / maxScroll;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

	const getOpacity = (targetIndex: number) =>
	progress.to((p) => {

		if (previousIndex === currentIndex) {
			return targetIndex === currentIndex ? 1 : 0;
		}

		if (targetIndex === previousIndex) return 1 - p;
		if (targetIndex === currentIndex) return p;
		return 0;
	});

	const isSceneActive = (targetIndex: number) => {
		return targetIndex === previousIndex || targetIndex === currentIndex;
	};

	useFrame(() => {
		const t = progress.get();

		const fromColor = CATEGORY_COLORS[previousIndex];
		const toColor = CATEGORY_COLORS[currentIndex];

		const scrollFactor = scrollY.current;
    // Efecto de profundidad: mover en eje Z y Y
    const targetZ = 5; // de 5 → 10
    const targetY = scrollFactor * -5; // de 0 → -5
    camera.position.lerp(new THREE.Vector3(0, targetY, targetZ), 0.9);

		if (!scene.background || !(scene.background instanceof THREE.Color)) {
			scene.background = new THREE.Color();
		}

		
		(scene.background as THREE.Color).copy(fromColor).lerp(toColor, t);

		
		if (!scene.fog) {
			scene.fog = new THREE.Fog(scene.background, 1, 100);
		} else {
			(scene.fog as THREE.Fog).color.copy(scene.background);
		}
	});
	
	return (
		<>
			{/* Luces generales */}
			<ambientLight intensity={0.5} />
			{/* Añadimos una luz direccional para darle dimensión a los objetos */}
			<directionalLight position={[5, 10, 7]} intensity={1} />
			
			{/* 💡 EFECTO 'ALL' (Índice 0) */}
			{isSceneActive(CATEGORY_INDICES.all) && (
				<SceneAll 
					opacity={getOpacity(CATEGORY_INDICES.all)} 
					transitionProgress={progress}
					isVisible={currentIndex === CATEGORY_INDICES.all}
				/>
			)}

			{/* 💡 EFECTO 'IA' (Índice 1) */}
			{isSceneActive(CATEGORY_INDICES.ai) && (
				<SceneAI 
					opacity={getOpacity(CATEGORY_INDICES.ai)} 
					transitionProgress={progress}
					isVisible={currentIndex === CATEGORY_INDICES.ai}
				/>
			)}

			{/* 💡 EFECTO 'GAMES' (Índice 2) */}
			{isSceneActive(CATEGORY_INDICES.games) && (
				<SceneGames 
					opacity={getOpacity(CATEGORY_INDICES.games)} 
					transitionProgress={progress}
					isVisible={currentIndex === CATEGORY_INDICES.games}
				/>
			)}
		</>
	);
}