"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { TranslatedProject } from "@/data/projects";
import { ProjectModalPortal } from "./ProjectModalPortal";

interface ProjectsGridProps {
  projects: TranslatedProject[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [selected, setSelected] = useState<{ project: TranslatedProject; rect: DOMRect } | null>(null);

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 0.5, ease: "easeIn" as any } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.98, 
      transition: { duration: 0.5, ease: "easeInOut" as any } 
    },
  };

  const handleSelect = (project: TranslatedProject, rect: DOMRect) => {
    setSelected({ project, rect });
  };

  const handleClose = () => setSelected(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        <AnimatePresence initial={false}>
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              layout
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ProjectCard
                project={project}
                onSelect={handleSelect}
                isHidden={selected?.project.id === project.id}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {selected && (
        <ProjectModalPortal project={selected.project} originRect={selected.rect} onClose={handleClose} />
      )}
    </>
  );
}