// src/app/[locale]/projects/ClientProjectsPage.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl"; // <-- Client Hook

import ProjectsGrid from '@/components/ProjectsGrid';
import { TranslatedProject } from '@/data/projects';


type Category = "ai" | "games";

interface ClientProjectsPageProps {
  projectsData: TranslatedProject[];
}

export default function ClientProjectsPage({ projectsData}: ClientProjectsPageProps) {
  
  const t = useTranslations("ProjectsPage"); 
  
  const [category, setCategory] = useState<Category>("ai");

  // Filtrado de proyectos
  const filteredProjects = projectsData.filter(project => {
      // (Debes adaptar esta lógica de filtrado según cómo tags o category estén definidos en tu JSON)
      if (category === "ai") return project.categorys.includes("AI");
      if (category === "games") return project.categorys.includes("Game");
      return true; // Mostrar todos si no hay filtro
  });
  


  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-8 text-black">{t("projects")}</h1>

      <div
        className={`${
          category === "ai" ? "bg-blue-900" : "bg-green-900"
        } transition-colors duration-500 min-h-screen`}
      >
        <section className="p-8">
          <div className="flex gap-4 mb-6 justify-center">
            <button
              className={`px-4 py-2 rounded ${
                category === "ai" ? "bg-blue-600" : "bg-gray-700"
              }`}
              onClick={() => setCategory("ai")}
            >
              {t("ai")}
            </button>
            <button
              className={`px-4 py-2 rounded ${
                category === "games" ? "bg-green-600" : "bg-gray-700"
              }`}
              onClick={() => setCategory("games")}
            >
              {t("games")}
            </button>
          </div>

          <ProjectsGrid projects={filteredProjects} />
          
        </section>
      </div>
    </div>
  );
}