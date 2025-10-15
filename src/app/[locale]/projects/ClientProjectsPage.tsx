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
    <div className="relative flex min-h-screen flex-col bg-gray-900 text-white">
      <ProjectSceneCanvas category={category} />

      <div className="relative z-10 flex flex-col">
        
        <section className="relative overflow-hidden bg-transparent px-4 pt-44 pb-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(125,211,252,0.40),transparent_20%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950/50 to-transparent" />
          <ScrollReveal delay={0.7} className="w-full">
            <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
              <span
                className={`inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70 backdrop-blur transition ${titleColorClass}`}
              >
                {t("tagline")}
              </span>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white/95 sm:text-5xl md:text-6xl">
                {t("title")}
              </h1>
              <p className="max-w-2xl text-pretty text-lg text-white/70 sm:text-xl">
                {t("intro_paragraph")}
              </p>
            </div>
          </ScrollReveal>
        </section>

        <FeaturedProjects projects={projectsData} />
        
        <ProjectGallery category={category} filteredProjects={filteredProjects} onCategoryChange={setCategory} />

        <CallToAction />
      </div>
    </div>
  );
}
