// src/app/[locale]/projects/ClientProjectsPage.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import ProjectsGrid from '@/components/ProjectsGrid';
import { TranslatedProject } from '@/data/projects';
import CategorySwitcher from '@/components/CategorySwitcher';
import { ProjectSceneCanvas } from '@/components/ProjectSceneCanvas';

import {ClientCategorySlug, CATEGORY_CONFIG } from '@/config/projectCategories';


interface ClientProjectsPageProps {
  projectsData: TranslatedProject[];
}

export default function ClientProjectsPage({ projectsData}: ClientProjectsPageProps) {
  const t = useTranslations("ProjectsPage"); 

  const [category, setCategory] = useState<ClientCategorySlug>("all");

  const filteredProjects = projectsData.filter(project => {
    const currentFilter = CATEGORY_CONFIG[category].filterKey;

    if (!currentFilter) return true;
    
    return project.categorys.includes(currentFilter);
  });


  return (
    <div className="relative min-h-[200vh] text-white"> 
      {/* 1. Fondo 3D: Posición absoluta, z-index bajo */}
      <ProjectSceneCanvas category={category} /> 
      
      <div className="relative z-10 pt-20 pb-16">
        
        {/* 2. Sección Hero/Introducción */}
        <header className="text-center mb-16 px-4 max-w-3xl mx-auto">
            <h1 className="text-6xl font-extrabold mb-4 tracking-tighter drop-shadow-lg">
                {t("title")} {/* Ej: "Proyectos y Creaciones" */}
            </h1>
            <p className="text-xl text-gray-300">
                {t("intro_paragraph")} 
            </p>
        </header>

        {/* 3. Selector de Categorías */}
        <CategorySwitcher 
            currentCategory={category}
            onCategoryChange={setCategory}
        />

        {/* 4. Grid de Proyectos */}
        <section className="mt-10 px-4 md:px-8 max-w-7xl mx-auto">
            <ProjectsGrid projects={filteredProjects} />
        </section>

      </div>
    </div>
  );
}