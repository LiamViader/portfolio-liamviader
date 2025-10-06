// src/components/ProjectSceneCanvas.tsx
"use client";

import { Canvas } from '@react-three/fiber';
import ProjectSceneContent from './scene/ProjectSceneContent'; // 🚨 Nueva importación
import { ClientCategorySlug } from '@/config/projectCategories'; 

// Definición de las Props
interface ProjectSceneCanvasProps {
	category: ClientCategorySlug;
}

// 🚨 Ya no necesitamos SceneContent aquí
export function ProjectSceneCanvas({ category }: ProjectSceneCanvasProps) {
	return (
		<div className="fixed inset-0 z-0" >
			<Canvas 
				camera={{ position: [0, 0, 5], fov: 75 }}
			>
				{/* 🚨 Usamos el componente de contenido separado */}
				<ProjectSceneContent category={category} />
			</Canvas>
		</div>
	);
}