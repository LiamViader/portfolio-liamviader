"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { createPortal } from "react-dom";
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
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const locales = routing.locales;

  const effectiveLocale = pendingLocale ?? locale;
  const currentLabel =
    labelByLocale[effectiveLocale] ?? effectiveLocale.toUpperCase();

  const buttonRef = useRef<HTMLButtonElement>(null);
  // We'll use this ref to detect clicks outside both the button and the portal dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 8, // slight offset
        left: rect.left + window.scrollX,
        width: Math.round(rect.width), // Round to integer to avoid subpixel rendering gaps
      });
    }
  };

  useEffect(() => {
    setOpen(false);
    setPendingLocale(null);
  }, [pathname, locale]);

  useEffect(() => {
    // Update position when opening
    if (open) {
      updatePosition();
    }

    // Close on resize or scroll to prevent misalignment
    const handleResizeOrScroll = () => {
      if (open) setOpen(false);
    };

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, { capture: true });

    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll, { capture: true });
    };
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      // Check if click is on the button
      if (buttonRef.current && buttonRef.current.contains(e.target as Node)) {
        return;
      }

      // Check if click is on the dropdown (rendered in portal)
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
        return;
      }

      setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const toggleOpen = () => {
    if (!open) {
      updatePosition();
    }
    setOpen((prev) => !prev);
  };

  const handleButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleOpen();
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <>
      <motion.button
        ref={buttonRef}
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={toggleOpen}
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

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              zIndex: 9999,
            }}
          >
            <AnimatePresence>
              <motion.div
                key="language-dropdown"
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded shadow-lg overflow-hidden"
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
                      className={`flex items-center w-full text-white justify-between gap-1 px-2 py-2 text-xs transition-colors ${isActive ? "bg-white/10" : " hover:bg-white/20"
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
                    </Link>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>,
          document.body
        )}
    </>
  );
}
