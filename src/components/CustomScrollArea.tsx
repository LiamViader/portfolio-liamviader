"use client";

import * as React from "react";

type ScrollAreaProps = {
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
  thickness?: number;
  gap?: number;
  minThumbSize?: number;
  autoHide?: boolean;
  autoHideDelay?: number;
  fillViewport?: boolean;
  ariaLabel?: string;
  onScroll?: (info: { scrollTop: number; scrollHeight: number; clientHeight: number }) => void;
};

export default function CustomScrollArea({
  children,
  className,
  trackClassName,
  thumbClassName,
  thickness = 8,
  gap = 8,
  minThumbSize = 28,
  autoHide = true,
  autoHideDelay = 900,
  fillViewport = false,
  ariaLabel = "Scrollable region",
  onScroll,
}: ScrollAreaProps) {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);

  const [isNeeded, setIsNeeded] = React.useState(false);
  const [thumbSize, setThumbSize] = React.useState(0);
  const [thumbOffset, setThumbOffset] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(!autoHide);
  const hideTimerRef = React.useRef<number | null>(null);

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const showTemporarily = React.useCallback(() => {
    if (!autoHide) return;
    setIsVisible(true);
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => setIsVisible(false), autoHideDelay);
  }, [autoHide, autoHideDelay]);

  const updateMetrics = React.useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const needs = scrollHeight > clientHeight + 1;
    setIsNeeded(needs);

    if (!needs) {
      setThumbSize(0);
      setThumbOffset(0);
    } else {
      const ratio = clientHeight / scrollHeight;
      const size = Math.max(minThumbSize, Math.round(clientHeight * ratio));
      const maxThumbOffset = Math.max(0, clientHeight - size);
      const maxScrollTop = Math.max(1, scrollHeight - clientHeight);
      const offset = Math.round((scrollTop / maxScrollTop) * maxThumbOffset);
      setThumbSize(size);
      setThumbOffset(offset);
    }

    // ➜ EMITIR evento para que el Header reaccione al scroll del contenedor
    window.dispatchEvent(
      new CustomEvent("app-scroll", {
        detail: { scrollTop, scrollHeight, clientHeight },
      })
    );

    // Callback opcional del consumidor
    onScroll?.({ scrollTop, scrollHeight, clientHeight });
  }, [minThumbSize, onScroll]);

  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onScrollHandler = () => {
      updateMetrics();
      showTemporarily();
    };

    el.addEventListener("scroll", onScrollHandler, { passive: true });

    const ro = new ResizeObserver(() => updateMetrics());
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);

    window.addEventListener("resize", updateMetrics);

    // ➜ DISPARO INICIAL (sin esperar al primer scroll)
    window.dispatchEvent(
      new CustomEvent("app-scroll", {
        detail: { scrollTop: el.scrollTop, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight },
      })
    );
    updateMetrics();

    return () => {
      el.removeEventListener("scroll", onScrollHandler);
      ro.disconnect();
      window.removeEventListener("resize", updateMetrics);
    };
  }, [updateMetrics, showTemporarily]);

  React.useEffect(() => {
    if (!autoHide) { setIsVisible(true); return; }
    if (isDragging || isHovering) {
      setIsVisible(true);
      clearHideTimer();
    } else if (isNeeded) {
      showTemporarily();
    }
    return () => clearHideTimer();
  }, [isDragging, isHovering, isNeeded, autoHide, showTemporarily]);

  // Drag con mouse/touch
  const startDrag = (startClientY: number, startScrollTop: number) => {
    setIsDragging(true);
    const onMove = (clientY: number) => {
      if (!viewportRef.current || !trackRef.current) return;
      const deltaY = clientY - startClientY;
      const { clientHeight, scrollHeight } = viewportRef.current;
      const trackRect = trackRef.current.getBoundingClientRect();
      const moveArea = Math.max(1, trackRect.height - thumbSize);
      const maxScrollTop = Math.max(1, scrollHeight - clientHeight);
      const scrollDelta = (deltaY / moveArea) * maxScrollTop;
      viewportRef.current.scrollTop = Math.min(
        maxScrollTop,
        Math.max(0, startScrollTop + scrollDelta)
      );
    };
    const onMouseMove = (ev: MouseEvent) => onMove(ev.clientY);
    const onTouchMove = (ev: TouchEvent) => onMove(ev.touches[0].clientY);
    const end = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", end);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", end);
      document.removeEventListener("touchcancel", end);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", end);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", end);
    document.addEventListener("touchcancel", end);
  };

  const onThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!viewportRef.current) return;
    startDrag(e.clientY, viewportRef.current.scrollTop);
  };
  const onThumbTouchStart = (e: React.TouchEvent) => {
    if (!viewportRef.current) return;
    startDrag(e.touches[0].clientY, viewportRef.current.scrollTop);
  };

  const onTrackMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.role === "thumb") return;
    if (!viewportRef.current || !trackRef.current) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - trackRect.top;
    const targetThumbTop = Math.max(
      0,
      Math.min(clickY - thumbSize / 2, trackRect.height - thumbSize)
    );
    const el = viewportRef.current;
    const { clientHeight, scrollHeight } = el;
    const maxScrollTop = Math.max(1, scrollHeight - clientHeight);
    const moveArea = Math.max(1, trackRect.height - thumbSize);
    el.scrollTop = (targetThumbTop / moveArea) * maxScrollTop;
  };

  // Base classes
  const baseWrapper = "relative block";
  const baseViewport = "absolute inset-0 overflow-auto no-scrollbar outline-none";
  const baseTrack = "absolute top-0 bottom-0 rounded-full transition-opacity duration-200 z-40"; // z-40 < header z-50
  const baseThumb = "absolute left-0 right-0 rounded-full cursor-grab active:cursor-grabbing";

  const trackVisible = isNeeded && (isVisible || isDragging || isHovering);

  // Altura del wrapper
  const wrapperStyle: React.CSSProperties = fillViewport ? { height: "100dvh" } : {};

  return (
    <div
      ref={wrapperRef}
      className={`${baseWrapper} ${className ?? ""}`}
      style={wrapperStyle}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        ref={viewportRef}
        className={baseViewport}
        tabIndex={0}
        role="region"
        aria-label={ariaLabel}
      >
        <div>{children}</div>
      </div>

      <div
        ref={trackRef}
        aria-hidden
        onMouseDown={onTrackMouseDown}
        className={[
          baseTrack,
          trackVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          "bg-white/10 hover:bg-white/15 backdrop-blur-sm",
          trackClassName ?? "",
        ].join(" ")}
        style={{ right: `${gap}px`, width: `${thickness}px` }}
      >
        <div
          role="scrollbar"
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={100}
          data-role="thumb"
          className={[
            baseThumb,
            "bg-white/60 hover:bg-white/80 shadow-sm",
            thumbClassName ?? "",
          ].join(" ")}
          style={{ top: `${thumbOffset}px`, height: `${thumbSize}px` }}
          onMouseDown={onThumbMouseDown}
          onTouchStart={onThumbTouchStart}
        />
      </div>
    </div>
  );
}
