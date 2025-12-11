"use client";

import { motion, type Variants } from "framer-motion";
import { InfoCard } from "../home/InfoCard";
import { ListChecks, Workflow, AlertTriangle, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";

import PulseHexGridCanvas from "../home/scene/PulseHexGridCanvas";


const createSectionAnimation = (animated: boolean): Variants => ({
  hidden: {},
  show: { transition: animated ? 
    { staggerChildren: 0.10, delayChildren: 0.05 } 
    :
    { staggerChildren: 0, delayChildren: 0}
  },
});

const createHeaderGroupAnimation = (animated: boolean): Variants => ({
  hidden: {},
  show: { transition: animated ? 
    { staggerChildren: 0.06 } 
    :
    { staggerChildren: 0}
  },
});

const createHeaderItemAnimation = (animated: boolean): Variants => ({
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: animated ? 
    { duration: 0.55, ease: "easeOut" } 
    :
    { duration: 0}
  },
});


const createInfoCardsAnimation = (animated: boolean): Variants => ({
  hidden: {},
  show: { transition: animated ? 
    { staggerChildren: 0.08, delayChildren: 0.05 } 
    :
    { staggerChildren: 0, delayChildren: 0 }
  },
});

const PHILOSOPHY_ITEMS = [
  {
    icon: <ListChecks className="h-5 w-5 text-sky-300" />,
    titleKey: "philosophySection.items.requirements.title",
    descriptionKey: "philosophySection.items.requirements.description",
  },
  {
    icon: <AlertTriangle className="h-5 w-5 text-sky-300" />,
    titleKey: "philosophySection.items.validate.title",
    descriptionKey: "philosophySection.items.validate.description",
  },
  {
    icon: <Workflow className="h-5 w-5 text-sky-300" />,
    titleKey: "philosophySection.items.diagrams.title",
    descriptionKey: "philosophySection.items.diagrams.description",
  },
  {
    icon: <Rocket className="h-5 w-5 text-sky-300" />,
    titleKey: "philosophySection.items.prototype.title",
    descriptionKey: "philosophySection.items.prototype.description",
  },
];

type PhilosophySectionProps = {
  entranceAnimationsEnabled: boolean;
};

export function PhilosophySection({ entranceAnimationsEnabled }: PhilosophySectionProps) {
  const t = useTranslations("AboutPage");
  const listVariants = createInfoCardsAnimation(entranceAnimationsEnabled);
  const headerItem = createHeaderItemAnimation(entranceAnimationsEnabled);
  const headerGroup = createHeaderGroupAnimation(entranceAnimationsEnabled);
  const sectionVariants = createSectionAnimation(entranceAnimationsEnabled);

  return (
    <section className="relative px-4 pb-24 pt-10 sm:px-6 lg:px-12 lg:pb-32 lg:pt-20 ">
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
      <div className="inset-0 absolute bg-[linear-gradient(to_bottom,_rgb(3,7,18)_0%,rgb(3,7,18)_3%,_rgba(3,7,18,0.7)_40%,_rgba(3,7,18,0.85)_100%)]" />

      <motion.div
        className="relative"
        initial="hidden"
        whileInView={entranceAnimationsEnabled ? "show" : undefined}
        animate={entranceAnimationsEnabled ? undefined : "show"}
        viewport={entranceAnimationsEnabled ? { once: true, amount: 0.25 } : undefined}
        variants={sectionVariants}
      >
        <div className="relative mx-auto max-w-6xl space-y-8">
          <motion.div className="space-y-2 max-w-3xl" variants={headerGroup}>
            <motion.h2
              className="text-2xl font-semibold text-white sm:text-3xl"
              variants={headerItem}
            >
              {t("philosophySection.title")}
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg text-white/70 leading-relaxed"
              variants={headerItem}
            >
              {t("philosophySection.subtitle")}
            </motion.p>
          </motion.div>

          <motion.ul
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            variants={listVariants}
          >
            {PHILOSOPHY_ITEMS.map((item) => (
              <InfoCard
                key={item.titleKey}
                title={t(item.titleKey)}
                info={t(item.descriptionKey)}
                icon={item.icon}
                entranceAnimationEnabled={entranceAnimationsEnabled}
              />
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </section>
  );
}
