"use client";

import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";

import { type TranslatedProject } from "@/data/projects/types";

import { ProjectModalBackdrop } from "./ProjectModalBackdrop";
import { ProjectModalContent } from "./ProjectModalContent";
import { ProjectModalShell } from "./ProjectModalShell";
import { useProjectModalTransition } from "./hooks/useProjectModalTransition";
import { useEffect } from "react";

interface ModalPortalProps {
  project: TranslatedProject;
  originRect: DOMRect;
  originEl?: HTMLElement;
  onRevealOrigin?: () => void;
  onClose: () => void;
}

export function ProjectModalPortal({
  project,
  originRect,
  originEl,
  onRevealOrigin,
  onClose,
}: ModalPortalProps) {
  const { controls, containerRef, closing, passThrough, handleClose } =
    useProjectModalTransition({
      originRect,
      originEl,
      onRevealOrigin,
      onClose,
    });

  useEffect(() => {
    // If closing, we want to unlock immediately, so do nothing (cleanup from previous run will handle it)
    if (closing) return;

    // 1. Calculate scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // 2. Add padding to body to prevent layout shift
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // 3. Lock scroll
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
      document.body.style.paddingRight = "";
    };
  }, [closing]);

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
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(portal, document.body);
}
