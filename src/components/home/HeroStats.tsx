"use client";

import { motion, type Variants } from "framer-motion";
import { BrainCircuit, Gamepad2, Workflow } from "lucide-react";
import { InfoCard } from "@/components/home/InfoCard";
import { BASE_DELAY_ENTRANCE } from "@/utils/constants";
import { useTranslations } from "next-intl";

const icons = {
  BrainCircuit,
  Gamepad2,
  Workflow,
};

// Variantes movidas aquí para limpiar Home.tsx
const createTitleInfoCardsAnimation = (animated: boolean): Variants => ({
  hidden: { opacity: 0, y: animated ? 10 : 0 },
  show: {
    opacity: 1,
    y: 0,
    transition: animated
      ? { delay: BASE_DELAY_ENTRANCE + 0.45, duration: 0.7, ease: "easeOut" }
      : { delay: 0, duration: 0 },
  },
});

const createInfoCardsAnimation = (animated: boolean): Variants => ({
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: animated
      ? {
          delayChildren: BASE_DELAY_ENTRANCE + 0.4,
          staggerChildren: 0.15,
          when: "beforeChildren",
        }
      : {
          delayChildren: 0,
          staggerChildren: 0,
          when: "beforeChildren",
        },
  },
});

interface HeroStatsProps {
  entranceAnimationsEnabled: boolean;
}

export function HeroStats({ entranceAnimationsEnabled }: HeroStatsProps) {
  const t = useTranslations("HomePage");
  
  // Definimos las claves aquí dentro
  const metricKeys: Array<"ai" | "videogames" | "system_design"> = ["ai", "videogames", "system_design"];
  
  const titleInfoCardsAnimation = createTitleInfoCardsAnimation(entranceAnimationsEnabled);
  const infoCardsAnimation = createInfoCardsAnimation(entranceAnimationsEnabled);

  return (
    <div className="relative z-10 mx-auto max-w-6xl w-full pt-15 text-center">
      <motion.p
        variants={titleInfoCardsAnimation}
        initial="hidden"
        animate="show"
        className="z-10 text-base md:text-lg font-medium uppercase tracking-[0.3em] text-white/70"
      >
        {t("work_section.title")}
      </motion.p>

      <motion.ul
        variants={infoCardsAnimation}
        initial="hidden"
        animate="show"
        className="mx-auto grid w-full max-w-6xl gap-4 pt-8 text-left sm:grid-cols-3"
      >
        {metricKeys.map((metricKey, index) => {
          const iconName = t(`work_section.${metricKey}.icon`);
          const IconComponent = icons[iconName as keyof typeof icons];
          return (
            <InfoCard
              key={index}
              title={t(`work_section.${metricKey}.value`)}
              info={t(`work_section.${metricKey}.label`)}
              icon={<IconComponent className="h-7 w-7 text-sky-300" />}
              entranceAnimationEnabled={entranceAnimationsEnabled}
            />
          );
        })}
      </motion.ul>
    </div>
  );
}