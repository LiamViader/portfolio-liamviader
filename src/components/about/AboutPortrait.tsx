"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";

import { BASE_DELAY_ENTRANCE } from "@/utils/constants";

const portraitVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    boxShadow: "0 25px 60px -40px rgba(56,189,248,0.4)",
  },
  intro: {
    opacity: 1,
    y: 0,
    boxShadow: "0 25px 60px -40px rgba(56,189,248,0.4)",
    transition: { duration: 0.7, ease: "easeOut", delay: BASE_DELAY_ENTRANCE },
  },
  show: {
    opacity: 1,
    y: 0,
    boxShadow: "0 25px 60px -40px rgba(56,189,248,0.4)",
    transition: { duration: 0.45, ease: "easeOut" },
  },
  hover: {
    y: -8,
    boxShadow: "0 30px 80px -50px rgba(56,189,248,0.9)",
    transition: { duration: 0.25, ease: "easeOut" },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.08, ease: "easeOut" },
  },
};

export function AboutPortrait() {
  const [phase, setPhase] = useState<"intro" | "show">("intro");
  const [ready, setReady] = useState(false);

  return (
    <motion.div
      variants={portraitVariants}
      initial="hidden"
      animate={phase}
      onAnimationComplete={(def) => {
        setReady(true);
        if (def === "intro") setPhase("show");
      }}
      whileHover={ready ? "hover" : undefined}
      whileTap={ready ? "tap" : undefined}
      className="relative w-38 aspect-square sm:w-46 md:w-54 rounded-2xl border border-white/20 overflow-hidden bg-gradient-to-br from-sky-500/30 via-sky-500/10 to-indigo-500/30"
      style={{
        pointerEvents: ready ? "auto" : "none",
      }}
    >
      <div
        className="pointer-events-none absolute -inset-10 rounded-[2rem] bg-sky-500/25 blur-3xl"
        aria-hidden
      />

      <div className="relative h-full w-full">
        <Image
          src="/images/test2_liam.png"
          alt="Retrato"
          fill
          sizes="(min-width: 1024px) 260px, (min-width: 768px) 220px, 190px"
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}
