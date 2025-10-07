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
  const [highlightStyle, setHighlightStyle] = useState({ width: 0, left: 0 });

  useEffect(() => {
    // Encuentra el botón activo y ajusta la posición y ancho del highlight
    const container = containerRef.current;
    if (!container) return;

    const activeBtn = container.querySelector<HTMLButtonElement>("button[data-active='true']");
    if (activeBtn) {
      const rect = activeBtn.getBoundingClientRect();
      const parentRect = container.getBoundingClientRect();
      setHighlightStyle({
        width: rect.width,
        left: rect.left - parentRect.left,
      });
    }
  }, [currentCategory]);

  return (
    <div 
      ref={containerRef}
      className="relative flex justify-center mb-10 p-1 bg-white/10 backdrop-blur-sm rounded-full shadow-lg max-w-[360px] min-h-[64px] mx-auto"
    >
      {/* Fondo que se mueve */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute top-1 bottom-1 bg-white rounded-full shadow-md z-0"
        style={{ width: highlightStyle.width, left: highlightStyle.left }}
      />

      {categories.map((cat) => {
        const isActive = currentCategory === cat.slug;

        return (
          <button
            key={cat.slug}
            data-active={isActive ? "true" : "false"}
            className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ease-out
              ${isActive ? "text-black" : "text-gray-200 hover:text-white"}`}
            onClick={() => onCategoryChange(cat.slug)}
          >
            {t(cat.tKey)}
          </button>
        );
      })}
    </div>
  );
}
