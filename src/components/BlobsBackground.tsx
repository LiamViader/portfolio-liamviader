// BlobsBackground.tsx
"use client";

import React from "react";
import { motion, useAnimationFrame, useMotionValue, MotionStyle } from "framer-motion";

type BlobProps = {
  color: string;         // color RGBA del núcleo del radial
  sizeVW: number;        // tamaño del blob en vw
  phase: number;         // desfase de fase (radianes) para que sigan la misma ruta desfasados
  speed: number;         // vueltas por segundo aproximadas (velocidad angular)
  centerX: number;       // % horizontal del centro de la elipse (0–100)
  centerY: number;       // % vertical del centro de la elipse (0–100)
  ampX: number;          // amplitud horizontal en %
  ampY: number;          // amplitud vertical en %
  opacity?: number;      // opacidad del blob (0–1)
  blurPx?: number;       // blur en px
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

  const style: MotionStyle = {
    // ✅ CSS vars como MotionValue (OK en MotionStyle)
    ["--px" as any]: px,
    ["--py" as any]: py,

    position: "absolute",
    width: `${sizeVW}vw`,
    height: `${sizeVW}vw`,

    // ✅ centrado sin usar transform; evitamos chocar con `scale`
    left: `calc(var(--px) * 1% - ${sizeVW / 2}vw)`,
    top:  `calc(var(--py) * 1% - ${sizeVW / 2}vw)`,

    borderRadius: "9999px",
    background: `radial-gradient(closest-side, ${color}, transparent)`,
    opacity,
    filter: `blur(${blurPx}px)`,
    willChange: "transform",
    pointerEvents: "none",

    // ✅ MotionValue permitido en MotionStyle
    scale,
  };

  return <motion.div style={style} />;
}

export default function BlobsBackground() {
  // ⚙️ Ajustes “globales” de la ruta (todos siguen la misma, con desfase)
  const speed = 0.04;        // vueltas/seg (0.02 ≈ una vuelta cada ~50s)
  const centerX = 50;        // centro de la elipse en %
  const centerY = 50;
  const ampX = 40;           // amplitud en % (más grande = ocupa más pantalla)
  const ampY = 33;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Tres blobs con el mismo camino, desfasados 120° */}
      <Blob
        color="rgba(99, 118, 241, 0.9)" // indigo-500
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
        color="rgba(184, 92, 246, 0.9)" // violet-500
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
        color="rgba(81, 70, 229, 0.9)" // indigo-600
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
