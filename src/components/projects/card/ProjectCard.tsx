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
      className={`relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg shadow-2xl cursor-pointer transition-transform transform-gpu origin-center ${
        isHidden ? "opacity-0 pointer-events-none select-none" : "hover:scale-110"
      }`}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
    >
      {hasPreviewImage ? (
        <img src={project.media_preview} alt={project.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="flex h-48 w-full flex-col items-center justify-center gap-3 border-b border-white/10 bg-slate-900/70 text-white/70">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 shadow-lg backdrop-blur">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75A2.25 2.25 0 0 1 6 4.5h12a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 18 19.5H6a2.25 2.25 0 0 1-2.25-2.25V6.75z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 16.5 4.5-4.5 3 3 4.5-4.5 4.5 4.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5h.008v.008H8.25V7.5z" />
            </svg>
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-white/60">Preview coming soon</span>
        </div>
      )}

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
