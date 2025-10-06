"use client";

import { useFrame, useThree, extend } from '@react-three/fiber';
import { animated } from '@react-spring/three';
import * as THREE from 'three';

import { useSceneTransition } from '@/hooks/useSceneTransition';
import { ClientCategorySlug, CATEGORY_INDICES, CATEGORY_COLORS } from '@/config/projectCategories';

// Definición del componente animado de R3F
// Usamos 'meshStandardMaterial' ya que es más flexible que 'meshBasicMaterial' 
// para la iluminación de los efectos futuros.
const AnimatedMaterial = animated('meshStandardMaterial'); 


interface ProjectSceneContentProps {
		category: ClientCategorySlug;
}

export default function ProjectSceneContent({ category }: ProjectSceneContentProps) {
		
	const { progress, previousIndex, currentIndex } = useSceneTransition(category);
	const { scene } = useThree();

	const getOpacity = (targetIndex: number) =>
	progress.to((p) => {
		// 🧠 Si estamos en el primer render (sin transición)
		if (previousIndex === currentIndex) {
		return targetIndex === currentIndex ? 1 : 0;
		}

		if (targetIndex === previousIndex) return 1 - p;
		if (targetIndex === currentIndex) return p;
		return 0;
	});

	useFrame(() => {
		const t = progress.get();

		const fromColor = CATEGORY_COLORS[previousIndex];
		const toColor = CATEGORY_COLORS[currentIndex];

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
			
			{/* 💡 EFECTO 'ALL' (Índice 0) - Gris Oscuro / Polvo Estelar */}
			<group> 
				<mesh position={[-2, 0, -2]}> 
					<boxGeometry args={[1, 1, 1]} />
					<AnimatedMaterial 
							color="white" 
							transparent={true} 
							opacity={getOpacity(CATEGORY_INDICES.all)} 
					/>
				</mesh>
			</group>

			{/* 💡 EFECTO 'IA' (Índice 1) - Azul Cian / Líneas Neuronales */}
			<group>
				<mesh position={[0, 0, 0]}>
					<sphereGeometry args={[1, 32, 32]} />
					<AnimatedMaterial 
							color="cyan" 
							transparent={true} 
							opacity={getOpacity(CATEGORY_INDICES.ai)} 
					/>
				</mesh>
			</group>

			{/* 💡 EFECTO 'GAMES' (Índice 2) - Púrpura / Asteroides Low-Poly */}
			<group>
				<mesh position={[2, 0, -2]}>
					<coneGeometry args={[1, 2, 32]} />
					<AnimatedMaterial 
							color="fuchsia" 
							transparent={true} 
							opacity={getOpacity(CATEGORY_INDICES.games)} 
					/>
				</mesh>
			</group>
		</>
	);
}