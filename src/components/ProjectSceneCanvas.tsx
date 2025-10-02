"use client";

import { Canvas } from '@react-three/fiber';
import { useSceneTransition } from '@/hooks/useSceneTransition'; 
import { ClientCategorySlug } from '@/config/projectCategories'; 

interface ProjectSceneCanvasProps {
    category: ClientCategorySlug;
}

function SceneContent({ category }: ProjectSceneCanvasProps) {
    
    const globalMixFactor = useSceneTransition(category); 

    return (
        <>
            <ambientLight intensity={0.5} />
            {/* Placeholder */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="red" />
            </mesh>
        </>
    );
}


export function ProjectSceneCanvas({ category }: ProjectSceneCanvasProps) {
    return (
        <Canvas 
            className="absolute inset-0 z-0 bg-gray-900" 
            camera={{ position: [0, 0, 5], fov: 75 }}
        >
            <SceneContent category={category} />
        </Canvas>
    );
}