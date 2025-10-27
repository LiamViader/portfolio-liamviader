"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 64 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
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
      duration: 0.7,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.12,
      delayChildren: 0.1,
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
    <section className="relative px-4 pb-32 pt-16 sm:px-6 lg:px-10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/35 to-gray-950/70" />
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={sectionVariants}
        className="relative mx-auto max-w-5xl"
      >
        <motion.div
          variants={cardVariants}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-12 text-center shadow-[0_28px_60px_-35px_rgba(56,189,248,0.55)] backdrop-blur-sm"
        >
          <div className="relative z-10 space-y-6">
            <motion.h2 variants={contentVariants} className="text-3xl font-semibold text-white md:text-4xl">
              {t("cta_title")}
            </motion.h2>
            <motion.p variants={contentVariants} className="text-balance text-base text-white/70 md:text-lg">
              {t("cta_text")}
            </motion.p>
            <motion.div variants={contentVariants} className="flex flex-wrap justify-center gap-4">
              <motion.div variants={linkVariants}>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-sky-500/90 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                >
                  {t("cta_button_contact")}
                </Link>
              </motion.div>
              <motion.div variants={linkVariants}>
                <a
                  href="/cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-sky-400/60 hover:bg-sky-500/10"
                >
                  {t("cta_button_cv")}
                </a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

