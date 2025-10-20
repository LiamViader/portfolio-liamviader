import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TranslatedProject } from "@/data/projects";

import {
  CarouselVariant,
  getInitialStyle,
  getVariantAnimation,
  isCenterVariant,
  isHiddenVariant,
  DUR_ENTER_CENTER_MS,
} from "./carouselAnimations";
import { FeaturedCarouselCard } from "./FeaturedCarouselCard";

export interface FeaturedCarouselLayoutOptions {
  containerClassName?: string;
  viewportClassName?: string;
  cardClassName?: string;
  controlsContainerClassName?: string;
  controlButtonClassName?: string;
}

interface FeaturedCarouselProps {
  projects: TranslatedProject[];
  onSelectProject: (project: TranslatedProject) => void;
  registerCardRef: (projectId: number) => (node: HTMLElement | null) => void;
  selectedProjectId?: number;
  revealOrigin: boolean;
  layout?: FeaturedCarouselLayoutOptions;
}

export function FeaturedCarousel({
  projects,
  onSelectProject,
  registerCardRef,
  selectedProjectId,
  revealOrigin,
  layout,
}: FeaturedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalProjects = projects.length;
  const previousVariantsRef = useRef<Record<string, CarouselVariant | undefined>>({});
  const hasSelectedProject = selectedProjectId !== undefined;

  useEffect(() => {
    if (totalProjects === 0) return;
    setActiveIndex((current) => current % totalProjects);
  }, [totalProjects]);

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
      setActiveIndex((idx) => (idx + 1) % totalProjects);
      // Overlay desde el inicio de cada pase de autoplay
      startMaskForAnimation(DUR_ENTER_CENTER_MS);
    }, 5000);
  }, [clearAutoplay, hasSelectedProject, totalProjects]);

  useEffect(() => {
    scheduleAutoplay();
    return () => {
      clearAutoplay();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleAutoplay, clearAutoplay]);

  const handleManualNavigation = useCallback(
    (direction: 1 | -1) => {
      if (totalProjects <= 1) return;

      clearAutoplay();
      setActiveIndex((idx) => (idx + direction + totalProjects) % totalProjects);

      // Overlay desde que empieza la animación
      startMaskForAnimation(DUR_ENTER_CENTER_MS);

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

  const getVariantForIndex = useCallback(
    (index: number): CarouselVariant => {
      if (totalProjects <= 1) return "center";

      const forwardDistance = (index - activeIndex + totalProjects) % totalProjects;
      const backwardDistance = (activeIndex - index + totalProjects) % totalProjects;

      if (forwardDistance === 0) return "center";
      if (backwardDistance === 1) return "left";
      if (forwardDistance === 1) return "right";
      if (forwardDistance < backwardDistance) return "hiddenRight";
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

  /** ---------------- Overlay anti-hover “fantasma” ---------------- */

  // Mostrar/ocultar
  const [showHoverMask, setShowHoverMask] = useState(false);

  // Control robusto de timers (evita carreras y overlays pegados)
  const maskCycleRef = useRef(0);
  const maskTimeoutRef = useRef<number | null>(null);
  const maskFailsafeRef = useRef<number | null>(null);

  const MASK_RATIO = 0.50;
  const MASK_FAILSAFE_MS = 200;

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

  // 1-frame overlay para “refresh” inmediato del hover (lo usamos al volver de una pestaña)
  const refreshHoverOneFrame = useCallback(() => {
    setShowHoverMask(true);
    requestAnimationFrame(() => setShowHoverMask(false));
  }, []);

  // Arranca overlay y programa su retirada a 75% + failsafe
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

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      clearMaskTimers();
    };
  }, [clearMaskTimers]);

  // Robustez al cambiar de pestaña / ventana
  useEffect(() => {
    const handleHidden = () => {
      clearMaskTimers();
      setShowHoverMask(false);
      clearAutoplay();
    };
    const handleVisible = () => {
      // Reprograma autoplay y refresca hover
      scheduleAutoplay();
      refreshHoverOneFrame();
    };
    const onVisChange = () => {
      if (typeof document === "undefined") return;
      if (document.hidden) handleHidden();
      else handleVisible();
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", onVisChange);
    }
    if (typeof window !== "undefined") {
      window.addEventListener("blur", handleHidden);
      window.addEventListener("focus", handleVisible);
    }

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVisChange);
      }
      if (typeof window !== "undefined") {
        window.removeEventListener("blur", handleHidden);
        window.removeEventListener("focus", handleVisible);
      }
    };
  }, [clearAutoplay, scheduleAutoplay, refreshHoverOneFrame, clearMaskTimers]);

  /** --------------------------------------------------------------- */

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

  // Subimos el z-index de los controles para que NUNCA los tape el overlay
  const controlsContainerClassName = clsx(
    "pointer-events-none absolute inset-y-0 flex w-full items-center justify-between px-2 md:px-6 z-[80]",
    layout?.controlsContainerClassName,
  );

  const controlButtonClassName = clsx(
    "pointer-events-auto cursor-pointer inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/[0.07] text-white shadow-lg transition duration-200 hover:scale-110 hover:border-sky-400/60 hover:bg-sky-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 active:scale-90",
    layout?.controlButtonClassName,
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
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        handleCardInteraction(variant, project);
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
          animate={animate}
          initial={previousVariant ? false : getInitialStyle(variant)}
          transition={transition}
          role={!isHidden ? "button" : undefined}
          tabIndex={!isHidden ? 0 : -1}
          aria-hidden={isHidden}
          onClick={!isHidden ? handleClick : undefined}
          onKeyDown={!isHidden ? handleKeyDown : undefined}
          // Backup: si por cualquier motivo acabara una animación y la máscara sigue, la quitamos.
          onAnimationComplete={() => setShowHoverMask(false)}
        >
          <FeaturedCarouselCard
            project={project}
            isCenter={isCenter}
            dimmed={!isCenter}
            shouldHide={shouldHideForModal}
          />
        </motion.article>
      );
    });
  }, [
    getVariantForIndex,
    handleCardInteraction,
    projects,
    registerCardRef,
    revealOrigin,
    selectedProjectId,
    cardClassName,
  ]);

  const hasMultipleProjects = totalProjects > 1;

  if (totalProjects === 0) return null;

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
        <div className={controlsContainerClassName}>
          <button
            type="button"
            onClick={() => handleManualNavigation(1)}
            className={controlButtonClassName}
            aria-label="View previous project"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">View previous project</span>
          </button>

          <button
            type="button"
            onClick={() => handleManualNavigation(-1)}
            className={controlButtonClassName}
            aria-label="View next project"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">View next project</span>
          </button>
        </div>
      )}
    </div>
  );
}
