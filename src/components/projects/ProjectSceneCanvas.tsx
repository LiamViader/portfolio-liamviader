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
    <div className="fixed top-0 left-0 w-full h-[100lvh] z-0" style={{ paddingRight: "var(--scrollbar-gap)" }}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 75 }}
        dpr={devicePixelRatio}
      >
        <ProjectSceneContent category={category} />
      </Canvas>
    </div>
  );
}