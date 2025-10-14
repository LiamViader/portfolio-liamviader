"use client";

import { useCallback, useMemo, useRef } from "react";

import { useTranslations } from "next-intl";

import { TranslatedProject } from "@/data/projects";
import { measureStableRect } from "@/utils/measureStableRect";

import { ProjectModalPortal } from "../modal/ProjectModalPortal";
import { useProjectSelection } from "../grid/hooks/useProjectSelection";
import { FeaturedCarousel } from "./FeaturedCarousel";

interface FeaturedProjectsProps {
  projects: TranslatedProject[];
}

type CardRegistry = Map<number, HTMLElement>;

type CardRefRegister = (projectId: number) => (node: HTMLElement | null) => void;

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
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
    <section className="py-24 px-4 md:px-8 w-full mx-auto mb-16">
      <h2 className="text-3xl md:text-5xl font-extrabold mb-20 tracking-tight text-center">
        {t("featured_title")}
      </h2>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="hidden md:block h-64 w-3/4 max-w-4xl rounded-full bg-gradient-to-r from-indigo-500/30 via-fuchsia-500/30 to-cyan-500/30 blur-3xl" />
        </div>

        <FeaturedCarousel
          projects={featuredProjects}
          badgeLabel={t("featured_badge")}
          onSelectProject={openProjectDetails}
          registerCardRef={registerCardRef}
          selectedProjectId={selectedProjectId}
          revealOrigin={revealOrigin}
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
