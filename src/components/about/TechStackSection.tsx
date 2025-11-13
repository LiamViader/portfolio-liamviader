"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";

import { type TechIcon } from "./types";

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

const techItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    boxShadow: "0 0px 30px 1px rgba(56,189,248,0.01)",
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.05)",
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const techGridVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.02,
    },
  },
};

type TechStackSectionProps = {
  techStack: TechIcon[];
};

export function TechStackSection({ techStack }: TechStackSectionProps) {
  return (
    <motion.section
      className="relative px-4 pb-20 pt-10 sm:px-6 lg:px-12 lg:pb-24 lg:pt-16 mx-0"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950 to-gray-950" />

      <motion.div
        className="relative mx-auto max-w-[1400px] space-y-8"
        variants={techSectionContainerVariants}
      >
        {/* Título + subtítulo */}
        <motion.div
          className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"
          variants={techTextVariants}
        >
          <div>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Tecnologías y herramientas
            </h2>
            <p className="mt-2 max-w-5xl text-sm text-pretty text-white/70 sm:text-base">
              Un vistazo rápido a las tecnologías con las que me siento
              cómodo trabajando.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(90px,1fr))]"
          variants={techGridVariants}
        >
          {techStack.map((tech) => (
            <motion.div
              key={tech.id}
              variants={techItemVariants}
              whileHover={{
                y: -6,
                boxShadow: "0 0px 30px 1px rgba(56,189,248,0.40)",
                transition: { duration: 0.2, ease: "easeOut" },
                borderColor: "rgba(56,189,248,0.60)",
                backgroundColor: "rgba(56,189,248,0.10)",
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="group flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-1 py-2 backdrop-blur-sm"
            >
              <div className="flex h-20 w-20 items-center justify-center">
                {tech.iconSrc ? (
                  <Image
                    src={tech.iconSrc}
                    alt={tech.label}
                    width={40}
                    height={40}
                    className="object-contain saturate-90"
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
          className="mt-3 text-xs text-white/55 sm:text-[13px] leading-relaxed"
          variants={techTextVariants}
        >
          Algunas herramientas como <span className="font-medium text-sky-300/60">TensorFlow</span> y{" "}
          <span className="font-medium text-sky-300/60">Scikit-Learn</span> las he usado sobre todo en proyectos de aprendizaje: un clasificador
          de imágenes con redes convolucionales, pequeños experimentos de
          machine learning supervisado y no supervisado y algún proyecto de
          optimización. No me considero experto, pero sí tengo una base
          práctica sólida y sigo profundizando.
        </motion.p>
      </motion.div>
    </motion.section>
  );
}
