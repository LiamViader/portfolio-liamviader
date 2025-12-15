"use client";

import { Fragment, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { type Locale } from "@/i18n/routing";
import { type TimelineItem } from "./types";

import PulseHexGridCanvas from "../home/scene/PulseHexGridCanvas";
import { usePerfTier } from "@/hooks/usePerfTier";

import { Section } from "../layout/Section";
import { Stack } from "../layout/Stack";
import { Container } from "../layout/Container";
import { ContentBlock } from "../layout/ContentBlock";
import { SectionHeader } from "../layout/SectionHeader";

const pathSectionContainerVariants: Variants = {
  hidden: { y: 30 },
  show: {
    y: 0,
    transition: {
      duration: 0.05,
      ease: "easeOut",
      when: "beforeChildren",
    },
  },
};

const pathHeaderVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const pathColumnsWrapperVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
      delay: 0.02,
      when: "beforeChildren",
      staggerChildren: 0.12,
    },
  },
};

const pathColumnVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      when: "beforeChildren",
    },
  },
};

const pathColumnHeaderVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const pathListVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const pathItemShellVariants: Variants = {
  hidden: {},
  show: {},
};

const pathCardVariantsWithHover: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    boxShadow: "0 0px 30px 1px rgba(56,189,248,0.01)",
    borderColor: "rgba(255,255,255,0.10)",
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.04,
    },
  },
};

const pathCardVariantsWhithoutHover: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    borderColor: "rgba(255,255,255,0.10)",
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.04,
    },
  },
};

const pathLineVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const pathArrowVariants: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const pathDotVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const pathCardInnerVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const MotionStack = motion(Stack);

const getLocalizedValue = <T,>(
  value: Record<Locale, T> | undefined,
  locale: Locale,
) => {
  if (!value) return undefined;
  return value[locale] ?? value.en;
};

type RichTextSegment =
  | { type: "text"; content: string }
  | { type: "highlight"; content: string };

const highlightRegex = /<highlight>(.*?)<\/highlight>/g;

function parseRichText(text: string): RichTextSegment[] {
  const segments: RichTextSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  highlightRegex.lastIndex = 0;

  while ((match = highlightRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }

    segments.push({ type: "highlight", content: match[1] ?? "" });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }

  return segments;
}

type RichTextProps = {
  text: string;
};

function RichText({ text }: RichTextProps) {
  const segments = parseRichText(text);

  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type === "highlight") {
          return (
            <span key={`highlight-${index}`} className="font-semibold text-sky-200/90">
              {segment.content}
            </span>
          );
        }

        return <Fragment key={`text-${index}`}>{segment.content}</Fragment>;
      })}
    </>
  );
}

type TimelineProps = {
  items: TimelineItem[];
  icon: ReactNode;
  locale: Locale;
};

function Timeline({ items, icon, locale }: TimelineProps) {
  const { canHover } = usePerfTier();
  return (
    <div className="relative pl-0">
      <motion.span
        variants={pathArrowVariants}
        className="pointer-events-none absolute left-2 top-0 -translate-x-1/2 flex items-center justify-center"
      >
        <span className="h-0 w-0 border-l-[5px] border-r-[5px] border-b-[7px] border-l-transparent border-r-transparent border-b-sky-400/80" />
      </motion.span>

      <motion.span
        className="pointer-events-none absolute left-2 top-3 bottom-3 w-px bg-gradient-to-b from-sky-400/60 via-sky-400/60 to-transparent"
        variants={pathLineVariants}
      />

      <motion.ul className="flex flex-col gap-6 lg:gap-8" variants={pathListVariants}>
        {items.map((item, index) => (
          <motion.li
            key={`${item.period}-${index}`}
            className="relative pl-6"
            variants={pathItemShellVariants}
          >
            <motion.span
              className="absolute left-0 top-2 flex h-4 w-4 items-center justify-center"
              variants={pathDotVariants}
            >
              <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-sky-400/80">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-950" />
              </span>
            </motion.span>

            <MotionStack
              size="xs"
              variants={canHover ? pathCardVariantsWithHover : pathCardVariantsWhithoutHover}
              whileHover={canHover ? {
                y: -6,
                rotateX: 2,
                rotateY: -2,
                boxShadow: "0 0px 30px 1px rgba(56,189,248,0.30)",
                transition: { duration: 0.25, ease: "easeOut" },
                borderColor: "rgba(56,189,248,0.60)",
                backgroundColor: "rgba(56,189,248,0.10)",
              } : undefined}
              whileTap={{
                scale: 0.97,
              }}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 backdrop-blur-sm"
            >
              <motion.div
                variants={pathCardInnerVariants}
                className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.2em] text-sky-200/80"
              >
                {icon}
                <span>{item.period}</span>
              </motion.div>

              <motion.p
                variants={pathCardInnerVariants}
                className="text-base md:text-lg font-semibold text-white"
              >
                {getLocalizedValue(item.title, locale)}
              </motion.p>

              <motion.p
                variants={pathCardInnerVariants}
                className="text-xs text-sky-200/80"
              >
                {getLocalizedValue(item.place, locale)}
              </motion.p>

              {getLocalizedValue(item.description, locale) ? (
                <motion.p
                  variants={pathCardInnerVariants}
                  className="text-sm md:text-[15.3px] text-white/60 leading-relaxed"
                >
                  <RichText text={getLocalizedValue(item.description, locale)!} />
                </motion.p>
              ) : null}
            </MotionStack>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

type TrajectorySectionProps = {
  academicPath: TimelineItem[];
  experiencePath: TimelineItem[];
  entranceAnimationsEnabled: boolean;
};

export function TrajectorySection({
  academicPath,
  experiencePath,
  entranceAnimationsEnabled,
}: TrajectorySectionProps) {
  const t = useTranslations("AboutPage.trajectory");
  const locale = useLocale() as Locale;

  return (
    <Section className="relative">
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
      <div className="inset-0 absolute bg-[linear-gradient(to_bottom,_rgb(3,7,18)_0%,rgb(3,7,18)_3%,_rgba(3,7,18,0.3)_40%,_rgb(3,7,18)_97%,_rgb(3,7,18)_100%)]" />
      <Container>
        <ContentBlock>
          <motion.div
            className="relative"
            initial={entranceAnimationsEnabled ? "hidden" : "show"}
            whileInView={entranceAnimationsEnabled ? "show" : undefined}
            animate={entranceAnimationsEnabled ? undefined : "show"}
            viewport={entranceAnimationsEnabled ? { once: true, amount: 0.15 } : undefined}
          >
            <MotionStack
              size="lg"
              variants={pathSectionContainerVariants}
            >
              <motion.div variants={pathHeaderVariants}>
                <SectionHeader
                  title={t("title")}
                  description={t("description")}
                  align="left"
                />
              </motion.div>

              <motion.div
                className="grid gap-8 lg:gap-12 lg:grid-cols-2"
                variants={pathColumnsWrapperVariants}
              >
                <MotionStack size="md" variants={pathColumnVariants}>
                  <motion.div
                    className="flex items-center gap-2 lg:gap-4 text-sm lg:text-base font-medium uppercase tracking-[0.25em] text-sky-300"
                    variants={pathColumnHeaderVariants}
                  >
                    <GraduationCap className="h-4 w-4 lg:h-5 lg:w-5 text-sky-300" />
                    <span>{t("academicTitle")}</span>
                  </motion.div>
                  <Timeline
                    items={academicPath}
                    icon={<GraduationCap className="h-3.5 w-3.5 text-sky-200" />}
                    locale={locale}
                  />
                </MotionStack>

                <MotionStack size="md" variants={pathColumnVariants}>
                  <motion.div
                    className="flex items-center gap-2 lg:gap-4 text-sm lg:text-base font-medium uppercase tracking-[0.25em] text-sky-300"
                    variants={pathColumnHeaderVariants}
                  >
                    <Briefcase className="h-4 w-4 lg:h-5 lg:w-5 text-sky-300" />
                    <span>{t("experienceTitle")}</span>
                  </motion.div>
                  <Timeline
                    items={experiencePath}
                    icon={<Briefcase className="h-3.5 w-3.5 text-sky-200" />}
                    locale={locale}
                  />
                </MotionStack>
              </motion.div>
            </MotionStack>
          </motion.div>
        </ContentBlock>
      </Container>
    </Section>
  );
}
