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
      className="
        relative
        w-fit mx-auto                 /* ancho justo al contenido y centrado */
        flex flex-nowrap items-center /* sin saltos de línea */
        whitespace-nowrap
        gap-1
        p-1 border border-white/10 bg-white/[0.02]
        backdrop-blur-sm rounded-full shadow-lg
      "
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
            whileHover={{ scale: 1.05, boxShadow: "0 8px 10px rgba(0,0,0,0.55)", backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95, backgroundColor: "rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`
              relative z-10 px-4 sm:px-6 py-4 sm:py-5 cursor-pointer text-xs sm:text-sm font-semibold rounded-full
              transition-colors duration-300 ease-out
              ${isActive ? "text-black" : "text-gray-200 hover:text-white"}
            `}
            onClick={() => onCategoryChange(category.slug)}
          >
            {t(category.tKey)}
          </motion.button>
        );
      })}
    </div>
  );
}
