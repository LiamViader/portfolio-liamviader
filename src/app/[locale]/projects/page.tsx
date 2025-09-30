import { getTranslations } from "next-intl/server"; // <-- Server Hook
import { getProjectsByLocale, TranslatedProject } from '@/data/projects';
import ClientProjectsPage from './ClientProjectsPage'; // <-- Nuevo componente de Cliente

interface ProjectsPageProps {
  params: { locale: string } | Promise<{ locale: string }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  // Resuelve la promesa de params y extrae el locale
  const { locale } = await params; 

  // Carga los datos traducidos
  const projectsData = getProjectsByLocale(locale);

  // Carga el diccionario de traducciones completo
  const messages = (await getTranslations("ProjectsPage"));

  return (
    // Pasa los datos y mensajes como props al componente de cliente
    <ClientProjectsPage projectsData={projectsData}/>
  );
}