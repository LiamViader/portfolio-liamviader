"use client";

import { Canvas } from '@react-three/fiber';
import ProjectSceneContent from './scene/ProjectSceneContent';
import { ClientCategorySlug } from '@/config/projectCategories'; 

interface ProjectSceneCanvasProps {
	category: ClientCategorySlug;
}

export function ProjectSceneCanvas({ category }: ProjectSceneCanvasProps) {
        const devicePixelRatio = typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio, 1.5);

        return (
                <div className="fixed inset-0 z-0" >
                        <Canvas
                                camera={{ position: [0, 0, 0], fov: 75 }}
                                dpr={devicePixelRatio}
                        >
                                <ProjectSceneContent category={category} />
                        </Canvas>
		</div>
	);
}