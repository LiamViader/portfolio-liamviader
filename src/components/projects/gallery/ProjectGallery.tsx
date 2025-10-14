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
    <section className="w-full rounded-3xl border border-white/5 bg-white/5 px-6 py-16 shadow-xl backdrop-blur md:px-10 md:py-20">
      <h2 className="text-center text-3xl font-extrabold tracking-tight md:text-5xl">
        {t("project_gallery_title")}
      </h2>
      <div className="mt-12 space-y-10 md:mt-16">
        <CategorySwitcher currentCategory={category} onCategoryChange={onCategoryChange} />

        <div className="mx-auto max-w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 px-4 py-6 shadow-lg md:px-8 md:py-10">
          <ProjectsGrid projects={filteredProjects} />
        </div>
      </div>
    </section>
  );
}
