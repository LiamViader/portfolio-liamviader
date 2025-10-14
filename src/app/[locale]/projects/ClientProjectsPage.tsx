"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import CallToAction from "@/components/CallToAction";
import RevealOnScroll from "@/components/RevealOnScroll";
import { ProjectSceneCanvas } from "@/components/ProjectSceneCanvas";
import { FeaturedProjects, ProjectGallery } from "@/components/projects";
import { CATEGORY_CONFIG, ClientCategorySlug } from "@/config/projectCategories";
import type { TranslatedProject } from "@/data/projects";

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
    <div className="relative min-h-[200vh] overflow-hidden text-white">
      <ProjectSceneCanvas category={category} />

      <div className="relative z-10 flex flex-col gap-24 pt-32 pb-24">
        <RevealOnScroll
          as="header"
          className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 text-center"
        >
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-lg transition-colors duration-500 ${titleColorClass}`}
          >
            {t("title")}
          </h1>
          <p className="text-lg md:text-2xl text-gray-300/90 md:max-w-3xl">
            {t("intro_paragraph")}
          </p>
        </RevealOnScroll>

        <RevealOnScroll className="mx-auto w-full max-w-6xl">
          <FeaturedProjects projects={projectsData} />
        </RevealOnScroll>

        <RevealOnScroll className="mx-auto w-full max-w-6xl px-6">
          <ProjectGallery category={category} filteredProjects={filteredProjects} onCategoryChange={setCategory} />
        </RevealOnScroll>

        <RevealOnScroll className="mx-auto w-full max-w-4xl px-6" delay={0.1}>
          <CallToAction />
        </RevealOnScroll>
      </div>
    </div>
  );
}
