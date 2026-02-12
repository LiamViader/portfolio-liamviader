"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Section } from "../layout/Section";
import { type TechIcon } from "./types";
import { usePerfTier } from "@/hooks/usePerfTier";
import { ShowcaseBlock } from "../layout/ShowcaseBlock";
import { Container } from "../layout/Container";
import { SectionHeader } from "../layout/SectionHeader";
import { Stack } from "../layout/Stack";

const techSectionContainerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const techTextVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const techHintVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      delay: 0.5
    },
  },
};

const techItemVariantsWithHover: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    boxShadow: "0 0px 30px 1px rgba(56,189,248,0.01)",
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.05)",
    transition: {
      duration: 1,
      ease: "easeOut",
      y: { duration: 0.5, ease: "easeOut" },
    },
  },
};

const techItemVariantsWithoutHover: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.05)",
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

const techGridVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.025,
    },
  },
};

const MotionStack = motion.create(Stack);

type TechStackSectionProps = {
  techStack: TechIcon[];
  entranceAnimationsEnabled: boolean;
};

export function TechStackSection({
  techStack,
  entranceAnimationsEnabled,
}: TechStackSectionProps) {
  const t = useTranslations("AboutPage.techStack");
  const { canHover } = usePerfTier();

  return (
    <Section className="bg-gray-950">
      <Container>
        <ShowcaseBlock>

          <motion.div
            className="relative"
            initial={entranceAnimationsEnabled ? "hidden" : "show"}
            whileInView={entranceAnimationsEnabled ? "show" : undefined}
            animate={entranceAnimationsEnabled ? undefined : "show"}
            viewport={entranceAnimationsEnabled ? { once: true, amount: 0.2 } : undefined}
          >
            <MotionStack
              size="lg"
              variants={techSectionContainerVariants}
            >
              <motion.div
                className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"
                variants={techTextVariants}
              >
                <SectionHeader
                  title={t("title")}
                  description={t("description")}
                  align="left"
                />
              </motion.div>

              <motion.div
                className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(90px,1fr))]"
                variants={techGridVariants}
              >
                {techStack.map((tech) => (
                  <motion.div
                    key={tech.id}
                    variants={canHover ? techItemVariantsWithHover : techItemVariantsWithoutHover}
                    whileHover={canHover ? {
                      y: -6,
                      boxShadow: "0 0px 30px 1px rgba(56,189,248,0.40)",
                      transition: { duration: 0.2, ease: "easeOut" },
                      borderColor: "rgba(56,189,248,0.60)",
                      backgroundColor: "rgba(56,189,248,0.10)",
                    } : undefined}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="group flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-1 py-2"
                  >
                    <div className="flex h-20 w-20 items-center justify-center">
                      {tech.iconSrc ? (
                        <Image
                          src={tech.iconSrc}
                          alt={tech.label}
                          width={40}
                          height={40}
                          className="object-contain saturate-90"
                          style={{ width: 40, height: 40 }}
                        />
                      ) : null}
                    </div>
                    <p className="text-xs text-white/70 text-center">
                      {tech.label}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.p
                className="text-xs text-white/55 sm:text-[13px] leading-relaxed"
                variants={techHintVariants}
              >
                {t.rich("note", {
                  highlight: (chunks) => (
                    <span className="font-medium text-sky-300/60">{chunks}</span>
                  ),
                })}
              </motion.p>
            </MotionStack>
          </motion.div>
        </ShowcaseBlock>
      </Container>
    </Section>
  );
}
