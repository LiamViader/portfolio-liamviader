"use client";

import { AnimatePresence, LayoutGroup, Variants, motion } from "framer-motion";

import { type TranslatedProject } from "@/data/projects/types";
import { useEffect, useRef } from "react";
import { measureStableRect } from "@/utils/measureStableRect";

import ProjectCard from "../card/ProjectCard";
import { ProjectModalPortal } from "../modal/ProjectModalPortal";
import { useProjectSelection } from "./hooks/useProjectSelection";

interface ProjectsGridProps {
  projects: TranslatedProject[];
  replaceUrl?: boolean;
  allowUrlOpen?: boolean;
}

type CardRegistry = Map<number, HTMLElement>;

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
  const { selected, revealOrigin, selectProject, closeProject, markOriginRevealed, projectFromUrl } =
    useProjectSelection(projects, { replaceUrl: replaceUrl, allowUrlOpen: allowUrlOpen, deferUrlTrigger: true });
  const cardRefs = useRef<CardRegistry>(new Map());

  const setCardRef = (id: number) => (node: HTMLElement | null) => {
    if (node) cardRefs.current.set(id, node);
    else cardRefs.current.delete(id);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    if (projectFromUrl && !selected && allowUrlOpen) {
      const element = cardRefs.current.get(projectFromUrl.id);

      if (element) {
        timeoutId = setTimeout(() => {
          
          element.scrollIntoView({ behavior: "smooth", block: "center" });

          let lastScrollY = window.scrollY;
          
          intervalId = setInterval(() => {
            if (Math.abs(window.scrollY - lastScrollY) < 1) {
              clearInterval(intervalId);

              requestAnimationFrame(() => {
                const rect = measureStableRect(element);
                selectProject(projectFromUrl, rect, element);
              });
              
            } else {
              lastScrollY = window.scrollY;
            }
          }, 400);

        }, 200); 
      }
    }

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [projectFromUrl, selected, allowUrlOpen, selectProject]);
  
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
                <div ref={setCardRef(project.id)} className="h-full w-full"> 
                  <ProjectCard
                    project={project}
                    onSelect={(p) => {
                        // Manual click handling: medimos el elemento actual
                        const el = cardRefs.current.get(p.id);
                        if(el) {
                            const rect = measureStableRect(el);
                            selectProject(p, rect, el);
                        }
                    }}
                    isHidden={Boolean(selected?.project.id === project.id && !revealOrigin)}
                  />
                </div>
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
