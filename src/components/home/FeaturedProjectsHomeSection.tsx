"use client";

import { useRef, useState } from "react";

import { motion, type Variants, useAnimationControls } from "framer-motion";
import { WhiteButton, SkyButton } from "./Buttons";
import FeaturedProjects from "../projects/featured/FeaturedProjects";
import { type TranslatedProject } from "@/data/projects/types";

interface FeaturedProjectsHomeSectionProps {
  title: string;
  description: string;
  projectsButtonText: string;
  contactButtonText: string;
  projects: TranslatedProject[];
  replaceUrl?: boolean;
  allowUrlOpen?: boolean;
  entranceAnimationEnabled: boolean;
}


const PAGE_STAGGER = 0.1;   
const LEFT_STAGGER = 0.1; 
const ITEM_DURATION = 0.6; 

const page: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: PAGE_STAGGER,
      when: "beforeChildren",
    },
  },
};

const leftCol: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      when: "beforeChildren", 
      staggerChildren: LEFT_STAGGER,
      delayChildren: 0,
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

const leftButtonsRow: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: LEFT_STAGGER,
      delayChildren: 0,
    },
  },
};

export function FeaturedProjectsHomeSection({
  title,
  description,
  projectsButtonText,
  contactButtonText,
  projects,
  replaceUrl = true,
  allowUrlOpen = true,
  entranceAnimationEnabled,
}: FeaturedProjectsHomeSectionProps) {
  const leftControls = useAnimationControls();
  const rightControls = useAnimationControls();
  const firedRightOnceRef = useRef(false);

  const [cardsIntro, setCardsIntro] = useState(false);

  return (
    <motion.div
      variants={page}
      initial={entranceAnimationEnabled ? "hidden" : "show" }
      whileInView={entranceAnimationEnabled ? "show" : undefined }
      viewport={entranceAnimationEnabled ? { once: true, amount: 0.35, margin: "0px 0px -15% 0px" } : undefined}
      className="relative mx-auto max-w-[1400px]"
    >
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <motion.div
          variants={leftCol}
          initial={entranceAnimationEnabled ? "hidden" : "show" }
          animate={entranceAnimationEnabled ? leftControls : "show"}
          viewport={{ once: true, amount: 0.35, margin: "0px 0px -15% 0px" }}
          onViewportEnter={() => {
            leftControls.start("show");
            setTimeout(() => setCardsIntro(true), 300);
          }}
          className="flex flex-col gap-6 text-center lg:text-left pl-3 will-change-transform"
        >
          <div className="space-y-4 mt-10 sm:mb-2 md:mb-8 lg:mb-0">
            <motion.h2 variants={leftItem} className="text-left font-semibold text-white text-2xl sm:text-3xl whitespace-nowrap">
              {title}
            </motion.h2>

            <motion.p variants={leftItem} className="text-left text-base sm:text-lg text-white/65 lg:max-w-xl">
              {description}
            </motion.p>
          </div>

          <motion.div
            variants={leftButtonsRow}
            className="hidden lg:flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <motion.div variants={leftItem}>
              <SkyButton href="/projects" text={projectsButtonText} />
            </motion.div>

            <motion.div
              variants={leftItem}
              onAnimationStart={() => {
                if (firedRightOnceRef.current) return;
                firedRightOnceRef.current = true;
                rightControls.start("show",  { delay: 0.1 });
              }}
            >
              <WhiteButton href="/contact" text={contactButtonText} />
            </motion.div>
          </motion.div>
        </motion.div>

        <div
          className="lg:col-start-2 lg:flex lg:justify-end will-change-transform mt-2 lg:mt-0"
        >
          <FeaturedProjects
            projects={projects}
            introStart={cardsIntro}
            className="max-w-full"
            contentClassName="justify-center"
            carouselLayout={{
              containerClassName: "!w-full",
              viewportClassName:
                "!h-[310px] md:!h-[390px] lg:!h-[390px] xl:!h-[410px] !w-full",
              cardClassName:
                "!w-[47%] sm:!w-[40%] md:!w-[39%] lg:!w-[37%] xl:!w-[38%]",
              controlsContainerClassName: "",
            }}
            carouselTypography={{
              titleClassName: "text-base sm:text-lg md:text-xl",
              descriptionClassName: "text-xs md:text-sm",
              tagClassName: "text-[10px]",
            }}
            replaceUrl={replaceUrl}
            allowUrlOpen={allowUrlOpen}
            carouselIntroEnabled={entranceAnimationEnabled}
          />
        </div>

        <div
          className="lg:hidden pt-4 flex flex-wrap items-center justify-center gap-4 lg:justify-start will-change-transform"
        >
          <SkyButton href="/projects" text={projectsButtonText} />
          <WhiteButton href="/contact" text={contactButtonText} />
        </div>
      </div>
    </motion.div>
  );
}
