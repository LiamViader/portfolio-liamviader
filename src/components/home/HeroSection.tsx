"use client";

import { ReactNode, useEffect, useState } from "react";
import { HeroImage } from "@/components/home/HeroImage";
import { motion, useAnimationControls } from "framer-motion";
import { SkyButton, WhiteButton } from "./Buttons";
import { BASE_DELAY_ENTRANCE } from "@/utils/constants";
import { usePerfTier } from "@/hooks/usePerfTier";

interface HeroSectionProps {
  title: ReactNode;
  subtitle: string;
  projectsButtonText: string;
  contactButtonText: string;
  entranceAnimationEnabled: boolean;
}

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
    filter: "drop-shadow(0 0 12px rgba(56,189,248,0.01))",
  },
  hover: {
    scale: 1.02,
    y: -2,
    filter: "drop-shadow(0 0 12px rgba(56,189,248,0.35))",
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

export function HeroSection({
  title,
  subtitle,
  projectsButtonText,
  contactButtonText,
  entranceAnimationEnabled,
}: HeroSectionProps) {
  const controls = useAnimationControls();
  const [ready, setReady] = useState(false);

  const { canHover } = usePerfTier();

  useEffect(() => {
    controls.start("animate", {
      delay: entranceAnimationEnabled ? BASE_DELAY_ENTRANCE + 0.1 : 0,
      duration: entranceAnimationEnabled ? 0.7 : 0,
    });
  }, [controls, entranceAnimationEnabled]);

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-8 lg:gap-16 px-2 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
      <HeroImage entranceAnimationEnabled={entranceAnimationEnabled}/>

      <div className="flex max-w-2xl flex-col items-center gap-8 lg:items-start">
        <motion.h1
          variants={canHover ? titleVariantsWithHover : titleVariantsWithoutHover}
          onAnimationComplete={() => setReady(true)}
          initial="initial"
          animate={controls}
          onHoverStart={() => {
            if (!ready) return;
            controls.start("hover", { duration: 0.25, delay: 0 });
          }}
          onHoverEnd={() => {
            if (!ready) return;
            controls.start("animate", { duration: 0.2, delay: 0 });
          }}
          className="whitespace-pre-line text-balance text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white/95 "
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: entranceAnimationEnabled ? 20 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: entranceAnimationEnabled ? BASE_DELAY_ENTRANCE + 0.2 : 0,
            duration: entranceAnimationEnabled ? 0.7 : 0,
          }}
          className="max-w-2xl text-pretty text-lg text-white/70 sm:text-xl"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: entranceAnimationEnabled ? 20 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: entranceAnimationEnabled ? BASE_DELAY_ENTRANCE + 0.3 : 0,
            duration: entranceAnimationEnabled ? 0.7 : 0,
          }}
          className="flex w-full flex-wrap justify-center gap-4 lg:justify-start"
        >
          <SkyButton href="/projects" text={projectsButtonText} />
          <WhiteButton href="/contact" text={contactButtonText} />
        </motion.div>
      </div>
    </div>
  );
}
