// src/components/ProjectsGrid.tsx
"use client";
import { useState } from 'react';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal'
import { TranslatedProject } from '@/data/projects';

interface ProjectsGridProps {
  projects: TranslatedProject[];
}

// Clase de desfase simple para las tarjetas pares
const offsetClasses = [
    "mt-0", 
    "mt-12 md:mt-24", // Desplaza la columna 2 hacia abajo
    "mt-0",
    "mt-12 md:mt-24"  // Repite el desfase
];

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [selectedProject, setSelectedProject] = useState<TranslatedProject | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        {projects.map((project, index) => (
          <div 
            key={project.id} 
            // 🎯 Aplica el desfase a las columnas pares del grid de 2 o 3 columnas
            className={`
                ${index % 2 === 1 ? 'md:mt-16' : 'mt-0'}
                ${index % 3 === 1 ? 'lg:mt-12' : ''}
                ${index % 3 === 2 ? 'lg:mt-24' : ''}
            `}
          >
            <ProjectCard 
              project={project} 
              onClick={() => setSelectedProject(project)} 
            />
          </div>
        ))}
      </div>
      
      {/* Modal se renderiza condicionalmente si hay un proyecto seleccionado */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </>
  );
}