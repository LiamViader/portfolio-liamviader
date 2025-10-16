"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrainCircuit, Gamepad2, Sparkles, Workflow } from "lucide-react";

import PulseHexGridCanvas from "@/components/home/scene/PulseHexGridCanvas";
import { getProjectsByLocale, TranslatedProject } from "@/data/projects";
import { ScrollReveal } from "@/components/ScrollReveal";


const buttonBaseClasses =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

const heroButtons = {
  primary: `${buttonBaseClasses} bg-sky-500/90 text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400`,
  secondary: `${buttonBaseClasses} border border-white/30 bg-white/10 text-white/90 hover:bg-white/20`,
};

const highlightIcons = {
  ai: BrainCircuit,
  experience: Sparkles,
  games: Gamepad2,
};

export default function Home() {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const projects = getProjectsByLocale(locale)
          .filter((project) => project.is_featured)
          .slice(0, 3) satisfies TranslatedProject[];

  const highlightItems: Array<{ key: keyof typeof highlightIcons; descriptionKey: string }> = [
    { key: "ai", descriptionKey: "highlights.items.ai.description" },
    { key: "experience", descriptionKey: "highlights.items.experience.description" },
    { key: "games", descriptionKey: "highlights.items.games.description" },
  ];

  const metricKeys: Array<"ai" | "systems" | "collaboration"> = ["ai", "systems", "collaboration"];

  return (
    <div className="flex flex-col bg-gray-900">
      <section className="relative overflow-hidden bg-gray-950/70 px-4 py-34 shadow-[0_40px_50px_-40px_rgba(56,189,248,0.45)] mb-0">
        <PulseHexGridCanvas pixelsPerHex={40} hue={240} hueJitter={30} s={80}/>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.3),_transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/10 via-gray-950/60 to-gray-950" />
        <ScrollReveal delay={1}>
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70 backdrop-blur"
            >
              {t("hero.tagline")}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl text-white/95"
            >
              {t.rich("hero.title", {
                      highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
              })}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="max-w-2xl text-pretty text-lg text-white/70 sm:text-xl"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link href="/projects" className={heroButtons.primary}>
                {t("hero.ctaProjects")}
              </Link>
              <Link href="/contact" className={heroButtons.secondary}>
                {t("hero.ctaContact")}
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-sm font-medium uppercase tracking-[0.3em] text-white/50"
            >
              {t("hero.availability")}
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid w-full gap-4 pt-6 text-left sm:grid-cols-3"
            >
              {metricKeys.map((metricKey) => (
                <li
                  key={metricKey}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg transition hover:border-sky-400/60 hover:bg-sky-500/10"
                >
                  <p className="text-2xl font-semibold text-white">
                    {t(`metrics.${metricKey}.value`)}
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    {t(`metrics.${metricKey}.label`)}
                  </p>
                </li>
              ))}
            </motion.ul>
          </div>
        </ScrollReveal>
      </section>

      <section className="relative px-4 py-24 bg-black/10 border-y border-white/10">
        <PulseHexGridCanvas pixelsPerHex={20} gridType="Fill" hue={240} hueJitter={10} l={1}/>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-90/10 via-gray-950/60 to-sky-900/20" />
        <ScrollReveal>
          <div className="relative mx-auto flex max-w-5xl flex-col gap-8 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("highlights.title")}</h2>
              <p className="mt-3 text-balance text-base text-white/65 md:max-w-2xl">
                {t("highlights.description")}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {highlightItems.map(({ key, descriptionKey }) => {
                const Icon = highlightIcons[key];
                return (
                  <div
                    key={key}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur transition hover:-translate-y-1 hover:border-sky-400/60 hover:bg-sky-500/10"
                  >
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-500/5 blur-3xl transition group-hover:bg-sky-400/10" />
                    <Icon className="h-8 w-8 text-sky-300" />
                    <h3 className="mt-4 text-xl font-semibold text-white">
                      {t(`highlights.items.${key}.title`)}
                    </h3>
                    <p className="mt-3 text-sm text-white/65">
                      {t(descriptionKey)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="relative px-4 py-24">
        <PulseHexGridCanvas pixelsPerHex={40} hue={240} hueJitter={10} s={80}/>
        <div className="z-0 absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.3),_transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950/60 to-gray-950" />
        <ScrollReveal>
          <div className="relative mx-auto flex max-w-6xl flex-col gap-10">
            <div className="flex flex-col gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
              <div>
                <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("projects.title")}</h2>
                <p className="mt-3 text-balance text-base text-white/65 md:max-w-2xl">
                        {t("projects.description")}
                </p>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-sky-400/60 hover:bg-sky-500/10"
              >
                {t("projects.viewAll")}
                <Workflow className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur transition hover:-translate-y-1 hover:border-sky-400/60 hover:bg-sky-500/10"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={project.media_preview}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
                    {project.is_featured && (
                      <span className="absolute left-4 top-4 rounded-full bg-sky-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
                        {t("projects.featuredBadge")}
                      </span>
                    )}
                  </div>
                  <div className="relative space-y-4 p-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/65">{project.short_description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-white/60">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/15 bg-white/5 px-3 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </ScrollReveal>
        <section className="px-4 pt-34 pb-10">
          <ScrollReveal>
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 p-10 text-center shadow-[0_20px_10px_-30px_rgba(56,189,248,0.6)] backdrop-blur">
              <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
              <div className="absolute -right-16 bottom-10 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("cta.title")}</h2>
                <p className="text-balance text-base text-white/70 md:text-lg">{t("cta.subtitle")}</p>
                <Link href="/contact" className={heroButtons.primary}>
                  {t("cta.button")}
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </section>


    </div>
  );
}
