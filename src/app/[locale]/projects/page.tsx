import { getProjectsByLocale } from "@/data/projects/allProjects";
import ClientProjectsPage from "./ClientProjectsPage"; 
import type { Locale } from "@/i18n/routing"; 

type ProjectsParams = Promise<{ locale: Locale }>;

export default async function ProjectsPage({
  params,
}: {
  params: ProjectsParams;
}) {
  const { locale } = await params;
  const projectsData = getProjectsByLocale(locale);

  return <ClientProjectsPage projectsData={projectsData} />;
}