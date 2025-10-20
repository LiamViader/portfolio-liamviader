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
  rootMargin?: string;
  motionProps?: MotionProps;
  noTransform?: boolean;
  noOpacity?: boolean;
  lateral?: boolean;
  duration?: number;
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
  noTransform = false,
  noOpacity = false,
  lateral = false,
  duration = 0.7,
}: ScrollRevealProps) {
  const { ref, inView } = useInView({ triggerOnce: once, threshold: amount, rootMargin });

  const variants = (() => {
    if (noTransform && noOpacity) {
      return {
        hidden: {},
        show: {},
      };
    }
    if (noTransform) {
      return {
        hidden: { opacity: noOpacity ? 1 : 0 },
        show: { opacity: 1 },
      };
    }
    if (noOpacity) {
      if (lateral){
        return {
          hidden: { x: distance },
          show: { x: 0, transitionEnd: { transform: "none" } },
        }
      }
      return {
        hidden: { y: distance },
        show: { y: 0, transitionEnd: { transform: "none" } },
      };
    }
    else{
      if (lateral){
        return {
          hidden: { opacity: 0, x: distance },
          show: { opacity: 1, x: 0, transitionEnd: { transform: "none" } },
        }
      }
      return {
        hidden: { opacity: 0, y: distance },
        show: { opacity: 1, y: 0, transitionEnd: { transform: "none" } },
      };
    }

  })();

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={variants}
        transition={{ duration: duration, ease: "easeOut", delay }}
        style={noTransform ? undefined : inView ? { transform: "none" } : undefined}
        {...motionProps}
      >
        {children}
      </motion.div>
    </div>
  );
}
