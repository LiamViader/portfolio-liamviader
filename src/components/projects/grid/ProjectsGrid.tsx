"use client";

import { AnimatePresence, LayoutGroup, Variants, motion } from "framer-motion";
import { type TranslatedProject } from "@/data/projects/types";
import { useEffect, useRef, useMemo } from "react";
import { measureStableRect } from "@/utils/measureStableRect";

import ProjectCard from "../card/ProjectCard";
import { ProjectModalPortal } from "../modal/ProjectModalPortal";
import { useProjectSelection } from "./hooks/useProjectSelection";
import { BASE_DELAY_ENTRANCE } from "@/utils/constants";

interface ProjectsGridProps {
  projects: TranslatedProject[];
  replaceUrl?: boolean;
  allowUrlOpen?: boolean;
  entranceAnimation: boolean;
  shouldAnimate?: boolean;
  useTransparent?: boolean;
  backgroundColor?: string;
}

type CardRegistry = Map<number, HTMLElement>;

const createItemVariants = (animated: boolean): Variants => ({
  hidden: {
    opacity: 0,
    y: animated ? 20 : 0,
    scale: animated ? 0.98 : 1
  },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: animated ? i * 0.15 : 0,
      duration: animated ? 0.8 : 0,
      ease: "easeOut"
    },
  }),
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    transition: { duration: 0.25, ease: "easeIn" },
  },
});

export default function ProjectsGrid({
  projects,
  replaceUrl = true,
  allowUrlOpen = true,
  entranceAnimation,
  shouldAnimate = true,
  useTransparent,
  backgroundColor
}: ProjectsGridProps) {
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.localeCompare(a.date);
    });
  }, [projects]);

  const { selected, revealOrigin, selectProject, closeProject, markOriginRevealed, projectFromUrl } =
    useProjectSelection(sortedProjects, { replaceUrl: replaceUrl, allowUrlOpen: allowUrlOpen, deferUrlTrigger: true });
  const cardRefs = useRef<CardRegistry>(new Map());

  const setCardRef = (id: number) => (node: HTMLElement | null) => {
    if (node) cardRefs.current.set(id, node);
    else cardRefs.current.delete(id);
  };

  useEffect(() => {
    if (projectFromUrl && !selected && allowUrlOpen) {
      const element = cardRefs.current.get(projectFromUrl.id);

      if (element) {
        element.scrollIntoView({ behavior: "auto", block: "center" });

        const timer = setTimeout(() => {
          requestAnimationFrame(() => {
            const rect = measureStableRect(element);
            selectProject(projectFromUrl, rect, element);
          });
        }, 200);

        return () => clearTimeout(timer);
      }
    }
  }, [projectFromUrl, selected, allowUrlOpen, selectProject]);

  const effectiveEntranceAnimation = entranceAnimation && !projectFromUrl;
  const itemVariants = createItemVariants(effectiveEntranceAnimation);

  return (
    <>
      <LayoutGroup id="projects">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-2 md:px-4">
          <AnimatePresence mode="popLayout" initial={true}>
            {sortedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout="position"
                custom={index}
                variants={itemVariants}
                initial={projectFromUrl ? "show" : "hidden"}
                animate={shouldAnimate || projectFromUrl ? "show" : "hidden"}
                exit="exit"

                transition={{ layout: { duration: 0.65, ease: "easeInOut" } }}
              >
                <div ref={setCardRef(project.id)} className="h-full w-full">
                  <ProjectCard
                    project={project}
                    onSelect={(p) => {
                      const el = cardRefs.current.get(p.id);
                      if (el) {
                        const rect = measureStableRect(el);
                        selectProject(p, rect, el);
                      }
                    }}
                    isHidden={Boolean(selected?.project.id === project.id && !revealOrigin)}
                    useTransparent={useTransparent}
                    backgroundColor={backgroundColor}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>

      {selected && (
        <ProjectModalPortal
          key={selected.project.id}
          project={selected.project}
          originRect={selected.rect}
          originEl={selected.el}
          onRevealOrigin={markOriginRevealed}
          onClose={closeProject}
          ghostCardType="grid"
          backgroundColor={backgroundColor}
        />
      )}
    </>
  );
}