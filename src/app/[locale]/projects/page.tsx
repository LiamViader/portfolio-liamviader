import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getProjectsByLocale } from "@/data/projects/allProjects";
import ClientProjectsPage from "./ClientProjectsPage";
import type { Locale } from "@/i18n/routing";

type ProjectsParams = Promise<{ locale: Locale }>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "Metadata",
  });

  return {
    title: t("projects.title"),
    description: t("projects.description"),
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const projectsData = getProjectsByLocale(locale);

  return <ClientProjectsPage projectsData={projectsData} />;
}