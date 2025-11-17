import { getProjectsByLocale } from "@/data/projects/allProjects";
import ClientProjectsPage from "./ClientProjectsPage"; // <-- Nuevo componente de Cliente

interface ProjectsPageProps {
  params: { locale: string } | Promise<{ locale: string }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  const projectsData = getProjectsByLocale(locale);

  return <ClientProjectsPage projectsData={projectsData} />;
}