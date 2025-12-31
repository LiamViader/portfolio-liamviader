"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import clsx from "clsx";
import { motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type TranslatedProject } from "@/data/projects/types";

import {
  CarouselVariant,
  getInitialStyle,
  getVariantAnimationFromTo,
  isCenterVariant,
  isHiddenVariant,
  DUR_ENTER_CENTER_MS,
} from "./carouselAnimations";
import { FeaturedCarouselCard } from "./FeaturedCarouselCard";


const ctrlLeft: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.7)",
    transition: {
      opacity: { duration: 0.8, ease: "easeOut", delay: 0.5 },
      x: { duration: 0.8, ease: "easeOut", delay: 0.5 },
      backgroundColor: { duration: 0.3 },
      borderColor: { duration: 0.3 },
      color: { duration: 0.3 }
    }
  },
  hover: {
    scale: 1.05,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "rgba(255,255,255,0.3)",
    color: "rgba(255,255,255,1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.2)",
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
};

const ctrlRight: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.7)",
    transition: {
      opacity: { duration: 0.8, ease: "easeOut", delay: 0.5 },
      x: { duration: 0.8, ease: "easeOut", delay: 0.5 },
      backgroundColor: { duration: 0.3 },
      borderColor: { duration: 0.3 },
      color: { duration: 0.3 }
    }
  },
  hover: {
    scale: 1.05,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderColor: "rgba(255,255,255,0.3)",
    color: "rgba(255,255,255,1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.2)",
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
};

const dotsVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      delay: 0.2
    }
  }
};

export interface FeaturedCarouselLayoutOptions {
  containerClassName?: string;
  viewportClassName?: string;
  cardClassName?: string;
  controlsContainerClassName?: string;
  controlButtonClassName?: string;
}

export interface FeaturedCarouselTypographyOptions {
  titleClassName?: string;
  descriptionClassName?: string;
  tagClassName?: string;
}

interface FeaturedCarouselProps {
  projects: TranslatedProject[];
  onSelectProject: (project: TranslatedProject) => void;
  registerCardRef: (projectId: number) => (node: HTMLElement | null) => void;
  selectedProjectId?: number;
  revealOrigin: boolean;
  layout?: FeaturedCarouselLayoutOptions;
  typography?: FeaturedCarouselTypographyOptions;
  introStart?: boolean;
  introAnimationEnabled?: boolean;
  variant?: "stack" | "peek";
  useTransparent?: boolean;
  backgroundColor?: string;
}

function getIntroOrder(nextVariant: CarouselVariant): number {
  switch (nextVariant) {
    case "center": return 0;
    case "right": return 1;
    case "left": return 2;
    case "hiddenRight": return 3;
    case "hiddenLeft": return 4;
    case "hiddenCenter": return 5;
    default: return 6;
  }
}

export function FeaturedCarousel({
  projects,
  onSelectProject,
  registerCardRef,
  selectedProjectId,
  revealOrigin,
  layout,
  typography,
  introStart,
  introAnimationEnabled = true,
  variant = 'stack',
  useTransparent,
  backgroundColor,
}: FeaturedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollDir, setScrollDir] = useState<1 | -1>(1);

  const prevActiveIndexRef = useRef<number>(0);
  const prevScrollDirRef = useRef<1 | -1>(1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isDraggingRef = useRef(false);

  const totalProjects = projects.length;
  const hasSelectedProject = selectedProjectId !== undefined;

  useEffect(() => {
    if (totalProjects === 0) return;
    setActiveIndex((current) => current % totalProjects);
    prevActiveIndexRef.current = 0;
    prevScrollDirRef.current = 1;
  }, [totalProjects]);

  const [showHoverMask, setShowHoverMask] = useState(false);
  const [visibilityTick, setVisibilityTick] = useState(0);
  const maskCycleRef = useRef(0);
  const maskTimeoutRef = useRef<number | null>(null);
  const maskFailsafeRef = useRef<number | null>(null);

  const MASK_RATIO = 0.5;
  const MASK_FAILSAFE_MS = 200;

  const introSuppressedOnceRef = useRef(false);

  useEffect(() => {
    if (introStart && !introSuppressedOnceRef.current) {
      introSuppressedOnceRef.current = true;
    }
  }, [introStart]);

  const clearMaskTimers = useCallback(() => {
    if (maskTimeoutRef.current) {
      window.clearTimeout(maskTimeoutRef.current);
      maskTimeoutRef.current = null;
    }
    if (maskFailsafeRef.current) {
      window.clearTimeout(maskFailsafeRef.current);
      maskFailsafeRef.current = null;
    }
  }, []);

  const refreshHoverOneFrame = useCallback(() => {
    setShowHoverMask(true);
    requestAnimationFrame(() => setShowHoverMask(false));
  }, []);

  const startMaskForAnimation = useCallback(
    (totalMs: number) => {
      setShowHoverMask(true);
      clearMaskTimers();

      const myCycle = ++maskCycleRef.current;

      maskTimeoutRef.current = window.setTimeout(() => {
        if (myCycle === maskCycleRef.current) {
          setShowHoverMask(false);
          maskTimeoutRef.current = null;
        }
      }, Math.max(0, totalMs * MASK_RATIO));

      maskFailsafeRef.current = window.setTimeout(() => {
        if (myCycle === maskCycleRef.current) {
          setShowHoverMask(false);
          maskFailsafeRef.current = null;
        }
      }, totalMs + MASK_FAILSAFE_MS);
    },
    [clearMaskTimers],
  );

  useEffect(() => {
    return () => {
      clearMaskTimers();
    };
  }, [clearMaskTimers]);

  const clearAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const scheduleAutoplay = useCallback(() => {
    if (totalProjects <= 1 || hasSelectedProject) {
      clearAutoplay();
      return;
    }

    clearAutoplay();
    autoplayRef.current = setInterval(() => {
      setScrollDir(1);
      setActiveIndex((idx) => (idx + 1) % totalProjects);
      startMaskForAnimation(DUR_ENTER_CENTER_MS);
    }, 5000);
  }, [clearAutoplay, hasSelectedProject, totalProjects, startMaskForAnimation]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        maskCycleRef.current += 1;
        clearMaskTimers();
        setShowHoverMask(false);
        clearAutoplay();
        return;
      }

      prevActiveIndexRef.current = activeIndex;
      prevScrollDirRef.current = scrollDir;
      setVisibilityTick((tick) => tick + 1);
      refreshHoverOneFrame();
      scheduleAutoplay();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [activeIndex, scrollDir, clearAutoplay, clearMaskTimers, refreshHoverOneFrame, scheduleAutoplay]);


  useEffect(() => {
    scheduleAutoplay();
    return () => {
      clearAutoplay();
    };
  }, [scheduleAutoplay, clearAutoplay]);

  const handleManualNavigation = useCallback(
    (direction: 1 | -1) => {
      if (totalProjects <= 1) return;
      setScrollDir(direction);
      clearAutoplay();
      setActiveIndex((idx) => (idx + direction + totalProjects) % totalProjects);
      startMaskForAnimation(DUR_ENTER_CENTER_MS);
      scheduleAutoplay();
    },
    [clearAutoplay, scheduleAutoplay, totalProjects, startMaskForAnimation],
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
      if (active && containerRef.current.contains(active)) return;
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

  const computeVariant = useCallback(
    (index: number, activeIdx: number, n: number, dir: 1 | -1): CarouselVariant => {
      if (n <= 1) return "center";

      const fd = (index - activeIdx + n) % n;
      const bd = (activeIdx - index + n) % n;

      if (fd === 0) return "center";
      if (bd === 1) return "left";
      if (fd === 1) return "right";

      if (n === 4 && fd === 2) return "hiddenCenter";

      const half = Math.floor(n / 2);
      if (dir === 1) {
        if (fd >= 2 && fd <= half) return "hiddenRight";
        return "hiddenLeft";
      } else {
        if (bd >= 2 && bd <= half) return "hiddenLeft";
        return "hiddenRight";
      }
    },
    [],
  );

  const prevActive = prevActiveIndexRef.current;
  const prevDir = prevScrollDirRef.current;

  useEffect(() => {
    prevActiveIndexRef.current = activeIndex;
    prevScrollDirRef.current = scrollDir;
  }, [activeIndex, scrollDir]);

  const cardClassName = clsx(
    "absolute top-0 h-full w-[80%] sm:w-[40%] md:w-[42%] lg:w-[45%] xl:w-[48%]",
    layout?.cardClassName,
  );

  const containerClassName = clsx(
    "relative flex w-full justify-center overflow-visible touch-pan-y",
    layout?.containerClassName,
  );

  const viewportClassName = clsx(
    "relative w-full md:w-[85%] h-[310px] sm:h-[350px] md:h-[380px] lg:h-[450px] xl:h-[500px]",
    layout?.viewportClassName,
  );

  const controlsContainerClassName = clsx(
    "pointer-events-none absolute inset-y-0 flex w-full items-center justify-between px-2 md:px-6 z-[80]",
    layout?.controlsContainerClassName,
  );

  const controlButtonClassName = clsx(
    "pointer-events-auto cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm border border-transparent shadow-sm",
    layout?.controlButtonClassName,
  );

  const isPeekVariant = variant === 'peek';

  const cardItems = useMemo(() => {
    const n = totalProjects;

    const suppressParentIntro = introStart && !introSuppressedOnceRef.current;

    return projects.map((project, index) => {
      const prevVariant = computeVariant(index, prevActive, n, prevDir);
      const nextVariant = computeVariant(index, activeIndex, n, scrollDir);

      const { animate, transition } = suppressParentIntro
        ? { animate: getInitialStyle(nextVariant, isPeekVariant), transition: { duration: 0 } }
        : getVariantAnimationFromTo(nextVariant, prevVariant, isPeekVariant);

      const introOrder = getIntroOrder(nextVariant);
      const isHidden = isHiddenVariant(nextVariant);
      const isCenter = isCenterVariant(nextVariant);
      const isSelectedCard = selectedProjectId === project.id;
      const shouldHideForModal = Boolean(isSelectedCard && !revealOrigin);

      const handleClick = () => {
        if (isDraggingRef.current) return;
        if (nextVariant === "left") handleManualNavigation(-1);
        else if (nextVariant === "right") handleManualNavigation(1);
        else if (nextVariant === "center") {
          clearAutoplay();
          onSelectProject(project);
        }
      };

      const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        handleClick();
      };

      return (
        <motion.article
          key={project.id}
          ref={registerCardRef(project.id)}
          className={cardClassName}
          style={{
            left: "50%",
            pointerEvents: isHidden || shouldHideForModal ? "none" : "auto",
          }}
          data-visibility-bump={visibilityTick}
          initial={false}
          animate={animate}
          transition={transition}
          role={!isHidden ? "button" : undefined}
          tabIndex={!isHidden ? 0 : -1}
          aria-hidden={isHidden}
          onClick={!isHidden ? handleClick : undefined}
          onKeyDown={!isHidden ? handleKeyDown : undefined}
          onAnimationComplete={() => setShowHoverMask(false)}
        >
          <FeaturedCarouselCard
            project={project}
            isCenter={isCenter}
            shouldHide={shouldHideForModal}
            titleClassName={typography?.titleClassName}
            descriptionClassName={typography?.descriptionClassName}
            tagClassName={typography?.tagClassName}
            introStart={introStart}
            introOrder={introOrder}
            introAnimationEnabled={introAnimationEnabled}
            useTransparent={useTransparent}
            backgroundColor={backgroundColor}
          />
        </motion.article>
      );
    });
  }, [
    projects,
    totalProjects,
    introStart,
    activeIndex,
    scrollDir,
    prevActive,
    prevDir,
    cardClassName,
    registerCardRef,
    selectedProjectId,
    revealOrigin,
    typography?.titleClassName,
    typography?.descriptionClassName,
    typography?.tagClassName,
    handleManualNavigation,
    clearAutoplay,
    onSelectProject,
    visibilityTick,
    computeVariant,
    isPeekVariant,
    useTransparent,
    backgroundColor,
    introAnimationEnabled,
  ]);

  const hasMultipleProjects = totalProjects > 1;

  if (totalProjects === 0) return null;

  return (
    <motion.div
      ref={containerRef}
      className={clsx(containerClassName, "flex-col")}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onFocusCapture={handleInteractionStart}
      onBlurCapture={handleBlurCapture}
      onKeyDown={handleContainerKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-live="polite"
      tabIndex={-1}
      onPanStart={() => {
        isDraggingRef.current = true;
      }}
      onPanEnd={(e, info) => {
        // Simple threshold for swipe
        const SWIPE_THRESHOLD = 50;
        if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
          if (info.offset.x > 0) {
            handleManualNavigation(-1);
          } else {
            handleManualNavigation(1);
          }
        }
        // Small delay to prevent click from firing immediately after drag
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 50);
      }}
    >
      <div className="relative flex w-full justify-center">
        <div className={viewportClassName}>
          {showHoverMask && (
            <div
              aria-hidden
              role="presentation"
              className="absolute inset-0 z-[70] bg-transparent"
              style={{ pointerEvents: "auto", cursor: "auto" }}
            />
          )}
          {cardItems}
        </div>

        {hasMultipleProjects && !isPeekVariant && (
          <motion.div className={controlsContainerClassName}>
            <motion.button
              type="button"
              onClick={() => handleManualNavigation(-1)}
              className={controlButtonClassName}
              variants={ctrlLeft}
              initial={introAnimationEnabled ? "hidden" : "show"}
              animate={introAnimationEnabled && !introStart ? "hidden" : "show"}
              whileHover="hover"
              whileTap="tap"
              aria-label="View previous project"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">View previous project</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => handleManualNavigation(1)}
              className={controlButtonClassName}
              variants={ctrlRight}
              initial={introAnimationEnabled ? "hidden" : "show"}
              animate={introAnimationEnabled && !introStart ? "hidden" : "show"}
              whileHover="hover"
              whileTap="tap"
              aria-label="View next project"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">View next project</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Navigation Dots */}
      {hasMultipleProjects && (
        <motion.div
          className="mt-6 flex justify-center gap-2 z-[90]"
          variants={dotsVariants}
          initial={introAnimationEnabled ? "hidden" : "show"}
          animate={introAnimationEnabled && !introStart ? "hidden" : "show"}
        >
          {projects.map((_, idx) => (
            <div
              key={idx}
              className="group relative h-2 w-2 rounded-full bg-white/20 p-0"
              aria-hidden="true"
            >
              {idx === activeIndex && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
