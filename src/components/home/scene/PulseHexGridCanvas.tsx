"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import PulseHexGridOverlapLine, { type HexGridParams } from "./PulseHexGridOverlapLine";
import PulseHexGridFill from "./PulseHexGridFill";
import HexGridTrails from "./HexGridTrails";
import HexGridStrata from "./HexGridStrata";
import { FillTuning } from "./PulseHexGridFill";

export const grid_types = ['OverlapLine', 'Fill', 'Trails', 'Strata'] as const; 

export type GridType = typeof grid_types[number]; 

export type CanvasSceneProps = {

  className?: string;

  pixelsPerHex?: number;
  hue?: number;
  hueJitter?: number;
  s?: number;
  l?: number;
  gridType?: GridType;
  trailCount?: number;
  stepsPerSecond?: number;
  fadeSeconds?: number;
  fillTuning?: FillTuning;
};

type HexGridTrailParams = {
  trailCount: number;
  stepsPerSecond: number;
  fadeSeconds: number;
}

function renderGrid(finalGridType: GridType, mergedParams: HexGridParams, trailParams?: HexGridTrailParams, filltuning?: FillTuning) {
  switch (finalGridType) {
    case "Fill":
      return <PulseHexGridFill params={mergedParams} tuning={filltuning}/>;

    case "OverlapLine":
      return <PulseHexGridOverlapLine params={mergedParams} />;

    case "Trails":
      return (
        <HexGridTrails
          params={mergedParams}
          options={{ trailCount: trailParams?.trailCount, stepsPerSecond: trailParams?.stepsPerSecond, fadeSeconds: trailParams?.fadeSeconds }}
        />
      );
    case "Strata":
      return (
        <HexGridStrata
          params={mergedParams}
          options={{
            mode: "diagA",      // "rows" | "cols" | "diagA" | "diagB"
            amplitude: 5,    
            speed: 0.25,       
            phaseStep: 0,    
          }}
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
  trailCount,
  stepsPerSecond,
  fadeSeconds,
  fillTuning,
}: CanvasSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  const mergedClassName = clsx(
    "pointer-events-none absolute inset-0 h-full w-full z-0",
    className
  );

  // Default parameter values if not provided
  const mergedParams: HexGridParams = {
    pixelsPerHex: pixelsPerHex ?? 90, // grid density
    hue: hue ?? 200,                  // base hue (0..360)
    hueJitter: hueJitter ?? 8,        // random hue variation ±degrees
    s: s ?? 60,                       // saturation %
    l: l ?? 0,                       // lightness %
  };

  const trailParams = gridType === 'Trails' ? {
    trailCount: trailCount ?? 40,
    stepsPerSecond: stepsPerSecond ?? 22,
    fadeSeconds: fadeSeconds ?? 7,
  }: undefined;

  const finalGridType = gridType ?? 'OverlapLine';

  return (
    <div ref={hostRef} className={mergedClassName}>
      <Canvas
        orthographic
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 20], near: -1000, far: 1000 }}
        gl={{ antialias: true, alpha: true, depth: false, stencil: false, powerPreference: "high-performance" }}
        frameloop="always"
      >
        <fog attach="fog" args={["#04060c", 0.0018]} />
        <Suspense fallback={null}>
          <group>
            {renderGrid(finalGridType, mergedParams, trailParams, fillTuning)}
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
