import type { Target, Transition } from "framer-motion";
import { cubicBezier } from "framer-motion";

export type CarouselVariant =
  | "center"
  | "left"
  | "right"
  | "hiddenLeft"
  | "hiddenRight"
  | "hiddenCenter";

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
export const EASE_ENTER = cubicBezier(0.16, 1, 0.3, 1);

const variantStyles: Record<CarouselVariant, VariantStyle> = {
  center: { x: "-50%", scale: 1, opacity: 1, zIndex: 30 },
  left: { x: "-108%", scale: 0.9, opacity: 1, zIndex: 20 },
  right: { x: "8%", scale: 0.9, opacity: 1, zIndex: 20 },
  hiddenLeft: { x: "-120%", scale: 0.5, opacity: 0, zIndex: 10 },
  hiddenRight: { x: "20%", scale: 0.5, opacity: 0, zIndex: 10 },
  hiddenCenter: { x: "-50%", scale: 0.5, opacity: 0, zIndex: 10 },
};

const peekVariantStyles: Record<CarouselVariant, VariantStyle> = {
  center: { x: "-50%", scale: 1, opacity: 1, zIndex: 30 },
  left: { x: "-155%", scale: 0.9, opacity: 1, zIndex: 20 },
  right: { x: "55%", scale: 0.9, opacity: 1, zIndex: 20 },
  hiddenLeft: { x: "-260%", scale: 0.5, opacity: 0, zIndex: 10 },
  hiddenRight: { x: "160%", scale: 0.5, opacity: 0, zIndex: 10 },
  hiddenCenter: { x: "-50%", scale: 0.5, opacity: 0, zIndex: 10 },
};

const hiddenVariants: CarouselVariant[] = ["hiddenLeft", "hiddenRight", "hiddenCenter"];

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
    return { animate: to, transition: { duration: DUR_OTHER_S, ease: EASE_LEAVE } };
  }

  const from = styles[prev];

  if (prev === "center" && next !== "center") {
    return {
      animate: {
        x: ["-50%", to.x],
        scale: [1, to.scale],
        opacity: 1,
        zIndex: to.zIndex,
      },
      transition: { duration: DUR_OTHER_S, ease: EASE_LEAVE, opacity: { duration: 0 } },
    };
  }

  if (next === "center" && prev !== "center") {
    return {
      animate: {
        x: [from.x, "-50%"],
        scale: [from.scale, 1],
        opacity: 1,
        zIndex: to.zIndex,
      },
      transition: { duration: DUR_ENTER_CENTER_S, ease: EASE_ENTER, opacity: { duration: 0 } },
    };
  }

  const enterRightFromHidden = next === "right" && (prev === "hiddenRight" || prev === "hiddenCenter");
  const enterLeftFromHidden = next === "left" && (prev === "hiddenLeft" || prev === "hiddenCenter");

  if (enterRightFromHidden || enterLeftFromHidden) {
    return {
      animate: {
        x: [from.x, to.x],
        scale: [from.scale, to.scale],
        opacity: 1,
        zIndex: to.zIndex,
      },
      transition: { duration: 1.2, ease: EASE_ENTER, opacity: { duration: 0 } },
    };
  }

  return {
    animate: {
      x: [from.x, to.x],
      scale: [from.scale, to.scale],
      opacity: [from.opacity, to.opacity],
      zIndex: to.zIndex,
    },
    transition: { duration: DUR_OTHER_S, ease: EASE_LEAVE },
  };
}
