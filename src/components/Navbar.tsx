"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";

import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const t = useTranslations("Navbar");
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: t("home"), exact: true },
    { href: "/about", label: t("about") },
    { href: "/projects", label: t("projects") },
    { href: "/contact", label: t("contact") },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav>
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-base transition-colors ${
                isActive(item.href, item.exact)
                  ? "text-white border-b border-sky-300/70"
                  : "text-white hover:text-sky-300 hover:border-b border-sky-300/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="">
          <LanguageSwitcher />
        </div>
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
