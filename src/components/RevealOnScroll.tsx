"use client";

import { ElementType, ReactNode } from "react";
import { motion } from "framer-motion";

interface RevealOnScrollProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function RevealOnScroll({
  as: Component = "section",
  children,
  className,
  delay = 0,
}: RevealOnScrollProps) {
  const MotionComponent = motion(Component);

  return (
    <MotionComponent
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      variants={{
        hidden: { opacity: 0, y: 48 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            delay,
          },
        },
      }}
    >
      {children}
    </MotionComponent>
  );
}
