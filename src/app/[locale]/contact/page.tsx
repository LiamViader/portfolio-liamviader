"use client";

import { motion, type Variants } from "framer-motion";
import { useState, type ComponentType } from "react";
import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";
import { Mail, Building2, MessageSquare, Hammer, ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import PulseHexGridCanvas from "@/components/home/scene/PulseHexGridCanvas";

type AnyIcon = ComponentType<{ className?: string }>;

const BASE_BG = "rgba(255,255,255,0.05)";
const BASE_BORD = "rgba(255,255,255,0.10)";
const HOVER_BG = "rgba(56,189,248,0.10)";
const HOVER_BOR = "rgba(56,189,248,0.60)";
const HOVER_SH = "0 0 30px rgba(56,189,248,0.30)";
const BASE_SH = "0 0 30px rgba(56,189,248,0.01)";

const contactContainerVariant: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
    y: 0,
    backgroundColor: BASE_BG,
    borderColor: BASE_BORD,
    boxShadow: BASE_SH,
  },
  show: (c: { order: number; isIntro: boolean } = { order: 0, isIntro: false }) => ({
    opacity: 1,
    x: 0,
    y: 0,
    backgroundColor: BASE_BG,
    borderColor: BASE_BORD,
    boxShadow: BASE_SH,
    transition: {
      duration: c.isIntro ? 0.6 : 0.5,
      delay: c.isIntro ? c.order * 0.2 + 1.2 : 0,
      ease: "easeOut",
    },
  }),
  hover: {
    opacity: 1,
    x: 0,
    y: -7,
    backgroundColor: HOVER_BG,
    borderColor: HOVER_BOR,
    boxShadow: HOVER_SH,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  tap: {
    y: -2,
    transition: {
      duration: 0.08,
      ease: "easeOut",
    },
  },
};

const navLinkVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(2px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, delay: 1.5, ease: "easeOut" },
  },
  hover: {
    scale: 1.06,
    y: -2,
    backgroundColor: "rgba(56,189,248,0.08)",
    boxShadow: "0 12px 28px rgba(56,189,248,0.35), 0 0 0 1px rgba(56,189,248,0.60)",
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 26,
      backgroundColor: { duration: 0.25 },
      boxShadow: { duration: 0.25 },
    },
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: { duration: 0.12 },
  },
};

const glintVariants: Variants = {
  show: { x: "-120%", opacity: 0 },
  hover: { x: "120%", opacity: 0.6, transition: { duration: 0.6, ease: "easeOut" } },
};

const leftIconVariants: Variants = {
  show: { y: 0, rotate: 0, scale: 1 },
  hover: { y: -1, rotate: -8, scale: 1.08, transition: { duration: 0.2 } },
};

const textVariants: Variants = {
  show: { x: 0, color: "rgba(255,255,255,0.90)" },
  hover: { x: 2, color: "rgba(255,255,255,1)", transition: { duration: 0.2 } },
};

const arrowVariants: Variants = {
  show: { x: 0, rotate: 0, opacity: 0.7 },
  hover: { x: 8, rotate: 15, opacity: 1, transition: { type: "spring", stiffness: 360, damping: 20 } },
};

export default function ContactPage() {
  const t = useTranslations("ContactPage");
  const [introDone, setIntroDone] = useState(false);

  const highlightCards = [
    {
      key: "teams",
      icon: Building2,
      title: t("highlights.items.teams.title"),
      description: t("highlights.items.teams.description"),
    },
    {
      key: "projects",
      icon: Hammer,
      title: t("highlights.items.projects.title"),
      description: t("highlights.items.projects.description"),
    },
    {
      key: "networking",
      icon: MessageSquare,
      title: t("highlights.items.networking.title"),
      description: t("highlights.items.networking.description"),
    },
  ] as const satisfies readonly {
    key: "projects" | "teams" | "networking";
    icon: LucideIcon;
    title: string;
    description: string;
  }[];

  const contactLinks: Array<{
    key: "email" | "linkedin" | "github";
    icon: AnyIcon;
    href: string;
    label: string;
    value: string;
  }> = [
    {
      key: "email",
      icon: Mail as unknown as AnyIcon,
      href: `mailto:${t("links.items.email.value")}`,
      label: t("links.items.email.label"),
      value: t("links.items.email.value"),
    },
    {
      key: "linkedin",
      icon: FaLinkedin,
      href: t("links.items.linkedin.href"),
      label: t("links.items.linkedin.label"),
      value: t("links.items.linkedin.value"),
    },
    {
      key: "github",
      icon: FaGithub,
      href: t("links.items.github.href"),
      label: t("links.items.github.label"),
      value: t("links.items.github.value"),
    },
  ];

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-white px-3">
      <PulseHexGridCanvas gridType="Fill" pixelsPerHex={30} hue={250} l={5} s={100} fillTuning={{ fillAlphaMax: 0.2, fillAlphaMin: 0, lineAlphaMax: 1, lineAlphaMin: 0.8 }} />
      <PulseHexGridCanvas gridType="Trails" pixelsPerHex={30} hue={270} s={100} l={37} hueJitter={30} trailCount={15} stepsPerSecond={20} />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.1),_transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950/50" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-28 pt-30 sm:px-6 sm:pb-42 sm:pt-34 lg:px-8">
        <div className="flex flex-col gap-6 max-w-4xl">
          <motion.h1
            className="text-center md:text-left text-balance text-4xl font-semibold tracking-tight text-white/95 sm:text-5xl md:text-6xl"
            initial={{ y: 20, opacity: 0, scale: 1, filter: "drop-shadow(0 0 12px rgba(56,189,248,0.01))" }}
            animate={{ y: 0, opacity: 1, scale: 1, filter: "drop-shadow(0 0 12px rgba(56,189,248,0.01))" }}
            whileHover={introDone ? {scale: 1.02, y: -2, filter: "drop-shadow(0 0 12px rgba(56,189,248,0.35))", transition: {duration: 0.3}} : undefined}
            transition={introDone ? {duration: 0.5, delay:0}: { duration: 0.7, delay: 1, ease: "easeOut" }}
          >
            {t.rich("hero.title", {
              highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
            })}
          </motion.h1>
          <motion.p
            className="text-center md:text-left text-pretty text-lg text-white/75 sm:text-xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.1, ease: "easeOut" }}
          >
            {t("hero.description")}
          </motion.p>
        </div>

        <div className="space-y-6 mt-5 gap-5 grid py-4 sm:py-6 overflow-hidden">
          {highlightCards.map(({ key, icon: Icon, title, description }, index) => (
            <motion.article
              key={key}
              className="relative overflow-hidden p-2 sm:p-4 h-full backdrop-blur-sm border border-white/10 bg-white/5 rounded-3xl"
              aria-labelledby={`contact-highlight-${key}`}
              initial="hidden"
              animate="show"
              whileHover={introDone ? "hover" : undefined}
              whileTap={introDone ? "tap" : undefined}
              custom={{ order: index, isIntro: !introDone }}
              variants={contactContainerVariant}
              onAnimationComplete={() => {
                if (!introDone) {
                  setIntroDone(true);
                }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
              <div className="relative z-10 flex h-full flex-row items-center justify-left gap-6">
                <div className="flex shrink-0 h-12 w-12 items-center justify-center text-sky-300/95">
                  <Icon className="h-8 w-8" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 id={`contact-highlight-${key}`} className="text-lg font-semibold text-sky-300/95">
                    {title}
                  </h3>
                  <p className="text-sm text-white/70">{description}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-6">
          <nav aria-label="Contact" className="mx-auto max-w-4xl">
            <ul className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {contactLinks.map(({ key, icon: Icon, href, value }) => (
                <li key={key}>
                  <motion.a
                    href={href}
                    target={key === "email" ? undefined : "_blank"}
                    rel={key === "email" ? undefined : "noreferrer"}
                    variants={navLinkVariants}
                    initial="hidden"
                    animate="show"
                    whileHover="hover"
                    whileTap="tap"
                    className="relative overflow-hidden inline-flex items-center gap-4 rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-lg bg-white/0 ring-1 ring-white/15 text-white/85 backdrop-blur-sm shadow-md transform-gpu will-change-[transform,opacity] transition-none"
                  >
                    <motion.span
                      aria-hidden
                      className="pointer-events-none absolute -inset-1"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.28) 14%, rgba(255,255,255,0.06) 32%, transparent 55%)",
                        transform: "rotate(8deg)",
                      }}
                      variants={glintVariants}
                    />
                    <motion.span variants={leftIconVariants} className="flex">
                      <Icon className="size-5 shrink-0 text-sky-200" />
                    </motion.span>
                    <motion.span variants={textVariants} className="font-medium">
                      {value}
                    </motion.span>
                    <motion.span variants={arrowVariants} className="flex">
                      <ArrowUpRight className="size-4 shrink-0 text-white/80" />
                    </motion.span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
