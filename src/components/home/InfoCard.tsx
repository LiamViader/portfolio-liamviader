"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";

import { usePerfTier } from "@/hooks/usePerfTier";

const BASE_BG = "rgba(255,255,255,0.05)";
const BASE_BORD = "rgba(255,255,255,0.10)";
const HOVER_BG = "rgba(56,189,248,0.10)";
const HOVER_BOR = "rgba(56,189,248,0.60)";
const HOVER_SH = "0 0 30px rgba(56,189,248,0.30)";
const BASE_SH = "0 0 30px rgba(56,189,248,0.01)";

const createTextVariants = (animated: boolean): Variants => ({
  hidden: {
    opacity: 0,
    y: animated ? 8 : 0,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: animated ? 0.5 : 0,
      ease: "easeInOut",
    },
  },
});

const createCardVariantsWithHover = (animated: boolean): Variants => ({
  hidden: {
    opacity: 0,
    y: animated ? 20 : 0,
    backgroundColor: BASE_BG,
    borderColor: BASE_BORD,
  },
  show: {
    opacity: 1,
    y: 0,
    backgroundColor: BASE_BG,
    borderColor: BASE_BORD,
    transition: {
      opacity: {
        duration: animated ? 0.6 : 0,
        ease: "easeOut",
      },
      y: {
        duration: 0.6,
        ease: "easeOut",
      },
      backgroundColor: {
        duration: 0.25,
        ease: "easeOut",
      },
      borderColor: {
        duration: 0.25,
        ease: "easeOut",
      },
      boxShadow: {
        duration: 0.25,
        ease: "easeOut",
      },
      staggerChildren: animated ? 0.15 : 0,
    },
  },
  hover: {
    y: -4,
    backgroundColor: HOVER_BG,
    borderColor: HOVER_BOR,
    boxShadow: HOVER_SH,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.08,
      ease: "easeOut",
    },
  },
});

const createCardVariantsNoHover = (animated: boolean): Variants => ({
  hidden: {
    opacity: 0,
    y: animated ? 20 : 0,
    backgroundColor: BASE_BG,
    borderColor: BASE_BORD,
  },
  show: {
    opacity: 1,
    y: 0,
    backgroundColor: BASE_BG,
    borderColor: BASE_BORD,
    transition: {
      opacity: {
        duration: animated ? 0.6 : 0,
        ease: "easeOut",
      },
      y: {
        duration: 0.6,
        ease: "easeOut",
      },
      staggerChildren: animated ? 0.15 : 0,
    },
  },
  tap: {
    scale: 0.96,
    transition: {
      duration: 0.08,
      ease: "easeOut",
    },
  },
});

export function InfoCard({
  title,
  info,
  icon,
  entranceAnimationEnabled,
}: {
  title: string;
  info: string;
  icon?: React.ReactNode;
  entranceAnimationEnabled: boolean;
}) {
  const [ready, setReady] = useState(false);

  const cardVariants: Variants = createCardVariantsWithHover(entranceAnimationEnabled)

  const textVariants = createTextVariants(entranceAnimationEnabled);

  return (
    <motion.li
      variants={cardVariants}
      onAnimationComplete={() => setReady(true)}
      whileHover={ready ? "hover" : undefined}
      whileTap={ready ? "tap" : undefined}
      className="rounded-2xl border p-5 backdrop-blur-md transform-gpu will-change-[transform,opacity] transition-none flex flex-col gap-3"
      style={{
        backgroundColor: BASE_BG,
        borderColor: BASE_BORD,
        pointerEvents: ready ? "auto" : "none",
      }}
    >
      <motion.div
        variants={textVariants}
        className="flex items-center gap-3 text-white"
      >
        {icon && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center rounded-md bg-white/5 p-2"
          >
            {icon}
          </motion.div>
        )}
        <p className="text-base md:text-lg lg:text-xl font-semibold">{title}</p>
      </motion.div>

      <motion.p
        variants={textVariants}
        className="text-sm md:text-[15.3px] text-white/60 leading-relaxed"
      >
        {info}
      </motion.p>
    </motion.li>
  );
}
