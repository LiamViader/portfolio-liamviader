"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { Languages, MapPin, Sparkles, User2 } from "lucide-react";

import { InfoCard } from "@/components/home/InfoCard";
import { SkyButton, WhiteButton } from "@/components/home/Buttons";
import { BASE_DELAY_ENTRANCE } from "@/utils/constants";

import { AboutPortrait } from "./AboutPortrait";
import { type PersonalInfo } from "./types";

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

  useEffect(() => {
    controls.start("animate", {
      delay: BASE_DELAY_ENTRANCE + 0.1,
      duration: 0.7,
    });
  }, [controls]);

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-12 lg:pb-20 lg:pt-36 md:min-h-[950px]">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/10 via-gray-950/50 to-gray-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.05),_transparent_50%)]" />

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
              Yo, como <span className="text-sky-300">persona</span> y como{" "}
              <span className="text-sky-300">profesional</span>
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
              Esta página recoge un poco de contexto sobre quién soy, de dónde
              vengo y qué cosas me importan dentro y fuera del trabajo.
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
              <SkyButton href="/projects" text="Ver proyectos" />
              <WhiteButton href="/contact" text="Contacto" />
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
            info={`${age} años · nacido el 16 de febrero de 2001.`}
            icon={<User2 className="h-6 w-6 text-sky-300" />}
          />

          <InfoCard
            title={personalInfo.city}
            info="Actualmente vivo en un pueblo tranquilo cerca de Barcelona, donde nací y encuentro calma para pensar y construir. Estoy abierto vivir en otro lugar si el proyecto y el momento encajan."
            icon={<MapPin className="h-6 w-6 text-sky-300" />}
          />

          <InfoCard
            title="Idiomas"
            info={personalInfo.languages.join(" · ")}
            icon={<Languages className="h-6 w-6 text-sky-300" />}
          />

          <InfoCard
            title="Qué hago"
            info="Ingeniero de software con enfoque técnico y creativo, cómodo tanto diseñando el sistema como construyéndolo."
            icon={<Sparkles className="h-6 w-6 text-sky-300" />}
          />
        </motion.ul>
      </div>
    </section>
  );
}
