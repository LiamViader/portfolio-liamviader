"use client";

import { useRef, useState } from "react";

import { motion, type Variants, useAnimationControls } from "framer-motion";
import { WhiteButton, SkyButton } from "./Buttons";
import FeaturedProjects from "../projects/featured/FeaturedProjects";
import { type TranslatedProject } from "@/data/projects/types";
import { SectionHeader } from "../layout/SectionHeader";
import { Stack } from "../layout/Stack";
import { ButtonGroup } from "../layout/ButtonGroup";

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
      initial={entranceAnimationEnabled ? "hidden" : "show"}
      whileInView={entranceAnimationEnabled ? "show" : undefined}
      viewport={entranceAnimationEnabled ? { once: true, amount: 0.35, margin: "0px 0px -15% 0px" } : undefined}
      className="relative mx-auto w-full"
    >
      <div className="flex flex-col gap-8 sm:gap-10 xl:grid xl:grid-cols-[minmax(0,0.70fr)_minmax(0,1fr)]">
        <motion.div
          variants={leftCol}
          initial={entranceAnimationEnabled ? "hidden" : "show"}
          animate={entranceAnimationEnabled ? leftControls : "show"}
          viewport={{ once: true, amount: 0.35, margin: "0px 0px -15% 0px" }}
          onViewportEnter={() => {
            leftControls.start("show");
            setTimeout(() => setCardsIntro(true), 300);
          }}
          className="flex flex-col will-change-transform"
        >
          <Stack size="lg" className="xl:mt-12">
            <SectionHeader
              title={title}
              description={description}
              align="left"
              variants={leftItem}
            />
            <motion.div variants={leftButtonsRow} className="hidden xl:block">
              <ButtonGroup>
                <motion.div variants={leftItem}>
                  <SkyButton href="/projects" text={projectsButtonText} />
                </motion.div>

                <motion.div
                  variants={leftItem}
                  onAnimationStart={() => {
                    if (firedRightOnceRef.current) return;
                    firedRightOnceRef.current = true;
                    rightControls.start("show", { delay: 0.1 });
                  }}
                >
                  <WhiteButton href="/contact" text={contactButtonText} />
                </motion.div>
              </ButtonGroup>
            </motion.div>
          </Stack>
        </motion.div>

        <Stack size="md">
          <FeaturedProjects
            projects={projects}
            introStart={cardsIntro}
            carouselLayout={{
              viewportClassName:
                "xl:!h-[380px]",
              cardClassName:
                "xl:!w-[44%]",
            }}
            carouselTypography={{
              titleClassName: "text-base sm:text-lg md:text-xl",
              descriptionClassName: "text-xs md:text-sm",
              tagClassName: "text-[10px]",
            }}
            replaceUrl={replaceUrl}
            allowUrlOpen={allowUrlOpen}
            carouselIntroEnabled={entranceAnimationEnabled}
            debugTransparent={false}
            backgroundColor="rgb(24, 28, 57)"
          />
          <ButtonGroup className="xl:hidden" align="center">
            <motion.div variants={leftItem}>
              <SkyButton href="/projects" text={projectsButtonText} />
            </motion.div>

            <motion.div
              variants={leftItem}
            >
              <WhiteButton href="/contact" text={contactButtonText} />
            </motion.div>
          </ButtonGroup>
        </Stack>
      </div>
    </motion.div>
  );
}
