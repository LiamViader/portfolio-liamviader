"use client";

import PersonalGallery from "./PersonalGallery";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { Section } from "../layout/Section";
import { Container } from "../layout/Container";
import { ShowcaseBlock } from "../layout/ShowcaseBlock";
import { Stack } from "../layout/Stack";

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
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const PARAGRAPH_KEYS = [
  "paragraphs.first",
  "paragraphs.second",
  "paragraphs.third",
  "paragraphs.fourth",
  "paragraphs.fifth",
];

const MotionStack = motion.create(Stack);

type PersonalSectionProps = {
  entranceAnimationsEnabled: boolean;
};

export function PersonalSection({ entranceAnimationsEnabled }: PersonalSectionProps) {
  const t = useTranslations("AboutPage.personalSection");

  return (
    <Section className="bg-gray-950">
      <Container>
        <ShowcaseBlock>
          <motion.div
            className="relative"
            initial={entranceAnimationsEnabled ? "hidden" : "show"}
            whileInView={entranceAnimationsEnabled ? "show" : undefined}
            animate={entranceAnimationsEnabled ? undefined : "show"}
            viewport={entranceAnimationsEnabled ? { once: true, amount: 0.25 } : undefined}
            variants={sectionVariants}
          >
            <Stack size="md" className="relative mx-auto ">
              <motion.h2
                className="text-2xl sm:text-3xl font-semibold text-white whitespace-nowrap"
                variants={textItem}
              >
                {t("title")}
              </motion.h2>

              <div className="flex flex-col gap-8 xl:gap-12 xl:flex-row xl:items-center">
                <motion.div className="flex-1 space-y-4" variants={blockFadeUp}>
                  <MotionStack size="sm" variants={textGroup}>
                    {PARAGRAPH_KEYS.map((paragraphKey) => (
                      <motion.p
                        key={paragraphKey}
                        className="text-base sm:text-lg text-white/65"
                        variants={textItem}
                      >
                        {t(paragraphKey)}
                      </motion.p>
                    ))}
                  </MotionStack>
                </motion.div>

                <motion.div className="flex-1" variants={blockFadeUp}>
                  <PersonalGallery
                    photos={[
                      { src: "/images/personal_gallery/cala_arenys.jpg" },
                      { src: "/images/personal_gallery/neo_taula.jpg" },
                      { src: "/images/personal_gallery/llums_cel_alps.jpg" },
                      { src: "/images/personal_gallery/landscape_alps.jpg" },
                      { src: "/images/personal_gallery/posta_sol_pais_vasc.jpg" },
                      { src: "/images/personal_gallery/emporda_original.jpg" },
                      { src: "/images/personal_gallery/pineta_liam_croped.jpg" },
                      { src: "/images/personal_gallery/iris_camps.jpg" },
                      { src: "/images/personal_gallery/llibres.jpg" },
                    ]}
                  />
                  <motion.p
                    className="mt-3 hidden lg:block text-xs text-white/40 text-center font-extralight"
                    variants={textItem}
                  >
                    {t("galleryHint")}
                  </motion.p>
                </motion.div>
              </div>
            </Stack>
          </motion.div>
        </ShowcaseBlock>
      </Container>
    </Section>
  );
}
