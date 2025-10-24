"use client";

import { easeIn, easeOut, motion, type Variants } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrainCircuit, Gamepad2, Workflow, Sparkles } from "lucide-react";
import { useInView } from "react-intersection-observer";
import PulseHexGridCanvas from "@/components/home/scene/PulseHexGridCanvas";
import { getProjectsByLocale, TranslatedProject } from "@/data/projects";
import { ScrollReveal } from "@/components/ScrollReveal";
import FeaturedProjects from "@/components/projects/featured/FeaturedProjects";
import { InfoCard } from "@/components/home/InfoCard";
import { HeroImage } from "@/components/home/HeroImage";
import { HeroSection } from "@/components/home/HeroSection";


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
        <PulseHexGridCanvas pixelsPerHex={40} hue={240} hueJitter={30} s={80}/>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.2),_transparent_65%)]" />
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
            transition={{ delay: 1.45, duration: 0.7 }}
            className="z-10 text-lg font-medium uppercase tracking-[0.3em] text-white/70"
          >
            {t("work_section.title")}
          </motion.p>
        

          <motion.ul
            variants={{
              hidden: {opacity: 1},
              show: {
                opacity: 1,
                transition: { delayChildren: 1.55, staggerChildren: 0.15, when: "beforeChildren" }
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

      <section className="relative px-2 md:px-6 pt-10 sm:pt-20 lg:pt-22 xl:pt-28 pb-40">
        <PulseHexGridCanvas pixelsPerHex={40} gridType="Fill" s={75} hue={240} hueJitter={5} l={0}/>
        <PulseHexGridCanvas pixelsPerHex={40} hue={240} hueJitter={30} s={40} l={25} gridType="Strata"/>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-[rgba(56,189,248,0.02)] to-gray-950" />
        <ScrollReveal distance={-100} lateral duration={0.8}>
          <div className="relative mx-auto max-w-[1400px]">
            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
              <div className="flex flex-col gap-6 text-center lg:text-left pl-3">
                <div className="space-y-4 mt-10">
                  <h2 className="font-semibold text-white text-3xl md:text-4xl xl:text-5xl whitespace-nowrap">
                    {t("projects.title")}
                  </h2>
                  <p className=" text-base text-white/65 lg:max-w-xl">
                    {t("projects.description")}
                  </p>
                </div>
                <div className="hidden lg:flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                  <Link
                    href="/projects"
                    className="inline-flex items-center justify-center rounded-full bg-sky-500/90 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                  >
                    {t("projects.viewAll")}
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-sky-400/60 hover:bg-sky-500/10"
                  >
                    {t("hero.ctaContact")}
                  </Link>
                </div>
              </div>
              <div className="lg:col-start-2 lg:flex lg:justify-end">
                <FeaturedProjects
                  projects={projects}
                  className="max-w-full"
                  contentClassName="justify-center"
                  carouselLayout={{
                    containerClassName: "!w-full",
                    viewportClassName:
                      "!h-[310px] md:!h-[390px] lg:!h-[390px] xl:!h-[410px] !w-full",
                    cardClassName: "!w-[47%] sm:!w-[40%] md:!w-[39%] lg:!w-[37%] xl:!w-[38%]",
                    controlsContainerClassName: "",
                  }}
                  carouselTypography={{
                    titleClassName: "text-2xl",
                    descriptionClassName: "text-sm",
                    tagClassName: "text-[10px]"
                  }}
                />
              </div>
              <div className="lg:hidden pt-5 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                  <Link
                    href="/projects"
                    className="inline-flex items-center justify-center rounded-full bg-sky-500/90 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                  >
                    {t("projects.viewAll")}
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-sky-400/60 hover:bg-sky-500/10"
                  >
                    {t("hero.ctaContact")}
                  </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>


    </div>
  );
}
