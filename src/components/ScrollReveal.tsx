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
  const motionWrapperRef = useRef<HTMLDivElement | null>(null);
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
  const [overlayOffsets, setOverlayOffsets] =
    useState<{ top: number; right: number; bottom: number; left: number } | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const fallback = { backgroundColor: FALLBACK_OVERLAY_COLOR } as const;

    const hasColor = (value: string | null | undefined) =>
      !!value && value !== "transparent" && value !== "rgba(0, 0, 0, 0)";

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
        const hasAnyColor = hasColor(bgColor);

        if (hasImage || hasAnyColor) {
          return {
            backgroundColor: hasAnyColor ? bgColor : fallback.backgroundColor,
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

    const findBackdropSurface = (element: HTMLElement | null): HTMLElement | null => {
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
        const backdrop = computed.backdropFilter || (computed as unknown as { webkitBackdropFilter?: string }).webkitBackdropFilter;
        const hasBackdrop = !!backdrop && backdrop !== "none";

        if (hasBackdrop) {
          return current;
        }

        queue.push(...Array.from(current.children) as HTMLElement[]);
      }

      return null;
    };

    const updateOverlay = () => {
      const container = motionWrapperRef.current;

      if (!container) {
        setOverlayBackground(fallback);
        setOverlayBorderRadius(undefined);
        setOverlayOffsets(undefined);
        return;
      }

      const backdropSurface = findBackdropSurface(container);

      if (!backdropSurface) {
        setOverlayBackground(resolveBackground(wrapperRef.current));
        setOverlayBorderRadius(undefined);
        setOverlayOffsets(undefined);
        return;
      }

      const computed = window.getComputedStyle(backdropSurface);
      const bgImage = computed.backgroundImage;
      const hasImage = !!bgImage && bgImage !== "none";
      const background = {
        backgroundColor: hasColor(computed.backgroundColor) ? computed.backgroundColor : fallback.backgroundColor,
        ...(hasImage
          ? {
              backgroundImage: bgImage,
              backgroundPosition: computed.backgroundPosition,
              backgroundSize: computed.backgroundSize,
              backgroundRepeat: computed.backgroundRepeat,
            }
          : {}),
      };

      const containerRect = container.getBoundingClientRect();
      const surfaceRect = backdropSurface.getBoundingClientRect();

      setOverlayBackground(background);
      setOverlayBorderRadius(computed.borderRadius);
      setOverlayOffsets({
        top: surfaceRect.top - containerRect.top,
        right: containerRect.right - surfaceRect.right,
        bottom: containerRect.bottom - surfaceRect.bottom,
        left: surfaceRect.left - containerRect.left,
      });
    };

    updateOverlay();

    const resizeObserver = new ResizeObserver(() => updateOverlay());
    const container = motionWrapperRef.current;
    if (container) {
      resizeObserver.observe(container);
    }

    window.addEventListener("resize", updateOverlay);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateOverlay);
    };
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
      ...(overlayOffsets
        ? {
            top: overlayOffsets.top,
            right: overlayOffsets.right,
            bottom: overlayOffsets.bottom,
            left: overlayOffsets.left,
          }
        : { top: 0, right: 0, bottom: 0, left: 0 }),
    }),
    [
      backgroundColor,
      backgroundImage,
      backgroundPosition,
      backgroundRepeat,
      backgroundSize,
      overlayBorderRadius,
      overlayOffsets,
    ],
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
        ref={motionWrapperRef}
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
          className="pointer-events-none absolute z-[2]"
          style={overlayStyle}
        />
      </motion.div>
    </div>
  );
}
