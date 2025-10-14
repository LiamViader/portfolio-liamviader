export type CarouselVariant = "center" | "left" | "right" | "hiddenLeft" | "hiddenRight";

export interface VariantStyle {
  x: string;
  scale: number;
  opacity: number;
  zIndex: number;
}

export type KeyframeAnimation = {
  x: string[];
  scale: number[];
  opacity: number[];
  zIndex: number;
};

export type AnimationTransition = {
  duration?: number;
  ease?: number[];
  times?: number[];
  type?: string;
  stiffness?: number;
  damping?: number;
};

export interface VariantAnimation {
  animate: VariantStyle | KeyframeAnimation;
  transition: AnimationTransition;
}

const variantStyles: Record<CarouselVariant, VariantStyle> = {
  center: {
    x: "-50%",
    scale: 1,
    opacity: 1,
    zIndex: 30,
  },
  left: {
    x: "-98%",
    scale: 0.88,
    opacity: 0.45,
    zIndex: 20,
  },
  right: {
    x: "-2%",
    scale: 0.88,
    opacity: 0.45,
    zIndex: 20,
  },
  hiddenLeft: {
    x: "-145%",
    scale: 0.8,
    opacity: 0,
    zIndex: 10,
  },
  hiddenRight: {
    x: "45%",
    scale: 0.8,
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
        x: ["-50%", "-50%", baseAnimation.x],
        scale: [1, baseAnimation.scale, baseAnimation.scale],
        opacity: [1, baseAnimation.opacity, baseAnimation.opacity],
        zIndex: baseAnimation.zIndex,
      },
      transition: {
        duration: 0.6,
        ease: [0.33, 1, 0.68, 1],
        times: [0, 0.8, 1],
      },
    };
  }

  if (isEnteringCenter && previousVariant) {
    const from = variantStyles[previousVariant];

    return {
      animate: {
        x: [from.x, "-50%", "-50%"],
        scale: [from.scale, baseAnimation.scale, baseAnimation.scale],
        opacity: [from.opacity, baseAnimation.opacity, baseAnimation.opacity],
        zIndex: baseAnimation.zIndex,
      },
      transition: {
        duration: 0.6,
        ease: [0.33, 1, 0.68, 1],
        times: [0, 0.2, 1],
      },
    };
  }

  return {
    animate: baseAnimation,
    transition: { type: "spring", stiffness: 260, damping: 34 },
  };
};

export const getInitialStyle = (variant: CarouselVariant) => variantStyles[variant];
