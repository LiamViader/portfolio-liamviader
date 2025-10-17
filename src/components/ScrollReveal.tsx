"use client";

import { PropsWithChildren } from "react";
import { motion, type MotionProps } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ScrollRevealProps extends PropsWithChildren {
  className?: string;
  delay?: number;
  distance?: number;
  once?: boolean;
  amount?: number;
  rootMargin?: string; // acepta 'px'
  motionProps?: MotionProps;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 48,
  once = true,
  amount = 0.12,
  rootMargin = "200px 0px 200px 0px",
  motionProps,
}: ScrollRevealProps) {
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold: amount,
    rootMargin, // ← aquí sí acepta string tipo "200px 0px 200px 0px"
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: distance },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      style={{ willChange: "opacity, transform" }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
