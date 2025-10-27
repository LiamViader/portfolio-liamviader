"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";

import { TranslatedProject } from "@/data/projects";

import FeaturedProjects from "./FeaturedProjects";

interface FeaturedProjectsProps {
  projects: TranslatedProject[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 56 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.16,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function FeaturedProjectsSection({ projects }: FeaturedProjectsProps) {
  const t = useTranslations("ProjectsPage");

  return (
    <section className="relative px-4 pb-28 pt-20 sm:px-6 lg:px-10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/40 to-transparent" />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        variants={containerVariants}
        className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 text-center"
      >
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("featured_title")}</h2>
          <p className="mx-auto max-w-2xl text-balance text-base text-white/65">
            {t("featured_description")}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <FeaturedProjects projects={projects} />
        </motion.div>
      </motion.div>
    </section>
  );
}
