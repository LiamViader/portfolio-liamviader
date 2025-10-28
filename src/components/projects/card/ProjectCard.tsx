"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { motion, type Variants } from "framer-motion";

import { TranslatedProject } from "@/data/projects";
import { measureStableRect } from "@/utils/measureStableRect";

const BASE_BG   = "rgba(255,255,255,0.05)";
const BASE_BORD = "rgba(255,255,255,0.10)";
const HOVER_BG  = "rgba(56,189,248,0.10)";
const HOVER_BOR = "rgba(56,189,248,0.60)";
const HOVER_SH  = "0 0 20px rgba(56,189,248,0.50)";
const BASE_SH = "0 0 30px rgba(56,189,248,0.08)";


interface ProjectCardProps {
  project: TranslatedProject;
  onSelect: (project: TranslatedProject, rect: DOMRect, el: HTMLElement) => void;
  isHidden?: boolean;
}

const containerVariants: Variants = {
  rest: {
    y: 0,
    backgroundColor: BASE_BG,
    borderColor: BASE_BORD,
    boxShadow: BASE_SH,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  hover: {
    y: -10,
    backgroundColor: HOVER_BG,
    borderColor: HOVER_BOR,
    boxShadow: HOVER_SH,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

const mediaVariants: Variants = {
  rest: { scale: 1, y: 0, },
  hover: { scale: 1.05, y: -8, transition: {duration: 0.3} },
};

const overlayVariants: Variants = {
  rest: { opacity: 1 },
  hover: {  opacity: 0.2 },
};

const contentVariants: Variants = {
  rest: { y: 0, opacity: 1 },
  hover: { y: -2, opacity: 1 },
};

const tagVariants: Variants = {
  rest: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.15)",
    rotate: 0,
  },
  hover: {
    backgroundColor: "rgba(56,189,248,0.10)",
    borderColor: "rgba(56,189,248,0.50)",
    rotate: -3,
    transition: { duration: 0.2 },
  },
};



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
      variants={containerVariants}
      className={`cursor-pointer group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur transform-gpu will-change-[transform,opacity] transition-none 
        ${
          isHidden
            ? "pointer-events-none select-none opacity-0"
            : ""
        }
      `}
      animate="rest"
      initial="rest"
      whileTap="tap"
      whileHover="hover"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {hasPreviewImage && (
        <div className="relative h-48 w-full overflow-hidden">
          <motion.div
            variants={mediaVariants}
            className="absolute inset-0"
            style={{ transformOrigin: "center" }}
            transition={{duration: 0.4}}
          >
            <Image
              src={project.media_preview}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              priority={false}
            />
            <motion.div
              variants={overlayVariants}
              className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/30 to-transparent"
            />
          </motion.div>
        </div>
      )}

      <motion.div
        variants={contentVariants}
        className={`flex flex-1 flex-col ${hasPreviewImage ? "p-6" : "p-8"}`}
      >
        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
        <p
          className={`mt-3 text-sm text-white/70 ${
            hasPreviewImage ? "line-clamp-3" : "line-clamp-4"
          }`}
        >
          {project.short_description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-6 text-xs text-white/70">
          {(project.tags ?? []).slice(0, 4).map((tag) => (
            <motion.span
              key={tag}
              variants={tagVariants}
              className="rounded-full border px-3 py-1"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
