"use client";
import Image from "next/image";
import clsx from "clsx";
import { type TranslatedProject } from "@/data/projects/types";
import { motion, Variants } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { usePerfTier } from "@/hooks/usePerfTier";

const TRANSPARENT_BASE_BG = "rgba(255,255,255,0.05)";
const BASE_BORD = "rgba(255,255,255,0.10)";
const TRANSPARENT_HOVER_BG = "rgba(56,189,248,0.10)";
const HOVER_BOR = "rgba(56,189,248,0.60)";
const HOVER_SH = "0 0 30px rgba(56,189,248,0.50)";
const BASE_SH = "0 0 30px rgba(0, 0, 0, 0.3)";

const cardVariants: Variants = {
  hidden: (
    c: { useTransparent: boolean, backgroundColor: string }
  ) => ({
    opacity: 0,
    y: 30,
    backgroundColor: c.useTransparent ? TRANSPARENT_BASE_BG : c.backgroundColor,
    borderColor: BASE_BORD,
  }),
  show: (
    c: { translate: boolean; order: number; isIntro: boolean, canHover: boolean, useTransparent: boolean, backgroundColor: string }
  ) => ({
    opacity: 1,
    y: 0,
    backgroundColor: c.useTransparent ? TRANSPARENT_BASE_BG : c.backgroundColor,
    borderColor: BASE_BORD,
    boxShadow: c.canHover ? BASE_SH : undefined,
    transition: {
      duration: c.isIntro ? 0.65 : 0.5,
      delay: c.isIntro ? c.order * 0.15 : 0,
      ease: "easeOut",
      backgroundColor: { duration: 0.6 }
    },
  }),
  hover: (
    c: { translate: boolean; order: number; isIntro: boolean, canHover: boolean, useTransparent: boolean, backgroundColor: string }
  ) => ({
    y: c.translate ? -20 : 0,
    backgroundColor: c.useTransparent ? TRANSPARENT_HOVER_BG : c.backgroundColor,
    borderColor: HOVER_BOR,
    boxShadow: HOVER_SH,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  }),
};

const mediaVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: (
    c: { translate: boolean; order: number; isIntro: boolean } = {
      order: 0,
      isIntro: false,
      translate: true,
    }
  ) => ({
    scale: c.translate ? 1.03 : 1,
    y: c.translate ? 2 : 0,
    transition: { duration: 0.3 },
  }),
};

const overlayVariants: Variants = {
  rest: { opacity: 1 },
  hover: (c: { center: boolean } = { center: false }) => ({
    opacity: c.center ? 0.5 : 1,
  }),
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

interface FeaturedCarouselCardProps {
  project: TranslatedProject;
  isCenter: boolean;
  shouldHide: boolean;
  titleClassName?: string;
  descriptionClassName?: string;
  tagClassName?: string;
  introStart?: boolean;
  introOrder?: number;
  introAnimationEnabled: boolean;
  useTransparent?: boolean;
  backgroundColor?: string;
}

export function FeaturedCarouselCard({
  project,
  isCenter,
  shouldHide,
  titleClassName,
  descriptionClassName,
  tagClassName,
  introStart = false,
  introOrder = 0,
  introAnimationEnabled,
  useTransparent = true,
  backgroundColor = "rgb(24, 28, 57)",
}: FeaturedCarouselCardProps) {
  const titleSize = titleClassName ?? "text-2xl md:text-3xl";
  const descSize = descriptionClassName ?? "text-sm md:text-base";
  const tagSize = tagClassName ?? "text-xs";

  const { canHover } = usePerfTier();

  const [introDone, setIntroDone] = useState(!introAnimationEnabled);
  const isIntro = introStart && !introDone;

  const allTags = useMemo(() => project.tags ?? [], [project.tags]);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const [allowedLines, setAllowedLines] = useState<number>(0);

  const [visibleCount, setVisibleCount] = useState<number>(allTags.length);
  const [hiddenCount, setHiddenCount] = useState<number>(0);

  const tagsMeasureRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!introAnimationEnabled) {
      setIntroDone(true);
    }
  }, [introAnimationEnabled]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const computeAllowedLines = (width: number): number => {
      if (width < 220) return 0;
      if (width < 320) return 1;
      return 2;
    };

    const updateFromWidth = (width: number) => {
      setAllowedLines(computeAllowedLines(width));
    };

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        updateFromWidth(entry.contentRect.width);
      }
    });

    observer.observe(el);
    updateFromWidth(el.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!tagsMeasureRef.current) return;
    if (allTags.length === 0) {
      setVisibleCount(0);
      setHiddenCount(0);
      return;
    }

    if (allowedLines <= 0) {
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

      if (lineNumber <= allowedLines) {
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
    const hasOverflow = numberThatFit < total;

    if (!hasOverflow) {
      setVisibleCount(total);
      setHiddenCount(0);
      return;
    }

    const visible = Math.max(numberThatFit - 1, 0);
    const hidden = total - visible;

    setVisibleCount(visible);
    setHiddenCount(hidden);
  }, [allowedLines, allTags]);

  const visibleTags = allTags.slice(0, visibleCount);

  return (
    <motion.article
      ref={cardRef}
      variants={cardVariants}
      initial={introAnimationEnabled ? "hidden" : "show"}
      animate={introAnimationEnabled && !introStart ? "hidden" : "show"}
      custom={{
        order: introOrder,
        isIntro,
        translate: !shouldHide,
        canHover: canHover,
        useTransparent,
        backgroundColor
      }}
      onAnimationComplete={() => {
        if (isIntro) {
          setIntroDone(true);
        }
      }}
      whileHover={introDone ? "hover" : undefined}
      className={`
        relative flex h-full flex-col cursor-pointer overflow-hidden rounded-3xl
        border border-white/10
        ${useTransparent ? "bg-white/5 backdrop-blur-xl" : ""} 
        shadow-[0_0_10px_rgba(0,0,0,0.40)]
        transform-gpu will-change-[transform,opacity]
        ${shouldHide
          ? "pointer-events-none select-none !opacity-0"
          : ""
        }
      `}
      style={{
        backgroundColor: useTransparent ? TRANSPARENT_BASE_BG : backgroundColor,
        borderColor: BASE_BORD,
        pointerEvents: introDone ? "auto" : "none",
      }}
    >
      <div
        ref={tagsMeasureRef}
        className="pointer-events-none absolute left-0 top-0 -z-10 opacity-0"
      >
        <div className="px-4 pt-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag, idx) => (
              <span
                key={`measure-${project.id}-tag-${idx}-${tag}`}
                data-tag-index={idx}
                className={clsx(
                  "rounded-md bg-white/10 border border-white/10 px-2 py-1 font-medium tracking-wide text-white/70",
                  tagSize
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`
          relative z-10 flex h-full flex-col
        `}
      >
        <div className="relative h-2/3 overflow-hidden">
          <motion.div
            variants={mediaVariants}
            className="absolute inset-0"
            style={{ transformOrigin: "center" }}
            transition={{ duration: 0.2 }}
            custom={{ order: introOrder, isIntro, translate: isCenter }}
          >
            <Image
              src={project.media_preview}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 60vw, (min-width: 1024px) 68vw, (min-width: 768px) 78vw, 90vw"
              priority={isCenter}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/30 to-transparent"
              custom={{ center: isCenter && !shouldHide }}
              variants={overlayVariants}
            />
          </motion.div>
        </div>

        <div className="flex flex-1 flex-col justify-around gap-4 px-4 pt-4 pb-4">
          <div className="inset-x-0 text-white/90 flex flex-row gap-2 justify-left items-center full-w">
            <h3
              className={clsx(
                "font-semibold leading-tight text-left text-pretty text-white/80 ",
                titleSize
              )}
            >
              {project.title}
            </h3>
          </div>
          <p
            className={clsx(
              "text-white/60 text-pretty text-left ",
              descSize
            )}
          >
            {project.short_description}
          </p>

          {allowedLines > 0 && (
            <div className="flex flex-wrap gap-2">
              {visibleTags.map((tag, idx) => (
                <motion.span
                  key={`${project.id}-tag-${idx}-${tag}`}
                  className={clsx(
                    "rounded-lg bg-white/10 border border-white/10 px-2 py-1 font-medium text-white/75",
                    tagSize
                  )}
                >
                  {tag}
                </motion.span>
              ))}

              {hiddenCount > 0 && visibleCount > 0 && (
                <motion.span
                  key={`${project.id}-tag-more`}
                  className={clsx(
                    "rounded-lg bg-white/10 border border-dashed border-white/10 px-2 py-1 font-medium text-white/75",
                    tagSize
                  )}
                >
                  +{hiddenCount}
                </motion.span>
              )}
            </div>
          )}
        </div>
      </div>
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 bg-black"
        initial={false}
        animate={{ opacity: isCenter ? 0 : 0.02 }}
        transition={{ duration: 0.2 }}
      />
    </motion.article>
  );
}
