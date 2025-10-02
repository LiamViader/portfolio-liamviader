import { useTranslations } from 'next-intl';

import { TranslatedProject } from '@/data/projects';
import { ClientCategorySlug } from '@/config/projectCategories';

import CategorySwitcher from '@/components/CategorySwitcher';
import ProjectsGrid from '@/components/ProjectsGrid';

interface ProjectGalleryProps {
    category: ClientCategorySlug;
    filteredProjects: TranslatedProject[];
    onCategoryChange: (category: ClientCategorySlug) => void;
}

export default function ProjectGallery({ category, filteredProjects, onCategoryChange }: ProjectGalleryProps) {
    const t = useTranslations("ProjectsPage");

    return (
        <div className="mt-10 py-24 border-t border-white/20">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-20 tracking-tight text-center">
                {t('project_gallery_title')}
            </h2>
            <CategorySwitcher
                currentCategory={category}
                onCategoryChange={onCategoryChange}
            />

            <section className="mb-10 px-4 md:px-8 max-w-7xl mx-auto">
                <ProjectsGrid projects={filteredProjects} />
            </section>
        </div>
    );
}