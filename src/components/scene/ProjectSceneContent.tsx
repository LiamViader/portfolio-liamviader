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


interface ProjectSceneContentProps {
	category: ClientCategorySlug;
}

export default function ProjectSceneContent({ category }: ProjectSceneContentProps) {
	const { progress, previousCategory, currentCategory } = useSceneTransition(category);
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

	const getOpacity = (targetCategorySlug: ClientCategorySlug) =>
	progress.to((p) => {


		if (previousCategory === currentCategory) {
			return targetCategorySlug === currentCategory ? 1 : 0;
		}


		if (targetCategorySlug === previousCategory) return 1 - p; // Fade OUT (desde 1 hasta 0)
		if (targetCategorySlug === currentCategory) return p;      // Fade IN (desde 0 hasta 1)
		return 0; // Cualquier otra escena no está involucrada
	});


	const isSceneActive = (targetCategorySlug: ClientCategorySlug) => {
		return targetCategorySlug === previousCategory || targetCategorySlug === currentCategory;
	};

	useFrame(() => {
		const t = progress.get();

		const fromIndex = CATEGORY_INDICES[previousCategory];
		const toIndex = CATEGORY_INDICES[currentCategory];

		const fromColor = CATEGORY_COLORS[fromIndex];
		const toColor = CATEGORY_COLORS[toIndex];

		const scrollFactor = scrollY.current;

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
 
			{/* 💡 EFECTO 'ALL' (Usamos el slug 'all') */}
			{isSceneActive('all') && (
				<SceneAll 
					opacity={getOpacity('all')} 
					transitionProgress={progress}
					isVisible={currentCategory === 'all'}
				/>
			)}

			{/* 💡 EFECTO 'IA' (Usamos el slug 'ai') */}
			{isSceneActive('ai') && (
				<SceneAI 
					opacity={getOpacity('ai')} 
					transitionProgress={progress}
					isVisible={currentCategory === 'ai'}
				/>
			)}

			{/* 💡 EFECTO 'GAMES' (Usamos el slug 'games') */}
			{isSceneActive('games') && (
				<SceneGames 
					opacity={getOpacity('games')} 
					transitionProgress={progress}
					isVisible={currentCategory === 'games'}
				/>
			)}
		</>
	);
}