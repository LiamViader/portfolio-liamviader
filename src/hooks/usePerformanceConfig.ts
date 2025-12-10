"use client";

import { usePerfTier } from "./usePerfTier";

export type BackgroundsType = "normal" | "semioptimized" | "optimized";

export type PerformanceConfig = {
  entranceAnimationsEnabled: boolean;
  backgroundsOptimization: BackgroundsType;
  isSmallScreen: boolean;
};

export function usePerformanceConfig(): PerformanceConfig {
  const { isHigh, isMedium, isLow, isSmallScreen } = usePerfTier();

  const entranceAnimationsEnabled = isHigh || (isMedium && !isSmallScreen);

  const backgroundsOptimization: BackgroundsType = (() => {
    if (isHigh || (isMedium && !isSmallScreen)) return "normal";
    if (isMedium) return "semioptimized";
    return "optimized";
  })();

  return {
    entranceAnimationsEnabled,
    backgroundsOptimization,
    isSmallScreen
  };
}
