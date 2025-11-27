"use client";

import { type ReactNode } from "react";
import clsx from "clsx";

import PulseHexGridCanvas, {
  type CanvasSceneProps,
} from "@/components/home/scene/PulseHexGridCanvas";

import { usePerfTier } from "@/hooks/usePerfTier";

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

const DEFAULT_OVERLAY = <></>;

/**
 * HUD de debug de performance.
 * Muestra el tier (low/medium/high) y las métricas que devuelve usePerfTier.
 */
function PerfDebugOverlay() {
  const {
    tier,
    isLow,
    isMedium,
    isHigh,
    isSmallScreen,
    canHover,
    isTouchDevice,
    metrics,
  } = usePerfTier();

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-[9999] text-[10px] md:text-xs font-mono">
      <div className="pointer-events-auto max-w-[280px] rounded-lg border border-white/20 bg-black/85 px-3 py-2 shadow-lg backdrop-blur-sm">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-300">
            PERF HUD
          </span>
          <span
            className={clsx(
              "rounded px-1.5 py-[1px] text-[10px] font-semibold uppercase",
              tier === "high" && "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40",
              tier === "medium" && "bg-amber-500/20 text-amber-200 border border-amber-400/40",
              tier === "low" && "bg-red-500/20 text-red-200 border border-red-400/40",
            )}
          >
            {tier}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] leading-snug text-white/80">
          {/* Flags principales */}
          <div>
            <div>isLow: {String(isLow)}</div>
            <div>isMedium: {String(isMedium)}</div>
            <div>isHigh: {String(isHigh)}</div>
          </div>
          <div>
            <div>smallScreen: {String(isSmallScreen)}</div>
            <div>canHover: {String(canHover)}</div>
            <div>touchDevice: {String(isTouchDevice)}</div>
          </div>

          {/* Métricas crudas */}
          <div className="mt-1 border-t border-white/10 pt-1">
            <div>cores: {metrics.logicalCores ?? "?"}</div>
            <div>memGB: {metrics.deviceMemoryGB ?? "?"}</div>
            <div>screenMin: {metrics.screenMinPx ?? "?"}</div>
          </div>
          <div className="mt-1 border-t border-white/10 pt-1">
            <div>dpr: {metrics.dpr?.toFixed(2) ?? "?"}</div>
            <div>hasTouch: {String(metrics.hasTouch)}</div>
            <div>mobileUA: {String(metrics.isMobileUA)}</div>
          </div>
        </div>
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

      {overlays}

      {/* HUD de debug de performance */}
      <PerfDebugOverlay />

      <div className={clsx("relative z-10 flex flex-col flex-1", contentClassName)}>
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
