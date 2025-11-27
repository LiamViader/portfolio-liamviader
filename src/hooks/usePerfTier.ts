"use client";

import { useEffect, useState } from "react";

export type PerfTier = "low" | "medium" | "high";

export type PerfTierProfile = {
  tier: PerfTier;
  isLow: boolean;
  isMedium: boolean;
  isHigh: boolean;

  isSmallScreen: boolean;
  canHover: boolean;
  isTouchDevice: boolean;

  metrics: {
    logicalCores: number | null;
    deviceMemoryGB: number | null;
    screenMinPx: number | null;
    dpr: number | null;
    hasTouch: boolean;
    coarsePointer: boolean;
    hasHover: boolean;
    prefersReducedMotion: boolean;
    isMobileUA: boolean;
  };
};

declare global {
  interface Navigator {
    deviceMemory?: number;
    msMaxTouchPoints?: number;
  }
}

function detectPerfTier(): PerfTierProfile {
  if (typeof window === "undefined") {
    return {
      tier: "high",
      isLow: false,
      isMedium: false,
      isHigh: true,
      isSmallScreen: false,
      canHover: false,
      isTouchDevice: false,
      metrics: {
        logicalCores: null,
        deviceMemoryGB: null,
        screenMinPx: null,
        dpr: null,
        hasTouch: false,
        coarsePointer: false,
        hasHover: false,
        prefersReducedMotion: false,
        isMobileUA: false,
      },
    };
  }

  const nav = window.navigator;

  const logicalCores =
    typeof nav.hardwareConcurrency === "number"
      ? nav.hardwareConcurrency
      : null;

  const deviceMemoryGB =
    typeof nav.deviceMemory === "number" ? nav.deviceMemory : null;

  const screenMinPx = Math.min(window.screen.width, window.screen.height);
  const dpr = window.devicePixelRatio || 1;

  const mqCoarse = window.matchMedia?.("(pointer: coarse)");
  const mqFine = window.matchMedia?.("(pointer: fine)");
  const mqHover = window.matchMedia?.("(hover: hover)");
  const mqReduceMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  );

  const coarsePointer = !!mqCoarse && mqCoarse.matches;
  const finePointer = !!mqFine && mqFine.matches;
  const hasHover = !!mqHover && mqHover.matches;
  const prefersReducedMotion = !!mqReduceMotion && mqReduceMotion.matches;

  const touchPoints = nav.maxTouchPoints ?? nav.msMaxTouchPoints ?? 0;
  const hasTouch =
    touchPoints > 0 || "ontouchstart" in window || coarsePointer;

  const isTouchDevice = hasTouch && !hasHover;
  const canHover = hasHover || finePointer;

  const ua = (nav.userAgent || nav.vendor || "").toLowerCase();
  const isAndroid = ua.includes("android");
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isMobileUA = /mobi/.test(ua) || isAndroid || isIOS;

  const isSmallScreen = screenMinPx <= 900;

  let tier: PerfTier = "high";

  const mem = deviceMemoryGB ?? 4;
  const cores = logicalCores ?? 4;

  const looksLikeMobileOrTablet =
    (isMobileUA || isTouchDevice || coarsePointer) && isSmallScreen;
  const looksLikeDesktop =
    !looksLikeMobileOrTablet && screenMinPx >= 900;

  if (mem <= 2 || cores <= 2) {
    tier = "low";
  }

  if (
    looksLikeMobileOrTablet &&
    mem <= 3 &&
    cores <= 4
  ) {
    tier = "low";
  }

  if (
    looksLikeDesktop &&
    mem >= 8 &&
    cores >= 4
  ) {
    tier = "high";
  }

  if (tier !== "low") {
    if (looksLikeDesktop && (mem <= 4 || cores <= 4)) {
      tier = "medium";
    }

    if (looksLikeMobileOrTablet && tier === "high") {
      tier = "medium";
    }
  }

  if (tier === "high" && dpr > 2.5 && mem <= 4) {
    tier = "medium";
  }

  if (prefersReducedMotion && tier === "high") {
    tier = "medium";
  }

  return {
    tier,
    isLow: tier === "low",
    isMedium: tier === "medium",
    isHigh: tier === "high",
    isSmallScreen,
    canHover,
    isTouchDevice,
    metrics: {
      logicalCores,
      deviceMemoryGB,
      screenMinPx,
      dpr,
      hasTouch,
      coarsePointer,
      hasHover,
      prefersReducedMotion,
      isMobileUA,
    },
  };
}

export function usePerfTier(): PerfTierProfile {
  const [profile, setProfile] = useState<PerfTierProfile>(() => detectPerfTier());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqList: MediaQueryList[] = [];
    const addMQ = (query: string) => {
      const mq = window.matchMedia?.(query);
      if (mq) mqList.push(mq);
    };

    addMQ("(pointer: coarse)");
    addMQ("(pointer: fine)");
    addMQ("(hover: hover)");
    addMQ("(hover: none)");
    addMQ("(prefers-reduced-motion: reduce)");

    const update = () => setProfile(detectPerfTier());

    mqList.forEach((mq) => mq.addEventListener("change", update));
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      mqList.forEach((mq) => mq.removeEventListener("change", update));
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return profile;
}
