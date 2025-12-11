"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Navbar from "./Navbar";
import LanguageSwitcher from "./LanguageSwitcher";
import { useModal } from "@/providers/ModalContext";

const INITIAL_HEADER_HEIGHT = 73;
const SCROLL_THRESHOLD = 40; 

export default function Header() {
  const t = useTranslations("Navbar");
  const pathname = usePathname();

  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(INITIAL_HEADER_HEIGHT);

  const [transitionDurationMs, setTransitionDurationMs] = useState(100);
  const [yOffset, setYOffset] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const accumulatedScrollRef = useRef(0);
  const isStickyRef = useRef(false);

  const { isModalOpen } = useModal();

  const calculateAndSetHeight = () => {
    if (typeof window !== "undefined") {
      const isDesktop = window.innerWidth >= 768;
      const newHeight = isDesktop ? 73 : 65;
      const actualMeasuredHeight = headerRef.current?.offsetHeight ?? newHeight;
      setHeaderHeight(actualMeasuredHeight);
    }
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--header-h", `${headerHeight}px`);
  }, [headerHeight]);

  useLayoutEffect(() => {
    calculateAndSetHeight();
    window.addEventListener("resize", calculateAndSetHeight);
    return () => window.removeEventListener("resize", calculateAndSetHeight);
  }, []);

  useEffect(() => {
    const maxOffset = headerHeight;

    if (isModalOpen) {
      setYOffset(-maxOffset);
      return;
    }

    if (isMenuOpen) {
      setYOffset(0);
      return;
    }

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      
      const deltaY = currentScrollY - lastScrollY;
      
      if (headerHeight !== 0) {

        if (currentScrollY <= 0) { 
           setYOffset(0);
           setTransitionDurationMs(0);
           isStickyRef.current = false;
           accumulatedScrollRef.current = 0;
           setLastScrollY(currentScrollY);
           return;
        }
        
        if (currentScrollY <= headerHeight) {
          if (isStickyRef.current) {
            setYOffset(0);
            setTransitionDurationMs(0); 
          } else {
            setYOffset(-currentScrollY);
            setTransitionDurationMs(0); 
          }
          accumulatedScrollRef.current = 0; 
        } 
        else {
          if (deltaY === 0) return;

          if ((deltaY > 0 && accumulatedScrollRef.current < 0) || (deltaY < 0 && accumulatedScrollRef.current > 0)) {
            accumulatedScrollRef.current = 0;
          }

          accumulatedScrollRef.current += deltaY;

          if (Math.abs(accumulatedScrollRef.current) > SCROLL_THRESHOLD) {
            if (accumulatedScrollRef.current > 0) {
              if (yOffset !== -maxOffset) {
                setYOffset(-maxOffset);
                setTransitionDurationMs(300);
                isStickyRef.current = false;
                accumulatedScrollRef.current = 0; 
              }
            } else {
              if (yOffset !== 0) {
                setYOffset(0);
                setTransitionDurationMs(300);
                isStickyRef.current = true; 
                accumulatedScrollRef.current = 0; 
              }
            }
          }
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY, isMenuOpen, headerHeight, isModalOpen, yOffset]);

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
    <div style={{ height: `${headerHeight}px` }} className="text-gray-50 absolute">
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full px-4 md:px-8 py-3 md:py-5 border-b border-black/20 flex justify-between items-center shadow-sm bg-gray/5 backdrop-blur-sm z-50 transition-transform`}
        style={{
          transform: `translateY(${yOffset}px)`,
          transitionDuration: `${transitionDurationMs}ms`,
          transitionTimingFunction: transitionDurationMs > 0 ? "cubic-bezier(0.4, 0, 0.2, 1)" : "linear"
        }}
      >
        <h1 className="font-bold text-lg md:text-xl">Liam Viader</h1>
        <Navbar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed top-0 left-0 right-0 min-h-screen mt-0 bg-black/50 z-40"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ top: headerHeight }}
              className="fixed left-0 w-full shadow-sm bg-gray/5 backdrop-blur-sm border-b border-black/20 flex flex-col items-center gap-4 py-6 origin-top z-50"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base transition-colors ${
                    isActive(item.href, item.exact)
                      ? "text-white border-b border-sky-200/70"
                      : "text-white hover:text-sky-300"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <LanguageSwitcher />
            </motion.div>
          </nav>
        )}
      </AnimatePresence>
    </div>
  );
}