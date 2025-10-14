"use client";

import { PropsWithChildren } from "react";
import { motion, MotionProps } from "framer-motion";

interface ScrollRevealProps extends PropsWithChildren {
  className?: string;
  delay?: number;
  distance?: number;
  motionProps?: MotionProps;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 48,
  motionProps,
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      viewport={{ once: true, amount: 0.3 }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
