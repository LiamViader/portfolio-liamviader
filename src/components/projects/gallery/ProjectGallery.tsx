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
    <div className="mt-10 py-24">
      <h2 className="text-3xl md:text-5xl font-extrabold mb-20 tracking-tight text-center">
        {t("project_gallery_title")}
      </h2>
      <CategorySwitcher currentCategory={category} onCategoryChange={onCategoryChange} />

      <section className="mb-10 px-4 md:px-8 max-w-[90%] mx-auto mt-10">
        <ProjectsGrid projects={filteredProjects} />
      </section>
    </div>
  );
}
