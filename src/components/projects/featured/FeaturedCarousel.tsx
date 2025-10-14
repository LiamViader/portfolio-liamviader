import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { motion } from "framer-motion";

import { TranslatedProject } from "@/data/projects";

import {
  CarouselVariant,
  getInitialStyle,
  getVariantAnimation,
  isCenterVariant,
  isHiddenVariant,
} from "./carouselAnimations";
import { FeaturedCarouselCard } from "./FeaturedCarouselCard";

interface FeaturedCarouselProps {
  projects: TranslatedProject[];
  badgeLabel: string;
  onSelectProject: (project: TranslatedProject) => void;
  registerCardRef: (projectId: number) => (node: HTMLElement | null) => void;
  selectedProjectId?: number;
  revealOrigin: boolean;
}

export function FeaturedCarousel({
  projects,
  badgeLabel,
  onSelectProject,
  registerCardRef,
  selectedProjectId,
  revealOrigin,
}: FeaturedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalProjects = projects.length;
  const previousVariantsRef = useRef<Record<string, CarouselVariant | undefined>>({});

  useEffect(() => {
    if (totalProjects === 0) {
      return;
    }

    setActiveIndex((current) => current % totalProjects);
  }, [totalProjects]);

  const clearAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const scheduleAutoplay = useCallback(() => {
    if (totalProjects <= 1) {
      clearAutoplay();
      return;
    }

    clearAutoplay();
    autoplayRef.current = setInterval(() => {
      setActiveIndex((idx) => (idx + 1) % totalProjects);
    }, 6000);
  }, [clearAutoplay, totalProjects]);

  useEffect(() => {
    scheduleAutoplay();

    return () => {
      clearAutoplay();
    };
  }, [clearAutoplay, scheduleAutoplay]);

  const handleManualNavigation = useCallback(
    (direction: 1 | -1) => {
      if (totalProjects <= 1) {
        return;
      }

      clearAutoplay();
      setActiveIndex((idx) => (idx + direction + totalProjects) % totalProjects);
      scheduleAutoplay();
    },
    [clearAutoplay, scheduleAutoplay, totalProjects],
  );

  const handleInteractionStart = useCallback(() => {
    clearAutoplay();
  }, [clearAutoplay]);

  const handleBlurCapture = useCallback(() => {
    requestAnimationFrame(() => {
      if (!containerRef.current) {
        scheduleAutoplay();
        return;
      }

      const active = document.activeElement;
      if (active && containerRef.current.contains(active)) {
        return;
      }

      scheduleAutoplay();
    });
  }, [scheduleAutoplay]);

  const handleInteractionEnd = useCallback(() => {
    scheduleAutoplay();
  }, [scheduleAutoplay]);

  const handleContainerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleManualNavigation(1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleManualNavigation(-1);
      }
    },
    [handleManualNavigation],
  );

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

  const handleCardInteraction = useCallback(
    (variant: CarouselVariant, project: TranslatedProject) => {
      if (variant === "left") {
        handleManualNavigation(-1);
        return;
      }

      if (variant === "right") {
        handleManualNavigation(1);
        return;
      }

      if (variant === "center") {
        clearAutoplay();
        onSelectProject(project);
      }
    },
    [clearAutoplay, handleManualNavigation, onSelectProject],
  );

  const cardItems = useMemo(() => {
    return projects.map((project, index) => {
      const variant = getVariantForIndex(index);
      const previousVariant = previousVariantsRef.current[project.id];
      previousVariantsRef.current[project.id] = variant;

      const { animate, transition } = getVariantAnimation(variant, previousVariant);

      const isHidden = isHiddenVariant(variant);
      const isCenter = isCenterVariant(variant);
      const isSelectedCard = selectedProjectId === project.id;
      const shouldHideForModal = Boolean(isSelectedCard && !revealOrigin);

      const handleClick = () => handleCardInteraction(variant, project);

      const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }

        event.preventDefault();
        handleCardInteraction(variant, project);
      };

      return (
        <motion.article
          key={project.id}
          ref={registerCardRef(project.id)}
          className="absolute top-0 h-full w-[60%] md:w-[55%] lg:w-[52%] xl:w-[48%]"
          style={{
            left: "50%",
            pointerEvents: isHidden || shouldHideForModal ? "none" : "auto",
          }}
          animate={animate}
          initial={previousVariant ? false : getInitialStyle(variant)}
          transition={transition}
          role={!isHidden ? "button" : undefined}
          tabIndex={!isHidden ? 0 : -1}
          aria-hidden={isHidden}
          onClick={!isHidden ? handleClick : undefined}
          onKeyDown={!isHidden ? handleKeyDown : undefined}
        >
          <FeaturedCarouselCard
            project={project}
            badgeLabel={badgeLabel}
            isCenter={isCenter}
            shouldHide={shouldHideForModal}
          />
        </motion.article>
      );
    });
  }, [
    badgeLabel,
    getVariantForIndex,
    handleCardInteraction,
    projects,
    registerCardRef,
    revealOrigin,
    selectedProjectId,
  ]);

  const hasMultipleProjects = totalProjects > 1;

  if (totalProjects === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="relative flex w-full justify-center overflow-visible"
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onFocusCapture={handleInteractionStart}
      onBlurCapture={handleBlurCapture}
      onKeyDown={handleContainerKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-live="polite"
      tabIndex={-1}
    >
      <div className="relative w-full md:w-[85%]  h-[300px] md:h-[380px] lg:h-[450px] xl:h-[500px]">
        {cardItems}
      </div>

      {hasMultipleProjects && (
        <div className="pointer-events-none absolute inset-y-0 flex w-full items-center justify-between px-2 md:px-6">
          <button
            type="button"
            onClick={() => handleManualNavigation(-1)}
            className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-900/70 text-white shadow-lg backdrop-blur transition duration-200 hover:scale-110 hover:border-white/40 hover:bg-slate-900/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 active:scale-90"
            aria-label="View previous project"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <span className="sr-only">View previous project</span>
          </button>

          <button
            type="button"
            onClick={() => handleManualNavigation(1)}
            className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-900/70 text-white shadow-lg backdrop-blur transition duration-200 hover:scale-110 hover:border-white/40 hover:bg-slate-900/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 active:scale-90"
            aria-label="View next project"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <span className="sr-only">View next project</span>
          </button>
        </div>
      )}
    </div>
  );
}
