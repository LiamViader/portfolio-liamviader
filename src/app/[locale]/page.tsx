"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { BrainCircuit, Gamepad2, Workflow } from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";
import { getProjectsByLocale, TranslatedProject } from "@/data/projects";
import { InfoCard } from "@/components/home/InfoCard";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProjectsHomeSection } from "@/components/home/FeaturedProjectsHomeSection";

const icons = {
  BrainCircuit,
  Gamepad2,
  Workflow,
};

const HOME_BACKGROUND_LAYERS = [
  {
    id: "base",
    gridType: "Fill" as const,
    pixelsPerHex: 40,
    hue: 232,
    hueJitter: 12,
    s: 78,
    l: 0,
  },
  {
    id: "glow",
    gridType: "Fill" as const,
    pixelsPerHex: 40,
    hue: 240,
    hueJitter: 28,
    s: 72,
    l: 16,
    className: "opacity-80",
  },
];

const HOME_BACKGROUND_OVERLAY = (
  <>
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.12),_transparent_60%)]" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gray-950/50 via-gray-950/20 to-gray-950/80" />
  </>
);

export default function Home() {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const projects = getProjectsByLocale(locale)
    .filter((project) => project.is_featured) satisfies TranslatedProject[];

  const metricKeys: Array<"ai" | "videogames" | "system_design"> = ["ai", "videogames", "system_design"];
  return (
    <PageLayout
      backgroundLayers={HOME_BACKGROUND_LAYERS}
      overlays={HOME_BACKGROUND_OVERLAY}
      contentClassName="flex flex-col"
    >
      <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-10 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950" />

        <HeroSection
          title={t.rich("hero.title", {
            highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
          })}
          subtitle={t("hero.subtitle")}
          contactButtonText={t("hero.ctaContact")}
          projectsButtonText={t("hero.ctaProjects")}
        />

        <div className="relative z-10 mx-auto mt-20 w-full max-w-6xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 0.7 }}
            className="text-lg font-medium uppercase tracking-[0.3em] text-white/70"
          >
            {t("work_section.title")}
          </motion.p>

          <motion.ul
            variants={{
              hidden: { opacity: 1 },
              show: {
                opacity: 1,
                transition: {
                  delayChildren: 1.45,
                  staggerChildren: 0.15,
                  when: "beforeChildren",
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="mx-auto grid w-full max-w-6xl gap-4 pt-8 text-left sm:grid-cols-3"
          >
            {metricKeys.map((metricKey, index) => {
              const iconName = t(`work_section.${metricKey}.icon`);
              const IconComponent = icons[iconName as keyof typeof icons];
              return (
                <InfoCard
                  key={index}
                  title={t(`work_section.${metricKey}.value`)}
                  info={t(`work_section.${metricKey}.label`)}
                  icon={<IconComponent className="h-7 w-7 text-sky-300" />}
                />
              );
            })}
          </motion.ul>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 pb-40 pt-16 sm:px-6 sm:pt-20 lg:px-10 lg:pt-24 xl:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(56,189,248,0.08),_transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_right,_rgba(56,189,248,0.06),_transparent_75%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950" />

        <FeaturedProjectsHomeSection
          title={t("projects.title")}
          description={t("projects.description")}
          contactButtonText={t("hero.ctaContact")}
          projectsButtonText={t("projects.viewAll")}
          projects={projects}
        />
      </section>
    </PageLayout>
  );
}
