"use client";

import { motion, type Variants } from "framer-motion";
import { InfoCard } from "../home/InfoCard";
import { ListChecks, Workflow, AlertTriangle, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";

import PulseHexGridCanvas, { HexGridStrata, PulseHexGridFill } from "../home/scene/PulseHexGridCanvas";
import { Stack } from "../layout/Stack";
import { SectionHeader } from "../layout/SectionHeader";
import { LastSection } from "../layout/LastSection";
import { Container } from "../layout/Container";
import { ContentBlock } from "../layout/ContentBlock";
import { usePerformanceConfig } from "@/hooks/usePerformanceConfig";

const createSectionAnimation = (animated: boolean): Variants => ({
  hidden: {},
  show: {
    transition: animated ?
      { staggerChildren: 0.10, delayChildren: 0.05 }
      :
      { staggerChildren: 0, delayChildren: 0 }
  },
});

const createHeaderGroupAnimation = (animated: boolean): Variants => ({
  hidden: {},
  show: {
    transition: animated ?
      { staggerChildren: 0.06 }
      :
      { staggerChildren: 0 }
  },
});

const createHeaderItemAnimation = (animated: boolean): Variants => ({
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1, y: 0, transition: animated ?
      { duration: 0.55, ease: "easeOut" }
      :
      { duration: 0 }
  },
});


const createInfoCardsAnimation = (animated: boolean): Variants => ({
  hidden: {},
  show: {
    transition: animated ?
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
  const sectionVariants = createSectionAnimation(entranceAnimationsEnabled);
  const { backgroundsOptimization } = usePerformanceConfig();

  return (
    <LastSection className="relative">
      {backgroundsOptimization === "normal" ?
        <>
          <PulseHexGridCanvas>
            <PulseHexGridFill
              params={{
                pixelsPerHex: 45,
                hue: 240,
                hueJitter: 10,
                s: 50,
                l: 30,
              }}
            />
            <HexGridStrata
              params={{
                pixelsPerHex: 45,
                hue: 240,
                hueJitter: 30,
                s: 60,
                l: 25,
              }}
              options={{
                mode: "diagA",
                amplitude: 5,
                speed: 0.25,
                phaseStep: 0,
              }}
            />
          </PulseHexGridCanvas>
        </>
        :
        <div className="inset-0 absolute bg-[rgb(14,17,51)]" />
      }
      <div className="inset-0 absolute bg-[linear-gradient(to_bottom,_rgb(3,7,18)_0%,rgb(3,7,18)_3%,_rgba(3,7,18,0.6)_40%,_rgba(3,7,18,0.7)_60%,_rgba(3,7,18,0.85)_100%)]" />

      <Container>
        <ContentBlock>
          <motion.div
            className="relative"
            initial="hidden"
            whileInView={entranceAnimationsEnabled ? "show" : undefined}
            animate={entranceAnimationsEnabled ? undefined : "show"}
            viewport={entranceAnimationsEnabled ? { once: true, amount: 0.2 } : undefined}
            variants={sectionVariants}
          >
            <Stack className="relative mx-auto" size="lg">

              <motion.div variants={headerItem}>
                <SectionHeader
                  title={t("philosophySection.title")}
                  description={t("philosophySection.subtitle")}
                  align="left"
                />
              </motion.div>

              <motion.ul
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
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
            </Stack>
          </motion.div>
        </ContentBlock>
      </Container>
    </LastSection>
  );
}
