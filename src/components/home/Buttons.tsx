"use client";

import { motion, type Variants } from "framer-motion";
import { Link } from "@/i18n/navigation";

const MotionLink = motion.create(Link);

const glintVariants: Variants = {
  rest:  { x: "-120%", opacity: 0 },
  hover: { x: "120%",  opacity: 0.6, transition: { duration: 0.6, ease: "easeOut" } },
};

const rippleVariants: Variants = {
  rest:  { scale: 0.9, opacity: 0 },
  hover: { scale: 1.12, opacity: 0.16, transition: { duration: 0.35, ease: "easeOut" } },
  tap:   { scale: 1.05, opacity: 0.2, transition: { duration: 0.15, ease: "easeOut" } },
};

const skyVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    backgroundColor: "rgba(14,165,233)",
    color: "#ffffff",
    boxShadow: "0 4px 16px rgba(56,189,248,0.30)",
    transition: {
      backgroundColor: { duration: 0.25 },
      boxShadow: { duration: 0.25 },
      type: "spring",
      stiffness: 420,
      damping: 25,
    },
  },
  hover: {
    scale: 1.03,
    y: -1,
    backgroundColor: "rgb(56,189,248)",
    boxShadow: "0 14px 34px rgba(56,189,248,0.45)",
    transition: {
      backgroundColor: { duration: 0.3 },
      boxShadow: { duration: 0.3 },
      type: "spring",
      stiffness: 420,
      damping: 26,
    },
  },
  tap: {
    scale: 0.97,
    y: 0,
    backgroundColor: "rgb(56,189,248)",
    transition: { type: "spring", stiffness: 520, damping: 30 },
  },
};

const whiteVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderColor: "rgba(255,255,255,0.20)",
    color: "rgba(255,255,255,0.85)",
    boxShadow: "0 4px 16px rgba(56,189,248,0.18)",
    transition: {
      backgroundColor: { duration: 0.25 },
      borderColor: { duration: 0.25 },
      color: { duration: 0.25 },
    },
  },
  hover: {
    scale: 1.03,
    y: -1,
    backgroundColor: "rgba(14,165,233,0.10)",
    borderColor: "rgba(14,165,233,0.60)",
    color: "rgba(255,255,255,0.95)",
    boxShadow: "0 14px 34px rgba(56,189,248,0.35)",
    transition: {
      backgroundColor: { duration: 0.3 },
      borderColor: { duration: 0.3 },
      color: { duration: 0.3 },
      boxShadow: { duration: 0.3 },
      type: "spring",
      stiffness: 420,
      damping: 26,
    },
  },
  tap: {
    scale: 0.97,
    y: 0,
    backgroundColor: "rgba(14,165,233,0.10)",
    borderColor: "rgba(14,165,233,0.60)",
    color: "rgba(255,255,255,0.95)",
    transition: { type: "spring", stiffness: 520, damping: 30 },
  },
};

const base =
  "relative overflow-hidden inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

const skyBase = base;
const whiteBase = base + " border";

export function SkyButton({ text, href }: { text: string; href: string }) {
  return (
    <MotionLink
      href={href}
      className={skyBase}
      variants={skyVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-1"
        style={{
          background:
            "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.30) 14%, rgba(255,255,255,0.10) 34%, transparent 56%)",
          transform: "rotate(10deg)",
        }}
        variants={glintVariants}
      />
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(60% 120% at 50% 120%, rgba(255,255,255,0.35) 0%, transparent 60%)",
        }}
        variants={rippleVariants}
      />
      <span>{text}</span>
    </MotionLink>
  );
}

export function WhiteButton({ text, href }: { text: string; href: string }) {
  return (
    <MotionLink
      href={href}
      className={whiteBase}
      variants={whiteVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-1"
        style={{
          background:
            "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.26) 14%, rgba(255,255,255,0.08) 34%, transparent 56%)",
          transform: "rotate(10deg)",
        }}
        variants={glintVariants}
      />
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(60% 120% at 50% 120%, rgba(56,189,248,0.25) 0%, transparent 60%)",
        }}
        variants={rippleVariants}
      />
      <span>{text}</span>
    </MotionLink>
  );
}
