"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

import PageLayout from "@/components/layout/PageLayout";

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

const PROFILE_IMAGE = "/images/test_liam.png";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerParent: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  const heroMeta = t.raw("hero.meta") as Record<string, string>;
  const heroMetaEntries = [heroMeta.age, heroMeta.location].filter(Boolean);

  const profileParagraphs = t.raw(
    "sections.profile.paragraphs"
  ) as string[];
  const profileIntro = profileParagraphs[0];
  const profileDetails = profileParagraphs.slice(1);
  const profileContent = profileDetails.length > 0 ? profileDetails : profileParagraphs;

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
      <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-12 lg:pb-24 lg:pt-36">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/25 to-gray-950/40" />

        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerParent}
          className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-start lg:gap-16"
        >
          <div className="flex-1 space-y-8">
            <motion.p
              variants={fadeUp}
              className="text-xs uppercase tracking-[0.4em] text-sky-200/70"
            >
              {t("hero.aboutTitle")}
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-balance text-4xl font-semibold tracking-tight text-white/95 sm:text-5xl md:text-6xl"
            >
              {t.rich("hero.title", {
                highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
              })}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-2xl text-pretty text-lg text-white/70 sm:text-xl"
            >
              {t("hero.subtitle")}
            </motion.p>

            {heroMetaEntries.length > 0 && (
              <motion.ul
                variants={fadeUp}
                className="flex flex-wrap gap-3 text-sm text-white/75"
              >
                {heroMetaEntries.map((entry, index) => (
                  <li
                    key={index}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-md"
                  >
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-300" aria-hidden />
                    <span>{entry}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </div>

          <motion.aside
            variants={fadeUp}
            className="relative w-full max-w-sm overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-[0_32px_120px_rgba(15,23,42,0.55)] backdrop-blur-2xl"
          >
            <div className="relative mb-6 h-48 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80">
              <Image
                src={PROFILE_IMAGE}
                alt={t("sections.profile.title")}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 320px, 100vw"
              />
            </div>

            <p className="text-sm uppercase tracking-[0.3em] text-white/45">
              {t("sections.profile.title")}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white/95">
              {t("sections.profile.subtitle")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {profileIntro ?? t("hero.subtitle")}
            </p>
          </motion.aside>
        </motion.div>
      </section>

      <section className="relative px-4 pb-28 sm:px-6 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(56,189,248,0.12),_transparent_25%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/30 via-gray-950/10 to-gray-950" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-20">
          <motion.section
            id="profile"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerParent}
            className="grid gap-12 rounded-[28px] border border-white/10 bg-white/10 p-8 shadow-[0_24px_90px_rgba(15,23,42,0.55)] backdrop-blur-xl lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
          >
            <div className="space-y-6">
              <motion.div variants={fadeUp}>
                <p className="text-sm uppercase tracking-[0.28em] text-white/50">
                  {t("sections.profile.title")}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white/95 sm:text-3xl">
                  {t("sections.profile.subtitle")}
                </h2>
              </motion.div>

              <motion.div
                variants={staggerParent}
                className="space-y-5 text-base leading-relaxed text-white/75"
              >
                {profileContent.map((paragraph, index) => (
                  <motion.p key={index} variants={fadeUp}>
                    {paragraph}
                  </motion.p>
                ))}
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="space-y-6 rounded-[24px] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                {workStyle.eyebrow}
              </p>
              <h3 className="text-lg font-semibold text-white/95">
                {workStyle.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                {workStyle.description}
              </p>
              <ul className="space-y-2 text-sm text-white/75">
                {workStyle.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-sky-300" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.section>

          <motion.section
            id="thinking"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={staggerParent}
            className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
          >
            <motion.div variants={fadeUp} className="space-y-4">
              <p className="text-sm uppercase tracking-[0.28em] text-white/50">
                {t("sections.thinking.title")}
              </p>
              <h2 className="text-2xl font-semibold text-white/95 sm:text-3xl">
                {t("sections.thinking.subtitle")}
              </h2>
              <p className="text-base leading-relaxed text-white/75">
                {thinkingIntro}
              </p>
            </motion.div>

            <motion.div
              variants={staggerParent}
              className="grid gap-4 sm:grid-cols-2"
            >
              {thinkingPillarOrder.map((pillarKey) => {
                const pillar = thinkingPillars[pillarKey];
                if (!pillar) return null;

                return (
                  <motion.div
                    key={pillarKey}
                    variants={fadeUp}
                    className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-md"
                  >
                    <h3 className="text-lg font-semibold text-white/90">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                      {pillar.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.section>

          <motion.section
            id="stack"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={staggerParent}
            className="overflow-hidden rounded-[30px] border border-sky-500/15 bg-gradient-to-r from-slate-950/80 via-slate-900/70 to-slate-950/80"
          >
            <div className="grid gap-10 px-8 py-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
              <motion.div variants={fadeUp} className="space-y-4">
                <p className="text-sm uppercase tracking-[0.28em] text-sky-200/70">
                  {t("sections.stack.title")}
                </p>
                <h2 className="text-2xl font-semibold text-white/95 sm:text-3xl">
                  {t("sections.stack.subtitle")}
                </h2>
                <p className="text-base leading-relaxed text-white/75">
                  {stackIntro}
                </p>
              </motion.div>

              <motion.ul
                variants={staggerParent}
                className="flex flex-wrap gap-3"
              >
                {stackItems.map((tool, index) => (
                  <motion.li
                    key={index}
                    variants={fadeUp}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-md"
                  >
                    {tool}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.section>

          <motion.section
            id="education"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={staggerParent}
            className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start"
          >
            <motion.div variants={fadeUp} className="space-y-5 text-base leading-relaxed text-white/75">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white/50">
                  {t("sections.education.title")}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white/95 sm:text-3xl">
                  {t("sections.education.subtitle")}
                </h2>
              </div>
              <p>{educationIntro}</p>
              <p className="text-white/70">{educationDetail}</p>
            </motion.div>

            <motion.div
              variants={staggerParent}
              className="grid gap-4 sm:grid-cols-2"
            >
              {educationStatEntries.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/8 to-transparent p-6 text-white/80 backdrop-blur-md"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-white/95">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          <motion.section
            id="personal"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={staggerParent}
            className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
          >
            <motion.div variants={fadeUp} className="space-y-4">
              <p className="text-sm uppercase tracking-[0.28em] text-white/50">
                {t("sections.personal.title")}
              </p>
              <h2 className="text-2xl font-semibold text-white/95 sm:text-3xl">
                {t("sections.personal.subtitle")}
              </h2>
              <p className="max-w-3xl text-base leading-relaxed text-white/75">
                {personalIntro}
              </p>
            </motion.div>

            <motion.ul
              variants={staggerParent}
              className="mt-8 grid gap-3 sm:grid-cols-2"
            >
              {personalItems.map((item, index) => (
                <motion.li
                  key={index}
                  variants={fadeUp}
                  className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/10 px-5 py-4 text-sm leading-relaxed text-white/75 backdrop-blur-md"
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
