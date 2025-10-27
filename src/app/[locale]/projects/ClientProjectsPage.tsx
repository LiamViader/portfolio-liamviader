"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import CallToAction from "@/components/CallToAction";
import { ProjectSceneCanvas } from "@/components/projects/ProjectSceneCanvas";
import { CATEGORY_CONFIG, ClientCategorySlug } from "@/config/projectCategories";
import type { TranslatedProject } from "@/data/projects";
import FeaturedProjectsSection from "@/components/projects/featured/FeaturedProjectsSection";
import ProjectGallery from "@/components/projects/gallery/ProjectGallery";

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
    <div className="relative flex min-h-screen flex-col bg-gray-900 text-white">
      <ProjectSceneCanvas category={category} />

      <div className="relative z-10 flex flex-col">
        
        <section className="relative overflow-hidden bg-transparent px-4 pt-44 pb-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(125,211,252,0.20),transparent_30%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/20 to-transparent" />
          <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-white/95 sm:text-5xl md:text-6xl">
              {t("title")}
            </h1>
            <p className="max-w-2xl text-pretty text-lg text-white/70 sm:text-xl">
              {t("intro_paragraph")}
            </p>
          </div>
        </section>

        <FeaturedProjectsSection projects={projectsData} />
        
        <ProjectGallery category={category} filteredProjects={filteredProjects} onCategoryChange={setCategory} />

        <CallToAction />
      </div>
    </div>
  );
}
