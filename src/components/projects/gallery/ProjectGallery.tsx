import { useTranslations } from "next-intl";

import { ClientCategorySlug } from "@/config/projectCategories";
import { TranslatedProject } from "@/data/projects";

import CategorySwitcher from "./CategorySwitcher";
import ProjectsGrid from "../grid/ProjectsGrid";


interface ProjectGalleryProps {
  category: ClientCategorySlug;
  filteredProjects: TranslatedProject[];
  onCategoryChange: (category: ClientCategorySlug) => void;
}

export default function ProjectGallery({ category, filteredProjects, onCategoryChange }: ProjectGalleryProps) {
  const t = useTranslations("ProjectsPage");

  return (
    <section className="relative px-4 py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("project_gallery_title")}</h2>
          <p className="mx-auto max-w-2xl text-balance text-base text-white/65">
            {t("project_gallery_description")}
          </p>
        </div>

        <CategorySwitcher currentCategory={category} onCategoryChange={onCategoryChange} />

        <div className="w-full">
          <ProjectsGrid projects={filteredProjects} />
        </div>
      </div>
    </section>
  );
}
