"use client";

import { useCallback, useMemo, useRef } from "react";

import { useTranslations } from "next-intl";

import { TranslatedProject } from "@/data/projects";
import { measureStableRect } from "@/utils/measureStableRect";

import { ProjectModalPortal } from "../modal/ProjectModalPortal";
import { useProjectSelection } from "../grid/hooks/useProjectSelection";
import { FeaturedCarousel } from "./FeaturedCarousel";
import FeaturedProjects from "./FeaturedProjects";

interface FeaturedProjectsProps {
  projects: TranslatedProject[];
}

export default function FeaturedProjectsSection({ projects }: FeaturedProjectsProps) {
  const t = useTranslations("ProjectsPage");

  return (
    <section className="relative px-4 py-30">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-300/8 to-transparent" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("featured_title")}</h2>
          <p className="mx-auto max-w-2xl text-balance text-base text-white/65">
            {t("featured_description")}
          </p>
        </div>

        <FeaturedProjects projects={projects}/>
      </div>
    </section>
  );
}
