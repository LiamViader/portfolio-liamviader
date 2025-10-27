"use client";

import { useRef, useState } from "react";

import { motion, type Variants, useAnimationControls } from "framer-motion";
import { WhiteButton, SkyButton } from "./Buttons";
import FeaturedProjects from "../projects/featured/FeaturedProjects";
import type { TranslatedProject } from "@/data/projects";

interface FeaturedProjectsHomeSectionProps {
  title: string;
  description: string;
  projectsButtonText: string;
  contactButtonText: string;
  projects: TranslatedProject[];
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

const rightColGate: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", when: "beforeChildren" },
  },
};


export function FeaturedProjectsHomeSection({
  title,
  description,
  projectsButtonText,
  contactButtonText,
  projects,
}: FeaturedProjectsHomeSectionProps) {
  const leftControls = useAnimationControls();
  const rightControls = useAnimationControls();
  const firedRightOnceRef = useRef(false);

  const [cardsIntro, setCardsIntro] = useState(false);

  return (
    <motion.div
      variants={page}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35, margin: "0px 0px -15% 0px" }}
      className="relative mx-auto max-w-[1400px]"
    >
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <motion.div
          variants={leftCol}
          initial="hidden"
          animate={leftControls}
          viewport={{ once: true, amount: 0.35, margin: "0px 0px -15% 0px" }}
          onViewportEnter={() => {
            leftControls.start("show");
            setTimeout(() => setCardsIntro(true), 300);
          }}
          className="flex flex-col gap-6 text-center lg:text-left pl-3 will-change-transform"
        >
          <div className="space-y-4 mt-10">
            <motion.h2 variants={leftItem} className="font-semibold text-white text-3xl md:text-4xl xl:text-5xl whitespace-nowrap">
              {title}
            </motion.h2>

            <motion.p variants={leftItem} className="text-base text-white/65 lg:max-w-xl">
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
          className="lg:col-start-2 lg:flex lg:justify-end will-change-transform"
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
              titleClassName: "text-2xl",
              descriptionClassName: "text-sm",
              tagClassName: "text-[10px]",
            }}
          />
        </div>

        <div
          className="lg:hidden pt-5 flex flex-wrap items-center justify-center gap-4 lg:justify-start will-change-transform"
        >
          <SkyButton href="/projects" text={projectsButtonText} />
          <WhiteButton href="/contact" text={contactButtonText} />
        </div>
      </div>
    </motion.div>
  );
}
