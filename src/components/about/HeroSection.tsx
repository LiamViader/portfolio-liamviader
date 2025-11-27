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

type HeroSectionProps = {
  personalInfo: PersonalInfo;
  age: number;
};

const titleVariants = {
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
    filter: "drop-shadow(0 0 12px rgba(56,189,248,0.35))",
  },
};

export function HeroSection({ personalInfo, age }: HeroSectionProps) {
  const controls = useAnimationControls();
  const [ready, setReady] = useState(false);
  const t = useTranslations("AboutPage");
  const locale = useLocale() as Locale;

  const localizedLanguages = personalInfo.languages[locale] ?? [];
  const localizedCity = personalInfo.city[locale] ?? personalInfo.city.en;

  useEffect(() => {
    controls.start("animate", {
      delay: BASE_DELAY_ENTRANCE + 0.1,
      duration: 0.7,
    });
  }, [controls]);

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-12 lg:pb-20 lg:pt-34 md:min-h-[950px] ">
      <PulseHexGridCanvas  gridType="Fill" s={50} l={30} hue={240} hueJitter={10} pixelsPerHex={45}/>
      <PulseHexGridCanvas  gridType="Strata" s={60} l={25} hue={240} hueJitter={30} pixelsPerHex={45}/>
      <div className="inset-0 absolute bg-[linear-gradient(to_bottom,_rgba(3,7,18,0.05)_0%,_rgba(3,7,18,0.7)_50%,_rgb(3,7,18)_97%,_rgb(3,7,18)_100%)]"/>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="flex flex-col-reverse gap-8 lg:flex-row items-center lg:gap-16">
          <div className="flex-1 space-y-8">
            <motion.h1
              variants={titleVariants}
              initial="initial"
              animate={controls}
              onAnimationComplete={() => setReady(true)}
              onHoverStart={() => {
                if (!ready) return;
                controls.start("hover", { duration: 0.25 });
              }}
              onHoverEnd={() => {
                if (!ready) return;
                controls.start("animate", { duration: 0.2 });
              }}
              className="text-pretty text-4xl font-semibold tracking-tight text-white/95 sm:text-5xl md:text-6xl text-center lg:text-left"
            >
              {t.rich("hero.title", {
                highlight: (chunks) => (
                  <span className="text-sky-300">{chunks}</span>
                ),
              })}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
                delay: BASE_DELAY_ENTRANCE + 0.2,
              }}
              className="lg:max-w-2xl text-pretty text-lg text-white/70 sm:text-xl text-center lg:text-left"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
                delay: BASE_DELAY_ENTRANCE + 0.3,
              }}
              className="flex w-full flex-wrap justify-center gap-4 lg:justify-start"
            >
              <SkyButton
                href="/projects"
                text={t("hero.ctaProjects")}
              />
              <WhiteButton href="/contact" text={t("hero.ctaContact")} />
            </motion.div>
          </div>

          <div className="flex w-full justify-center lg:w-auto lg:justify-end">
            <AboutPortrait />
          </div>
        </div>

        <motion.ul
          variants={{
            hidden: { opacity: 1 },
            show: {
              opacity: 1,
              transition: {
                delayChildren: BASE_DELAY_ENTRANCE + 0.3,
                staggerChildren: 0.15,
                when: "beforeChildren",
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2"
        >
          <InfoCard
            title={personalInfo.fullName}
            info={t("hero.birthInfo", { age })}
            icon={<User2 className="h-6 w-6 text-sky-300" />}
          />

          <InfoCard
            title={localizedCity}
            info={t("hero.locationInfo")}
            icon={<MapPin className="h-6 w-6 text-sky-300" />}
          />

          <InfoCard
            title={t("hero.languagesTitle")}
            info={localizedLanguages.join(" · ")}
            icon={<Languages className="h-6 w-6 text-sky-300" />}
          />

          <InfoCard
            title={t("hero.whatIDoTitle")}
            info={t("hero.whatIDoInfo")}
            icon={<Sparkles className="h-6 w-6 text-sky-300" />}
          />
        </motion.ul>
      </div>
    </section>
  );
}
