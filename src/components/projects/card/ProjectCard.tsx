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

  const hasPreviewImage = Boolean(project.media_preview);

  return (
    <motion.div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      className={`relative flex h-full flex-col overflow-hidden rounded-xl shadow-2xl cursor-pointer transition-transform transform-gpu origin-center border border-white/10 bg-white/[0.02] backdrop-blur-sm ${isHidden ? "opacity-0 pointer-events-none select-none" : "hover:scale-104"}`}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
    >
      {hasPreviewImage && (
        <img src={project.media_preview} alt={project.title} className="w-full h-48 object-cover" />
      )}

      <div
        className={`flex flex-1 flex-col ${
          hasPreviewImage ? "p-4" : "p-6"
        }`}
      >

        <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
        <p className={`text-sm text-gray-300 mb-4 ${hasPreviewImage ? "line-clamp-2" : "line-clamp-4"}`}>
          {project.short_description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          {(project.tags ?? []).slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-indigo-600/80 rounded-full text-white font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
