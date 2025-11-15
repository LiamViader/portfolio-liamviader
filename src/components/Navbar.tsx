"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react"; // icones

import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const t = useTranslations("Navbar");

  return (
    <nav>
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-6">
        <Link href="/" className="hover:underline">{t("home")}</Link>
        <Link href="/about" className="hover:underline">{t("about")}</Link>
        <Link href="/projects" className="hover:underline">{t("projects")}</Link>
        <Link href="/contact" className="hover:underline">{t("contact")}</Link>
        <LanguageSwitcher />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded bg-white/8 hover:bg-white/15 relative z-50"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
