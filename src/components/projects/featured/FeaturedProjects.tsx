"use client";

import { useCallback, useMemo, useRef } from "react";

import { useTranslations } from "next-intl";

import { TranslatedProject } from "@/data/projects";
import { measureStableRect } from "@/utils/measureStableRect";

import { ProjectModalPortal } from "../modal/ProjectModalPortal";
import { useProjectSelection } from "../grid/hooks/useProjectSelection";
import { FeaturedCarousel } from "./FeaturedCarousel";
import { ScrollReveal } from "../../ScrollReveal";

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
    <section className="relative px-4 py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-300/10 to-transparent" />
      <ScrollReveal delay={0.9} className="w-full">
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("featured_title")}</h2>
            <p className="mx-auto max-w-2xl text-balance text-base text-white/65">
              {t("featured_description")}
            </p>
          </div>

          <div className="relative flex w-full items-center justify-center">
            <FeaturedCarousel
              projects={featuredProjects}
              badgeLabel={t("featured_badge")}
              onSelectProject={openProjectDetails}
              registerCardRef={registerCardRef}
              selectedProjectId={selectedProjectId}
              revealOrigin={revealOrigin}
            />
          </div>
        </div>
      </ScrollReveal>

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
