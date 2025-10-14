import { ReactNode, RefObject } from "react";
import { motion, useAnimation } from "framer-motion";

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
        boxShadow: "0 25px 70px rgba(0,0,0,0.6)",
        borderRadius: 16,
        boxSizing: "border-box",
        overflow: "hidden",
        transformOrigin: "top left",
        willChange: "transform, opacity",
        transform: "translateZ(0)",
      }}
      className={`bg-gray-900 rounded-2xl border border-white/10 ${passThrough ? "pointer-events-none" : ""}`}
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </motion.div>
  );
}
