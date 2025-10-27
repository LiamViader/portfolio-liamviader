import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import clsx from "clsx";
import { motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TranslatedProject } from "@/data/projects";

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
  hidden: { opacity: 0, x: 40 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.5 } },
  hover: {
    scale: 1.1,
    backgroundColor: "rgba(14,165,233,0.10)",
    borderColor: "rgba(14,165,233,0.60)",
    boxShadow: "0 10px 28px rgba(56,189,248,0.35)",
    transition: {
      type: "spring", 
      stiffness: 420, 
      damping: 26
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      type: "spring", 
      stiffness: 420, 
      damping: 26
    }
  }
};

const ctrlRight: Variants = {
  hidden: { opacity: 0, x: -40 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.7 } },
  hover: {
    scale: 1.1,
    backgroundColor: "rgba(14,165,233,0.10)",
    borderColor: "rgba(14,165,233,0.60)",
    boxShadow: "0 10px 28px rgba(56,189,248,0.35)",
    transition: {
      type: "spring", 
      stiffness: 420, 
      damping: 26
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      type: "spring", 
      stiffness: 420, 
      damping: 26
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
}

function getIntroOrder(nextVariant: CarouselVariant): number {
  switch (nextVariant) {
    case "center": return 0;
    case "right":  return 1;
    case "left":   return 2;
    case "hiddenRight": return 3;
    case "hiddenLeft":  return 4;
    case "hiddenCenter":return 5;
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
}: FeaturedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollDir, setScrollDir] = useState<1 | -1>(1);

  const prevActiveIndexRef = useRef<number>(0);
  const prevScrollDirRef = useRef<1 | -1>(1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalProjects = projects.length;
  const hasSelectedProject = selectedProjectId !== undefined;

  useEffect(() => {
    if (totalProjects === 0) return;
    setActiveIndex((current) => current % totalProjects);
    prevActiveIndexRef.current = 0;
    prevScrollDirRef.current = 1;
  }, [totalProjects]);

  const [showHoverMask, setShowHoverMask] = useState(false);
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
      setScrollDir(1); // autoplay avanza
      setActiveIndex((idx) => (idx + 1) % totalProjects);
      startMaskForAnimation(DUR_ENTER_CENTER_MS);
    }, 5000);
  }, [clearAutoplay, hasSelectedProject, totalProjects, startMaskForAnimation]);

  useEffect(() => {
    scheduleAutoplay();
    return () => {
      clearAutoplay();
    };
  }, [scheduleAutoplay, clearAutoplay]);

  /* ------------------- Handlers ------------------- */
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

  /* --------- Cálculo de variantes (determinista) --------- */
  const computeVariant = useCallback(
    (index: number, activeIdx: number, n: number, dir: 1 | -1): CarouselVariant => {
      if (n <= 1) return "center";

      const fd = (index - activeIdx + n) % n; // 0..n-1 hacia delante
      const bd = (activeIdx - index + n) % n; // 0..n-1 hacia atrás

      if (fd === 0) return "center";
      if (bd === 1) return "left";
      if (fd === 1) return "right";

      // n=4 → opuesta va a hiddenCenter
      if (n === 4 && fd === 2) return "hiddenCenter";

      // Con >4: apilamos en el lado de ENTRADA según dir (para garantizar hidden→lateral correcto)
      const half = Math.floor(n / 2);
      if (dir === 1) {
        // avanzando: cola por derecha; los que vienen por delante (fd >=2..half) se guardan en hiddenRight
        if (fd >= 2 && fd <= half) return "hiddenRight";
        return "hiddenLeft";
      } else {
        // retrocediendo: cola por izquierda
        if (bd >= 2 && bd <= half) return "hiddenLeft";
        return "hiddenRight";
      }
    },
    [],
  );

  // Guarda "frame anterior" (activeIndex + scrollDir) para animar prev→next
  const prevActive = prevActiveIndexRef.current;
  const prevDir = prevScrollDirRef.current;

  useEffect(() => {
    prevActiveIndexRef.current = activeIndex;
    prevScrollDirRef.current = scrollDir;
  }, [activeIndex, scrollDir]);

  /* ------------------- Clases ------------------- */
  const cardClassName = clsx(
    "absolute top-0 h-full w-[47%] md:w-[42%] lg:w-[45%] xl:w-[48%]",
    layout?.cardClassName,
  );

  const containerClassName = clsx(
    "relative flex w-full justify-center overflow-visible",
    layout?.containerClassName,
  );

  const viewportClassName = clsx(
    "relative w-full md:w-[85%] h-[300px] md:h-[380px] lg:h-[450px] xl:h-[500px]",
    layout?.viewportClassName,
  );

  const controlsContainerClassName = clsx(
    "pointer-events-none absolute inset-y-0 flex w-full items-center justify-between px-2 md:px-6 z-[80]",
    layout?.controlsContainerClassName,
  );

  const controlButtonClassName = clsx(
    "pointer-events-auto cursor-pointer inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/[0.07] text-white shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
    layout?.controlButtonClassName,
  );

  const cardItems = useMemo(() => {
    const n = totalProjects;

    const suppressParentIntro = introStart && !introSuppressedOnceRef.current;

    return projects.map((project, index) => {
      const prevVariant = computeVariant(index, prevActive, n, prevDir);
      const nextVariant = computeVariant(index, activeIndex, n, scrollDir);
      
      const { animate, transition } = suppressParentIntro
        ? { animate: getInitialStyle(nextVariant), transition: { duration: 0 } }
        : getVariantAnimationFromTo(nextVariant, prevVariant);

      const introOrder = getIntroOrder(nextVariant);
      const isHidden = isHiddenVariant(nextVariant);
      const isCenter = isCenterVariant(nextVariant);
      const isSelectedCard = selectedProjectId === project.id;
      const shouldHideForModal = Boolean(isSelectedCard && !revealOrigin);

      const handleClick = () => {
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
          // IMPORTANTE: siempre initial={false} y forzamos keyframes prev→next
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
          />
        </motion.article>
      );
    });
  }, [
    projects,
    totalProjects,
    activeIndex,
    scrollDir,
    prevActive,
    prevDir,
    registerCardRef,
    selectedProjectId,
    revealOrigin,
    cardClassName,
    typography?.titleClassName,
    typography?.descriptionClassName,
    typography?.tagClassName,
    handleManualNavigation,
    clearAutoplay,
    onSelectProject,
    introStart
  ]);

  const hasMultipleProjects = totalProjects > 1;

  if (totalProjects === 0) return null;

  console.log("Carousel", introStart);

  return (
    <div
      ref={containerRef}
      className={containerClassName}
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
      
      {hasMultipleProjects && (
        <motion.div 
          className={controlsContainerClassName}
        >
          <motion.button
            type="button"
            onClick={() => handleManualNavigation(1)}
            className={controlButtonClassName}
            variants={ctrlLeft}
            initial="hidden"
            animate={introStart ? "show" : "hidden"}
            whileHover='hover'
            whileTap='tap'
            aria-label="View previous project"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">View previous project</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => handleManualNavigation(-1)}
            className={controlButtonClassName}
            variants={ctrlRight}
            initial="hidden"
            animate={introStart ? "show" : "hidden"}
            whileHover='hover'
            whileTap='tap'
            aria-label="View next project"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">View next project</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
