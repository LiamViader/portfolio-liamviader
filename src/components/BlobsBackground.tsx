"use client";

import React from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import type { MotionStyle, MotionValue } from "framer-motion";

type BlobProps = {
  color: string;         // color rgb
  sizeVW: number;        // size in vw
  phase: number;         // phase in randians
  speed: number;         // laps/s
  centerX: number;       // %
  centerY: number;       // %
  ampX: number;          // amplitude x in %
  ampY: number;          // amplitude y in %
  opacity?: number;
  blurPx?: number;       // blur in px
};

type BlobStyle = MotionStyle & {
  "--px": MotionValue<number>;
  "--py": MotionValue<number>;
};

function Blob({
  color,
  sizeVW,
  phase,
  speed,
  centerX,
  centerY,
  ampX,
  ampY,
  opacity = 0.35,
  blurPx = 60,
}: BlobProps) {
  const px = useMotionValue(centerX);
  const py = useMotionValue(centerY);
  const scale = useMotionValue(1);

  useAnimationFrame((t) => {
    const time = t / 1000;
    const ang  = 2 * Math.PI * speed * time + phase;
    px.set(centerX + ampX * Math.cos(ang));
    py.set(centerY + ampY * Math.sin(ang));
    scale.set(1 + 0.08 * Math.sin(ang * 1.5));
  });

  const style: BlobStyle = {
    "--px": px,
    "--py": py,

    position: "absolute",
    width: `${sizeVW}vw`,
    height: `${sizeVW}vw`,

    left: `calc(var(--px) * 1% - ${sizeVW / 2}vw)`,
    top: `calc(var(--py) * 1% - ${sizeVW / 2}vw)`,

    borderRadius: "9999px",
    background: `radial-gradient(closest-side, ${color}, transparent)`,
    opacity,
    filter: `blur(${blurPx}px)`,
    willChange: "transform",
    pointerEvents: "none",

    scale,
  };

  return <motion.div style={style} />;
}

export default function BlobsBackground() {
  const speed = 0.04;        // laps/s
  const centerX = 50;        // in %
  const centerY = 50;
  const ampX = 40;           // in %
  const ampY = 33;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <Blob
        color="rgba(43, 62, 184, 0.9)"
        sizeVW={55}
        phase={0}
        speed={speed}
        centerX={centerX}
        centerY={centerY}
        ampX={ampX}
        ampY={ampY}
        opacity={0.38}
        blurPx={60}
      />
      <Blob
        color="rgba(130, 46, 185, 0.9)"
        sizeVW={48}
        phase={(1.5 * Math.PI) / 3}
        speed={speed}
        centerX={centerX}
        centerY={centerY}
        ampX={ampX}
        ampY={ampY}
        opacity={0.32}
        blurPx={60}
      />
      <Blob
        color="rgba(35, 24, 185, 0.9)"
        sizeVW={62}
        phase={(2 * Math.PI) / 3}
        speed={speed}
        centerX={centerX}
        centerY={centerY}
        ampX={ampX}
        ampY={ampY}
        opacity={0.28}
        blurPx={70}
      />
    </div>
  );
}
