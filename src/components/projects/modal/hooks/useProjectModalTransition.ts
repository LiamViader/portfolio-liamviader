import {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useAnimation } from "framer-motion";

import { measureStableRect } from "@/utils/measureStableRect";

type Controls = ReturnType<typeof useAnimation>;

interface UseProjectModalTransitionProps {
  originRect: DOMRect;
  originEl?: HTMLElement;
  onRevealOrigin?: () => void;
  onClose: () => void;
}

interface UseProjectModalTransitionResult {
  controls: Controls;
  containerRef: RefObject<HTMLDivElement>;
  closing: boolean;
  passThrough: boolean;
  handleClose: () => Promise<void>;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const DEFAULT_CARD_RADIUS = 24;

function readBorderRadius(el?: HTMLElement | null): number {
  if (!el) return DEFAULT_CARD_RADIUS;

  const { borderTopLeftRadius } = getComputedStyle(el);
  const parsed = parseFloat(borderTopLeftRadius || "");

  return Number.isFinite(parsed) ? parsed : DEFAULT_CARD_RADIUS;
}

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

export function useProjectModalTransition({
  originRect,
  originEl,
  onRevealOrigin,
  onClose,
}: UseProjectModalTransitionProps): UseProjectModalTransitionResult {
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null!);
  const followFrameRef = useRef<number>();

  const [closing, setClosing] = useState(false);
  const [passThrough, setPassThrough] = useState(false);

  useEffect(() => {
    const modalWidth = Math.min(window.innerWidth - 48, 960);
    const modalHeight = Math.min(window.innerHeight - 160, 800);
    const targetLeft = Math.max(24, (window.innerWidth - modalWidth) / 2);
    const targetTop = Math.max(48, (window.innerHeight - modalHeight) / 6);

    controls.set({
      left: originRect.left,
      top: originRect.top,
      width: originRect.width,
      height: originRect.height,
      opacity: 1,
      borderRadius: 16,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    });

    controls.start({
      left: targetLeft,
      top: targetTop,
      width: modalWidth,
      height: modalHeight,
      opacity: 1,
      borderRadius: 16,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
    });
  }, [controls, originRect]);

  useEffect(() => {
    return () => {
      if (followFrameRef.current) {
        cancelAnimationFrame(followFrameRef.current);
        followFrameRef.current = undefined;
      }
    };
  }, []);

  const handleClose = useCallback(async () => {
    if (closing) return;
    setClosing(true);
    setPassThrough(true);

    const baseRect = containerRef.current
      ? measureStableRect(containerRef.current)
      : originRect;
    const containerRadius = readBorderRadius(containerRef.current);

    const readOriginSnapshot = () => {
      if (!originEl) {
        return {
          rect: originRect,
          radius: readBorderRadius(originEl),
        };
      }

      return {
        rect: measureStableRect(originEl),
        radius: readBorderRadius(originEl),
      };
    };

    await controls.stop();
    await controls.set({
      left: baseRect.left,
      top: baseRect.top,
      width: baseRect.width,
      height: baseRect.height,
      opacity: 1,
      borderRadius: containerRadius,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    });

    const duration = 300;
    const startTime = performance.now();

    await new Promise<void>((resolve) => {
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const k = easeOutCubic(t);
        const { rect: liveRect, radius } = readOriginSnapshot();

        controls.set({
          left: lerp(baseRect.left, liveRect.left, k),
          top: lerp(baseRect.top, liveRect.top, k),
          width: lerp(baseRect.width, liveRect.width, k),
          height: lerp(baseRect.height, liveRect.height, k),
          borderRadius: lerp(containerRadius, radius, k),
          opacity: 1,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
        });

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });

    onRevealOrigin?.();

    const followLoop = () => {
      const { rect: liveRect, radius } = readOriginSnapshot();
      controls.set({
        left: liveRect.left,
        top: liveRect.top,
        width: liveRect.width,
        height: liveRect.height,
        borderRadius: radius,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
      });

      followFrameRef.current = requestAnimationFrame(followLoop);
    };

    followFrameRef.current = requestAnimationFrame(followLoop);

    await controls.start({
      opacity: 0,
      transition: { duration: 0.12, ease: "easeIn" },
    });

    if (followFrameRef.current) {
      cancelAnimationFrame(followFrameRef.current);
      followFrameRef.current = undefined;
    }
    onClose();
  }, [closing, controls, originEl, originRect, onClose, onRevealOrigin]);

  return {
    controls,
    containerRef,
    closing,
    passThrough,
    handleClose,
  };
}
