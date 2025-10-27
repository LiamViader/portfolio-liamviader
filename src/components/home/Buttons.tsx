"use client";

import { motion, type Variants } from "framer-motion";
import { Link } from "@/i18n/navigation";

const MotionLink = motion(Link);


const skyVariants: Variants = {
  rest: {
    scale: 1,
    backgroundColor: "rgba(14,165,233,0.9)",
    color: "#ffffff",
    boxShadow: "0 4px 16px rgba(56,189,248,0.3)",
    transition: {
      backgroundColor: { duration: 0.25 },
      boxShadow: { duration: 0.25 },
      type: "spring",
      stiffness: 420,
      damping: 25,
    },
  },
  hover: {
    scale: 1.05,
    backgroundColor: "rgb(56,189,248)",
    boxShadow: "0 6px 30px rgba(56,189,248,0.45)",
    transition: {
      backgroundColor: { duration: 0.35 },
      boxShadow: { duration: 0.35 },
      type: "spring",
      stiffness: 420,
      damping: 25,
    },
  },
  tap: {
    scale: 0.97,
    transition: { type: "spring", stiffness: 500, damping: 28 },
  },
};

const skyBase =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

const whiteVariants: Variants = {
  rest: {
    scale: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderColor: "rgba(255,255,255,0.20)",
    color: "rgba(255,255,255,0.80)",
    boxShadow: "0 4px 16px rgba(56,189,248,0.3)",
    transition: {
      backgroundColor: { duration: 0.25 },
      borderColor: { duration: 0.25 },
      color: { duration: 0.25 },
    },
  },
  hover: {
    scale: 1.05,
    backgroundColor: "rgba(14,165,233,0.10)",
    borderColor: "rgba(14,165,233,0.60)",    
    color: "rgba(255,255,255,0.92)",
    boxShadow: "0 6px 30px rgba(56,189,248,0.45)",
    transition: {
      backgroundColor: { duration: 0.35 },
      borderColor: { duration: 0.35 },
      color: { duration: 0.35 },
      boxShadow: { duration: 0.35 },
    },
  },
  tap: {
    scale: 0.97,
    transition: { type: "spring", stiffness: 500, damping: 28 },
  },
};

const whiteBase =
  "inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm font-semibold gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

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
      {text}
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
      {text}
    </MotionLink>
  );
}

