"use client";

import { CSSProperties, PropsWithChildren, useLayoutEffect, useRef, useState } from "react";
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

type OverlaySurface = {
  key: string;
  style: CSSProperties;
};

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
  const overlayIdRef = useRef(0);
  const { ref, inView } = useInView({ triggerOnce: once, threshold: amount, rootMargin });

  const [overlayConfig, setOverlayConfig] = useState<{
    hasBackdropSurface: boolean;
    surfaces: OverlaySurface[];
  }>({ hasBackdropSurface: false, surfaces: [] });

  useLayoutEffect(() => {
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

    const findBackdropSurfaces = (element: HTMLElement | null): HTMLElement[] => {
      const queue: HTMLElement[] = [];
      const surfaces: HTMLElement[] = [];

      if (element) {
        queue.push(element);
      }

      while (queue.length > 0) {
        const current = queue.shift();
        if (!current) {
          continue;
        }

        const computed = window.getComputedStyle(current);
        const backdrop =
          computed.backdropFilter || (computed as unknown as { webkitBackdropFilter?: string }).webkitBackdropFilter;
        const hasBackdrop = !!backdrop && backdrop !== "none";

        if (hasBackdrop) {
          surfaces.push(current);
        }

        queue.push(...Array.from(current.children) as HTMLElement[]);
      }

      return surfaces;
    };

    const observedSurfaces = new Set<HTMLElement>();
    let frame = 0;

    const scheduleOverlayUpdate = () => {
      if (frame !== 0) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateOverlay();
      });
    };

    const updateOverlay = () => {
      const container = motionWrapperRef.current;

      if (!container) {
        setOverlayConfig({ hasBackdropSurface: false, surfaces: [] });
        return;
      }

      const backdropSurfaces = findBackdropSurfaces(container);

      observedSurfaces.forEach((surface) => {
        if (!backdropSurfaces.includes(surface)) {
          resizeObserver.unobserve(surface);
          observedSurfaces.delete(surface);
        }
      });

      if (backdropSurfaces.length === 0) {
        setOverlayConfig({ hasBackdropSurface: false, surfaces: [] });
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const overlays: OverlaySurface[] = backdropSurfaces.map((surface) => {
        if (!observedSurfaces.has(surface)) {
          resizeObserver.observe(surface);
          observedSurfaces.add(surface);
        }

        const computed = window.getComputedStyle(surface);
        const background = resolveBackground(surface);

        const surfaceRect = surface.getBoundingClientRect();
        const backdrop = computed.backdropFilter || (computed as unknown as { webkitBackdropFilter?: string }).webkitBackdropFilter;

        const key = (() => {
          if (!surface.dataset.scrollRevealOverlayId) {
            overlayIdRef.current += 1;
            surface.dataset.scrollRevealOverlayId = `scroll-reveal-overlay-${overlayIdRef.current}`;
          }
          return surface.dataset.scrollRevealOverlayId;
        })();

        const style: CSSProperties = {
          ...background,
          borderRadius: computed.borderRadius || undefined,
          top: surfaceRect.top - containerRect.top,
          right: containerRect.right - surfaceRect.right,
          bottom: containerRect.bottom - surfaceRect.bottom,
          left: surfaceRect.left - containerRect.left,
        };

        if (backdrop && backdrop !== "none") {
          style.backdropFilter = backdrop;
          style.WebkitBackdropFilter = backdrop;
        }

        return { key, style };
      });

      setOverlayConfig({ hasBackdropSurface: true, surfaces: overlays });
    };

    const resizeObserver = new ResizeObserver(() => scheduleOverlayUpdate());
    const container = motionWrapperRef.current;
    if (container) {
      resizeObserver.observe(container);
    }

    updateOverlay();

    const mutationObserver = new MutationObserver(() => scheduleOverlayUpdate());
    if (container) {
      mutationObserver.observe(container, { childList: true, subtree: true });
    }

    window.addEventListener("resize", scheduleOverlayUpdate);

    return () => {
      resizeObserver.disconnect();
      observedSurfaces.clear();
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
      mutationObserver.disconnect();
      window.removeEventListener("resize", scheduleOverlayUpdate);
    };
  }, []);

  const {
    className: motionClassName,
    style: motionStyle,
    transition: motionTransition,
    variants: motionVariants,
    ...restMotionProps
  } = motionProps ?? {};

  const variants =
    motionVariants ??
    (overlayConfig.hasBackdropSurface
      ? noTransform
        ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
        : {
            hidden: { opacity: 1, y: distance },
            show: { opacity: 1, y: 0, transitionEnd: { transform: "none" } },
          }
      : noTransform
        ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
        : {
            hidden: { opacity: 0, y: distance },
            show: { opacity: 1, y: 0, transitionEnd: { transform: "none" } },
          });

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
          ...motionStyle,
        }}
        className={clsx("relative", motionClassName)}
        {...restMotionProps}
      >
        <div className="relative z-[1]">{children}</div>
        {overlayConfig.hasBackdropSurface ? (
          overlayConfig.surfaces.map((surface) => (
            <motion.div
              key={surface.key}
              aria-hidden
              initial="hidden"
              animate={animationState}
              variants={{ hidden: { opacity: 1 }, show: { opacity: 0 } }}
              transition={transition}
              className="pointer-events-none absolute z-[2]"
              style={{
                ...surface.style,
                borderRadius: surface.style.borderRadius ?? "inherit",
              }}
            />
          ))
        ) : null}
      </motion.div>
    </div>
  );
}
