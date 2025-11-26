"use client";

import React, { type ReactNode, useEffect, useState } from "react";
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

// Pequeño badge para ver los datos del grid en cualquier dispositivo.
// Solo se mostrará en entorno de desarrollo.
function HexGridDebugBadge() {
  if (typeof window === "undefined") return null;

  // Si quieres que también se muestre en producción, quita esta condición:
  if (process.env.NODE_ENV === "production") return null;

  type DebugInfo = {
    width: number;
    height: number;
    rows: number;
    columns: number;
    cellCount: number;
    edgeCount: number;
    pixelsPerHex: number;
    hue: number;
    hueJitter: number;
    s: number;
    l: number;
  };

  const [info, setInfo] = useState<DebugInfo | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      const data = (window as any).__HEX_GRID_DEBUG__ as DebugInfo | undefined;
      if (data) {
        setInfo(data);
      }
    }, 500); // refresca cada 0.5s

    return () => {
      window.clearInterval(id);
    };
  }, []);

  if (!info) return null;

  return (
    <div className="pointer-events-none fixed bottom-2 left-2 z-[9999] rounded bg-black/70 px-2 py-1 text-[10px] leading-tight text-white">
      <div>HEX GRID DEBUG</div>
      <div>
        w:{Math.round(info.width)} · h:{Math.round(info.height)}
      </div>
      <div>
        rows:{info.rows} · cols:{info.columns}
      </div>
      <div>
        cells:{info.cellCount} · edges:{info.edgeCount}
      </div>
      <div>
        pxHex:{info.pixelsPerHex} · hue:{info.hue}±{info.hueJitter}
      </div>
    </div>
  );
}

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

      {/* Badge de debug del grid (solo dev) */}
      <HexGridDebugBadge />

      {overlays}
      <div className={clsx("relative z-10 flex flex-col flex-1", contentClassName)}>
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
