"use client";

import { motion, type Variants } from "framer-motion";
import { useState, useMemo, type ComponentType } from "react";
import { useTranslations } from "next-intl";
import { Mail, Building2, MessageSquare, Hammer, ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import PageLayout from "@/components/layout/PageLayout";
import { BASE_DELAY_ENTRANCE } from "@/utils/constants";
import { usePerformanceConfig } from "@/hooks/usePerformanceConfig";

import { OneSectionPageSection } from "@/components/layout/OneSectionPageSection";
import { Container } from "@/components/layout/Container";
import { ContentBlock } from "@/components/layout/ContentBlock";
import { InfoCard } from "@/components/home/InfoCard"; 
import { Stack } from "@/components/layout/Stack";
import { Eyebrow } from "@/components/layout/Eyebrow";

type AnyIcon = ComponentType<{ className?: string }>;

const cardsContainerVariants = (animated: boolean): Variants => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: animated
      ? {
          delayChildren: BASE_DELAY_ENTRANCE + 0.3, 
          staggerChildren: 0.15,
        }
      : {
          delayChildren: 0,
          staggerChildren: 0,
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
  tap: { scale: 0.95 }
});

const iconHoverVariants: Variants = {
  hover: { rotate: -10, scale: 1.1, transition: { type: "spring", stiffness: 300, damping: 20 } }
};

const arrowHoverVariants: Variants = {
  hover: { x: 3, y: -3, opacity: 1, transition: { duration: 0.2 } }
};

const createTitleInfoCardsAnimation = (animated: boolean): Variants => ({
  hidden: { opacity: 0, y: animated ? 10 : 0 },
  show: {
    opacity: 1,
    y: 0,
    transition: animated
      ? { delay: BASE_DELAY_ENTRANCE + 0.15, duration: 0.7, ease: "easeOut" }
      : { delay: 0, duration: 0 },
  },
});

const MotionEyebrow = motion(Eyebrow);

export default function ContactPage() {
  const t = useTranslations("ContactPage");
  const [introDone, setIntroDone] = useState(false);
  const { entranceAnimationsEnabled, isSmallScreen } = usePerformanceConfig();

  const backgroundLayers = useMemo(() => [
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
      trailCount: isSmallScreen ? 7 : 15,
      stepsPerSecond: 20,
      fadeSeconds: isSmallScreen ? 4: 7,
    },
  ], [isSmallScreen]);

  const linkCardVariant = linkCardVariants(entranceAnimationsEnabled);
  const cardsContainerVariant = cardsContainerVariants(entranceAnimationsEnabled);

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
        containerHover: "hover:bg-rose-500/10 hover:border-rose-500/50 hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]",
        iconColors: "text-rose-300 group-hover:text-rose-100 group-hover:bg-rose-500/40",
        iconMobile: "",
        iconDesktop: "bg-white/5",
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
        containerHover: "hover:bg-sky-500/10 hover:border-sky-500/50 hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.3)]",
        iconColors: "text-sky-300 group-hover:text-sky-100 group-hover:bg-sky-500/40",
        iconMobile: "",
        iconDesktop: "bg-white/5",
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
        containerHover: "hover:bg-violet-500/10 hover:border-violet-500/50 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]",
        iconColors: "text-violet-300 group-hover:text-violet-100 group-hover:bg-violet-500/40",
        iconMobile: "",
        iconDesktop: "bg-white/5",
        text: "group-hover:text-violet-200"
      }
    },
  ];

  const titleInfoCardsAnimation = createTitleInfoCardsAnimation(entranceAnimationsEnabled);

  return (
    <PageLayout
      backgroundLayers={backgroundLayers}
      overlays={<div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/30 to-slate-950"></div>}
    >
      <OneSectionPageSection>
        <Container>
          <ContentBlock>
            <Stack size="lg">
              <Stack size="md">
                <motion.h1
                  className="text-center lg:text-left text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white/95"
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
                  className="text-center lg:text-left mx-auto lg:mx-0 text-pretty lg:text-balance text-lg sm:text-xl text-white/75 max-w-3xl"
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
              </Stack>
              
              <div className="flex flex-col lg:flex-row gap-10 lg:items-start">
                <motion.ul 
                    className="flex flex-col gap-4 w-full"
                    variants={cardsContainerVariant}
                    initial="hidden"
                    animate="show"
                >
                  {highlightCards.map(({ key, icon: Icon, title, description }) => (
                    <InfoCard
                      key={key}
                      title={title}
                      info={description}
                      icon={<Icon className="h-7 w-7 text-sky-300" />}
                      entranceAnimationEnabled={entranceAnimationsEnabled}
                    />
                  ))}
                </motion.ul>

                <Stack size="md" className="hidden lg:flex lg:w-full lg:max-w-[280px] shrink-0">
                  <MotionEyebrow 
                    className="opacity-0 text-white mx-auto lg:mx-0"
                    variants={titleInfoCardsAnimation}
                    initial="hidden"
                    animate="show"
                    align="left"
                  >
                    {t("links.eyebrow")}
                  </MotionEyebrow>
                  <div className="flex flex-col justify-center gap-4 sm:gap-4 mx-auto w-full">
                    {contactLinks.map(({ key, icon: Icon, href, value, label, styles }, index) => (
                      <motion.a
                        key={key}
                        href={href}
                        title={value} 
                        target={key === "email" ? undefined : "_blank"}
                        rel={key === "email" ? undefined : "noreferrer"}
                        variants={linkCardVariant}
                        custom={{ i: index, isIntro: !introDone }}
                        initial="hidden"
                        animate="show"
                        whileHover="hover"
                        whileTap="tap"
                        
                        className={`
                          group relative flex items-center rounded-xl 
                          border border-white/10 bg-white/[0.03] backdrop-blur-md w-full p-3 justify-start gap-3 px-4 overflow-hidden
                          ${styles.containerHover}
                        `}
                      >
                        <motion.div 
                          variants={iconHoverVariants}
                          className={`
                            flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors
                            ${styles.iconColors} 
                            ${styles.iconMobile}
                            ${styles.iconDesktop}
                          `}
                        >
                          <Icon className="h-5 w-5" />
                        </motion.div>

                        <div className="flex flex-1 min-w-0 flex-col justify-center">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 leading-tight">
                            {label}
                          </p>
                          <p className={`text-sm font-semibold text-white/90 truncate ${styles.text}`}>
                            {value}
                          </p>
                        </div>

                        <motion.div variants={arrowHoverVariants} className="block shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <ArrowUpRight className="h-4 w-4 text-white/70" />
                        </motion.div>
                      </motion.a>
                    ))}
                  </div>
                </Stack>
              </div>

              <div className="lg:hidden mt-2">
                <Stack size="lg">
                  <MotionEyebrow 
                    className="opacity-0 text-white/70 mx-auto"
                    variants={titleInfoCardsAnimation}
                    initial="hidden"
                    animate="show"
                    align="center"
                  >
                    {t("links.eyebrow")}
                  </MotionEyebrow>
                  <div className="flex flex-col lgflex-row justify-center gap-4 sm:gap-4 mx-auto w-full">
                    {contactLinks.map(({ key, icon: Icon, href, value, label, styles }, index) => (
                      <motion.a
                        key={key}
                        href={href}
                        title={value} 
                        target={key === "email" ? undefined : "_blank"}
                        rel={key === "email" ? undefined : "noreferrer"}
                        variants={linkCardVariant}
                        custom={{ i: index, isIntro: !introDone }}
                        initial="hidden"
                        animate="show"
                        whileHover="hover"
                        whileTap="tap"
                        className={`
                          group relative flex items-center rounded-xl 
                          border border-white/10 bg-white/[0.03] backdrop-blur-md w-full p-3 justify-start gap-3 px-4 overflow-hidden
                          ${styles.containerHover}
                        `}
                      >
                         <motion.div 
                          variants={iconHoverVariants}
                          className={`
                            flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors
                            ${styles.iconColors} 
                          `}
                        >
                          <Icon className="h-5 w-5" />
                        </motion.div>
                        <div className="flex flex-1 min-w-0 flex-col justify-center">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 leading-tight">
                            {label}
                          </p>
                          <p className={`text-sm font-semibold text-white/90 truncate ${styles.text}`}>
                            {value}
                          </p>
                        </div>
                         <motion.div variants={arrowHoverVariants} className="block shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <ArrowUpRight className="h-4 w-4 text-white/70" />
                        </motion.div>
                      </motion.a>
                    ))}
                  </div>
                </Stack>
              </div>
            </Stack>
          </ContentBlock>
        </Container>
      </OneSectionPageSection>
    </PageLayout>
  );
}