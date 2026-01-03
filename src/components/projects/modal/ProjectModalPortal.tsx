"use client";

import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";

import { type TranslatedProject } from "@/data/projects/types";

import { ProjectModalBackdrop } from "./ProjectModalBackdrop";
import { ProjectModalContent } from "./ProjectModalContent";
import { ProjectModalShell } from "./ProjectModalShell";
import { useProjectModalTransition } from "./hooks/useProjectModalTransition";
import { useEffect, useRef } from "react";
import ProjectCard from "../card/ProjectCard";
import { FeaturedCarouselCard } from "../featured/FeaturedCarouselCard";
import { type FeaturedCarouselTypographyOptions } from "../featured/FeaturedCarousel";

interface ModalPortalProps {
  project: TranslatedProject;
  originRect: DOMRect;
  originEl?: HTMLElement;
  onRevealOrigin?: () => void;
  onClose: () => void;
  ghostCardType?: "grid" | "carousel";
  backgroundColor?: string;
  carouselTypography?: FeaturedCarouselTypographyOptions;
}

export function ProjectModalPortal({
  project,
  originRect,
  originEl,
  onRevealOrigin,
  onClose,
  ghostCardType = "grid",
  backgroundColor,
  carouselTypography,
}: ModalPortalProps) {
  const ghostCardRef = useRef<HTMLDivElement>(null!);

  const { controls, containerRef, closing, passThrough, handleClose } =
    useProjectModalTransition({
      originRect,
      originEl,
      ghostCardRef, // Pass ref to hook
      onRevealOrigin,
      onClose,
    });

  useEffect(() => {
    // 1. Calculate scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // 2. Add padding to body to prevent layout shift
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.setProperty("--scrollbar-gap", `${scrollbarWidth}px`);

    // 3. Lock scroll
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
      document.body.style.paddingRight = "";
      document.body.style.removeProperty("--scrollbar-gap");
    };
  }, []);

  const portal = (
    <AnimatePresence mode="wait">
      <ProjectModalBackdrop
        key="modal-backdrop"
        closing={closing}
        passThrough={passThrough}
        onClose={handleClose}
      />
      <ProjectModalShell
        key={`modal-shell-${project.id}`}
        projectId={project.id}
        containerRef={containerRef}
        controls={controls}
        passThrough={passThrough}
      >
        <ProjectModalContent
          key={`modal-content-${project.id}`}
          project={project}
          closing={closing}
          onClose={handleClose}
        />
      </ProjectModalShell>

      {/* Ghost Card for Closing Animation */}
      <div
        ref={ghostCardRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: originRect.width,
          height: originRect.height,
          opacity: 0,
          zIndex: 9999999,
          pointerEvents: "none",
          transformOrigin: "top left",
        }}
      >
        {ghostCardType === "carousel" ? (
          <FeaturedCarouselCard
            project={project}
            isCenter={true}
            shouldHide={false}
            introAnimationEnabled={false}
            useTransparent={false}
            backgroundColor={backgroundColor}
            titleClassName={carouselTypography?.titleClassName}
            descriptionClassName={carouselTypography?.descriptionClassName}
            tagClassName={carouselTypography?.tagClassName}
            disableHover={true}
          />
        ) : (
          <ProjectCard
            project={project}
            onSelect={() => { }}
            isHidden={false}
            useTransparent={false} // Match grid look
            backgroundColor={backgroundColor}
          />
        )}
      </div>

    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(portal, document.body);
}
