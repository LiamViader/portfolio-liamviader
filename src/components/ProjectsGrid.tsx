"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants, LayoutGroup } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { TranslatedProject } from "@/data/projects";
import { ProjectModalPortal } from "./ProjectModalPortal";

interface ProjectsGridProps {
  projects: TranslatedProject[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [selected, setSelected] = useState<{ project: TranslatedProject; rect: DOMRect } | null>(null);
  const [revealOrigin, setRevealOrigin] = useState(false); // ← nuevo

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const handleSelect = (project: TranslatedProject, rect: DOMRect) => {
    setRevealOrigin(false);
    setSelected({ project, rect });
  };

  const handleClose = () => {
    setSelected(null);
    setRevealOrigin(false);
  };

  return (
    <>
      <LayoutGroup id="projects">
        <motion.div layoutRoot className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          <AnimatePresence initial={false} mode="popLayout">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                layout="position"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
              >
                <ProjectCard
                  project={project}
                  onSelect={handleSelect}
                  // Oculta solo mientras hay modal Y aún no se ha revelado la card
                  isHidden={!!(selected && selected.project.id === project.id && !revealOrigin)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {selected && (
        <ProjectModalPortal
          project={selected.project}
          originRect={selected.rect}
          onRevealOrigin={() => setRevealOrigin(true)} // ← se llama justo tras el shrink, antes del fade
          onClose={handleClose}
        />
      )}
    </>
  );
}
