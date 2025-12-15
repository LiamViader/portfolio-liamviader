"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { SkyButton } from "./home/Buttons";
import { LastSection } from "./layout/LastSection";
import { Container } from "./layout/Container";
import { ContentBlock } from "./layout/ContentBlock";
import { Stack } from "./layout/Stack";


const createSectionVariants = (animated: boolean): Variants => ({
  hidden: { 
    opacity: animated ? 0 : 1, 
    y: animated ? 64 : 0 
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: animated ? 0.16 : 0,
    },
  },
});

const createCardVariants = (animated: boolean): Variants => ({
  hidden: { 
    opacity: animated ? 0 : 1, 
    y: animated ? 32 : 0, 
    scale: animated ? 0.96 : 1 
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: animated ? 0.4 : 0,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: animated ? 0.12 : 0,
    },
  },
});

const createContentVariants = (animated: boolean): Variants => ({
  hidden: { 
    opacity: animated ? 0 : 1, 
    y: animated ? 18 : 0 
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animated ? 0.5 : 0,
      ease: "easeOut",
    },
  },
});

const MotionStack = motion(Stack);

export default function CallToAction({ entranceAnimationEnabled }: { entranceAnimationEnabled: boolean }) {
  const t = useTranslations("ProjectsPage");

  const sectionVariants = createSectionVariants(entranceAnimationEnabled);
  const cardVariants = createCardVariants(entranceAnimationEnabled);
  const contentVariants = createContentVariants(entranceAnimationEnabled);

  return (
    <LastSection className="relative">
      
      <div className="absolute inset-0 bg-gray-950" />
      <Container>
        <ContentBlock>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
            className="relative mx-auto"
          >
            <motion.div
              variants={cardVariants}
              className="overflow-hidden text-center"
            >
              <Stack className="relative z-10 max-w-4xl mx-auto" size="lg">
                <motion.h2 variants={contentVariants} className="text-3xl md:text-4xl xl:text-[40px] font-semibold text-white">
                  {t.rich("cta_title", {
                    highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
                  })}
                </motion.h2>
                <motion.p variants={contentVariants} className="text-pretty text-base sm:text-lg text-white/70">
                  {t("cta_text")}
                </motion.p>
                <motion.div variants={contentVariants} className="flex flex-wrap justify-center">
                  <SkyButton text={t("cta_button_contact")} href="/contact"/>
                </motion.div>
              </Stack>
            </motion.div>
          </motion.div>
        </ContentBlock>
      </Container>
    </LastSection>
  );
}