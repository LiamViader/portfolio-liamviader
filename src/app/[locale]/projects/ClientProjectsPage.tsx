"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import CallToAction from "@/components/CallToAction";
import { ProjectSceneCanvas } from "@/components/ProjectSceneCanvas";
import { CATEGORY_CONFIG, ClientCategorySlug } from "@/config/projectCategories";
import type { TranslatedProject } from "@/data/projects";
import { FeaturedProjects, ProjectGallery } from "@/components/projects";
import { ScrollReveal } from "@/components/ScrollReveal";

interface ClientProjectsPageProps {
  projectsData: TranslatedProject[];
}

export default function ClientProjectsPage({ projectsData }: ClientProjectsPageProps) {
  const t = useTranslations("ProjectsPage");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSlug = (searchParams.get("filter") as ClientCategorySlug) || "all";
  const category: ClientCategorySlug = CATEGORY_CONFIG[currentSlug] ? currentSlug : "all";

  const setCategory = (newCategory: ClientCategorySlug) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (newCategory === "all") {
      newParams.delete("filter");
    } else {
      newParams.set("filter", newCategory);
    }
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const filteredProjects = projectsData.filter((project) => {
    const currentFilter = CATEGORY_CONFIG[category].filterKey;

    if (!currentFilter) return true;

    return project.categorys.includes(currentFilter);
  });

  const titleColorClass = CATEGORY_CONFIG[category].cssColor;

  return (
    <div className="text-white relative min-h-[200vh]">
      <ProjectSceneCanvas category={category} />

      <div className="relative z-10 mt-[10vh] md:mt-[20vh]">
        <ScrollReveal delay={0.7}>
          <header className="text-center mb-[2vh] md:mb-[5vh] px-4 max-w-xl md:max-w-6xl mx-auto py-24">
            <h1
              className={`text-5xl md:text-7xl font-extrabold mb-10 tracking-tighter drop-shadow-lg transition-colors duration-500 ${titleColorClass}`}
            >
              {t("title")}
            </h1>
            <p className="text-1xl md:text-2xl text-gray-300 font-bold">{t("intro_paragraph")}</p>
          </header>
        </ScrollReveal>

        <ScrollReveal delay={0.9} className="w-full">
          <FeaturedProjects projects={projectsData} />
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="w-full">
          <ProjectGallery category={category} filteredProjects={filteredProjects} onCategoryChange={setCategory} />
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="w-full">
          <CallToAction />
        </ScrollReveal>
      </div>
    </div>
  );
}
