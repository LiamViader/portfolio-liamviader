"use client";

import { motion, type Variants } from "framer-motion";
import { useState, type ComponentType } from "react";
import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";
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
      duration: (c.isIntro && animated) ? 0.6 : (c.isIntro ? 0 : 0.5),
      delay: (c.isIntro && animated) ? c.order * 0.2 + BASE_DELAY_ENTRANCE + 0.2 : 0,
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
});

// Definimos el tipo de datos que recibirá 'custom'
type NavLinkCustom = {
  bg: string;
  border: string;
  shadow: string;
  isIntro: boolean;
};

const createNavLinkVariants = (animated: boolean): Variants => ({
  hidden: { 
    opacity: 0,
    y: animated ? 20 : 0,
  },
  // 'c' recibe el objeto combinado (colores + isIntro)
  show: (c: NavLinkCustom) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: animated ? 0.7 : 0,
      // Solo aplicamos delay si es la intro Y está animado
      delay: (c.isIntro && animated) ? BASE_DELAY_ENTRANCE + 0.5 : 0, 
      ease: "easeOut" 
    },
  }),
  // 'c' sigue teniendo los colores aquí
  hover: (c: NavLinkCustom) => ({
    scale: 1.03,
    y: -2,
    backgroundColor: c.bg,
    borderColor: c.border,
    boxShadow: c.shadow,
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 26,
      backgroundColor: { duration: 0.25 },
      boxShadow: { duration: 0.25 },
    },
  }),
  tap: {
    scale: 0.98,
    y: 0,
    transition: { duration: 0.12 },
  },
});

const glintVariants: Variants = {
  show: { x: "-120%", opacity: 0 },
  hover: { x: "120%", opacity: 0.6, transition: { duration: 0.6, ease: "easeOut" } },
};

const leftIconVariants: Variants = {
  show: { y: 0, rotate: 0, scale: 1 },
  hover: { y: -1, rotate: -8, scale: 1.08, transition: { duration: 0.2 } },
};

const textVariants: Variants = {
  show: { x: 0, color: "rgba(255,255,255,0.95)" },
  hover: { x: 2, color: "rgba(255,255,255,1)", transition: { duration: 0.2 } },
};

const arrowVariants: Variants = {
  show: { x: 0, rotate: 0, opacity: 0.7 },
  hover: { x: 8, rotate: 15, opacity: 1, transition: { type: "spring", stiffness: 360, damping: 20 } },
};

const CONTACT_BACKGROUND_LAYERS = [
  {
    id: "fill",
    gridType: "Fill" as const,
    pixelsPerHex: 30,
    hue: 250,
    s: 100,
    l: 8,
    hueJitter: 0,
    fillTuning: { fillAlphaMax: 0.2, fillAlphaMin: 0, lineAlphaMax: 1, lineAlphaMin: 0.8 },
  },
  {
    id: "trails",
    gridType: "Trails" as const,
    pixelsPerHex: 30,
    hue: 240,
    s: 60,
    l: 37,
    hueJitter: 20,
    trailCount: 15,
    stepsPerSecond: 20,
  },
];


export default function ContactPage() {
  const t = useTranslations("ContactPage");
  const [introDone, setIntroDone] = useState(false);
  const { entranceAnimationsEnabled } = usePerformanceConfig();

  const contactContainerVariant = createContactContainerVariant(entranceAnimationsEnabled);
  const navLinkVariants = createNavLinkVariants(entranceAnimationsEnabled);

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


  const contactLinks = [
    {
      key: "email",
      icon: Mail as unknown as AnyIcon,
      href: `mailto:${t("links.items.email.value")}`,
      label: t("links.items.email.label"),
      value: t("links.items.email.value"),
      theme: {
        baseClass: "bg-rose-400/10 border-rose-400/40",
        iconClass: "text-rose-200",
        hoverData: {
          bg: "rgba(244, 63, 94, 0.25)",
          border: "rgba(244, 63, 94, 0.8)",
          shadow: "0 0 25px rgba(244, 63, 94, 0.4)", // Agregué shadow que faltaba en tu snippet
        }
      }
    },
    {
      key: "linkedin",
      icon: FaLinkedin,
      href: t("links.items.linkedin.href"),
      label: t("links.items.linkedin.label"),
      value: t("links.items.linkedin.value"),
      theme: {
        baseClass: "bg-sky-400/10 border-sky-400/40",
        iconClass: "text-sky-200",
        hoverData: {
          bg: "rgba(56, 189, 248, 0.25)",
          border: "rgba(56, 189, 248, 0.8)",
          shadow: "0 0 25px rgba(56, 189, 248, 0.4)",
        }
      }
    },
    {
      key: "github",
      icon: FaGithub,
      href: t("links.items.github.href"),
      label: t("links.items.github.label"),
      value: t("links.items.github.value"),
      theme: {
        baseClass: "bg-violet-400/10 border-violet-400/40",
        iconClass: "text-violet-200",
        hoverData: {
          bg: "rgba(139, 92, 246, 0.25)",
          border: "rgba(139, 92, 246, 0.8)",
          shadow: "0 0 25px rgba(139, 92, 246, 0.4)",
        }
      }
    },
  ];

  return (
    <PageLayout
      backgroundLayers={CONTACT_BACKGROUND_LAYERS}
      className="bg-gradient-to-b from-transparent via-gray-950/20 to-gray-950"
    >
      <div>
        <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-28 lg:pt-34 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 max-w-4xl">
            <motion.h1
              className="text-center md:text-left text-4xl font-semibold tracking-tight text-white/95 sm:text-5xl md:text-6xl"
              initial={{ 
                y: entranceAnimationsEnabled ? 20 : 0, 
                opacity: 0, 
                scale: 1, 
                filter: "drop-shadow(0 0 12px rgba(56,189,248,0.01))" 
              }}
              animate={{ y: 0, opacity: 1, scale: 1, filter: "drop-shadow(0 0 12px rgba(56,189,248,0.01))" }}
              whileHover={introDone ? {scale: 1.02, y: -2, filter: "drop-shadow(0 0 12px rgba(56,189,248,0.35))", transition: {duration: 0.3}} : undefined}
              transition={
                introDone 
                  ? { duration: 0.5, delay: 0 }
                  : { 
                      duration: entranceAnimationsEnabled ? 0.7 : 0, 
                      delay: entranceAnimationsEnabled ? BASE_DELAY_ENTRANCE : 0, 
                      ease: "easeOut" 
                    }
              }
              onAnimationComplete={() => {
                if (!introDone) setIntroDone(true);
              }}
            >
              {t.rich("hero.title", {
                highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
              })}
            </motion.h1>
            <motion.p
              className="text-center md:text-left text-pretty text-lg text-white/75 sm:text-xl"
              initial={{ 
                y: entranceAnimationsEnabled ? 20 : 0, 
                opacity: 0
              }}
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
                className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 md:p-5 backdrop-blur-sm"
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
            <nav aria-label="Contact" className="mx-auto max-w-4xl">
              <ul className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {contactLinks.map(({ key, icon: Icon, href, value, theme }) => (
                  <li key={key}>
                    <motion.a
                      href={href}
                      target={key === "email" ? undefined : "_blank"}
                      rel={key === "email" ? undefined : "noreferrer"}
                      variants={navLinkVariants}
                      initial="hidden"
                      animate="show"
                      whileHover={introDone ? "hover" : undefined}
                      whileTap="tap"
                      custom={{ ...theme.hoverData, isIntro: !introDone }}
                      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 sm:gap-4 rounded-full p-3 sm:px-5 sm:py-2.5 text-lg border backdrop-blur-sm transform-gpu will-change-[transform,opacity] transition-none ${theme.baseClass}`}
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
                        <Icon className={`size-6 sm:size-5 shrink-0 ${theme.iconClass}`} />
                      </motion.span>
                      
                      <motion.span variants={textVariants} className="hidden sm:block font-medium">
                        {value}
                      </motion.span>
                      
                      <motion.span variants={arrowVariants} className="hidden sm:flex">
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
    </PageLayout>
  );
}