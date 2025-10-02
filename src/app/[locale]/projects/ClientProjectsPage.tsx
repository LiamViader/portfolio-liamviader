// src/app/[locale]/projects/ClientProjectsPage.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import FeaturedProjects from "@/components/FeaturedProjects";
import ProjectsGrid from '@/components/ProjectsGrid';
import { TranslatedProject } from '@/data/projects';
import CategorySwitcher from '@/components/CategorySwitcher';
import { ProjectSceneCanvas } from '@/components/ProjectSceneCanvas';
import CallToAction from '@/components/CallToAction';

import {ClientCategorySlug, CATEGORY_CONFIG } from '@/config/projectCategories';


interface ClientProjectsPageProps {
  projectsData: TranslatedProject[];
}

export default function ClientProjectsPage({ projectsData}: ClientProjectsPageProps) {
  const t = useTranslations("ProjectsPage"); 

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()

  const currentSlug = searchParams.get('filter') as ClientCategorySlug || 'all';
  const category: ClientCategorySlug = CATEGORY_CONFIG[currentSlug] ? currentSlug : 'all';

  const setCategory = (newCategory: ClientCategorySlug) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (newCategory === 'all') {
      newParams.delete('filter');
    } else {
      newParams.set('filter', newCategory);
    }
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const filteredProjects = projectsData.filter(project => {
    const currentFilter = CATEGORY_CONFIG[category].filterKey;

    if (!currentFilter) return true;
    
    return project.categorys.includes(currentFilter);
  });

  const titleColorClass = CATEGORY_CONFIG[category].cssColor;


  return (
    <div className="relative min-h-[200vh] text-white"> 
      {/* 1. Fondo 3D: Posición absoluta, z-index bajo */}
      <ProjectSceneCanvas category={category} /> 
      
      <div className="relative z-10 pt-20 pb-16">
        
        {/* 2. Sección Hero/Introducción */}
        <header className="text-center mb-16 px-4 max-w-3xl mx-auto">
            <h1 className={`text-6xl font-extrabold mb-4 tracking-tighter drop-shadow-lg transition-colors duration-500 ${titleColorClass}`}>
                {t("title")} {/* Ej: "Proyectos y Creaciones" */}
            </h1>
            <p className="text-xl text-gray-300">
                {t("intro_paragraph")} 
            </p>
        </header>

        {/* 3. Sección de Proyectos Destacados */}
        <FeaturedProjects projects={projectsData} />

        {/*4. Selector de Categorías */}
        <CategorySwitcher 
            currentCategory={category}
            onCategoryChange={setCategory}
        />

        {/* 5. Grid de Proyectos */}
        <section className="mt-10 px-4 md:px-8 max-w-7xl mx-auto">
            <ProjectsGrid projects={filteredProjects} />
        </section>

        {/* 6. Call to action */}
        <CallToAction />

      </div>
    </div>
  );
}