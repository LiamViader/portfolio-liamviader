"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { TranslatedProject } from "@/data/projects";

import FeaturedProjects from "./FeaturedProjects";

const LEFT_STAGGER = 0.1; 
const ITEM_DURATION = 0.6; 

interface FeaturedProjectsProps {
  projects: TranslatedProject[];
}

const leftCol: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: LEFT_STAGGER,
      delayChildren: 1.4,
    },
  },
};

const leftItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: ITEM_DURATION, ease: "easeOut" },
  },
};

export default function FeaturedProjectsSection({ projects }: FeaturedProjectsProps) {
  const t = useTranslations("ProjectsPage");
  const [cardsIntro, setCardsIntro] = useState(false);
  return (
    <section className="relative px-4 pb-28 sm:px-6 lg:px-10 ">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-300/5 to-transparent" />

      <div
        className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 text-center pt-15 border-t border-white/10"
      >
        <motion.div 
          variants={leftCol}
          initial="hidden"
          animate="show"
          className="space-y-4"
          onAnimationStart={ () => setTimeout(() => setCardsIntro(true), 1600) }
        >
          <motion.h2 variants={leftItem} className="text-3xl md:text-4xl xl:text-[42px] font-semibold text-white">{t("featured_title")}</motion.h2>
          <motion.p variants={leftItem} className="mx-auto max-w-2xl text-balance text-base text-white/65">
            {t("featured_description")}
          </motion.p>
        </motion.div>

        <div className="w-full mt-3">
          <FeaturedProjects projects={projects} introStart={cardsIntro}/>
        </div>
      </div>
    </section>
  );
}
