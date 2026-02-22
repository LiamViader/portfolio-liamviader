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
import PulseHexGridCanvas, { HexGridTrails } from "@/components/home/scene/PulseHexGridCanvas";
import { ContactForm } from "@/components/contact/ContactForm";

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
  tap: { scale: 0.98 }
});

const iconHoverVariants: Variants = {
  hover: { scale: 1.15, transition: { type: "spring", stiffness: 300, damping: 20 } }
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


export default function ContactClient() {
  const t = useTranslations("ContactPage");
  const [introDone, setIntroDone] = useState(false);
  const { entranceAnimationsEnabled, isSmallScreen } = usePerformanceConfig();

  const linkCardVariant = useMemo(() => linkCardVariants(entranceAnimationsEnabled), [entranceAnimationsEnabled]);
  const cardsContainerVariant = useMemo(() => cardsContainerVariants(entranceAnimationsEnabled), [entranceAnimationsEnabled]);

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
        containerHover: "",
        iconColors: "text-rose-400/80",
        iconMobile: "",
        iconDesktop: "",
        text: "group-hover:underline"
      }
    },
    {
      key: "linkedin",
      icon: FaLinkedin,
      href: t("links.items.linkedin.href"),
      label: t("links.items.linkedin.label"),
      value: t("links.items.linkedin.value"),
      styles: {
        containerHover: "",
        iconColors: "text-sky-400/85",
        iconMobile: "",
        iconDesktop: "",
        text: "group-hover:underline"
      }
    },
    {
      key: "github",
      icon: FaGithub,
      href: t("links.items.github.href"),
      label: t("links.items.github.label"),
      value: t("links.items.github.value"),
      styles: {
        containerHover: "",
        iconColors: "text-violet-400/80",
        iconMobile: "",
        iconDesktop: "",
        text: "group-hover:underline"
      }
    },
  ];

  return (
    <PageLayout>
      <OneSectionPageSection className="relative overflow-hidden">
        <PulseHexGridCanvas>
          <HexGridTrails
            params={{
              pixelsPerHex: 27,
              hue: 240,
              hueJitter: 20,
              s: 60,
              l: 37,
            }}
            options={{
              trailCount: isSmallScreen ? 9 : 25,
              stepsPerSecond: isSmallScreen ? 15 : 20,
              fadeSeconds: isSmallScreen ? 4 : 7,
            }}
          />
        </PulseHexGridCanvas>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgb(3,7,18)_0%,_rgb(3,7,18)_8%,_rgba(3,7,18,0.3)_50%,_rgb(3,7,18)_92%,_rgb(3,7,18)_100%)] " />
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
                  className="text-center lg:text-left mx-auto lg:mx-0 text-balance text-lg sm:text-xl text-white/75 max-w-3xl"
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

              <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
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


                <Stack size="sm" className="hidden lg:flex lg:w-fit shrink-0">
                  <div className="justify-center mx-auto w-full flex flex-col gap-4">
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
                          w-full justify-start gap-1 overflow-hidden
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
                          <Icon className="h-6 w-6" />
                        </motion.div>

                        <div className="flex flex-col justify-center">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-sky-200/80 leading-tight">
                            {label}
                          </p>
                          <p className={`text-sm font-semibold text-white/80 truncate group-hover:underline`}>
                            {value}
                          </p>
                        </div>
                        <motion.div className="flex">
                          <ArrowUpRight className="h-3 w-3 text-white/80" />
                        </motion.div>
                      </motion.a>

                    ))}
                  </div>
                </Stack>

              </div>

              <div className="lg:hidden mx-auto">
                <Stack size="sm">
                  <div className="justify-center items-center mx-auto w-full flex flex-wrap md:flex-row gap-4 md:gap-6">
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
                          w-fit justify-start gap-1 overflow-hidden
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
                          <Icon className="h-6 w-6" />
                        </motion.div>

                        <div className="flex flex-col justify-center">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-sky-200/80 leading-tight">
                            {label}
                          </p>
                          <p className={`text-sm font-semibold text-white/80 truncate group-hover:underline`}>
                            {value}
                          </p>
                        </div>
                      </motion.a>

                    ))}
                  </div>
                </Stack>
              </div>


            </Stack>
          </ContentBlock>
        </Container>
        <Container>
          <ContentBlock>
            <ContactForm />
          </ContentBlock>
        </Container>
      </OneSectionPageSection>
    </PageLayout>
  );
}
