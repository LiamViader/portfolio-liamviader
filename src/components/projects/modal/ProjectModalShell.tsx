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
        borderRadius: 26,
        boxSizing: "border-box",
        overflow: "hidden",
        transformOrigin: "top left",
        willChange: "transform, opacity",
        transform: "translateZ(0)",
      }}
      className={clsx(
        "relative flex h-full flex-col",
        "rounded-[26px] border border-white/10",
        "bg-gradient-to-br from-slate-950/35 via-slate-950/35 to-slate-900/30",
        "before:pointer-events-none before:absolute before:-inset-[1px] before:-z-10 before:bg-gradient-to-br before:from-slate-600/20 before:via-transparent before:to-slate-700/20 before:opacity-80 before:content-['']",
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
