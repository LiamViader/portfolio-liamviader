"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import ReactCountryFlag from "react-country-flag";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";

const labelByLocale: Record<string, string> = {
  en: "EN",
  es: "ES",
};

const countryCodeByLocale: Record<string, string> = {
  en: "GB",
  es: "ES",
};

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();

  const [open, setOpen] = useState(false);
  const [pendingLocale, setPendingLocale] = useState<string | null>(null);

  const locales = routing.locales;

  const effectiveLocale = pendingLocale ?? locale;
  const currentLabel =
    labelByLocale[effectiveLocale] ?? effectiveLocale.toUpperCase();

  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setOpen(false);
    setPendingLocale(null);
  }, [pathname, locale]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleButtonKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 px-1.5 py-1 bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/10 rounded text-xs md:text-sm text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        <Globe className="w-4 h-4" />
        <span>{currentLabel}</span>

        <motion.span
          className="text-[0.6rem] md:text-xs opacity-70"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          ▾
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="language-dropdown"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute mt-2 w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded shadow-lg z-20 overflow-hidden"
            role="menu"
          >
            {locales.map((code) => {
              const countryCode = countryCodeByLocale[code] ?? "UN";
              const label = labelByLocale[code] ?? code.toUpperCase();
              const isActive = code === effectiveLocale;

              return (
                <Link
                  key={code}
                  href={pathname}
                  locale={code}
                  role="menuitem"
                  onClick={() => {
                    setPendingLocale(code);
                    setOpen(false);
                  }}
                  className={`flex items-center justify-between gap-1 px-2 py-2 text-xs hover:bg-white/10 transition-colors ${
                    isActive ? "bg-white/10" : ""
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <ReactCountryFlag
                      svg
                      countryCode={countryCode}
                      className="text-base"
                      style={{ width: "1em", height: "1em" }}
                    />
                    <span>{label}</span>
                  </span>

                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-[0.5rem] opacity-80"
                    >
                      ✓
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
