"use client";

import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const t = useTranslations("Navbar");

  return (
    <nav className="flex items-center gap-6">
      <Link href="/" className="hover:underline">{t("home")}</Link>
      <Link href="/about" className="hover:underline">{t("about")}</Link>
      <Link href="/projects" className="hover:underline">{t("projects")}</Link>
      <Link href="/contact" className="hover:underline">{t("contact")}</Link>
      <LanguageSwitcher />
    </nav>
  );
}