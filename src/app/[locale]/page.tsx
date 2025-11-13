"use client";

import { easeIn, easeOut, motion, type Variants } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { BrainCircuit, Gamepad2, Workflow, Sparkles } from "lucide-react";
import PulseHexGridCanvas from "@/components/home/scene/PulseHexGridCanvas";
import { getProjectsByLocale, TranslatedProject } from "@/data/projects";
import { InfoCard } from "@/components/home/InfoCard";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProjectsHomeSection } from "@/components/home/FeaturedProjectsHomeSection";
import { BASE_DELAY_ENTRANCE } from "@/utils/constants";


const icons = {
  BrainCircuit,
  Gamepad2,
  Workflow,
};

export default function Home() {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const projects = getProjectsByLocale(locale)
    .filter((project) => project.is_featured) satisfies TranslatedProject[];

  const metricKeys: Array<"ai" | "videogames" | "system_design"> = ["ai", "videogames", "system_design"];
  return (
    <div className="flex flex-col bg-gray-900">
      <section className="relative overflow-hidden bg-gray-950/70 px-4 md:px-8 pb-14 pt-28 lg:py-34 shadow-[0_40px_50px_-40px_rgba(56,189,248,0.2)] mb-0 md:min-h-[900px]">
        <PulseHexGridCanvas pixelsPerHex={40} gridType="Fill" s={75} hue={240} hueJitter={5} l={0}/>
        <PulseHexGridCanvas pixelsPerHex={40} hue={240} hueJitter={30} s={60}/>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.1),_transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/10 via-gray-950/60 to-gray-950" />

        <HeroSection 
          title={t.rich("hero.title", {
            highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
          })}
          subtitle={t("hero.subtitle")} 
          contactButtonText={t("hero.ctaContact")} 
          projectsButtonText={t("hero.ctaProjects")}
        />


        <div className="relative z-10 mx-auto pt-20 max-w-6xl w-full pt-15 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.7 }}
            className="z-10 text-lg font-medium uppercase tracking-[0.3em] text-white/70"
          >
            {t("work_section.title")}
          </motion.p>
        

          <motion.ul
            variants={{
              hidden: {opacity: 1},
              show: {
                opacity: 1,
                transition: { delayChildren: BASE_DELAY_ENTRANCE+0.4, staggerChildren: 0.15, when: "beforeChildren" }
              }
            }}
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
                />
              )
            })}
          </motion.ul>
        </div>
      </section>

      <section className="relative px-2 md:px-6 pt-10 sm:pt-20 lg:pt-22 xl:pt-28 pb-40 bg-gray-950/70 ">
        <PulseHexGridCanvas pixelsPerHex={40} gridType="Fill" s={75} hue={240} hueJitter={5} l={0}/>
        <PulseHexGridCanvas pixelsPerHex={40} hue={240} hueJitter={30} s={60}/>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(125,211,252,0.05),_transparent_85%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_rgba(125,211,252,0.05),_transparent_85%)]" />
        
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950/15 to-gray-950" />

        <FeaturedProjectsHomeSection title={t("projects.title")} description={t("projects.description")} contactButtonText={t("hero.ctaContact")} projectsButtonText={t("projects.viewAll")} projects={projects}/>
      </section>


    </div>
  );
}
