"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import PulseHexGridOverlapLine, { type HexGridParams } from "./PulseHexGridOverlapLine";
import PulseHexGridFill from "./PulseHexGridFill";
import HexGridTrails from "./HexGridTrails";
export const grid_types = ['OverlapLine', 'Fill', 'Trails'] as const; 

export type GridType = typeof grid_types[number]; 

export type CanvasSceneProps = {
  /** Tailwind extra para el wrapper; se fusiona con las clases por defecto */
  className?: string;
  /** Parámetros del grid (ver abajo) con defaults sensatos */
  pixelsPerHex?: number;
  hue?: number;
  hueJitter?: number;
  s?: number;
  l?: number;
  gridType?: GridType;
};

function renderGrid(finalGridType: GridType, mergedParams: HexGridParams) {
  switch (finalGridType) {
    case "Fill":
      return <PulseHexGridFill params={mergedParams} />;

    case "OverlapLine":
      return <PulseHexGridOverlapLine params={mergedParams} />;

    case "Trails":
      return (
        <HexGridTrails
          params={mergedParams}
          options={{ trailCount: 28, stepsPerSecond: 22, fadeSeconds: 5 }}
        />
      );

    default:
      return null;
  }
}

export default function PulseHexGridCanvas({
  className,
  pixelsPerHex,
  hue,
  hueJitter,
  s,
  l,
  gridType,
}: CanvasSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  // Default wrapper classes + any extra from props
  const mergedClassName = clsx(
    "pointer-events-none absolute inset-0 h-full w-full",
    className
  );

  // Default parameter values if not provided
  const mergedParams: HexGridParams = {
    pixelsPerHex: pixelsPerHex ?? 90, // grid density
    hue: hue ?? 200,                  // base hue (0..360)
    hueJitter: hueJitter ?? 8,        // random hue variation ±degrees
    s: s ?? 60,                       // saturation %
    l: l ?? 58,                       // lightness %
  };

  const finalGridType = gridType ?? 'OverlapLine';

  return (
    <div ref={hostRef} className={mergedClassName}>
      <Canvas
        orthographic
        dpr={[1, 2]}
        camera={{ position: [0, 0, 20], near: -1000, far: 1000 }}
        gl={{ antialias: true, alpha: true }}
        frameloop="always"
      >
        <fog attach="fog" args={["#04060c", 0.0018]} />
        <Suspense fallback={null}>
          <group>
            {renderGrid(finalGridType, mergedParams)}
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
