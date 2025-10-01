"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
          className="p-2 rounded bg-gray-400 hover:bg-gray-300 relative z-50"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed top-0 left-0 right-0 min-h-screen mt-16 bg-black/50 z-40"
                onClick={() => setIsOpen(false)}
              />

              {/* Menu */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute top-full left-0 w-full bg-gray-100 border-t border-gray-800 flex flex-col items-center gap-4 py-6 origin-top z-50"
              >
                <Link href="/" onClick={() => setIsOpen(false)} className="hover:underline">{t("home")}</Link>
                <Link href="/about" onClick={() => setIsOpen(false)} className="hover:underline">{t("about")}</Link>
                <Link href="/projects" onClick={() => setIsOpen(false)} className="hover:underline">{t("projects")}</Link>
                <Link href="/contact" onClick={() => setIsOpen(false)} className="hover:underline">{t("contact")}</Link>
                <LanguageSwitcher />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
