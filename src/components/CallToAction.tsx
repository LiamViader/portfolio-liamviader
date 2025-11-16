"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { SkyButton } from "./home/Buttons";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 64 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.16,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.12,
    },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export default function CallToAction() {
  const t = useTranslations("ProjectsPage");

  return (
    <section className="relative px-4 pb-32 pt-2 lg:px-10">
      
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
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-9 text-center backdrop-blur-xl"
        >
          <div className="relative z-10 space-y-6">
            <motion.h2 variants={contentVariants} className="text-3xl font-semibold text-white md:text-4xl drop-shadow-[0_4px_16px_rgba(0,0,0,1)]">
              {t.rich("cta_title", {
                highlight: (chunks) => <span className="text-sky-300">{chunks}</span>,
              })}
            </motion.h2>
            <motion.p variants={contentVariants} className="text-pretty text-base text-white/70 md:text-lg drop-shadow-[0_4px_8px_rgba(0,0,0,1)]">
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

