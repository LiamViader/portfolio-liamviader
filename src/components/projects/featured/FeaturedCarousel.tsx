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
  registerCardRef: (projectId: string) => (node: HTMLElement | null) => void;
  selectedProjectId?: string;
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

  const totalProjects = projects.length;
  const previousVariantsRef = useRef<Record<string, CarouselVariant | undefined>>({});

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

  const handleCardInteraction = useCallback(
    (variant: CarouselVariant, project: TranslatedProject) => {
      if (variant === "left") {
        goToPrevious();
        return;
      }

      if (variant === "right") {
        goToNext();
        return;
      }

      if (variant === "center") {
        onSelectProject(project);
      }
    },
    [goToNext, goToPrevious, onSelectProject],
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

  if (totalProjects === 0) {
    return null;
  }

  return (
    <div className="relative flex w-full justify-center overflow-visible">
      <div className="relative w-full md:w-[85%]  h-[300px] md:h-[380px] lg:h-[450px] xl:h-[500px]">
        {cardItems}
      </div>
    </div>
  );
}
