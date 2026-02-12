"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { type TranslatedProject } from "@/data/projects/types";
import clsx from "clsx";
import { Section } from "@/components/layout/Section";
import { ShowcaseBlock } from "@/components/layout/ShowcaseBlock";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Stack } from "@/components/layout/Stack";
import { Container } from "@/components/layout/Container";
import { ContentBlock } from "@/components/layout/ContentBlock";

import FeaturedProjects from "./FeaturedProjects";

const LEFT_STAGGER = 0.1;
const ITEM_DURATION = 0.6;

interface FeaturedProjectsProps {
  projects: TranslatedProject[];
  replaceUrl?: boolean;
  allowUrlOpen?: boolean;
  entranceAnimationEnabled: boolean;
  className?: string;
  useTransparent?: boolean;
  backgroundColor?: string;
}

const createLeftColVariants = (animated: boolean): Variants => ({
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: animated ? LEFT_STAGGER : 0,
      delayChildren: animated ? 1.0 : 0,
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

const MotionStack = motion.create(Stack);

export default function FeaturedProjectsSection({
  projects,
  replaceUrl = true,
  allowUrlOpen = false,
  entranceAnimationEnabled,
  className = "",
  useTransparent = true,
  backgroundColor,
}: FeaturedProjectsProps) {
  const t = useTranslations("ProjectsPage");

  const [cardsIntro, setCardsIntro] = useState(!entranceAnimationEnabled);

  const leftCol = createLeftColVariants(entranceAnimationEnabled);
  const leftItem = createLeftItemVariants(entranceAnimationEnabled);

  return (
    <div className={clsx("relative", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-300/5 to-transparent" />
      <Container>
        <ContentBlock>
          <MotionStack
            size="lg"
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: entranceAnimationEnabled ? 0.4 : 0,
              duration: entranceAnimationEnabled ? 0.2 : 0
            }}
            onAnimationStart={() => {
              if (entranceAnimationEnabled) {
                setTimeout(() => setCardsIntro(true), 1000);
              }
            }}
          >
            <FeaturedProjects
              projects={projects}
              introStart={cardsIntro}
              carouselTypography={{
                titleClassName: "text-md sm:text-lg lg:text-xl",
                descriptionClassName: "text-xs sm:text-sm lg:text-base",
                tagClassName: "text-[10px] lg:text-xs",
              }}
              replaceUrl={replaceUrl}
              allowUrlOpen={allowUrlOpen}
              carouselIntroEnabled={entranceAnimationEnabled}
              useTransparent={useTransparent}
              backgroundColor={backgroundColor}
            />

          </MotionStack>
        </ContentBlock>
      </Container>
    </div>
  );
}