"use client";

import { useEffect, useState } from "react";

export type PerfTier = "low" | "medium" | "high";

export type PerfTierProfile = {
  tier: PerfTier;
  isLow: boolean;
  isMedium: boolean;
  isHigh: boolean;

  isSmallScreen: boolean; // pantalla físicamente pequeña (móvil/tablet)
  canHover: boolean;      // hay hover real (ratón / puntero fino)
  isTouchDevice: boolean; // táctil "de verdad" (touch + sin hover)

  // Métricas por si quieres debugar/loguear
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

  // --- Hardware básico ---
  const logicalCores =
    typeof nav.hardwareConcurrency === "number"
      ? nav.hardwareConcurrency
      : null;

  const deviceMemoryGB =
    typeof nav.deviceMemory === "number" ? nav.deviceMemory : null;

  // pantalla física (no tamaño de la ventana)
  const screenMinPx = Math.min(window.screen.width, window.screen.height);
  const dpr = window.devicePixelRatio || 1;

  // --- Pointer / hover / touch ---
  const mqCoarse = window.matchMedia?.("(pointer: coarse)");
  const mqFine = window.matchMedia?.("(pointer: fine)");
  const mqHover = window.matchMedia?.("(hover: hover)");
  const mqNoHover = window.matchMedia?.("(hover: none)");
  const mqReduceMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  );

  const coarsePointer = !!mqCoarse && mqCoarse.matches;
  const finePointer = !!mqFine && mqFine.matches;
  const hasHover = !!mqHover && mqHover.matches;
  const hoverNone = !!mqNoHover && mqNoHover.matches;
  const prefersReducedMotion = !!mqReduceMotion && mqReduceMotion.matches;

  const touchPoints =
    (nav as any).maxTouchPoints ?? (nav as any).msMaxTouchPoints ?? 0;
  const hasTouch =
    touchPoints > 0 || "ontouchstart" in window || coarsePointer;

  const isTouchDevice = hasTouch && !hasHover; // típico móvil / tablet
  const canHover = hasHover || finePointer;    // ratón o pen con hover

  // --- User agent (solo para diferenciar escritorio vs móvil) ---
  const ua = (nav.userAgent || nav.vendor || "").toLowerCase();
  const isAndroid = ua.includes("android");
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isMobileUA = /mobi/.test(ua) || isAndroid || isIOS;

  // Pantalla pequeña → móvil/tablet en orientación normal
  const isSmallScreen = screenMinPx <= 900;

  // --- Heurística de performance pensada para TU web ---

  // Empezamos optimistas: HIGH por defecto.
  let tier: PerfTier = "high";

  const mem = deviceMemoryGB ?? 4; // si no sabemos, asumimos algo decente
  const cores = logicalCores ?? 4;

  const looksLikeMobileOrTablet = (isMobileUA || isTouchDevice || coarsePointer) && isSmallScreen;
  const looksLikeDesktop =
    !looksLikeMobileOrTablet && screenMinPx >= 900;

  // 1) Hardware MUY débil → LOW directo
  if (mem <= 2 || cores <= 2) {
    tier = "low";
  }

  // 2) Móviles/tablets modestos → LOW
  if (
    looksLikeMobileOrTablet &&
    mem <= 3 &&
    cores <= 4
  ) {
    tier = "low";
  }

  // 3) Escritorio claramente decente → HIGH se mantiene
  //    (8GB+, 4+ cores, pantalla grande)
  if (
    looksLikeDesktop &&
    mem >= 8 &&
    cores >= 4
  ) {
    tier = "high";
  }

  // 4) Casos intermedios → MEDIUM
  //    (si no están en LOW, pero tampoco claramente pepinos)
  if (tier !== "low") {
    // Escritorio con 4GB / 2–4 cores → MEDIUM
    if (looksLikeDesktop && (mem <= 4 || cores <= 4)) {
      tier = "medium";
    }

    // Móvil/tablet decente → MEDIUM (nunca HIGH, por seguridad con canvas+scroll)
    if (looksLikeMobileOrTablet && tier === "high") {
      tier = "medium";
    }
  }

  // 5) Pantalla muy densa + poca memoria → bajar un poco
  if (tier === "high" && dpr > 2.5 && mem <= 4) {
    tier = "medium";
  }

  // 6) Usuario pide menos animación → nunca HIGH
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
