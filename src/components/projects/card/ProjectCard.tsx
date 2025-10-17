"use client";

import Image from "next/image";
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
      className={`cursor-pointer group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_45px_-30px_rgba(56,189,248,0.65)] backdrop-blur transition ${
        isHidden
          ? "pointer-events-none select-none opacity-0"
          : "hover:-translate-y-1 hover:border-sky-400/60 hover:bg-sky-500/10"
      }`}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
    >
      {hasPreviewImage && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={project.media_preview}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-110 group-hover:translate-y-[-10%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />
        </div>
      )}

      <div className={`flex flex-1 flex-col ${hasPreviewImage ? "p-6" : "p-8"}`}>
        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
        <p className={`mt-3 text-sm text-white/70 ${hasPreviewImage ? "line-clamp-3" : "line-clamp-4"}`}>
          {project.short_description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-6 text-xs text-white/60">
          {(project.tags ?? []).slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
