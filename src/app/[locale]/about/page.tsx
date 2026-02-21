import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutClient from "./AboutClient";

export async function generateMetadata({
  params,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const t = await getTranslations({
    locale,
    namespace: "Metadata",
  });

  return {
    title: t("about.title"),
    description: t("about.description"),
  };
}

export default function AboutPage() {
  return <AboutClient />;
}
