"use client";

import { useCallback, useMemo, useRef } from "react";

import clsx from "clsx";
import { useTranslations } from "next-intl";

import { TranslatedProject } from "@/data/projects";
import { measureStableRect } from "@/utils/measureStableRect";

import { ProjectModalPortal } from "../modal/ProjectModalPortal";
import { useProjectSelection } from "../grid/hooks/useProjectSelection";
import {
  FeaturedCarousel,
  type FeaturedCarouselLayoutOptions,
} from "./FeaturedCarousel";

interface FeaturedProjectsProps {
  projects: TranslatedProject[];
  className?: string;
  contentClassName?: string;
  carouselLayout?: FeaturedCarouselLayoutOptions;
}

type CardRegistry = Map<number, HTMLElement>;

type CardRefRegister = (projectId: number) => (node: HTMLElement | null) => void;

export default function FeaturedProjects({
  projects,
  className,
  contentClassName,
  carouselLayout,
}: FeaturedProjectsProps) {
  const t = useTranslations("ProjectsPage");
  const featuredProjects = useMemo(
    () => projects.filter((project) => project.is_featured),
    [projects],
  );

  const { selected, revealOrigin, selectProject, closeProject, markOriginRevealed } = useProjectSelection();

  const cardRefs = useRef<CardRegistry>(new Map());

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

  const openProjectDetails = useCallback(
    (project: TranslatedProject) => {
      const element = cardRefs.current.get(project.id);

      if (!element) {
        return;
      }

      const rect = measureStableRect(element);
      selectProject(project, rect, element);
    },
    [selectProject],
  );

  const selectedProjectId = selected?.project.id;

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <section className={clsx("relative w-full", className)}>
      <div
        className={clsx(
          "relative flex w-full items-center justify-center",
          contentClassName,
        )}
      >
        <FeaturedCarousel
          projects={featuredProjects}
          onSelectProject={openProjectDetails}
          registerCardRef={registerCardRef}
          selectedProjectId={selectedProjectId}
          revealOrigin={revealOrigin}
          layout={carouselLayout}
        />
      </div>

      {selected && (
        <ProjectModalPortal
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
