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
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    };
  }

  if (isEnteringCenter && previousVariant) {
    const from = variantStyles[previousVariant];

    return {
      animate: {
        x: [from.x, "-50%"],
        scale: [from.scale, baseAnimation.scale],
        opacity: [from.opacity, baseAnimation.opacity],
        zIndex: baseAnimation.zIndex,
      },
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    };
  }

  return {
    animate: baseAnimation,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  };
};

export const getInitialStyle = (variant: CarouselVariant) => variantStyles[variant];
