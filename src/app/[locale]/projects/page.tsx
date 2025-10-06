import { getTranslations } from "next-intl/server"; // <-- Server Hook
import { getProjectsByLocale, TranslatedProject } from '@/data/projects';
import ClientProjectsPage from './ClientProjectsPage'; // <-- Nuevo componente de Cliente

interface ProjectsPageProps {
	params: { locale: string } | Promise<{ locale: string }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
	const { locale } = await params; 
	const projectsData = getProjectsByLocale(locale);

	return (
		<ClientProjectsPage projectsData={projectsData}/>
	);
}