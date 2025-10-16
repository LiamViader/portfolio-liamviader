"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Navbar from "./Navbar";
import LanguageSwitcher from "./LanguageSwitcher";
import { useModal } from "@/providers/ModalContext";


const INITIAL_HEADER_HEIGHT = 73; 

export default function Header() {

  const t = useTranslations("Navbar");

  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(INITIAL_HEADER_HEIGHT);

  const [transitionDurationMs, setTransitionDurationMs] = useState(100);
  const [yOffset, setYOffset] = useState(0);



  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isModalOpen } = useModal();

  const calculateAndSetHeight = () => {
    if (typeof window !== 'undefined') {
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
    window.addEventListener('resize', calculateAndSetHeight);
    return () => window.removeEventListener('resize', calculateAndSetHeight);
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

    const onAppScroll = (e: Event) => {

      const detail = (e as CustomEvent).detail as { source?: "full" | "local"; scrollTop: number; clientHeight?: number; scrollHeight?: number };
      if (detail?.source !== "full") return;
      const currentScrollY = detail?.scrollTop ?? 0;
      const deltaY = currentScrollY - lastScrollY;


      if (headerHeight !==0){
        if (deltaY == 0) return;
        if (deltaY > 0) { // Scrolling down
          if (currentScrollY > headerHeight) {
            setYOffset(-maxOffset);
            setTransitionDurationMs(200);
          }
          else{
            const wasAligned = Math.abs(yOffset + lastScrollY) < 5;
            setYOffset(-currentScrollY);
            if (wasAligned){
              setTransitionDurationMs(0);
            }
            else{
              setTransitionDurationMs(50);
            }
          }
        }
        else { // Scrolling up
          if (currentScrollY > headerHeight) {
            setYOffset(0);
            setTransitionDurationMs(200);
          }
          else{
            if (yOffset <= 10){
              setYOffset(0);
              setTransitionDurationMs(200);
            }
            else{
              setYOffset(0);
              setTransitionDurationMs(0);
            }
          }
        }
      }
      console.log("Scroll Y:", currentScrollY, "Header Height:", headerHeight);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("app-scroll", onAppScroll);
    return () => window.removeEventListener("app-scroll", onAppScroll);
  }, [lastScrollY, isMenuOpen, headerHeight, isModalOpen]);




  return (
    <div style={{ height: `${headerHeight}px` }} className={"text-gray-50 absolute"}>
      <header
          ref={headerRef}
          className={`fixed top-0 left-0 w-full px-4 md:px-8 py-3 md:py-5 flex justify-between items-center shadow-sm bg-gray/5 backdrop-blur-sm z-50 transition-transform `}
          style={{ 
            transform: `translateY(${yOffset}px)`,
            transitionDuration: `${transitionDurationMs}ms` 
          }}
      >
          <h1 className="font-bold text-lg md:text-xl">Liam Viader</h1>
          <Navbar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      </header>
      
      {/* Mobile Menu and Overlay */}
      <AnimatePresence>
          {isMenuOpen && (
            <nav>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed top-0 left-0 right-0 min-h-screen mt-16 bg-black/50 z-40 "
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Menu */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ top: headerHeight }}
                className="fixed left-0 w-full shadow-sm bg-gray/5 backdrop-blur-xl flex flex-col items-center gap-4 py-6 origin-top z-50"
              >
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="hover:underline">{t("home")}</Link>
                <Link href="/about" onClick={() => setIsMenuOpen(false)} className="hover:underline">{t("about")}</Link>
                <Link href="/projects" onClick={() => setIsMenuOpen(false)} className="hover:underline">{t("projects")}</Link>
                <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="hover:underline">{t("contact")}</Link>
                <LanguageSwitcher />
              </motion.div>
            </nav>
          )}
        </AnimatePresence>

    </div>
  );
}
