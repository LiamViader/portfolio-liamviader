"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { SkyButton } from "./home/Buttons";

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

export default function CallToAction({ entranceAnimationEnabled }: { entranceAnimationEnabled: boolean }) {
  const t = useTranslations("ProjectsPage");

  const sectionVariants = createSectionVariants(entranceAnimationEnabled);
  const cardVariants = createCardVariants(entranceAnimationEnabled);
  const contentVariants = createContentVariants(entranceAnimationEnabled);

  return (
    <section className="relative px-8 pb-24 lg:pt-6">
      
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/90 to-gray-950" />
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.01, margin: "0px 0px -15% 0px" }}
        variants={sectionVariants}
        className="relative mx-auto max-w-5xl"
      >
        <motion.div
          variants={cardVariants}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-8 px-6 text-center backdrop-blur-xl"
        >
          <div className="relative z-10 space-y-6 px-4 md:px-8 lg:px-12">
            <motion.h2 variants={contentVariants} className="text-2xl font-semibold text-white md:text-4xl drop-shadow-[0_4px_16px_rgba(0,0,0,1)]">
              {t.rich("cta_title", {
                highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
              })}
            </motion.h2>
            <motion.p variants={contentVariants} className="text-pretty text-sm md:text-base text-white/70 lg:text-lg drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">
              {t("cta_text")}
            </motion.p>
            <motion.div variants={contentVariants} className="flex flex-wrap justify-center gap-4">
              <SkyButton text={t("cta_button_contact")} href="/contact"/>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}