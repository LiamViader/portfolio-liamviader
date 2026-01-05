"use client";

import { ReactNode, RefObject } from "react";
import { motion, useAnimation } from "framer-motion";
import clsx from "clsx";

type Controls = ReturnType<typeof useAnimation>;

interface ProjectModalShellProps {
  projectId: number;
  containerRef: RefObject<HTMLDivElement>;
  controls: Controls;
  passThrough: boolean;
  children: ReactNode;
}

export function ProjectModalShell({
  projectId,
  containerRef,
  controls,
  passThrough,
  children,
}: ProjectModalShellProps) {
  return (
    <motion.div
      key={`modal-${projectId}`}
      ref={containerRef}
      animate={controls}
      initial={false}
      style={{
        position: "fixed",
        zIndex: 99999,
        borderRadius: 24,
        boxSizing: "border-box",
        overflow: "hidden",
        transformOrigin: "top left",
        willChange: "transform, opacity",
        transform: "translateZ(0)",
      }}
      className={clsx(
        "relative flex h-full flex-col",
        "border border-white/10",
        "bg-gray-950",
        "transform-gpu will-change-[transform,opacity]",
        "transition-none",
        passThrough && "pointer-events-none"
      )}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="relative flex h-full flex-col overflow-hidden">{children}</div>
    </motion.div>
  );
}
