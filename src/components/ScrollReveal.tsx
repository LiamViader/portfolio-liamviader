"use client";

import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { motion, type MotionProps } from "framer-motion";
import clsx from "clsx";
import { useInView } from "react-intersection-observer";

interface ScrollRevealProps extends PropsWithChildren {
  className?: string;
  delay?: number;
  distance?: number;
  once?: boolean;
  amount?: number;
  rootMargin?: string;
  motionProps?: MotionProps;
}

const FALLBACK_OVERLAY_COLOR = "rgba(2, 6, 23, 1)";

export function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 48,
  once = true,
  amount = 0.12,
  rootMargin = "200px 0px 200px 0px",
  motionProps,
  noTransform = false,
}: ScrollRevealProps & { noTransform?: boolean }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { ref, inView } = useInView({ triggerOnce: once, threshold: amount, rootMargin });

  const [{ backgroundColor, backgroundImage, backgroundPosition, backgroundSize, backgroundRepeat }, setOverlayBackground] =
    useState<{
      backgroundColor: string;
      backgroundImage?: string;
      backgroundPosition?: string;
      backgroundSize?: string;
      backgroundRepeat?: string;
    }>({ backgroundColor: FALLBACK_OVERLAY_COLOR });
  const [overlayBorderRadius, setOverlayBorderRadius] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const fallback = { backgroundColor: FALLBACK_OVERLAY_COLOR } as const;

    const resolveBackground = (element: HTMLElement | null): typeof fallback & {
      backgroundImage?: string;
      backgroundPosition?: string;
      backgroundSize?: string;
      backgroundRepeat?: string;
    } => {
      let current: HTMLElement | null = element;

      while (current) {
        const computed = window.getComputedStyle(current);
        const bgImage = computed.backgroundImage;
        const bgColor = computed.backgroundColor;
        const hasImage = !!bgImage && bgImage !== "none";
        const hasColor = !!bgColor && bgColor !== "transparent" && bgColor !== "rgba(0, 0, 0, 0)";

        if (hasImage || hasColor) {
          return {
            backgroundColor: hasColor ? bgColor : fallback.backgroundColor,
            ...(hasImage
              ? {
                  backgroundImage: bgImage,
                  backgroundPosition: computed.backgroundPosition,
                  backgroundSize: computed.backgroundSize,
                  backgroundRepeat: computed.backgroundRepeat,
                }
              : {}),
          };
        }

        current = current.parentElement;
      }

      return fallback;
    };

    const findBorderRadius = (element: HTMLElement | null): string | undefined => {
      const queue: HTMLElement[] = [];
      if (element) {
        queue.push(element);
      }

      while (queue.length > 0) {
        const current = queue.shift();
        if (!current) {
          continue;
        }

        const computed = window.getComputedStyle(current);
        const hasRadius =
          computed.borderTopLeftRadius !== "0px" ||
          computed.borderTopRightRadius !== "0px" ||
          computed.borderBottomRightRadius !== "0px" ||
          computed.borderBottomLeftRadius !== "0px";

        if (hasRadius) {
          return computed.borderRadius;
        }

        queue.push(...Array.from(current.children) as HTMLElement[]);
      }

      return undefined;
    };

    setOverlayBackground(resolveBackground(wrapperRef.current));
    setOverlayBorderRadius(findBorderRadius(wrapperRef.current ?? null));
  }, []);

  const overlayStyle = useMemo(
    () => ({
      backgroundColor,
      ...(backgroundImage
        ? {
            backgroundImage,
            backgroundPosition,
            backgroundSize,
            backgroundRepeat,
          }
        : {}),
      borderRadius: overlayBorderRadius ?? "inherit",
    }),
    [backgroundColor, backgroundImage, backgroundPosition, backgroundRepeat, backgroundSize, overlayBorderRadius],
  );

  const {
    className: motionClassName,
    style: motionStyle,
    transition: motionTransition,
    variants: motionVariants,
    ...restMotionProps
  } = motionProps ?? {};

  const variants =
    motionVariants ??
    (noTransform
      ? { hidden: {}, show: {} }
      : { hidden: { y: distance }, show: { y: 0, transitionEnd: { transform: "none" } } });

  const transition = motionTransition ?? { duration: 0.7, ease: "easeOut", delay };

  const animationState = inView ? "show" : "hidden";

  return (
    <div ref={(node) => { wrapperRef.current = node; ref(node); }} className={className}>
      <motion.div
        initial="hidden"
        animate={animationState}
        variants={variants}
        transition={transition}
        style={{
          ...(!noTransform && inView ? { transform: "none" } : undefined),
          ...(overlayBorderRadius ? { borderRadius: overlayBorderRadius } : undefined),
          ...motionStyle,
        }}
        className={clsx("relative", motionClassName)}
        {...restMotionProps}
      >
        <div className="relative z-[1]">{children}</div>
        <motion.div
          aria-hidden
          initial="hidden"
          animate={animationState}
          variants={{ hidden: { opacity: 1 }, show: { opacity: 0 } }}
          transition={transition}
          className="pointer-events-none absolute inset-0 z-[2]"
          style={overlayStyle}
        />
      </motion.div>
    </div>
  );
}
