"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ClientCategorySlug } from "@/config/projectCategories";
import { type TranslatedProject } from "@/data/projects/types";

import CategorySwitcher from "./CategorySwitcher";
import ProjectsGrid from "../grid/ProjectsGrid";

const createContainerVariants = (animated: boolean): Variants => ({
  hidden: { 
    opacity: animated ? 0 : 1, 
    y: animated ? 60 : 0 
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animated ? 0.1 : 0,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: animated ? 0.12 : 0,
    },
  },
});

const createItemVariants = (animated: boolean): Variants => ({
  hidden: { 
    opacity: animated ? 0 : 1, 
    y: animated ? 28 : 0 
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animated ? 0.6 : 0,
      ease: "easeOut",
    },
  },
});

interface ProjectGalleryProps {
  category: ClientCategorySlug;
  filteredProjects: TranslatedProject[];
  onCategoryChange: (category: ClientCategorySlug) => void;
  entranceAnimationEnabled: boolean;
}

export default function ProjectGallery({ category, filteredProjects, onCategoryChange, entranceAnimationEnabled }: ProjectGalleryProps) {
  const t = useTranslations("ProjectsPage");
  const [gridVisible, setGridVisible] = useState(false);

  const containerVariants = createContainerVariants(entranceAnimationEnabled);
  const itemVariants = createItemVariants(entranceAnimationEnabled);

  return (
    <section className="relative px-4 pb-16 lg:pb-20 sm:px-6 lg:px-10 border-t border-white/10 pt-10 lg:pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/40 to-gray-950/60" />
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.01, margin: "0px 0px -15% 0px" }}
        onViewportEnter={() => setGridVisible(true)} 
        variants={containerVariants}
        className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 text-center"
      >
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-3xl md:text-4xl xl:text-[40px] font-semibold text-white">{t("project_gallery_title")}</h2>
          <p className="mx-auto max-w-2xl text-balance text-base text-white/65">
            {t("project_gallery_description")}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <CategorySwitcher currentCategory={category} onCategoryChange={onCategoryChange} />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <ProjectsGrid 
            projects={filteredProjects} 
            replaceUrl={true} 
            allowUrlOpen={true} 
            entranceAnimation={entranceAnimationEnabled}
            shouldAnimate={gridVisible} 
          />
        </motion.div>
      </motion.div>
    </section>
  );
}