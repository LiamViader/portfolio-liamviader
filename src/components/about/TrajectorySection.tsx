"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";

import { type TimelineItem } from "./types";

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
      staggerChildren: 0.5,
    },
  },
};

const pathItemShellVariants: Variants = {
  hidden: {},
  show: {},
};

const pathCardVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    boxShadow: "0 0px 30px 1px rgba(56,189,248,0.01)",
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

type TimelineProps = {
  items: TimelineItem[];
  icon: ReactNode;
};

function Timeline({ items, icon }: TimelineProps) {
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

      <motion.ul className="space-y-6" variants={pathListVariants}>
        {items.map((item, index) => (
          <motion.li
            key={`${item.title}-${index}`}
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

            <motion.div
              variants={pathCardVariants}
              whileHover={{
                y: -6,
                rotateX: 2,
                rotateY: -2,
                boxShadow: "0 0px 30px 1px rgba(56,189,248,0.30)",
                transition: { duration: 0.3, ease: "easeOut" },
                borderColor: "rgba(56,189,248,0.60)",
                backgroundColor: "rgba(56,189,248,0.10)",
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 backdrop-blur-sm"
            >
              <motion.div
                variants={pathCardInnerVariants}
                className="mb-1 flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.2em] text-sky-200/80"
              >
                {icon}
                <span>{item.period}</span>
              </motion.div>

              <motion.p
                variants={pathCardInnerVariants}
                className="text-[17px] font-semibold text-white"
              >
                {item.title}
              </motion.p>

              <motion.p
                variants={pathCardInnerVariants}
                className="text-[13px] text-white/60"
              >
                {item.place}
              </motion.p>

              {item.description ? (
                <motion.p
                  variants={pathCardInnerVariants}
                  className="mt-2 text-[15px] text-white/60 leading-relaxed"
                >
                  {item.description}
                </motion.p>
              ) : null}
            </motion.div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

type TrajectorySectionProps = {
  academicPath: TimelineItem[];
  experiencePath: TimelineItem[];
};

export function TrajectorySection({
  academicPath,
  experiencePath,
}: TrajectorySectionProps) {
  return (
    <motion.section
      className="relative px-4 pb-20 pt-10 sm:px-6 lg:px-12 lg:pb-24 lg:pt-20"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-950" />

      <motion.div
        className="relative mx-auto max-w-6xl space-y-10"
        variants={pathSectionContainerVariants}
      >
        <motion.div className="space-y-3" variants={pathHeaderVariants}>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Trayectoria académica y experiencia
          </h2>
          <p className="text-sm max-w-4xl text-white/70 sm:text-base">
            De momento mi recorrido pasa por un grado en videojuegos, unas
            primeras prácticas en investigación aplicada y muchas horas de
            aprendizaje autodidacta. Prefiero centrarme en pocas cosas a la vez,
            pero trabajarlas a fondo, de forma que cada etapa cambie
            de verdad cómo pienso y cómo trabajo.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-10 lg:grid-cols-2"
          variants={pathColumnsWrapperVariants}
        >
          <motion.div className="space-y-4" variants={pathColumnVariants}>
            <motion.div
              className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.25em] text-white/60"
              variants={pathColumnHeaderVariants}
            >
              <GraduationCap className="h-4 w-4 text-sky-300" />
              <span>Formación académica</span>
            </motion.div>
            <Timeline
              items={academicPath}
              icon={<GraduationCap className="h-3.5 w-3.5 text-sky-200" />}
            />
          </motion.div>

          <motion.div className="space-y-4" variants={pathColumnVariants}>
            <motion.div
              className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.25em] text-white/60"
              variants={pathColumnHeaderVariants}
            >
              <Briefcase className="h-4 w-4 text-sky-300" />
              <span>Experiencia profesional</span>
            </motion.div>
            <Timeline
              items={experiencePath}
              icon={<Briefcase className="h-3.5 w-3.5 text-sky-200" />}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
