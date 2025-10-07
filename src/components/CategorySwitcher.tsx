"use client";

import { useTranslations } from "next-intl";
import { ClientCategorySlug, CATEGORY_CONFIG } from '@/config/projectCategories';
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface CategorySwitcherProps {
  currentCategory: ClientCategorySlug;
  onCategoryChange: (category: ClientCategorySlug) => void;
}

export default function CategorySwitcher({ currentCategory, onCategoryChange }: CategorySwitcherProps) {
  const t = useTranslations("ProjectsPage");
  const categories = Object.values(CATEGORY_CONFIG);

  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightStyle, setHighlightStyle] = useState({ width: 0, left: 0, bgColor: "#ffffff" });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeBtn = container.querySelector<HTMLButtonElement>("button[data-active='true']");
    if (activeBtn) {
      const rect = activeBtn.getBoundingClientRect();
      const parentRect = container.getBoundingClientRect();
      setHighlightStyle({
        width: rect.width,
        left: rect.left - parentRect.left,
        bgColor: CATEGORY_CONFIG[currentCategory].colorButton.getStyle(),
      });
    }
  }, [currentCategory]);

  return (
    <div 
      ref={containerRef}
      className="relative flex justify-center mb-10 p-1 bg-white/10 backdrop-blur-sm rounded-full shadow-lg max-w-[360px] min-h-[64px] mx-auto"
    >
      {/* Fondo que se mueve y cambia de color */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute top-1 bottom-1 rounded-full shadow-md z-0"
        style={{ 
          width: highlightStyle.width, 
          left: highlightStyle.left,
          backgroundColor: highlightStyle.bgColor
        }}
      />

      {categories.map((cat) => {
        const isActive = currentCategory === cat.slug;

        return (
          <motion.button
            key={cat.slug}
            data-active={isActive ? "true" : "false"}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 20px rgba(0,0,0,0.55)",
            }}
            whileTap={{
              scale: 0.95,
							backgroundColor: "rgba(0,0,0,0.9)",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ease-out
              ${isActive ? "text-black" : "text-gray-200 hover:text-white"}`}
            onClick={() => onCategoryChange(cat.slug)}
          >
            {t(cat.tKey)}
          </motion.button>
        );
      })}
    </div>
  );
}
