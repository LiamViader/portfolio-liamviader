"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import clsx from "clsx";

import { type TranslatedProject } from "@/data/projects/types";
import { measureStableRect } from "@/utils/measureStableRect";
import { useTranslations } from "next-intl";
import { ProjectModalPortal } from "../modal/ProjectModalPortal";
import { useProjectSelection } from "../grid/hooks/useProjectSelection";
import { Stack } from "@/components/layout/Stack";
import {
  FeaturedCarousel,
  type FeaturedCarouselLayoutOptions,
  type FeaturedCarouselTypographyOptions,
} from "./FeaturedCarousel";

interface FeaturedProjectsProps {
  projects: TranslatedProject[];
  className?: string;
  contentClassName?: string;
  carouselLayout?: FeaturedCarouselLayoutOptions;
  carouselTypography?: FeaturedCarouselTypographyOptions;
  introStart?: boolean;
  replaceUrl?: boolean;
  allowUrlOpen?: boolean;
  carouselIntroEnabled?: boolean;
  carouselVariant?: "stack" | "peek";
}

type CardRegistry = Map<number, HTMLElement>;
type CardRefRegister = (projectId: number) => (node: HTMLElement | null) => void;

export default function FeaturedProjects({
  projects,
  className,
  contentClassName,
  carouselLayout,
  carouselTypography,
  introStart,
  replaceUrl = true,
  allowUrlOpen = false,
  carouselIntroEnabled = true,
  carouselVariant,
}: FeaturedProjectsProps) {
  const featuredProjects = useMemo(
    () => projects.filter((project) => project.is_featured),
    [projects],
  );

  // If carouselVariant is provided, use it. Otherwise, compute responsive default.
  const [responsiveVariant, setResponsiveVariant] = useState<"stack" | "peek">("stack");

  useEffect(() => {
    if (carouselVariant) return; // Controlled mode
    const media = window.matchMedia("(max-width: 639px)"); // sm breakpoint
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setResponsiveVariant(e.matches ? "peek" : "stack");
    };
    handler(media);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [carouselVariant]);

  const activeVariant = carouselVariant ?? responsiveVariant;

  const {
    selected,
    revealOrigin,
    selectProject,
    closeProject,
    markOriginRevealed,
    projectFromUrl
  } = useProjectSelection(projects, {
    replaceUrl: replaceUrl,
    allowUrlOpen: allowUrlOpen,
    deferUrlTrigger: true
  });

  const cardRefs = useRef<CardRegistry>(new Map());
  const t = useTranslations("ProjectCarousel");

  const registerCardRef = useCallback<CardRefRegister>(
    (projectId: number) =>
      (node: HTMLElement | null) => {
        if (!node) {
          cardRefs.current.delete(projectId);
          return;
        }
        cardRefs.current.set(projectId, node);
      },
    [],
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    if (projectFromUrl && !selected && allowUrlOpen) {
      const element = cardRefs.current.get(projectFromUrl.id);

      if (element) {
        timeoutId = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });

          let lastScrollY = window.scrollY;

          intervalId = setInterval(() => {
            if (Math.abs(window.scrollY - lastScrollY) < 1) {
              clearInterval(intervalId);
              requestAnimationFrame(() => {
                const rect = measureStableRect(element);
                selectProject(projectFromUrl, rect, element);
              });
            } else {
              lastScrollY = window.scrollY;
            }
          }, 300);
        }, 200);
      }
    }
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [projectFromUrl, selected, allowUrlOpen, selectProject]);


  const openProjectDetails = useCallback(
    (project: TranslatedProject) => {
      const element = cardRefs.current.get(project.id);
      if (!element) return;
      const rect = measureStableRect(element);
      selectProject(project, rect, element);
    },
    [selectProject],
  );

  const selectedProjectId = selected?.project.id;

  if (featuredProjects.length === 0) return null;

  return (
    <section className={clsx("relative w-full", className)}>
      <Stack size="sm" className={clsx("relative flex w-full items-center justify-center", contentClassName)}>
        <FeaturedCarousel
          projects={featuredProjects}
          onSelectProject={openProjectDetails}
          registerCardRef={registerCardRef}
          selectedProjectId={selectedProjectId}
          revealOrigin={revealOrigin}
          layout={carouselLayout}
          typography={carouselTypography}
          introStart={introStart}
          introAnimationEnabled={carouselIntroEnabled}
          variant={activeVariant}
        />
        <motion.p
          className="text-center text-xs text-white/40 font-light max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{
            opacity: (!carouselIntroEnabled || introStart) ? 1 : 0
          }}
          transition={{
            duration: carouselIntroEnabled ? 0.5 : 0,
            delay: carouselIntroEnabled ? 0.5 : 0,
            ease: "easeOut"
          }}
        >
          {t("hint")}
        </motion.p>
      </Stack>


      {selected && (
        <ProjectModalPortal
          key={selected.project.id}
          project={selected.project}
          originRect={selected.rect}
          originEl={selected.el}
          onRevealOrigin={markOriginRevealed}
          onClose={closeProject}
        />
      )}
    </section>
  );
}