"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { BASE_DELAY_ENTRANCE } from "@/utils/constants";

const createPortraitVariants = (animated: boolean): Variants => ({
  hidden: {
    opacity: 0,
    y: animated ? 20 : 0,
    boxShadow: "0 10px 60px -20px rgba(255,255,255,0.4)",
  },

  intro: {
    opacity: 1,
    y: 0,
    boxShadow: "0 10px 60px -20px rgba(255,255,255,0.4)",
    transition: {
      duration: animated ? 0.7 : 0,
      ease: animated ? "easeOut" : undefined,
      delay: animated ? BASE_DELAY_ENTRANCE + 0.3 : 0,
    },
  },

  show: {
    opacity: 1,
    y: 0,
    boxShadow: "0 10px 60px -20px rgba(255,255,255,0.4)",
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },

  hover: {
    y: -8,
    boxShadow: "0 10px 60px -20px rgba(56,189,248,0.8)",
    transition: { duration: 0.25, ease: "easeOut" },
  },

  tap: {
    scale: 0.98,
    transition: { duration: 0.08, ease: "easeOut" },
  },
});


export function AboutPortrait({
  entranceAnimationEnabled,
}: {
  entranceAnimationEnabled: boolean;
}) {
  const [phase, setPhase] = useState<"intro" | "show">("intro");
  const [ready, setReady] = useState(false);

  const variants = createPortraitVariants(entranceAnimationEnabled);

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={phase}
      onAnimationComplete={(def) => {
        setReady(true);
        if (def === "intro") setPhase("show");
      }}
      whileHover={ready ? "hover" : undefined}
      whileTap={ready ? "tap" : undefined}
      className="
        relative
        w-[210px] sm:w-[270px] lg:w-[290px]
        aspect-square
        rounded-2xl border border-white/20 overflow-hidden
      "
      style={{ pointerEvents: ready ? "auto" : "none" }}
    >
      <div
        className="pointer-events-none absolute -inset-10 rounded-[2rem] blur-3xl"
        aria-hidden
      />

      <div className="relative h-full w-full">
        <Image
          src="/images/personal_gallery/cala_arenys.jpg"
          alt="Retrato"
          fill
          priority
          fetchPriority="high"
          decoding="async"
          sizes="(min-width: 768px) 540px, (min-width: 640px) 440px, 400px"
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}
