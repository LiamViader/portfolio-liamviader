"use client";

import { AnimatePresence, LayoutGroup, Variants, motion } from "framer-motion";

import { type TranslatedProject } from "@/data/projects/types";

import ProjectCard from "../card/ProjectCard";
import { ProjectModalPortal } from "../modal/ProjectModalPortal";
import { useProjectSelection } from "./hooks/useProjectSelection";

interface ProjectsGridProps {
  projects: TranslatedProject[];
  replaceUrl?: boolean;
  allowUrlOpen?: boolean;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeIn" },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

export default function ProjectsGrid({ projects, replaceUrl = true, allowUrlOpen = true }: ProjectsGridProps) {
    const { selected, revealOrigin, selectProject, closeProject, markOriginRevealed } =
    useProjectSelection(projects, { replaceUrl: replaceUrl, allowUrlOpen: allowUrlOpen });

  return (
    <>
      <LayoutGroup id="projects">
        <motion.div
          layoutRoot
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                layout="position"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ layout: { duration: 0.25, ease: "easeInOut" } }}
              >
                <ProjectCard
                  project={project}
                  onSelect={selectProject}
                  isHidden={Boolean(
                    selected &&
                      selected.project.id === project.id &&
                      !revealOrigin,
                  )}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {selected && (
        <ProjectModalPortal
          key={selected.project.id}
          project={selected.project}
          originRect={selected.rect}
          originEl={selected.el}
          onRevealOrigin={markOriginRevealed}
          onClose={closeProject}
        />
      )}
    </>
  );
}
