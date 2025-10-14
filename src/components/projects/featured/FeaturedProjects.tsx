"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { TranslatedProject } from "@/data/projects";

interface FeaturedProjectsProps {
  projects: TranslatedProject[];
}

type CarouselVariant = "center" | "left" | "right" | "hiddenLeft" | "hiddenRight";

const variantStyles: Record<CarouselVariant, { x: string; scale: number; opacity: number; zIndex: number }> = {
  center: {
    x: "-50%",
    scale: 1,
    opacity: 1,
    zIndex: 30,
  },
  left: {
    x: "-98%",
    scale: 0.88,
    opacity: 0.45,
    zIndex: 20,
  },
  right: {
    x: "-2%",
    scale: 0.88,
    opacity: 0.45,
    zIndex: 20,
  },
  hiddenLeft: {
    x: "-145%",
    scale: 0.8,
    opacity: 0,
    zIndex: 10,
  },
  hiddenRight: {
    x: "45%",
    scale: 0.8,
    opacity: 0,
    zIndex: 10,
  },
};

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const t = useTranslations("ProjectsPage");
  const featuredProjects = useMemo(
    () => projects.filter((project) => project.is_featured),
    [projects],
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const totalProjects = featuredProjects.length;

  useEffect(() => {
    if (totalProjects === 0) {
      return;
    }

    setActiveIndex((current) => current % totalProjects);
  }, [totalProjects]);

  const goToNext = useCallback(() => {
    if (totalProjects <= 1) return;
    setActiveIndex((idx) => (idx + 1) % totalProjects);
  }, [totalProjects]);

  const goToPrevious = useCallback(() => {
    if (totalProjects <= 1) return;
    setActiveIndex((idx) => (idx - 1 + totalProjects) % totalProjects);
  }, [totalProjects]);

  const getVariantForIndex = useCallback(
    (index: number): CarouselVariant => {
      if (totalProjects <= 1) {
        return "center";
      }

      const forwardDistance = (index - activeIndex + totalProjects) % totalProjects;
      const backwardDistance = (activeIndex - index + totalProjects) % totalProjects;

      if (forwardDistance === 0) {
        return "center";
      }

      if (backwardDistance === 1) {
        return "left";
      }

      if (forwardDistance === 1) {
        return "right";
      }

      if (forwardDistance < backwardDistance) {
        return "hiddenRight";
      }

      return "hiddenLeft";
    },
    [activeIndex, totalProjects],
  );

  if (totalProjects === 0) {
    return null;
  }

  return (
    <section className="py-24 px-4 md:px-8 w-full mx-auto mb-16">
      <h2 className="text-3xl md:text-5xl font-extrabold mb-20 tracking-tight text-center">
        {t("featured_title")}
      </h2>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="hidden md:block h-64 w-3/4 max-w-4xl rounded-full bg-gradient-to-r from-indigo-500/30 via-blue-500/30 to-cyan-500/30 blur-3xl" />
        </div>

        <div className="relative flex w-full justify-center overflow-visible">
          <div className="relative w-full md:w-[85%]  h-[300px] md:h-[380px] lg:h-[450px] xl:h-[500px]">
            {featuredProjects.map((project, index) => {
              const variant = getVariantForIndex(index);
              const isSideCard = variant === "left" || variant === "right";
              const isHidden = variant === "hiddenLeft" || variant === "hiddenRight";

              const handleClick = () => {
                if (variant === "left") {
                  goToPrevious();
                }

                if (variant === "right") {
                  goToNext();
                }
              };

              const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
                if (event.key !== "Enter" && event.key !== " ") {
                  return;
                }

                event.preventDefault();

                if (variant === "left") {
                  goToPrevious();
                }

                if (variant === "right") {
                  goToNext();
                }
              };

              return (
                <motion.article
                  key={project.id}
                  className="absolute top-0 h-full w-[60%] md:w-[55%] lg:w-[52%] xl:w-[48%]"
                  style={{ left: "50%", pointerEvents: isHidden ? "none" : "auto" }}
                  animate={variantStyles[variant]}
                  initial={variantStyles[variant]}
                  transition={{ type: "spring", stiffness: 240, damping: 32 }}
                  role={isSideCard ? "button" : undefined}
                  tabIndex={isSideCard ? 0 : -1}
                  aria-hidden={isHidden}
                  onClick={isSideCard ? handleClick : undefined}
                  onKeyDown={isSideCard ? handleKeyDown : undefined}
                >
                  <div
                    className={`flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl transition-opacity ${
                      variant === "center" ? "opacity-100" : "opacity-75"
                    }`}
                  >
                    <div className="relative h-2/3 overflow-hidden">
                      <Image
                        src={project.media_preview}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1280px) 60vw, (min-width: 1024px) 68vw, (min-width: 768px) 78vw, 90vw"
                        priority={variant === "center"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <p className="text-xs uppercase tracking-widest text-white/70">{t("featured_badge")}</p>
                        <h3 className="mt-2 text-2xl font-semibold md:text-3xl">{project.title}</h3>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                      <p className="text-sm text-slate-200/90 md:text-base">{project.short_description}</p>

                      <div className="flex flex-wrap gap-2">
                        {(project.tags ?? []).slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-indigo-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
