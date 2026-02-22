import type { Target, Transition } from "framer-motion";
import { cubicBezier } from "framer-motion";

export type CarouselVariant =
  | "center"
  | "left"
  | "right"
  | "hiddenLeft"
  | "hiddenRight";

type AnimScalar = string | number;

export type VariantStyle = Target & {
  x: AnimScalar;
  scale: number;
  opacity: number;
  zIndex: number;
};

export interface VariantAnimation {
  animate: Target;
  transition: Transition;
}

export const DUR_ENTER_CENTER_S = 1;
export const DUR_OTHER_S = 0.55;

export const DUR_ENTER_CENTER_MS = Math.round(DUR_ENTER_CENTER_S * 1000);
export const DUR_OTHER_MS = Math.round(DUR_OTHER_S * 1000);

export const EASE_LEAVE = cubicBezier(0.22, 1, 0.36, 1);
export const EASE_ENTER = cubicBezier(0.2, 1, 0.32, 1);

const variantStyles: Record<CarouselVariant, VariantStyle> = {
  center: { x: "-50%", scale: 1, opacity: 1, zIndex: 30 },
  left: { x: "-108%", scale: 0.9, opacity: 1, zIndex: 20 },
  right: { x: "8%", scale: 0.9, opacity: 1, zIndex: 20 },
  hiddenLeft: { x: "-120%", scale: 0.5, opacity: 0, zIndex: 10 },
  hiddenRight: { x: "20%", scale: 0.5, opacity: 0, zIndex: 10 },
};

const peekVariantStyles: Record<CarouselVariant, VariantStyle> = {
  center: { x: "-50%", scale: 1, opacity: 1, zIndex: 30 },
  left: { x: "-155%", scale: 0.9, opacity: 1, zIndex: 20 },
  right: { x: "55%", scale: 0.9, opacity: 1, zIndex: 20 },
  hiddenLeft: { x: "-260%", scale: 0.5, opacity: 0, zIndex: 10 },
  hiddenRight: { x: "160%", scale: 0.5, opacity: 0, zIndex: 10 },
};

const hiddenVariants: CarouselVariant[] = ["hiddenLeft", "hiddenRight"];

export const isHiddenVariant = (v: CarouselVariant) => hiddenVariants.includes(v);
export const isCenterVariant = (v: CarouselVariant) => v === "center";

export const getInitialStyle = (v: CarouselVariant, usePeekVariant = false) => {
  return usePeekVariant ? peekVariantStyles[v] : variantStyles[v];
};

export function getVariantAnimationFromTo(
  next: CarouselVariant,
  prev?: CarouselVariant,
  usePeekVariant = false
): VariantAnimation {
  const styles = usePeekVariant ? peekVariantStyles : variantStyles;
  const to = styles[next];

  if (!prev || prev === next) {
    return { animate: to, transition: { duration: DUR_ENTER_CENTER_S, ease: EASE_LEAVE } };
  }

  const from = styles[prev];

  let startX = from.x;
  const startScale = from.scale;
  const startOpacity = from.opacity;

  if (isHiddenVariant(prev)) {
    if (next === "right") {
      startX = styles.hiddenRight.x;
    } else if (next === "left") {
      startX = styles.hiddenLeft.x;
    }
  }

  if (prev === "center" && next !== "center") {
    return {
      animate: {
        x: ["-50%", to.x],
        scale: [1, to.scale],
        opacity: [1, to.opacity],
        zIndex: to.zIndex,
      },
      transition: { duration: DUR_ENTER_CENTER_S, ease: EASE_LEAVE },
    };
  }

  if (next === "center" && prev !== "center") {
    return {
      animate: {
        x: [startX, "-50%"],
        scale: [startScale, 1],
        opacity: [startOpacity, 1],
        zIndex: to.zIndex,
      },
      transition: { duration: DUR_ENTER_CENTER_S, ease: EASE_ENTER },
    };
  }

  const enterRightFromHidden = next === "right" && isHiddenVariant(prev);
  const enterLeftFromHidden = next === "left" && isHiddenVariant(prev);

  if (enterRightFromHidden || enterLeftFromHidden) {
    return {
      animate: {
        x: [startX, to.x],
        scale: [startScale, to.scale],
        opacity: [startOpacity, 1],
        zIndex: to.zIndex,
      },
      transition: { duration: DUR_ENTER_CENTER_S, ease: EASE_ENTER },
    };
  }

  return {
    animate: {
      x: [startX, to.x],
      scale: [startScale, to.scale],
      opacity: [startOpacity, to.opacity],
      zIndex: to.zIndex,
    },
    transition: { duration: DUR_ENTER_CENTER_S, ease: EASE_LEAVE },
  };
}
