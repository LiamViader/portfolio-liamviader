import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactClient from "./ContactClient";

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
    title: t("contact.title"),
    description: t("contact.description"),
  };
}

export default function ContactPage() {
  return <ContactClient />;
}
