import type { Target, Transition } from "framer-motion";
import { cubicBezier } from "framer-motion";

export type CarouselVariant = "center" | "left" | "right" | "hiddenLeft" | "hiddenRight";

export type VariantStyle = Partial<Record<keyof Target, any>> & {
  x: string | string[];
  scale: number | number[];
  opacity: number | number[];
  zIndex: number;
};

export type KeyframeAnimation = {
  x: string[];
  scale: number[];
  opacity: number[];
  zIndex: number;
};

export type AnimationTransition = {
  duration?: number;
  ease?: ReturnType<typeof cubicBezier> | Array<ReturnType<typeof cubicBezier>>;
  times?: number[];
  type?: string;
  stiffness?: number;
  damping?: number;
};

export interface VariantAnimation {
  animate: Target;
  transition: Transition;
}

export const DUR_ENTER_CENTER_S = 0.6;
export const DUR_OTHER_S = 0.55;

export const DUR_ENTER_CENTER_MS = Math.round(DUR_ENTER_CENTER_S * 1000);
export const DUR_OTHER_MS = Math.round(DUR_OTHER_S * 1000);

export const EASE_LEAVE = cubicBezier(0.22, 1, 0.36, 1);
export const EASE_ENTER = cubicBezier(0.16, 1, 0.3, 1);

const variantStyles: Record<CarouselVariant, VariantStyle> = {
  center: {
    x: "-50%",
    scale: 1,
    opacity: 1,
    zIndex: 30,
  },
  left: {
    x: "-108%",
    scale: 0.9,
    opacity: 0.5,
    zIndex: 20,
  },
  right: {
    x: "8%",
    scale: 0.9,
    opacity: 0.5,
    zIndex: 20,
  },
  hiddenLeft: {
    x: "-145%",
    scale: 0.5,
    opacity: 0,
    zIndex: 10,
  },
  hiddenRight: {
    x: "45%",
    scale: 0.5,
    opacity: 0,
    zIndex: 10,
  },
};

const hiddenVariants: CarouselVariant[] = ["hiddenLeft", "hiddenRight"];

export const isHiddenVariant = (variant: CarouselVariant) => hiddenVariants.includes(variant);
export const isCenterVariant = (variant: CarouselVariant) => variant === "center";

export const getVariantAnimation = (
  variant: CarouselVariant,
  previousVariant: CarouselVariant | undefined,
): VariantAnimation => {
  const baseAnimation = variantStyles[variant];

  const isLeavingCenter = previousVariant === "center" && variant !== "center";
  const isEnteringCenter = variant === "center" && previousVariant && previousVariant !== "center";

  if (isLeavingCenter) {
    return {
      animate: {
        x: ["-50%", baseAnimation.x],
        scale: [1, baseAnimation.scale],
        opacity: [1, baseAnimation.opacity],
        zIndex: baseAnimation.zIndex,
      },
      transition: {
        duration: DUR_OTHER_S,
        ease: EASE_LEAVE,
      },
    };
  }

  if (isEnteringCenter && previousVariant) {
    const from = variantStyles[previousVariant];

    return {
      animate: {
        x: [from.x, "-50%"],
        scale: [from.scale, baseAnimation.scale],
        opacity: baseAnimation.opacity,
        zIndex: baseAnimation.zIndex,
      },
      transition: {
        duration: DUR_ENTER_CENTER_S,
        ease: EASE_ENTER,
        opacity: { duration: 0 },
      },
    };
  }

  return {
    animate: baseAnimation,
    transition: { duration: DUR_OTHER_S, ease: EASE_LEAVE },
  };
};

export const getInitialStyle = (variant: CarouselVariant) => variantStyles[variant];
