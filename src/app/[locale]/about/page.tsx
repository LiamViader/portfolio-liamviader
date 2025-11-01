"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";

import PulseHexGridCanvas from "@/components/home/scene/PulseHexGridCanvas";

type SectionKey =
  | "profile"
  | "thinking"
  | "stack"
  | "education"
  | "experience"
  | "personal"
  | "philosophy";

const sectionOrder: SectionKey[] = [
  "profile",
  "thinking",
  "stack",
  "education",
  "experience",
  "personal",
  "philosophy",
];

const listVariants: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.14,
    },
  },
};

const heroChildVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  const menuItems = useMemo(
    () =>
      sectionOrder.map((key) => ({
        id: key,
        title: t(`sections.${key}.title`),
        subtitle: t(`sections.${key}.subtitle`),
      })),
    [t]
  );

  const [activeSection, setActiveSection] = useState<SectionKey>(sectionOrder[0]);
  const activeIndex = sectionOrder.indexOf(activeSection);

  const goToIndex = (idx: number) => {
    const safe = Math.min(Math.max(idx, 0), sectionOrder.length - 1);
    setActiveSection(sectionOrder[safe]);
  };

  const goPrev = () => goToIndex(activeIndex - 1);
  const goNext = () => goToIndex(activeIndex + 1);

  const heroMeta = t.raw("hero.meta") as Record<string, string>;
  const heroChips = [heroMeta.age, heroMeta.location].filter(Boolean);

  const renderSectionContent = (section: SectionKey) => {
    switch (section) {
      case "profile": {
        const paragraphs = t.raw("sections.profile.paragraphs") as string[];
        return (
          <div className="space-y-5 text-base leading-relaxed text-white/75">
            {paragraphs.map((paragraph, index) => (
              <motion.p key={index} variants={itemVariants} className="text-pretty">
                {paragraph}
              </motion.p>
            ))}
          </div>
        );
      }
      case "thinking": {
        const intro = t("sections.thinking.intro");
        const pillars = t.raw("sections.thinking.pillars") as Record<
          string,
          { title: string; description: string }
        >;
        const pillarOrder: Array<keyof typeof pillars> = ["ai", "games", "systems"];
        return (
          <div className="space-y-8">
            <motion.p variants={itemVariants} className="text-base leading-relaxed text-white/75">
              {intro}
            </motion.p>
            <motion.div
              variants={listVariants}
              className="grid gap-4 sm:grid-cols-3"
            >
              {pillarOrder.map((pillarKey) => {
                const pillar = pillars[pillarKey];
                if (!pillar) return null;
                return (
                  <motion.div
                    key={pillarKey}
                    variants={itemVariants}
                    className="h-full rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur-md"
                  >
                    <h3 className="text-lg font-semibold text-white/90">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">{pillar.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        );
      }
      case "stack": {
        const intro = t("sections.stack.intro");
        const items = t.raw("sections.stack.items") as string[];
        return (
          <div className="space-y-6">
            <motion.p variants={itemVariants} className="text-base leading-relaxed text-white/75">
              {intro}
            </motion.p>
            <motion.div
              variants={listVariants}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {items.map((tool, index) => (
                <motion.span
                  key={index}
                  variants={itemVariants}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-md"
                >
                  {tool}
                </motion.span>
              ))}
            </motion.div>
          </div>
        );
      }
      case "education": {
        const intro = t("sections.education.intro");
        const detail = t("sections.education.detail");
        const stats = t.raw("sections.education.stats") as Record<
          string,
          { label: string; value: string }
        >;
        const statEntries = [stats.grade, stats.honors].filter(Boolean);
        return (
          <div className="space-y-8">
            <motion.p variants={itemVariants} className="text-base leading-relaxed text-white/75">
              {intro}
            </motion.p>
            <motion.div
              variants={listVariants}
              className="grid gap-4 sm:grid-cols-2"
            >
              {statEntries.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="rounded-[26px] border border-white/10 bg-gradient-to-br from-white/8 to-transparent p-6 backdrop-blur-md"
                >
                  <p className="text-sm uppercase tracking-[0.18em] text-white/50">{stat.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white/90">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>
            <motion.p variants={itemVariants} className="text-base leading-relaxed text-white/70">
              {detail}
            </motion.p>
          </div>
        );
      }
      case "experience": {
        const paragraphs = t.raw("sections.experience.paragraphs") as string[];
        return (
          <div className="space-y-5 text-base leading-relaxed text-white/75">
            {paragraphs.map((paragraph, index) => (
              <motion.p key={index} variants={itemVariants} className="text-pretty">
                {paragraph}
              </motion.p>
            ))}
          </div>
        );
      }
      case "personal": {
        const intro = t("sections.personal.intro");
        const items = t.raw("sections.personal.items") as string[];
        return (
          <div className="space-y-6">
            <motion.p variants={itemVariants} className="text-base leading-relaxed text-white/75">
              {intro}
            </motion.p>
            <motion.ul variants={listVariants} className="space-y-3">
              {items.map((item, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white/75 backdrop-blur-md"
                >
                  <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-sky-300" aria-hidden />
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        );
      }
      case "philosophy": {
        const paragraphs = t.raw("sections.philosophy.paragraphs") as string[];
        return (
          <div className="space-y-5 text-base leading-relaxed text-white/75">
            {paragraphs.map((paragraph, index) => (
              <motion.p key={index} variants={itemVariants} className="text-pretty">
                {paragraph}
              </motion.p>
            ))}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-950 text-white">
      {/* fondo */}
      <PulseHexGridCanvas pixelsPerHex={45} hue={230} s={75} l={38} gridType="Fill" className="opacity-15" />
      <PulseHexGridCanvas pixelsPerHex={45} hue={330} s={75} l={38} gridType="Fill" className="opacity-15" />
      <PulseHexGridCanvas pixelsPerHex={45} hue={120} s={75} l={38} gridType="Fill" className="opacity-15" />
      <PulseHexGridCanvas pixelsPerHex={45} hue={210} hueJitter={20} s={80} l={28} gridType="OverlapLine" className="opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_transparent_55%)]" />

      <div className="relative z-10 flex flex-col">
        {/* HERO */}
        <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-10">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/20 to-gray-950/30" />

          <motion.div
            initial="hidden"
            animate="show"
            variants={heroVariants}
            className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 text-center"
          >
            <motion.div variants={heroChildVariants} className="flex flex-wrap justify-center gap-3">
              {heroChips.map((chip, index) => (
                <motion.span
                  key={index}
                  variants={heroChildVariants}
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-md"
                >
                  {chip}
                </motion.span>
              ))}
            </motion.div>
            <motion.h1
              variants={heroChildVariants}
              className="text-balance text-4xl font-semibold tracking-tight text-white/95 sm:text-5xl"
            >
              {t("hero.title")}
            </motion.h1>
            <motion.p
              variants={heroChildVariants}
              className="max-w-3xl text-pretty text-lg text-white/70 sm:text-xl"
            >
              {t("hero.subtitle")}
            </motion.p>
          </motion.div>
        </section>

        {/* CONTENT */}
        <section className="relative px-4 pb-24 pt-6 sm:px-6 lg:px-10 min-h-[1000px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(56,189,248,0.12),_transparent_25%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/30 via-gray-950/10 to-gray-950" />

          <div className="relative mx-auto max-w-5xl">
            {/* MENÚ FUERA del panel animado */}
            <div className="mb-4 flex items-center justify-between gap-4">
              <button
                onClick={goPrev}
                disabled={activeIndex === 0}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 ${
                  activeIndex === 0 ? "opacity-40 pointer-events-none" : ""
                }`}
                aria-label="Sección anterior"
              >
                <span className="text-lg leading-none">‹</span>
              </button>

              <div className="flex items-center gap-2">
                {sectionOrder.map((key) => {
                  const isActive = key === activeSection;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveSection(key)}
                      className={`h-2.5 rounded-full transition-all ${
                        isActive ? "w-9 bg-sky-300" : "w-2.5 bg-white/25 hover:bg-white/45"
                      }`}
                      aria-label={t(`sections.${key}.title`)}
                    />
                  );
                })}
              </div>

              <button
                onClick={goNext}
                disabled={activeIndex === sectionOrder.length - 1}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 ${
                  activeIndex === sectionOrder.length - 1 ? "opacity-40 pointer-events-none" : ""
                }`}
                aria-label="Siguiente sección"
              >
                <span className="text-lg leading-none">›</span>
              </button>
            </div>

            {/* PANEL ANIMADO */}
            <AnimatePresence mode="wait">
              <motion.article
                key={activeSection}
                initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{
                    opacity: 0,
                    y: -18,
                    filter: "blur(8px)",
                    transition: { duration: 0.2, ease: "easeInOut" },
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-[26px] border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl"
              >
                <motion.header
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
                  className="mb-8"
                >
                  <p className="text-sm uppercase tracking-[0.25em] text-white/50">
                    {t(`sections.${activeSection}.title`)}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-white/95 sm:text-3xl">
                    {t(`sections.${activeSection}.subtitle`)}
                  </h2>
                </motion.header>

                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 1 },
                    show: {
                      opacity: 1,
                      transition: { delayChildren: 0.1, staggerChildren: 0.08 },
                    },
                  }}
                  className="space-y-6"
                >
                  {renderSectionContent(activeSection)}
                </motion.div>
              </motion.article>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
