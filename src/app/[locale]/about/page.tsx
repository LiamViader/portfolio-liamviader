"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

import PageLayout from "@/components/layout/PageLayout";

const listVariants: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { delayChildren: 0.1, staggerChildren: 0.08 },
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
    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.14 },
  },
};

const heroChildVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const heroMetaListVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { delayChildren: 0.15, staggerChildren: 0.1, duration: 0.6, ease: "easeOut" },
  },
};

const heroMetaItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const contentParentVariants: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { delayChildren: 0.1, staggerChildren: 0.08 },
  },
};

const PROFILE_IMAGE = "/images/test_liam.png";

const BACKGROUND_LAYERS = [
  {
    id: "primary",
    gridType: "Fill" as const,
    pixelsPerHex: 45,
    hue: 240,
    hueJitter: 5,
    s: 75,
    l: 1,
    className: "opacity-85",
  },
  {
    id: "secondary",
    gridType: "Strata" as const,
    pixelsPerHex: 45,
    hue: 240,
    hueJitter: 30,
    s: 60,
    l: 25,
  },
];

const BACKGROUND_OVERLAY = (
  <>
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.1),_transparent_55%)]" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gray-950/50 via-gray-950/25 to-gray-950/80" />
  </>
);

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  const heroMeta = t.raw("hero.meta") as Record<string, string>;
  const heroMetaEntries = [heroMeta.age, heroMeta.location].filter(Boolean);

  const profileParagraphs = t.raw(
    "sections.profile.paragraphs"
  ) as string[];

  const thinkingIntro = t("sections.thinking.intro");
  const thinkingPillars = t.raw(
    "sections.thinking.pillars"
  ) as Record<string, { title: string; description: string }>;
  const thinkingPillarOrder: Array<keyof typeof thinkingPillars> = [
    "ai",
    "games",
    "systems",
  ];

  const stackIntro = t("sections.stack.intro");
  const stackItems = t.raw("sections.stack.items") as string[];

  const educationIntro = t("sections.education.intro");
  const educationDetail = t("sections.education.detail");
  const educationStats = t.raw(
    "sections.education.stats"
  ) as Record<string, { label: string; value: string }>;
  const educationStatEntries = [educationStats.grade, educationStats.honors].filter(
    Boolean
  );

  const workStyle = t.raw("sections.thinking.workStyle") as {
    eyebrow: string;
    title: string;
    description: string;
    items: string[];
  };

  const personalIntro = t("sections.personal.intro");
  const personalItems = t.raw("sections.personal.items") as string[];

  return (
    <PageLayout backgroundLayers={BACKGROUND_LAYERS} overlays={BACKGROUND_OVERLAY}>
      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-10 lg:pt-34">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/20 to-gray-950/30" />

        <motion.div
          initial="hidden"
          animate="show"
          variants={heroVariants}
          className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 text-center lg:text-left"
        >
          <motion.h1
            variants={heroChildVariants}
            className="text-balance text-4xl font-semibold tracking-tight text-white/95 sm:text-5xl md:text-6xl"
          >
            {t.rich("hero.title", {
              highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
            })}
          </motion.h1>

          <motion.p
            variants={heroChildVariants}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="max-w-2xl text-pretty text-lg text-white/70 sm:text-xl"
          >
            {t("hero.subtitle")}
          </motion.p>

          {heroMetaEntries.length > 0 && (
            <motion.ul
              variants={heroMetaListVariants}
              initial="hidden"
              animate="show"
              className="flex flex-wrap justify-center gap-3 pt-4 text-sm text-white/75 lg:justify-start"
            >
              {heroMetaEntries.map((entry, index) => (
                <motion.li
                  key={index}
                  variants={heroMetaItemVariants}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-md"
                >
                  <span>{entry}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}

        </motion.div>
      </section>

      {/* CONTENIDO */}
      <section className="relative px-4 pb-28 pt-6 sm:px-6 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(56,189,248,0.12),_transparent_25%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/30 via-gray-950/10 to-gray-950" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 lg:gap-20">
            {/* 1. PROFILE – Card principal con blur + foto a la derecha */}
          <motion.section
              id="profile"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="rounded-[26px] border border-white/10 bg-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-[0_24px_80px_rgba(15,23,42,0.55)]"
            >
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                <div className="flex-1">
                  <header className="mb-5 sm:mb-6">
                    <p className="text-sm uppercase tracking-[0.25em] text-white/50">
                      {t("sections.profile.title")}
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-white/95 sm:text-3xl">
                      {t("sections.profile.subtitle")}
                    </h2>
                  </header>

                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={contentParentVariants}
                    className="space-y-5 text-base leading-relaxed text-white/75"
                  >
                    {profileParagraphs.map((paragraph, index) => (
                      <motion.p
                        key={index}
                        variants={itemVariants}
                        className="text-pretty"
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </motion.div>
                </div>

                {/* Foto a la derecha, tamaño contenido */}
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
                  className="relative mx-auto h-32 w-32 overflow-hidden rounded-3xl border border-white/15 bg-slate-900/70 shadow-[0_18px_60px_rgba(15,23,42,0.7)] md:h-40 md:w-40 lg:mx-0 lg:ml-6 lg:h-44 lg:w-44"
                >
                  <Image
                    src={PROFILE_IMAGE}
                    alt={t("sections.profile.title")}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </div>
          </motion.section>

            {/* 2. THINKING – 2 columnas: izquierda pilares, derecha “cómo trabajo” */}
          <motion.section
              id="thinking"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start"
            >
              {/* Columna izquierda: intro + pilares */}
              <div className="space-y-6">
                <header>
                  <p className="text-sm uppercase tracking-[0.25em] text-white/50">
                    {t("sections.thinking.title")}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-white/95 sm:text-3xl">
                    {t("sections.thinking.subtitle")}
                  </h2>
                </header>

                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={contentParentVariants}
                  className="space-y-7"
                >
                  <motion.p
                    variants={itemVariants}
                    className="text-base leading-relaxed text-white/75"
                  >
                    {thinkingIntro}
                  </motion.p>

                  <motion.div
                    variants={listVariants}
                    className="grid gap-4 sm:grid-cols-3"
                  >
                    {thinkingPillarOrder.map((pillarKey) => {
                      const pillar = thinkingPillars[pillarKey];
                      if (!pillar) return null;
                      return (
                        <motion.div
                          key={pillarKey}
                          variants={itemVariants}
                          className="h-full rounded-[22px] border border-white/10 bg-white/5 p-5 backdrop-blur-md"
                        >
                          <h3 className="text-base font-semibold text-white/90">
                            {pillar.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-white/70">
                            {pillar.description}
                          </p>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>
              </div>

              {/* Columna derecha: mini-panel de “cómo me gusta trabajar” */}
            <motion.aside
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
                className="rounded-[24px] border border-white/10 bg-slate-950/70 p-5 sm:p-6 backdrop-blur-md"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                  {workStyle.eyebrow}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-white/95">
                  {workStyle.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {workStyle.description}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  {workStyle.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span aria-hidden className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-sky-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.aside>
          </motion.section>

            {/* 3. STACK – banda con gradiente + tiles de tech */}
          <motion.section
              id="stack"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="rounded-[28px] border border-sky-500/15 bg-gradient-to-r from-slate-950/80 via-slate-900/70 to-slate-950/80 px-5 py-7 sm:px-8 sm:py-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl space-y-3">
                  <p className="text-sm uppercase tracking-[0.25em] text-sky-200/70">
                    {t("sections.stack.title")}
                  </p>
                  <h2 className="text-2xl font-semibold text-white/95 sm:text-3xl">
                    {t("sections.stack.subtitle")}
                  </h2>
                  <p className="text-sm sm:text-base leading-relaxed text-white/70">
                    {stackIntro}
                  </p>
                </div>

                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={contentParentVariants}
                  className="mt-3 flex flex-wrap justify-start gap-3 sm:gap-4 lg:mt-0"
                >
                  {stackItems.map((tool, index) => {
                    const abbrev = tool
                      .replace(/[^A-Za-z0-9]/g, "")
                      .slice(0, 3)
                      .toUpperCase();
                    return (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/5 text-xs font-semibold text-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.65)] backdrop-blur-md sm:h-14 sm:w-14"
                      >
                        <span aria-hidden>{abbrev}</span>
                        <span className="sr-only">{tool}</span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
          </motion.section>

            {/* 4. EDUCATION – grid 2 columnas: texto + stats */}
          <motion.section
              id="education"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-8"
            >
              <header className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.25em] text-white/50">
                  {t("sections.education.title")}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white/95 sm:text-3xl">
                  {t("sections.education.subtitle")}
                </h2>
              </header>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={contentParentVariants}
                  className="space-y-5 text-base leading-relaxed text-white/75"
                >
                  <motion.p variants={itemVariants}>{educationIntro}</motion.p>
                  <motion.p
                    variants={itemVariants}
                    className="text-white/70"
                  >
                    {educationDetail}
                  </motion.p>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={contentParentVariants}
                  className="space-y-4"
                >
                  {educationStatEntries.map((stat, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="rounded-[22px] border border-white/10 bg-gradient-to-br from-white/8 to-transparent p-6 backdrop-blur-md"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                        {stat.label}
                      </p>
                      <p className="mt-3 text-2xl font-semibold text-white/90">
                        {stat.value}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
          </motion.section>

            {/* 5. PERSONAL – final, más ligero, con grid de pill-cards */}
          <motion.section
              id="personal"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-6 border-t border-white/10 pt-10"
            >
              <header>
                <p className="text-sm uppercase tracking-[0.25em] text-white/50">
                  {t("sections.personal.title")}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white/95 sm:text-3xl">
                  {t("sections.personal.subtitle")}
                </h2>
              </header>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="max-w-3xl text-base leading-relaxed text-white/75"
              >
                {personalIntro}
              </motion.p>

              <motion.ul
                variants={listVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="grid gap-3 sm:grid-cols-2"
              >
                {personalItems.map((item, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white/75 backdrop-blur-md"
                  >
                    <span
                      className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-sky-300"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
          </motion.section>
        </div>
      </section>
    </PageLayout>
  );
}
