"use client";

import { useCallback, useRef } from "react";
import { motion } from "framer-motion";

import { TranslatedProject } from "@/data/projects";
import { measureStableRect } from "@/utils/measureStableRect";

interface ProjectCardProps {
  project: TranslatedProject;
  onSelect: (project: TranslatedProject, rect: DOMRect, el: HTMLElement) => void;
  isHidden?: boolean;
}

export default function ProjectCard({ project, onSelect, isHidden = false }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleClick = useCallback(() => {
    if (!cardRef.current) return;

    const rect = measureStableRect(cardRef.current);
    onSelect(project, rect, cardRef.current);
  }, [onSelect, project]);

  return (
    <motion.div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      className={`relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg shadow-2xl cursor-pointer transition-transform transform-gpu origin-center ${
        isHidden ? "opacity-0 pointer-events-none select-none" : "hover:scale-110"
      }`}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
    >
      <img src={project.media_preview} alt={project.title} className="w-full h-48 object-cover" />

      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.short_description}</p>

        <div className="flex flex-wrap gap-2">
          {(project.tags ?? []).slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-indigo-600 rounded-full text-white font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
