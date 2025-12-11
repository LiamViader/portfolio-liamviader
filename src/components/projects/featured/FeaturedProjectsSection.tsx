"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { type TranslatedProject } from "@/data/projects/types";

import FeaturedProjects from "./FeaturedProjects";

const LEFT_STAGGER = 0.1; 
const ITEM_DURATION = 0.6; 

interface FeaturedProjectsProps {
  projects: TranslatedProject[];
  replaceUrl?: boolean;
  allowUrlOpen?: boolean;
  entranceAnimationEnabled: boolean;
}

const createLeftColVariants = (animated: boolean): Variants => ({
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: animated ? LEFT_STAGGER : 0,
      delayChildren: animated ? 1.4 : 0,
    },
  },
});

const createLeftItemVariants = (animated: boolean): Variants => ({
  hidden: { 
    opacity: 0, 
    y: animated ? 16 : 0 
  },
  show: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: animated ? ITEM_DURATION : 0, 
      ease: "easeOut" 
    },
  },
});

export default function FeaturedProjectsSection({ 
  projects, 
  replaceUrl = true, 
  allowUrlOpen = false,   
  entranceAnimationEnabled,
}: FeaturedProjectsProps) {
  const t = useTranslations("ProjectsPage");
  
  // Si las animaciones están desactivadas, mostramos las cartas inmediatamente
  const [cardsIntro, setCardsIntro] = useState(!entranceAnimationEnabled);

  const leftCol = createLeftColVariants(entranceAnimationEnabled);
  const leftItem = createLeftItemVariants(entranceAnimationEnabled);

  return (
    <section className="relative px-4 pb-24 sm:px-6 lg:px-10 ">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-300/5 to-transparent" />

      <motion.div
        className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 text-center pt-15 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          delay: entranceAnimationEnabled ? 0.4 : 0, 
          duration: entranceAnimationEnabled ? 0.2 : 0 
        }}
      >
        <motion.div 
          variants={leftCol}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <motion.h2 
            variants={leftItem} 
            onAnimationStart={() => {
              if (entranceAnimationEnabled) {
                setTimeout(() => setCardsIntro(true), 1000);
              }
            }} 
            className="text-3xl md:text-4xl xl:text-[40px] font-semibold text-white"
          >
            {t("featured_title")}
          </motion.h2>
          <motion.p variants={leftItem} className="mx-auto max-w-2xl text-pretty text-base text-white/65">
            {t("featured_description")}
          </motion.p>
        </motion.div>

        <div className="w-full mt-3">
          <FeaturedProjects
            projects={projects} 
            introStart={cardsIntro}
            carouselTypography={{
              titleClassName: "text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl",
              descriptionClassName: "text-xs md:text-sm xl:text-base",
              tagClassName: "text-[10px] lg:text-xs",
            }}
            replaceUrl={replaceUrl}
            allowUrlOpen={allowUrlOpen}
            carouselIntroEnabled={entranceAnimationEnabled}
          />
        </div>
      </motion.div>
    </section>
  );
}