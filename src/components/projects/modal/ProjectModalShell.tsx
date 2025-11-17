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
        boxShadow: "0 0px 100px rgba(8, 47, 73, 1)",
        borderRadius: 26,
        boxSizing: "border-box",
        overflow: "hidden",
        transformOrigin: "top left",
        willChange: "transform, opacity",
        transform: "translateZ(0)",
      }}
      className={clsx(
        "relative flex h-full flex-col",
        "rounded-[26px] border border-white/20",
        "backdrop-blur-[200px] bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-950/80",
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
