"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ClientCategorySlug } from "@/config/projectCategories";
import { type TranslatedProject } from "@/data/projects/types";

import CategorySwitcher from "./CategorySwitcher";
import ProjectsGrid from "../grid/ProjectsGrid";

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { ShowcaseBlock } from "@/components/layout/ShowcaseBlock";
import { SectionHeaderBig } from "@/components/layout/SectionHeaderBig";
import { Stack } from "@/components/layout/Stack";
import { ContentBlock } from "@/components/layout/ContentBlock";

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

const MotionStack = motion(Stack);

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
    <Section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/40 to-gray-950" />
      <Container>
        <ContentBlock>


          <MotionStack
            size="lg"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.01, margin: "0px 0px -15% 0px" }}
            onViewportEnter={() => setGridVisible(true)} 
            variants={containerVariants}
            className="relative text-center"
          >
            <SectionHeaderBig
              title={t("project_gallery_title")}
              description={t("project_gallery_description")}
              align="center"
              variants={itemVariants} 
              subtitleClassName="text-pretty"
            />


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
          </MotionStack>
        </ContentBlock>
      </Container>
    </Section>
  );
}