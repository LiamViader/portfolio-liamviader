"use client";

import { motion, type Variants } from "framer-motion";
import { useState, useMemo, type ComponentType } from "react";
import { useTranslations } from "next-intl";
import { Mail, Building2, MessageSquare, Hammer, ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import PageLayout from "@/components/layout/PageLayout";
import { BASE_DELAY_ENTRANCE } from "@/utils/constants";
import { usePerformanceConfig } from "@/hooks/usePerformanceConfig";

type AnyIcon = ComponentType<{ className?: string }>;

const BASE_BG = "rgba(255,255,255,0.05)";
const BASE_BORD = "rgba(255,255,255,0.10)";
const HOVER_BG = "rgba(56,189,248,0.10)";
const HOVER_BOR = "rgba(56,189,248,0.60)";
const HOVER_SH = "0 0 30px rgba(56,189,248,0.30)";
const BASE_SH = "0 0 30px rgba(56,189,248,0.01)";


const createContactContainerVariant = (animated: boolean): Variants => ({
  hidden: {
    opacity: 0,
    x: animated ? 20 : 0,
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
      duration: (c.isIntro && animated) ? 0.6 : 0.3,
      delay: (c.isIntro && animated) ? c.order * 0.2 + BASE_DELAY_ENTRANCE + 0.2 : 0,
      ease: "easeOut",
    },
  }),
  hover: {
    opacity: 1,
    x: 0,
    y: -4,
    backgroundColor: HOVER_BG,
    borderColor: HOVER_BOR,
    boxShadow: HOVER_SH,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.08,
      ease: "easeOut",
    },
  },
});

const linkCardVariants = (animated: boolean): Variants => ({
  hidden: { 
    opacity: 0, 
    y: animated ? 20 : 0 
  },
  show: (c: { i: number; isIntro: boolean }) => ({
    opacity: 1, 
    y: 0,
    transition: { 
      delay: (animated && c.isIntro) ? BASE_DELAY_ENTRANCE + 0.4 + (c.i * 0.1) : 0,
      duration: animated ? 0.5 : 0,
      ease: "easeOut"
    }
  }),
  hover: {
    y: -3,
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  },
  tap: { scale: 0.98 }
});

const iconHoverVariants: Variants = {
  hover: { rotate: -10, scale: 1.1, transition: { type: "spring", stiffness: 300, damping: 20 } }
};

const arrowHoverVariants: Variants = {
  hover: { x: 3, y: -3, opacity: 1, transition: { duration: 0.2 } }
};


export default function ContactPage() {
  const t = useTranslations("ContactPage");
  const [introDone, setIntroDone] = useState(false);
  const { entranceAnimationsEnabled, isSmallScreen } = usePerformanceConfig();

  const backgroundLayers = useMemo(() => [
    {
      id: "fill",
      gridType: "Fill" as const,
      pixelsPerHex: isSmallScreen ? 20 : 30,
      hue: 250,
      s: 100,
      l: 8,
      hueJitter: 0,
      fillTuning: { fillAlphaMax: 0.2, fillAlphaMin: 0, lineAlphaMax: 1, lineAlphaMin: 0.8 },
    },
    {
      id: "trails",
      gridType: "Trails" as const,
      pixelsPerHex: isSmallScreen ? 20 : 30,
      hue: 240,
      s: 60,
      l: 37,
      hueJitter: 20,
      trailCount: isSmallScreen ? 7 : 15,
      stepsPerSecond: 20,
      fadeSeconds: isSmallScreen ? 5: 7,
    },
  ], [isSmallScreen]);

  const contactContainerVariant = createContactContainerVariant(entranceAnimationsEnabled);
  const linkCardVariant = linkCardVariants(entranceAnimationsEnabled);

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
  ] as const;

  const contactLinks = [
    {
      key: "email",
      icon: Mail as unknown as AnyIcon,
      href: `mailto:${t("links.items.email.value")}`,
      label: t("links.items.email.label"),
      value: t("links.items.email.value"),
      styles: {
        container: "hover:bg-rose-500/10 hover:border-rose-500/50 hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]",
        iconBox: "text-rose-300 group-hover:text-rose-100 group-hover:bg-rose-500/20",
        text: "group-hover:text-rose-200"
      }
    },
    {
      key: "linkedin",
      icon: FaLinkedin,
      href: t("links.items.linkedin.href"),
      label: t("links.items.linkedin.label"),
      value: t("links.items.linkedin.value"),
      styles: {
        container: "hover:bg-sky-500/10 hover:border-sky-500/50 hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.3)]",
        iconBox: "text-sky-300 group-hover:text-sky-100 group-hover:bg-sky-500/20",
        text: "group-hover:text-sky-200"
      }
    },
    {
      key: "github",
      icon: FaGithub,
      href: t("links.items.github.href"),
      label: t("links.items.github.label"),
      value: t("links.items.github.value"),
      styles: {
        container: "hover:bg-violet-500/10 hover:border-violet-500/50 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]",
        iconBox: "text-violet-300 group-hover:text-violet-100 group-hover:bg-violet-500/20",
        text: "group-hover:text-violet-200"
      }
    },
  ];

  return (
    <PageLayout
      backgroundLayers={backgroundLayers}
      overlays={<div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/30 to-slate-950"></div>}
      className=" px-4 sm:px-6 lg:px-12"
    >
      <div>
        <div className="mx-auto w-full max-w-6xl pb-24 pt-28 lg:pt-34">

          <div className="flex flex-col gap-6 max-w-4xl">
            <motion.h1
              className="text-center lg:text-left text-4xl font-semibold tracking-tight text-white/95 sm:text-5xl md:text-6xl"
              initial={{ 
                y: entranceAnimationsEnabled ? 20 : 0, 
                opacity: 0, 
                scale: 1, 
                filter: "drop-shadow(0 0 12px rgba(56,189,248,0.01))" 
              }}
              animate={{ y: 0, opacity: 1, scale: 1, filter: "drop-shadow(0 0 12px rgba(56,189,248,0.01))" }}
              whileHover={introDone ? {scale: 1.02, y: -2, filter: "drop-shadow(0 0 12px rgba(56,189,248,0.35))", transition: {duration: 0.3}} : undefined}
              transition={{
                  duration: introDone ? 0.5 : (entranceAnimationsEnabled ? 0.7 : 0),
                  delay: introDone ? 0 : (entranceAnimationsEnabled ? BASE_DELAY_ENTRANCE : 0),
                  ease: "easeOut"
              }}
              onAnimationComplete={() => { if (!introDone) setIntroDone(true); }}
            >
              {t.rich("hero.title", {
                highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
              })}
            </motion.h1>
            <motion.p
              className="text-center lg:text-left text-pretty text-lg text-white/75 sm:text-xl"
              initial={{ y: entranceAnimationsEnabled ? 20 : 0, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: entranceAnimationsEnabled ? 0.7 : 0, 
                delay: entranceAnimationsEnabled ? BASE_DELAY_ENTRANCE + 0.1 : 0, 
                ease: "easeOut" 
              }}
            >
              {t("hero.description")}
            </motion.p>
          </div>

          <div className="mt-5 flex flex-col gap-5 py-6">
            {highlightCards.map(({ key, icon: Icon, title, description }, index) => (
              <motion.article
                key={key}
                className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 backdrop-blur-sm"
                aria-labelledby={`contact-highlight-${key}`}
                initial="hidden"
                animate="show"
                whileHover={introDone ? "hover" : undefined}
                whileTap={introDone ? "tap" : undefined}
                custom={{ order: index, isIntro: !introDone }}
                variants={contactContainerVariant}
                onAnimationComplete={() => { if (!introDone) setIntroDone(true); }}
              >
                <div className="relative z-10 flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center text-sky-300/95">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-sky-300/95 md:hidden">
                      {title}
                    </h3>
                  </div>
                  
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <h3 id={`contact-highlight-${key}`} className="hidden text-lg font-semibold text-sky-300/95 md:block">
                      {title}
                    </h3>
                    <p className="text-sm text-white/70 text-pretty break-words">
                        {description}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto max-w-5xl">
              {contactLinks.map(({ key, icon: Icon, href, value, label, styles }, index) => (
                <motion.a
                  key={key}
                  href={href}
                  target={key === "email" ? undefined : "_blank"}
                  rel={key === "email" ? undefined : "noreferrer"}
                  variants={linkCardVariant}
                  custom={{ i: index, isIntro: !introDone }}
                  initial="hidden"
                  animate="show"
                  whileHover="hover"
                  whileTap="tap"
                  
                  className={`
                    group relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/10 
                    bg-white/[0.03] backdrop-blur-md p-3 px-4
                    ${styles.container}
                  `}
                >
                  <motion.div 
                    variants={iconHoverVariants}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 ${styles.iconBox}`}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 leading-tight">
                      {label}
                    </p>
                    <p className={`text-sm font-semibold text-white/90 truncate ${styles.text}`}>
                      {value}
                    </p>
                  </div>
                  <motion.div variants={arrowHoverVariants} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                     <ArrowUpRight className="h-4 w-4 text-white/70" />
                  </motion.div>
                </motion.a>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </PageLayout>
  );
}