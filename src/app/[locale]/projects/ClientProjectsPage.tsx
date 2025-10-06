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
import ProjectGallery from '@/components/ProjectGallery';
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
		<div className="text-white relative min-h-[200vh]">
			{/* 1. Fondo 3D: Posición absoluta, z-index bajo */}
			<ProjectSceneCanvas category={category} /> 
			
			<div className="relative z-10 py-20">
				
				{/* 2. Sección Hero/Introducción */}
				<header className="text-center mb-16 px-4 max-w-xl md:max-w-4xl mx-auto py-24">
						<h1 className={`text-5xl md:text-7xl font-extrabold mb-10 tracking-tighter drop-shadow-lg transition-colors duration-500 ${titleColorClass}`}>
								{t("title")} {/* Ej: "Proyectos y Creaciones" */}
						</h1>
						<p className="text-1xl md:text-2xl text-gray-300">
								{t("intro_paragraph")} 
						</p>
				</header>
			
				{/* 3. Sección de Proyectos Destacados */}
				<FeaturedProjects projects={projectsData} />

				{/*4. Project Browser */}
				<ProjectGallery
						category={category}
						filteredProjects={filteredProjects}
						onCategoryChange={setCategory}
				/>

				{/* 5. Call to action */}
				<CallToAction />

			</div>
		</div>
	);
}