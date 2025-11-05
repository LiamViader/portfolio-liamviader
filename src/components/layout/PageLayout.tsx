"use client";

import { type ReactNode } from "react";
import clsx from "clsx";

import PulseHexGridCanvas, {
  type CanvasSceneProps,
} from "@/components/home/scene/PulseHexGridCanvas";

interface BackgroundLayer extends CanvasSceneProps {
  id?: string;
}

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  backgroundLayers?: BackgroundLayer[];
  overlays?: ReactNode;
}

const DEFAULT_LAYERS: BackgroundLayer[] = [
  {
    id: "fill",
    gridType: "Fill",
    pixelsPerHex: 48,
    hue: 230,
    hueJitter: 8,
    s: 75,
    l: 1,
    className: "opacity-80",
  },
  {
    id: "strata",
    gridType: "Strata",
    pixelsPerHex: 48,
    hue: 240,
    hueJitter: 22,
    s: 65,
    l: 22,
  },
];

const DEFAULT_OVERLAY = (
  <>
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.08),_transparent_60%)]" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gray-950/40 via-gray-950/20 to-gray-950/80" />
  </>
);

export function PageLayout({
  children,
  className,
  contentClassName,
  backgroundLayers = DEFAULT_LAYERS,
  overlays = DEFAULT_OVERLAY,
}: PageLayoutProps) {
  return (
    <div
      className={clsx(
        "relative flex min-h-screen flex-col overflow-hidden bg-slate-950 text-white",
        className,
      )}
    >
      {backgroundLayers.map(({ id, ...layer }) => (
        <PulseHexGridCanvas key={id ?? JSON.stringify(layer)} {...layer} />
      ))}
      {overlays}
      <div className={clsx("relative z-10 flex flex-col", contentClassName)}>
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
