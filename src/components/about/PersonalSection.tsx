"use client";

import PersonalGallery from "./PersonalGallery";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";

const sectionVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.05,
    },
  },
};

const blockFadeUp: Variants = {
  hidden: { opacity: 0, y: 0 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const textGroup: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const textItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const PARAGRAPH_KEYS = [
  "paragraphs.first",
  "paragraphs.second",
  "paragraphs.third",
  "paragraphs.fourth",
  "paragraphs.fifth",
];

export function PersonalSection() {
  const t = useTranslations("AboutPage.personalSection");

  return (
    <section className="bg-gray-950 px-4 pb-20 pt-10 sm:px-6 lg:px-12 lg:pb-24 lg:pt-20">
      <motion.div
        className="relative"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={sectionVariants}
      >

        <div className="relative mx-auto max-w-[1400px] ">
          <motion.h2
            className="text-2xl font-semibold text-white sm:text-3xl"
            variants={textItem}
          >
            {t("title")}
          </motion.h2>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
            {/* Bloque de texto: entra con fade+stagger de cada elemento */}
            <motion.div className="flex-1 space-y-4" variants={blockFadeUp}>
              <motion.div variants={textGroup}>
                {PARAGRAPH_KEYS.map((paragraphKey) => (
                  <motion.p
                    key={paragraphKey}
                    className="text-sm text-white/70 sm:text-base leading-relaxed pt-3 first:pt-3 [&:not(:first-child)]:pt-2"
                    variants={textItem}
                  >
                    {t(paragraphKey)}
                  </motion.p>
                ))}
              </motion.div>
            </motion.div>

            <motion.div className="flex-1" variants={blockFadeUp}>
              <PersonalGallery
                photos={[
                  { src: "/images/personal_gallery/cala_arenys.jpg"},
                  { src: "/images/personal_gallery/neo_taula.jpg"},
                  { src: "/images/personal_gallery/llums_cel_alps.jpg"},
                  { src: "/images/personal_gallery/landscape_alps.jpg"},
                  { src: "/images/personal_gallery/posta_sol_pais_vasc.jpg"},
                  { src: "/images/personal_gallery/emporda_original.jpg"},
                  { src: "/images/personal_gallery/pineta_liam_croped.jpg"},
                  { src: "/images/personal_gallery/iris_camps.jpg"},
                  { src: "/images/personal_gallery/llibres.jpg"},

                ]}
              />
              <motion.p
                className="mt-3 text-xs text-white/50 text-center"
                variants={textItem}
              >
                {t("galleryHint")}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
