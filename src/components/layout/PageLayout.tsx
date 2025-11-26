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

const DEFAULT_OVERLAY = (
  <>
  </>
);

export function PageLayout({
  children,
  className,
  contentClassName,
  backgroundLayers = [],
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
      <div className={clsx("relative z-10 flex flex-col flex-1", contentClassName)}>
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
