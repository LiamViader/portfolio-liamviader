import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { AnimationControls, useAnimation } from "framer-motion";

import { measureStableRect } from "@/utils/measureStableRect";

interface UseProjectModalTransitionProps {
  originRect: DOMRect;
  originEl?: HTMLElement;
  onRevealOrigin?: () => void;
  onClose: () => void;
}

interface UseProjectModalTransitionResult {
  controls: AnimationControls;
  containerRef: MutableRefObject<HTMLDivElement | null>;
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
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [closing, setClosing] = useState(false);
  const [passThrough, setPassThrough] = useState(false);

  useEffect(() => {
    const modalWidth = Math.min(window.innerWidth - 48, 960);
    const modalHeight = Math.min(window.innerHeight - 160, 800);
    const targetLeft = Math.max(24, (window.innerWidth - modalWidth) / 2);
    const targetTop = Math.max(48, (window.innerHeight - modalHeight) / 6);

    controls.set({
      left: Math.round(originRect.left),
      top: Math.round(originRect.top),
      width: Math.round(originRect.width),
      height: Math.round(originRect.height),
      opacity: 1,
      borderRadius: 16,
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
      borderRadius: 16,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
    });
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
      borderRadius: 16,
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

        const live = originEl ? measureStableRect(originEl) : originRect;

        const tx = live.left - baseRect.left;
        const ty = live.top - baseRect.top;
        const sx = live.width / baseRect.width;
        const sy = live.height / baseRect.height;

        controls.set({
          x: tx * k,
          y: ty * k,
          scaleX: 1 + (sx - 1) * k,
          scaleY: 1 + (sy - 1) * k,
          opacity: 1,
        });

        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });

    onRevealOrigin?.();

    let follow = true;
    const followLoop = () => {
      if (!follow) return;
      const live = originEl ? measureStableRect(originEl) : originRect;
      const tx = live.left - baseRect.left;
      const ty = live.top - baseRect.top;
      const sx = live.width / baseRect.width;
      const sy = live.height / baseRect.height;
      controls.set({ x: tx, y: ty, scaleX: sx, scaleY: sy });
      requestAnimationFrame(followLoop);
    };
    requestAnimationFrame(followLoop);

    await controls.start({
      opacity: 0,
      transition: { duration: 0.12, ease: "easeIn" },
    });

    follow = false;
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
