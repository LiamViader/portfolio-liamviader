"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { CATEGORY_CONFIG, ClientCategorySlug } from "@/config/projectCategories";

import { useCategoryHighlight } from "./hooks/useCategoryHighlight";

interface CategorySwitcherProps {
  currentCategory: ClientCategorySlug;
  onCategoryChange: (category: ClientCategorySlug) => void;
}

export default function CategorySwitcher({ currentCategory, onCategoryChange }: CategorySwitcherProps) {
  const t = useTranslations("ProjectsPage");
  const categories = Object.values(CATEGORY_CONFIG);
  const { containerRef, highlightStyle } = useCategoryHighlight(currentCategory);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center mb-10 p-1 border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-indigo-900/40 backdrop-blur-sm rounded-full shadow-lg max-w-[360px] min-h-[64px] mx-auto"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute top-1 bottom-1 rounded-full shadow-md z-0"
        style={{
          width: highlightStyle.width,
          left: highlightStyle.left,
          backgroundColor: highlightStyle.backgroundColor,
        }}
      />

      {categories.map((category) => {
        const isActive = currentCategory === category.slug;

        return (
          <motion.button
            key={category.slug}
            data-active={isActive ? "true" : "false"}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.55)" }}
            whileTap={{ scale: 0.95, backgroundColor: "rgba(0,0,0,0.9)" }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`relative z-10 px-6 py-2 cursor-pointer text-sm font-semibold rounded-full transition-colors duration-300 ease-out ${
              isActive ? "text-black" : "text-gray-200 hover:text-white"
            }`}
            onClick={() => onCategoryChange(category.slug)}
          >
            {t(category.tKey)}
          </motion.button>
        );
      })}
    </div>
  );
}
