"use client";

import { usePerfTier } from "./usePerfTier";

export type BackgroundsType = "normal" | "semioptimized" | "optimized";

export type PerformanceConfig = {
  entranceAnimationsEnabled: boolean;
  backgroundsOptimization: BackgroundsType;
  isSmallScreen: boolean;
};

export function usePerformanceConfig(): PerformanceConfig {
  const { isHigh, isMedium, isLow, isSmallScreen, isHighRes, isVeryPowerful } = usePerfTier();

  const entranceAnimationsEnabled = isHigh || (isMedium && !isSmallScreen);

  const backgroundsOptimization: BackgroundsType = (() => {
    // Priority Rule: High Res demands optimization unless hardware is exceptional
    //if (isHighRes && !isVeryPowerful) return "optimized"; // TODO: Uncomment IF I Come across a high resolution monitor and it runs poorly

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
