"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { Languages, MapPin, Sparkles, User2 } from "lucide-react";

import { useTranslations, useLocale } from "next-intl";

import { InfoCard } from "@/components/home/InfoCard";
import { SkyButton, WhiteButton } from "@/components/home/Buttons";
import { BASE_DELAY_ENTRANCE } from "@/utils/constants";

import { AboutPortrait } from "./AboutPortrait";
import { type PersonalInfo } from "./types";
import { type Locale } from "@/i18n/routing";
import PulseHexGridCanvas from "../home/scene/PulseHexGridCanvas";
import { usePerfTier } from "@/hooks/usePerfTier";
import { HeroSectionWrapper } from "../layout/HeroSectionWrapper";
import { Stack } from "../layout/Stack";
import { Container } from "../layout/Container";
import { ContentBlock } from "../layout/ContentBlock";
import { Content } from "next/font/google";
import { ButtonGroup } from "../layout/ButtonGroup";

type HeroSectionProps = {
  personalInfo: PersonalInfo;
  age: number;
  entranceAnimationsEnabled: boolean
};

const titleVariantsWithHover = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 1,
    filter: "drop-shadow(0 0 12px rgba(56,189,248,0.01))",
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "drop-shadow(0 0 12px rgba(56,189,248,0.12))",
  },
  hover: {
    scale: 1.02,
    y: -2,
    filter: "drop-shadow(0 0 12px rgba(56,189,248,0.55))",
  },
};

const titleVariantsWithoutHover = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 1,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

export function HeroSection({ personalInfo, age, entranceAnimationsEnabled }: HeroSectionProps) {
  const controls = useAnimationControls();
  const [ready, setReady] = useState(false);
  const t = useTranslations("AboutPage");
  const locale = useLocale() as Locale;

  const localizedLanguages = personalInfo.languages[locale] ?? [];
  const localizedCity = personalInfo.city[locale] ?? personalInfo.city.en;

  const { canHover } = usePerfTier();

  useEffect(() => {
    controls.start("animate", {
      delay: entranceAnimationsEnabled
        ? BASE_DELAY_ENTRANCE + 0.1
        : 0,
      duration: entranceAnimationsEnabled ? 0.7 : 0,
    });
  }, [controls, entranceAnimationsEnabled]);

  const infoListVariants = entranceAnimationsEnabled
    ? {
        hidden: { opacity: 1 },
        show: {
          opacity: 1,
          transition: {
            delayChildren: BASE_DELAY_ENTRANCE + 0.3,
            staggerChildren: 0.15,
            when: "beforeChildren",
          },
        },
      }
    : {
        hidden: { opacity: 1 },
        show: {
          opacity: 1,
          transition: {
            delayChildren: 0,
            staggerChildren: 0,
            when: "beforeChildren",
          },
        },
      };

  return (
    <HeroSectionWrapper className="relative overflow-hidden">
      <PulseHexGridCanvas
        gridType="Fill"
        s={50}
        l={30}
        hue={240}
        hueJitter={10}
        pixelsPerHex={45}
      />
      <PulseHexGridCanvas
        gridType="Strata"
        s={60}
        l={25}
        hue={240}
        hueJitter={30}
        pixelsPerHex={45}
      />
      <div className="inset-0 absolute bg-[linear-gradient(to_bottom,_rgba(3,7,18,0.05)_0%,_rgba(3,7,18,0.7)_50%,_rgb(3,7,18)_97%,_rgb(3,7,18)_100%)]" />
      <Container>
        <ContentBlock>
          <Stack size="lg">
            <div className="flex flex-col-reverse gap-8 lg:gap-12 lg:flex-row items-center">
              <Stack size="lg" className="max-w-3xl lg:max-w-full z-10">
                <motion.h1
                  variants={canHover ? titleVariantsWithHover : titleVariantsWithoutHover}
                  initial="initial"
                  animate={controls}
                  onAnimationComplete={() => setReady(true)}
                  onHoverStart={() => {
                    if (!ready) return;
                    controls.start("hover", { duration: 0.35 });
                  }}
                  onHoverEnd={() => {
                    if (!ready) return;
                    controls.start("animate", { duration: 0.35 });
                  }}
                  className="text-pretty text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white/95 text-center lg:text-left "
                >
                  {t.rich("hero.title", {
                    highlight: (chunks) => (
                      <span className="text-sky-300">{chunks}</span>
                    ),
                  })}
                </motion.h1>

                <motion.p
                  initial={{
                    opacity: 0,
                    y: entranceAnimationsEnabled ? 18 : 0,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: entranceAnimationsEnabled ? 0.7 : 0,
                    ease: "easeOut",
                    delay: entranceAnimationsEnabled
                      ? BASE_DELAY_ENTRANCE + 0.2
                      : 0,
                  }}
                  className="max-w-full text-pretty text-lg sm:text-xl text-white/70 text-center lg:text-left"
                >
                  {t("hero.subtitle")}
                </motion.p>

                <motion.div
                  initial={{
                    opacity: 0,
                    y: entranceAnimationsEnabled ? 18 : 0,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: entranceAnimationsEnabled ? 0.7 : 0,
                    ease: "easeOut",
                    delay: entranceAnimationsEnabled
                      ? BASE_DELAY_ENTRANCE + 0.3
                      : 0,
                  }}
                  className="flex w-full flex-wrap justify-center gap-4 lg:justify-start"
                >
                  <SkyButton
                    href="/projects"
                    text={t("hero.ctaProjects")}
                  />
                  <WhiteButton href="/contact" text={t("hero.ctaContact")} />
                </motion.div>
              </Stack>

              <div className="flex w-full justify-center lg:w-auto lg:justify-end">
                <AboutPortrait entranceAnimationEnabled={entranceAnimationsEnabled}/>
              </div>
            </div>

            <motion.ul
              variants={infoListVariants}
              initial="hidden"
              animate="show"
              className="grid gap-4 md:grid-cols-2"
            >
              <InfoCard
                title={personalInfo.fullName}
                info={t("hero.birthInfo", { age })}
                icon={<User2 className="h-6 w-6 text-sky-300" />}
                entranceAnimationEnabled={entranceAnimationsEnabled}
              />

              <InfoCard
                title={localizedCity}
                info={t("hero.locationInfo")}
                icon={<MapPin className="h-6 w-6 text-sky-300" />}
                entranceAnimationEnabled={entranceAnimationsEnabled}
              />

              <InfoCard
                title={t("hero.languagesTitle")}
                info={localizedLanguages.join(" · ")}
                icon={<Languages className="h-6 w-6 text-sky-300" />}
                entranceAnimationEnabled={entranceAnimationsEnabled}
              />

              <InfoCard
                title={t("hero.whatIDoTitle")}
                info={t("hero.whatIDoInfo")}
                icon={<Sparkles className="h-6 w-6 text-sky-300" />}
                entranceAnimationEnabled={entranceAnimationsEnabled}
              />
            </motion.ul>
          </Stack>
        </ContentBlock>
      </Container>
    </HeroSectionWrapper>
  );
}
