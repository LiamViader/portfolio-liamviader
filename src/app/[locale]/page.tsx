import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HomeClient from "./HomeClient";

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
    title: t("home.title"),
    description: t("home.description"),
  };
}

export default function Home() {
  return <HomeClient />;
}
