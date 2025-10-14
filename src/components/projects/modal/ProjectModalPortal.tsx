"use client";

import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";

import { TranslatedProject } from "@/data/projects";

import { ProjectModalBackdrop } from "./ProjectModalBackdrop";
import { ProjectModalContent } from "./ProjectModalContent";
import { ProjectModalShell } from "./ProjectModalShell";
import { useProjectModalTransition } from "./hooks/useProjectModalTransition";

interface ModalPortalProps {
  project: TranslatedProject;
  originRect: DOMRect;
  originEl?: HTMLElement;
  onRevealOrigin?: () => void;
  onClose: () => void;
}

export function ProjectModalPortal({ project, originRect, originEl, onRevealOrigin, onClose }: ModalPortalProps) {
  const { controls, containerRef, closing, passThrough, handleClose } = useProjectModalTransition({
    originRect,
    originEl,
    onRevealOrigin,
    onClose,
  });

  const portal = (
    <AnimatePresence>
      <ProjectModalBackdrop closing={closing} passThrough={passThrough} onClose={handleClose} />
      <ProjectModalShell
        projectId={project.id}
        containerRef={containerRef}
        controls={controls}
        passThrough={passThrough}
      >
        <ProjectModalContent project={project} closing={closing} onClose={handleClose} />
      </ProjectModalShell>
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(portal, document.body);
}
