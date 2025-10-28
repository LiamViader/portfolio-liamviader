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
        boxShadow: "0 40px 140px rgba(8, 47, 73, 0.65)",
        borderRadius: 24,
        boxSizing: "border-box",
        overflow: "hidden",
        transformOrigin: "top left",
        willChange: "transform, opacity",
        transform: "translateZ(0)",
      }}
      className={clsx(
        "relative flex h-full flex-col",
        "rounded-3xl border border-white/10",
        "bg-gradient-to-br from-slate-950/25 via-slate-950/25 to-slate-900/20",
        "backdrop-blur-sm",
        "transform-gpu will-change-[transform,opacity]",
        "transition-none",
        passThrough && "pointer-events-none"
      )}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(165,180,252,0.12),transparent_50%)]" />
      <div className="relative flex h-full flex-col overflow-hidden">{children}</div>
    </motion.div>
  );
}
