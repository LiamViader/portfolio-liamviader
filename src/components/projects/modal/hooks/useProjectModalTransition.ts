import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useAnimation } from "framer-motion";
import { measureStableRect } from "@/utils/measureStableRect";

type Controls = ReturnType<typeof useAnimation>;

interface UseProjectModalTransitionResult {
  controls: Controls;
  containerRef: RefObject<HTMLDivElement>;
  closing: boolean;
  passThrough: boolean;
  handleClose: () => Promise<void>;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

interface UseProjectModalTransitionProps {
  originRect: DOMRect;
  originEl?: HTMLElement;
  ghostCardRef: RefObject<HTMLDivElement>;
  onRevealOrigin?: () => void;
  onClose: () => void;
}

export function useProjectModalTransition({
  originRect,
  originEl,
  ghostCardRef, // New
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

    const updateDimensions = (isResize = false) => {
      const isMobile = window.innerWidth < 640;
      const marginX = isMobile ? 12 : 48; // Mobile: 6px side margins (12 total)
      const marginY = isMobile ? 24 : 100; // Mobile: 12px top/bottom (24 total)

      const modalWidth = Math.min(window.innerWidth - marginX, 960);
      const modalHeight = Math.min(window.innerHeight - marginY, 850);

      const targetLeft = (window.innerWidth - modalWidth) / 2;
      const targetTop = isMobile
        ? (window.innerHeight - modalHeight) / 2
        : Math.max(48, (window.innerHeight - modalHeight) / 6);

      const targetProps = {
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
      };

      if (isResize) {
        controls.start({
          ...targetProps,
          transition: { duration: 0.2, ease: "easeOut" },
        });
      } else {
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
          ...targetProps,
          transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
        });
      }
    };

    updateDimensions();

    const handleResize = () => updateDimensions(true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
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

    const duration = 400; // Reduced duration
    const startTime = performance.now();

    await new Promise<void>((resolve) => {
      const tick = (now: number) => {
        if (!isMountedRef.current) {
          resolve();
          return;
        }

        const t = Math.min(1, (now - startTime) / duration);
        const k = easeOutCubic(t);

        // NOTE: We use originRect directly to avoid feedback loops from transforms we apply below.
        const live: DOMRect = originRect;

        const tx = live.left - baseRect.left;
        const ty = live.top - baseRect.top;
        const sx = live.width / baseRect.width || 1;
        const sy = live.height / baseRect.height || 1;

        // Current interpolated state of the "box"
        const currentTx = tx * k;
        const currentTy = ty * k;
        const currentSx = 1 + (sx - 1) * k;
        const currentSy = 1 + (sy - 1) * k;

        // --- STAGE 1: Modal Shell (0% - 50%) ---
        // Fades out from 40% to 60%
        let shellOpacity = 1;
        if (k > 0.4) {
          shellOpacity = Math.max(0, 1 - (k - 0.4) * 5); // 0.4 -> 0.6 fade out
        }

        controls.set({
          x: currentTx,
          y: currentTy,
          scaleX: currentSx,
          scaleY: currentSy,
          opacity: shellOpacity,
        });

        // --- STAGE 2: GHOST Card (50% - 100%) ---
        // Fades in from 40% to 60%
        if (ghostCardRef.current) {
          let cardOpacity = 0;
          if (k > 0.4) {
            cardOpacity = Math.min(1, (k - 0.4) * 5); // 0.4 -> 0.6 fade in
          }

          ghostCardRef.current.style.opacity = String(cardOpacity);

          if (cardOpacity > 0) {
            // Target Pos (Current Box TopLeft)
            const targetX = baseRect.left + currentTx;
            const targetY = baseRect.top + currentTy;

            const targetW = baseRect.width * currentSx;
            // const targetH = baseRect.height * currentSy;

            // The Ghost Card is FIXED at 0,0 with width=originRect.width
            // We just need to transform it to targetX, Turn
            // And scale it: targetW / originRect.width

            const scale = targetW / originRect.width;

            ghostCardRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) scale(${scale})`;
          }
        }

        if (t < 1) {
          closeRafRef.current = requestAnimationFrame(tick);
        } else {
          // Cleanup final state
          if (ghostCardRef.current) {
            ghostCardRef.current.style.opacity = "";
            ghostCardRef.current.style.transform = "";
          }
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
