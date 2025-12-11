"use client";

import { motion, type Variants } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { BrainCircuit, Gamepad2, Workflow } from "lucide-react";
import { getProjectsByLocale } from "@/data/projects/allProjects";
import { type TranslatedProject } from "@/data/projects/types";
import { InfoCard } from "@/components/home/InfoCard";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProjectsHomeSection } from "@/components/home/FeaturedProjectsHomeSection";
import { BASE_DELAY_ENTRANCE } from "@/utils/constants";
import PageLayout from "@/components/layout/PageLayout";
import PulseHexGridCanvas from "@/components/home/scene/PulseHexGridCanvas";
import { usePerformanceConfig } from "@/hooks/usePerformanceConfig";

const icons = {
  BrainCircuit,
  Gamepad2,
  Workflow,
};

const createTitleInfoCardsAnimation = (animated: boolean): Variants => ({
  hidden: { opacity: 0, y: animated ? 10 : 0 },
  show: {
    opacity: 1,
    y: 0,
    transition: animated
      ? { delay: BASE_DELAY_ENTRANCE + 0.45, duration: 0.7, ease: "easeOut" }
      : { delay: 0, duration: 0 },
  },
});

const createInfoCardsAnimation = (animated: boolean): Variants => ({
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: animated
      ? {
          delayChildren: BASE_DELAY_ENTRANCE + 0.4,
          staggerChildren: 0.15,
          when: "beforeChildren",
        }
      : {
          delayChildren: 0,
          staggerChildren: 0,
          when: "beforeChildren",
        },
  },
});

export default function Home() {

  const {entranceAnimationsEnabled, backgroundsOptimization} = usePerformanceConfig();

  const t = useTranslations("HomePage");
  const locale = useLocale();
  const projects = getProjectsByLocale(locale)
    .filter((project) => project.is_featured) satisfies TranslatedProject[];

  const metricKeys: Array<"ai" | "videogames" | "system_design"> = ["ai", "videogames", "system_design"];

  const titleInfoCardsAnimation = createTitleInfoCardsAnimation(entranceAnimationsEnabled);
  const infoCardsAnimation = createInfoCardsAnimation(entranceAnimationsEnabled);

  return (
    <PageLayout>
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-12 pb-16 pt-28 lg:pt-34 lg:pb-20">
        <PulseHexGridCanvas  gridType="Fill" s={50} l={30} hue={240} hueJitter={10} pixelsPerHex={40}/>
        <PulseHexGridCanvas  gridType="OverlapLine" s={60} l={0} hue={240} hueJitter={30} pixelsPerHex={40}/>
        <div className="inset-0 absolute bg-[linear-gradient(to_bottom,_rgba(3,7,18,0.1)_0%,_rgba(3,7,18,0.7)_50%,_rgb(3,7,18)_97%,_rgb(3,7,18)_100%)]"/>
        
        <HeroSection 
          title={t.rich("hero.title", {
            highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
          })}
          subtitle={t("hero.subtitle")} 
          contactButtonText={t("hero.ctaContact")} 
          aboutButtonText={t("hero.ctaAbout")}
          entranceAnimationEnabled={entranceAnimationsEnabled}
        />


        <div className="relative z-10 mx-auto max-w-6xl w-full pt-15 text-center">
          <motion.p
            variants={titleInfoCardsAnimation}
            initial="hidden"
            animate="show"
            className="z-10 text-base md:text-lg font-medium uppercase tracking-[0.3em] text-white/70"
          >
            {t("work_section.title")}
          </motion.p>
        

          <motion.ul
            variants={infoCardsAnimation}
            initial="hidden" 
            animate="show"
            className="mx-auto grid w-full max-w-6xl gap-4 pt-8 text-left sm:grid-cols-3"
          >
            {metricKeys.map((metricKey,index) => {
              const iconName = t(`work_section.${metricKey}.icon`);
              const IconComponent = icons[iconName as keyof typeof icons];
              return (
                <InfoCard
                  key={index}
                  title={t(`work_section.${metricKey}.value`)}
                  info={t(`work_section.${metricKey}.label`)}
                  icon={<IconComponent className="h-7 w-7 text-sky-300" />}
                  entranceAnimationEnabled={entranceAnimationsEnabled}
                />
              )
            })}
          </motion.ul>
        </div>
      </section>
      <section className="relative px-2 md:px-6 pt-10 lg:pt-20 pb-24 ">

        {
          (backgroundsOptimization === "normal") ?
          <>
            <PulseHexGridCanvas  gridType="Fill" s={50} l={30} hue={240} hueJitter={10} pixelsPerHex={40}/>
            <PulseHexGridCanvas  gridType="OverlapLine" s={60} l={0} hue={240} hueJitter={30} pixelsPerHex={40}/>
          </>
          :
          <div className="absolute inset-0 bg-slate-950"/>
        }


        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgb(3,7,18)_0%,_rgb(3,7,18)_3%,_rgba(3,7,18,0.3)_50%,_rgb(3,7,18)_100%)]"/>

        <FeaturedProjectsHomeSection 
          title={t("projects.title")} 
          description={t("projects.description")} 
          contactButtonText={t("hero.ctaContact")} 
          projectsButtonText={t("projects.viewAll")} 
          projects={projects}
          entranceAnimationEnabled={entranceAnimationsEnabled}
        />

      </section>
    </PageLayout>
  );
}
