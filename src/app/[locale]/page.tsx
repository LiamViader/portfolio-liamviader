"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrainCircuit, Gamepad2, Sparkles, Workflow } from "lucide-react";
import { useInView } from "react-intersection-observer";
import PulseHexGridCanvas from "@/components/home/scene/PulseHexGridCanvas";
import { getProjectsByLocale, TranslatedProject } from "@/data/projects";
import { ScrollReveal } from "@/components/ScrollReveal";
import FeaturedProjects from "@/components/projects/featured/FeaturedProjects";

const buttonBaseClasses =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

const heroButtons = {
  primary: `${buttonBaseClasses} bg-sky-500/90 text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400`,
  secondary: `${buttonBaseClasses} inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-sky-400/60 hover:bg-sky-500/10`,
};

const highlightIcons = {
  ai: BrainCircuit,
  experience: Sparkles,
  games: Gamepad2,
};

const highlightListVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.22,
      delayChildren: 0.12,
    },
  },
};

const highlightCardVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 0.9],
    },
  },
};

export default function Home() {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const projects = getProjectsByLocale(locale)
    .filter((project) => project.is_featured) satisfies TranslatedProject[];

  const highlightItems: Array<{ key: keyof typeof highlightIcons; descriptionKey: string }> = [
    { key: "ai", descriptionKey: "highlights.items.ai.description" },
    { key: "experience", descriptionKey: "highlights.items.experience.description" },
    { key: "games", descriptionKey: "highlights.items.games.description" },
  ];

  const metricKeys: Array<"ai" | "systems" | "collaboration"> = ["ai", "systems", "collaboration"];
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12, rootMargin: "200px 0px 200px 0px" });
  return (
    <div className="flex flex-col bg-gray-900">
      <section className="relative overflow-hidden bg-gray-950/70 px-4 pb-14 pt-28 lg:py-34 shadow-[0_40px_50px_-40px_rgba(56,189,248,0.2)] mb-0">
        <PulseHexGridCanvas pixelsPerHex={40} gridType="Fill" s={75} hue={240} hueJitter={5} l={0}/>
        <PulseHexGridCanvas pixelsPerHex={40} hue={240} hueJitter={30} s={80}/>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.2),_transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/10 via-gray-950/60 to-gray-950" />
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-8 lg:gap-16 px-2 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="relative lg:ml-auto flex h-50 w-34 md:h-70 md:w-50 lg:h-90 lg:w-70 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-transparent via-sky-500/20 to-transparent p-[3px] shadow-[0_25px_70px_-40px_rgba(56,189,248,0.8)] ring-2 ring-white/40 hover:-translate-y-[1px] hover:shadow-[0_25px_100px_-40px_rgba(250,189,248,1)]"
          >
            <div className="absolute -inset-5 -z-12 rounded-full bg-sky-500/10 blur-3xl" aria-hidden />
            <div className="absolute -inset-5 z-11 rounded-full bg-sky-400/5 blur-3xl" aria-hidden />
            <div className="relative h-full w-full overflow-hidden rounded-full border border-white/20">
              <Image
                src="/images/test2_liam.png"
                alt="Portrait"
                fill
                sizes="(min-width: 1024px) 350px, (min-width: 768px) 280px, 200px"
                quality={95}
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

          <div className="flex w/full max-w-2xl flex-col items-center gap-8 lg:items-start">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70 backdrop-blur"
            >
              {t("hero.tagline")}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-balance text-4xl font-semibold tracking-tight text-white/95 sm:text-5xl md:text-6xl"
            >
              {t.rich("hero.title", {
                highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
              })}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="max-w-2xl text-pretty text-lg text-white/70 sm:text-xl"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="flex w-full flex-wrap justify-center gap-4 lg:justify-start"
            >
              <Link href="/projects" className={heroButtons.primary}>
                {t("hero.ctaProjects")}
              </Link>
              <Link href="/contact" className={heroButtons.secondary}>
                {t("hero.ctaContact")}
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="relative z-10 mx-auto max-w-6xl w-full pt-15 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="z-10 text-sm font-medium uppercase tracking-[0.3em] text-white/50"
          >
            {t("hero.availability")}
          </motion.p>
        </div>


        <motion.ul
          className="mx-auto grid w-full max-w-6xl gap-4 pt-10 text-left sm:grid-cols-3"
        >
            {metricKeys.map((metricKey) => (
              <motion.li
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                key={metricKey}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg transition hover:border-sky-400/60 hover:bg-sky-500/10"
              >
                <p className="text-2xl font-semibold text-white">
                  {t(`metrics.${metricKey}.value`)}
                </p>
                <p className="mt-2 text-sm text-white/60">
                  {t(`metrics.${metricKey}.label`)}
                </p>
              </motion.li>
            ))}
          </motion.ul>
      </section>

      <section className="relative px-4 py-14 bg-black/10 border-y border-white/10 ">
        <PulseHexGridCanvas pixelsPerHex={25} gridType="Fill" s={80} hue={240} hueJitter={10} l={25}/>
        <PulseHexGridCanvas pixelsPerHex={25} hue={240} hueJitter={30} s={100} l={60} gridType="Trails" trailCount={30} fadeSeconds={4}/>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-90/10 via-gray-950/60 to-sky-900/10" />
        
        <div className="relative mx-auto flex max-w-5xl flex-col gap-8 text-center md:text-left">
          <motion.div
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={{
              hidden: { opacity: 0, x: 200 },
              show: { opacity: 1, x: 0, 
              transitionEnd: { transform: "none" } },
            }}
            ref={ref}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("highlights.title")}</h2>
            <p className="mt-3 text-balance text-base text-white/65 md:max-w-2xl">
              {t("highlights.description")}
            </p>
          </motion.div>
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            variants={highlightListVariants}
            className="grid gap-6 md:grid-cols-3"
          >
            {highlightItems.map(({ key, descriptionKey }) => {
              const Icon = highlightIcons[key];
              return (
                <li key={key} className="h-full">
                  <motion.article
                    variants={highlightCardVariants}
                    className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur transition hover:-translate-y-1 hover:border-sky-400/60 hover:bg-sky-500/10"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-500/5 blur-3xl transition group-hover:bg-sky-400/10" />
                    <Icon className="h-8 w-8 text-sky-300" />
                    <h3 className="mt-4 text-xl font-semibold text-white">
                      {t(`highlights.items.${key}.title`)}
                    </h3>
                    <p className="mt-3 text-sm text-white/65">
                      {t(descriptionKey)}
                    </p>
                  </motion.article>
                </li>
              );
            })}
          </motion.ul>
        </div>
      </section>

      <section className="relative px-4 pt-12 pb-20 lg:py-28">
        <PulseHexGridCanvas pixelsPerHex={40} gridType="Fill" s={75} hue={240} hueJitter={5} l={0}/>
        <PulseHexGridCanvas pixelsPerHex={40} hue={240} hueJitter={30} s={40} l={25} gridType="Strata"/>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-[rgba(56,189,248,0.02)] to-gray-950" />
        <ScrollReveal noOpacity distance={100}>
          <div className="relative mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(100px,1.1fr)_minmax(60%,0.9fr)] lg:items-start lg:gap-10">
              <div className="flex flex-col gap-6 text-center lg:text-left pl-3">
                <div className="space-y-4 mt-10">
                  <h2 className="text-3xl font-semibold text-white md:text-4xl">
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
                    <Workflow className="ml-1 h-4 w-4" />
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
                    cardClassName: "!w-[47%] md:!w-[39%] lg:!w-[37%] xl:!w-[38%]",
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
                    <Workflow className="ml-1 h-4 w-4" />
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
