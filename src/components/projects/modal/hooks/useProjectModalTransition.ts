import { RefObject, useCallback, useEffect, useRef, useState } from "react";
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

export function useProjectModalTransition({
  originRect,
  originEl,
  onRevealOrigin,
  onClose,
}: UseProjectModalTransitionProps): UseProjectModalTransitionResult {
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null!);

  const [closing, setClosing] = useState(false);
  const [passThrough, setPassThrough] = useState(false);

  const isMountedRef = useRef(false);
  const closeRafRef = useRef<number | null>(null);
  const followRafRef = useRef<number | null>(null);

  useEffect(() => {
    setClosing(false);
    setPassThrough(false);
  }, [originRect, originEl]);

  useEffect(() => {
    isMountedRef.current = true;

    const modalWidth = Math.min(window.innerWidth - 48, 960);
    const modalHeight = Math.min(window.innerHeight - 100, 850);
    const targetLeft = Math.max(24, (window.innerWidth - modalWidth) / 2);
    const targetTop = Math.max(48, (window.innerHeight - modalHeight) / 6);

    controls.set({
      left: Math.round(originRect.left),
      top: Math.round(originRect.top),
      width: Math.round(originRect.width),
      height: Math.round(originRect.height),
      opacity: 1,
      borderRadius: 26,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    });

    controls.start({
      left: Math.round(targetLeft),
      top: Math.round(targetTop),
      width: Math.round(modalWidth),
      height: Math.round(modalHeight),
      opacity: 1,
      borderRadius: 26,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    });

    return () => {
      isMountedRef.current = false;
      if (closeRafRef.current != null) cancelAnimationFrame(closeRafRef.current);
      if (followRafRef.current != null) cancelAnimationFrame(followRafRef.current);
    };
  }, [controls, originRect]);

  const handleClose = useCallback(async () => {
    if (closing) return;
    setClosing(true);
    setPassThrough(true);

    const baseRect = containerRef.current?.getBoundingClientRect() ?? originRect;

    await controls.stop();
    await controls.set({
      left: Math.round(baseRect.left),
      top: Math.round(baseRect.top),
      width: Math.round(baseRect.width),
      height: Math.round(baseRect.height),
      opacity: 1,
      borderRadius: 50,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    });

    const duration = 350;
    const startTime = performance.now();

    await new Promise<void>((resolve) => {
      const tick = (now: number) => {
        if (!isMountedRef.current) {
          resolve();
          return;
        }

        const t = Math.min(1, (now - startTime) / duration);
        const k = easeOutCubic(t);

        let live: DOMRect = originRect;
        try {
          if (originEl && originEl.isConnected) {
            live = measureStableRect(originEl);
          }
        } catch {
          resolve();
          return;
        }

        const tx = live.left - baseRect.left;
        const ty = live.top - baseRect.top;
        const sx = live.width / baseRect.width || 1;
        const sy = live.height / baseRect.height || 1;

        controls.set({
          x: tx * k,
          y: ty * k,
          scaleX: 1 + (sx - 1) * k,
          scaleY: 1 + (sy - 1) * k,
          opacity: 1,
        });

        if (t < 1) {
          closeRafRef.current = requestAnimationFrame(tick);
        } else {
          resolve();
        }
      };

      closeRafRef.current = requestAnimationFrame(tick);
    });

    onRevealOrigin?.();

    let follow = true;
    const followLoop = () => {
      if (!follow || !isMountedRef.current) return;

      if (!originEl || !originEl.isConnected) {
        follow = false;
        return;
      }

      let live: DOMRect;
      try {
        live = measureStableRect(originEl);
      } catch {
        follow = false;
        return;
      }

      const tx = live.left - baseRect.left;
      const ty = live.top - baseRect.top;
      const sx = live.width / baseRect.width || 1;
      const sy = live.height / baseRect.height || 1;

      controls.set({ x: tx, y: ty, scaleX: sx, scaleY: sy });

      followRafRef.current = requestAnimationFrame(followLoop);
    };

    followRafRef.current = requestAnimationFrame(followLoop);

    follow = false;
    if (followRafRef.current != null) cancelAnimationFrame(followRafRef.current);

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
