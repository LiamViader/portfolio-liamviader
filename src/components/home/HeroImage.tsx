"use client";

import Image from "next/image";
import { easeInOut, easeOut, motion, type Variants } from "framer-motion";
import { useState } from "react";
import { BASE_DELAY_ENTRANCE } from "@/utils/constants";
import portraitImg from "../../../public/images/profesional_liam.png";

const RING = "0 0 0 2px rgba(255, 255, 255, 0.4)";
const BASE_GLOW = "0 25px 80px -40px rgba(190,190,248,0.8)";
const HOVER_GLOW = "0 25px 80px -40px rgba(56,189,248,1)";

const createImageVariants = (animated: boolean): Variants => ({
  hidden: {
    y: 0,
    opacity: 0,
    scale: animated ? 0.9 : 1,
    boxShadow: `${RING}, ${BASE_GLOW}`,
  },
  intro: {
    y: 0,
    opacity: 1,
    scale: 1,
    boxShadow: `${RING}, ${BASE_GLOW}`,
    transition: {
      duration: animated ? 0.7 : 0,
      ease: animated ? easeOut : undefined,
      delay: animated ? BASE_DELAY_ENTRANCE + 0.3 : 0,
    },
  },
  show: {
    y: 0,
    opacity: 1,
    scale: 1,
    boxShadow: `${RING}, ${BASE_GLOW}`,
    transition: {
      duration: 0.55,
      ease: easeInOut,
    },
  },
  hover: {
    y: -10,
    boxShadow: `${RING}, ${HOVER_GLOW}`,
    transition: { duration: 0.25, ease: easeOut },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.08, ease: easeOut },
  },
});

export function HeroImage({
  entranceAnimationEnabled,
}: {
  entranceAnimationEnabled: boolean;
}) {
  const [phase, setPhase] = useState<"intro" | "show">("intro");
  const [ready, setReady] = useState(false);

  const imageVariants = createImageVariants(entranceAnimationEnabled);

  return (
    <motion.div
      variants={imageVariants}
      initial="hidden"
      animate={phase}
      onAnimationComplete={(def) => {
        setReady(true);
        if (def === "intro") setPhase("show");
      }}
      whileHover={ready ? "hover" : undefined}
      whileTap={ready ? "tap" : undefined}
      className="relative lg:ml-auto flex h-65 w-47 sm:h-85 sm:w-63 lg:h-100 lg:w-75 shrink-0 items-center justify-center rounded-full p-[3px] transform-gpu transition-none will-change-[transform, opacity]"
      style={{ pointerEvents: ready ? "auto" : "none" }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-full">
        <Image
          src={portraitImg}
          alt="Portrait"
          fill
          priority
          fetchPriority="high"
          decoding="sync"
          placeholder="blur"
          quality={95}
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 260px, 200px"
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}