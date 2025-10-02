// src/components/FeaturedProjects.tsx
import { TranslatedProject } from '@/data/projects';
import { useTranslations } from 'next-intl';
// Importa un componente de tarjeta grande/destacada (ej: FeaturedCard)

interface FeaturedProjectsProps {
    projects: TranslatedProject[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
    const t = useTranslations("ProjectsPage");
    
    // Filtra y toma solo los destacados
    const featured = projects.filter(p => p.is_featured);

    if (featured.length === 0) return null;

    return (
        <section className="py-24 px-4 md:px-8 md:max-w-7xl mx-auto mb-16">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-20 tracking-tight text-center">{t('featured_title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featured.slice(0, 2).map(project => (
                    // Reemplaza esto con tu componente de tarjeta destacada
                    <div key={project.id} className="bg-white/10 p-6 rounded-xl">
                        <h3 className="text-2xl font-bold">{project.title}</h3>
                        <p className="mt-2 text-gray-300">{project.short_description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}