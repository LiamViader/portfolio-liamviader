"use client";

import Image from "next/image";
import { useCallback, useRef, useState, useEffect, useMemo } from "react";
import { motion, type Variants } from "framer-motion";

import { type TranslatedProject } from "@/data/projects/types";
import { measureStableRect } from "@/utils/measureStableRect";

const BASE_BG = "rgba(255,255,255,0.05)";
const BASE_BORD = "rgba(255,255,255,0.10)";
const HOVER_BG = "rgba(56,189,248,0.10)";
const HOVER_BOR = "rgba(56,189,248,0.60)";
const HOVER_SH = "0 0 20px rgba(56,189,248,0.50)";
const BASE_SH = "0 0 30px rgba(0, 0, 0, 0.2)";

interface ProjectCardProps {
  project: TranslatedProject;
  onSelect: (project: TranslatedProject, rect: DOMRect, el: HTMLElement) => void;
  isHidden?: boolean;
}

const containerVariants: Variants = {
  rest: (c: { useTransparent: boolean; backgroundColor: string }) => ({
    y: 0,
    scale: 1,
    backgroundColor: c.useTransparent ? BASE_BG : c.backgroundColor,
    borderColor: BASE_BORD,
    boxShadow: BASE_SH,
    transition: { duration: 0.6, ease: "easeOut" },
  }),
  hover: (c: { useTransparent: boolean; backgroundColor: string }) => ({
    y: 0,
    scale: 1.02,
    backgroundColor: c.useTransparent ? HOVER_BG : c.backgroundColor,
    borderColor: HOVER_BOR,
    boxShadow: HOVER_SH,
    transition: { duration: 0.15, ease: "easeOut" },
  }),
  tap: {
    scale: 0.98,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const mediaVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.05, y: 2, transition: { duration: 0.2 } },
};

const overlayVariants: Variants = {
  rest: { opacity: 1 },
  hover: { opacity: 0.2 },
};

const contentVariants: Variants = {
  rest: { y: 0, opacity: 1 },
  hover: { y: 0, opacity: 1 },
};

const tagVariants: Variants = {
  rest: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.15)",
  },
  hover: {
    backgroundColor: "rgba(56,189,248,0.10)",
    borderColor: "rgba(56,189,248,0.50)",
    transition: { duration: 0.2 },
  },
};

const ALLOWED_LINES = 2;

interface ProjectCardProps {
  project: TranslatedProject;
  onSelect: (project: TranslatedProject, rect: DOMRect, el: HTMLElement) => void;
  isHidden?: boolean;
  useTransparent?: boolean;
  backgroundColor?: string;
}

export default function ProjectCard({
  project,
  onSelect,
  isHidden = false,
  useTransparent = true,
  backgroundColor = "rgb(24, 28, 57)",
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleClick = useCallback(() => {
    if (!cardRef.current) return;

    const rect = measureStableRect(cardRef.current);
    onSelect(project, rect, cardRef.current);
  }, [onSelect, project]);

  const hasPreviewImage = Boolean(project.media_preview);

  const allTags = useMemo(() => project.tags ?? [], [project.tags]);

  const [visibleCount, setVisibleCount] = useState<number>(allTags.length);
  const [hiddenCount, setHiddenCount] = useState<number>(0);

  const tagsMeasureRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!tagsMeasureRef.current) {
      setVisibleCount(allTags.length);
      setHiddenCount(0);
      return;
    }

    if (allTags.length === 0) {
      setVisibleCount(0);
      setHiddenCount(0);
      return;
    }

    const container = tagsMeasureRef.current;
    const spans = container.querySelectorAll<HTMLSpanElement>("[data-tag-index]");

    if (!spans.length) {
      setVisibleCount(0);
      setHiddenCount(0);
      return;
    }

    const lineTops: number[] = [];
    let lastAllowedIndex = -1;

    spans.forEach((span, idx) => {
      const top = span.offsetTop;

      let lineIndex = lineTops.findIndex((t) => Math.abs(t - top) < 2);
      if (lineIndex === -1) {
        lineTops.push(top);
        lineIndex = lineTops.length - 1;
      }

      const lineNumber = lineIndex + 1;

      if (lineNumber <= ALLOWED_LINES) {
        lastAllowedIndex = idx;
      }
    });

    if (lastAllowedIndex === -1) {
      setVisibleCount(0);
      setHiddenCount(allTags.length);
      return;
    }

    const numberThatFit = lastAllowedIndex + 1;
    const total = allTags.length;

    if (numberThatFit >= total) {
      setVisibleCount(total);
      setHiddenCount(0);
      return;
    }

    const visible = Math.max(numberThatFit - 1, 0);
    const hidden = total - visible;

    setVisibleCount(visible);
    setHiddenCount(hidden);
  }, [allTags]);

  const visibleTags = allTags.slice(0, visibleCount);

  return (
    <motion.article
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      variants={containerVariants}
      custom={{ useTransparent, backgroundColor }}
      className={`cursor-pointer group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 ${useTransparent ? "bg-white/5 backdrop-blur-xl" : ""} transform-gpu will-change-[transform,opacity] transition-none 
        ${isHidden ? "pointer-events-none select-none opacity-0" : ""}
      `}
      animate="rest"
      initial="rest"
      whileTap="tap"
      whileHover="hover"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        ref={tagsMeasureRef}
        className="pointer-events-none absolute left-0 top-0 -z-10 opacity-0"
      >
        <div className="px-4 pb-4 pt-4">
          <div className="mt-auto flex flex-wrap gap-2 text-xs text-white/70">
            {allTags.map((tag, idx) => (
              <span
                key={`measure-${project.id}-tag-${idx}-${tag}`}
                data-tag-index={idx}
                className="rounded-md border px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {hasPreviewImage && (
        <div className="relative h-32 w-full overflow-hidden">
          <motion.div
            variants={mediaVariants}
            className="absolute inset-0 border-b border-white/10"
            style={{ transformOrigin: "center" }}
            transition={{ duration: 0.4 }}
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
        className={`flex flex-1 flex-col px-4 pb-4 pt-4`}
      >
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white/80 text-left text-pretty drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
          {project.title}
        </h3>
        <div className="pt-3 flex flex-1 flex-col gap-6 justify-between">
          <p className={`text-sm text-white/70 text-pretty text-left drop-shadow-[0_4px_8px_rgba(0,0,0,1)]`}>
            {project.short_description}
          </p>

          <div className="mt-auto flex flex-wrap gap-2 text-[11px] sm:text-xs text-white/70">
            {visibleTags.map((tag, idx) => (
              <motion.span
                key={`${project.id}-tag-${idx}-${tag}`}
                className="rounded-lg bg-white/10 border border-white/10 px-2 py-1 font-medium text-white/75  drop-shadow-[0_8px_6px_rgba(0,0,0,0.5)]"
              >
                {tag}
              </motion.span>
            ))}

            {hiddenCount > 0 && visibleCount > 0 && (
              <motion.span
                key={`${project.id}-tag-more`}
                className="rounded-lg bg-white/10 border border-dashed border-white/10 px-2 py-1 font-medium text-white/75  drop-shadow-[0_8px_6px_rgba(0,0,0,0.5)]"
              >
                +{hiddenCount}
              </motion.span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
