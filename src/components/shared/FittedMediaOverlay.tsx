"use client";

import type React from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import Image from "next/image";

export type BaseMediaItem = {
  type: "image" | "video" | "externalVideo";
  src: string;
  alt?: string;
  thumbnail?: string;
  poster?: string;
  embedUrl?: string;
  aspectRatio?: number;
  captionLabel?: string;
  figureNumber?: string;
  description?: string;
};

type FittedMediaOverlayProps<T extends BaseMediaItem = BaseMediaItem> = {
  isOpen: boolean;
  media: T | null;
  title: string;
  closeLabel: string;
  onClose: () => void;
  footer?: React.ReactNode;
};

export function FittedMediaOverlay<T extends BaseMediaItem>({
  isOpen,
  media,
  title,
  closeLabel,
  onClose,
  footer,
}: FittedMediaOverlayProps<T>) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [mediaReady, setMediaReady] = useState(false);

  useEffect(() => {
    if (!isOpen || !media) {
      setMediaReady(false);
    }
  }, [isOpen, media]);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && media && (
        <InnerFittedOverlay
          activeMedia={media as BaseMediaItem}
          title={title}
          closeLabel={closeLabel}
          onClose={onClose}
          closeButtonRef={closeButtonRef}
          footer={footer}
          mediaReady={mediaReady}
          onMediaReady={() => setMediaReady(true)}
        />
      )}
    </AnimatePresence>,
    document.body,
  );
}

type InnerFittedOverlayProps = {
  activeMedia: BaseMediaItem;
  title: string;
  closeLabel: string;
  onClose: () => void;
  closeButtonRef: React.MutableRefObject<HTMLButtonElement | null>;
  footer?: React.ReactNode;
  mediaReady: boolean;
  onMediaReady: () => void;
};

function InnerFittedOverlay({
  activeMedia,
  title,
  closeLabel,
  onClose,
  closeButtonRef,
  footer,
  mediaReady,
  onMediaReady,
}: InnerFittedOverlayProps) {
  const captionRef = useRef<HTMLDivElement | null>(null);
  const [captionHeight, setCaptionHeight] = useState(0);
  const [contentDims, setContentDims] = useState<{ w: number; h: number } | null>(
    null,
  );

  const recalcCaption = useCallback(() => {
    const h = captionRef.current ? captionRef.current.offsetHeight : 0;
    setCaptionHeight(h);
  }, []);

  useLayoutEffect(() => {
    recalcCaption();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => recalcCaption());
      if (captionRef.current) ro.observe(captionRef.current);

      const onWin = () => recalcCaption();
      window.addEventListener("resize", onWin);

      return () => {
        ro.disconnect();
        window.removeEventListener("resize", onWin);
      };
    }

    const onWin = () => recalcCaption();
    window.addEventListener("resize", onWin);
    return () => window.removeEventListener("resize", onWin);
  }, [recalcCaption]);

  const hasCaption =
    Boolean(buildMediaLabel(activeMedia) || activeMedia.description || title) ||
    Boolean(footer);

  return (
    <motion.div
      className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/80 p-2 sm:p-6 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={buildMediaLabel(activeMedia) || activeMedia.alt || title}
      initial={{ opacity: 0 }}
      animate={
        mediaReady
          ? { opacity: 1, pointerEvents: "auto" }
          : { opacity: 0, pointerEvents: "none" }
      }
      exit={{ opacity: 0, pointerEvents: "none" }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onClick={onClose}
    >
      <motion.div
        className="relative flex w-auto max-w-[100svw] max-h-[100svh] flex-col overflow-y-auto overflow-x-hidden rounded-[28px] border border-white/10 bg-gray-950"
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={
          mediaReady
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0, scale: 0.96, y: 18 }
        }
        exit={{
          opacity: 0,
          scale: 0.96,
          y: 18,
          transition: { duration: 0.1, ease: "easeIn" },
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mx-auto inline-flex items-center justify-center overflow-hidden">
          <motion.button
            ref={closeButtonRef}
            type="button"
            aria-label={closeLabel}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="cursor-pointer group absolute top-6 right-6 z-[50] inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-slate-200 transition-colors hover:bg-white/10 hover:text-white hover:border-white/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={mediaReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
            <span className="sr-only">{closeLabel}</span>
          </motion.button>

          <MediaFittedContent
            media={activeMedia}
            title={title}
            captionHeight={captionHeight}
            onReady={onMediaReady}
            onDimensionsChange={setContentDims}
          />
        </div>

        {hasCaption && (
          <div
            ref={captionRef}
            className="shrink-0 space-y-2 border-t border-white/10 bg-gray-950 px-6 py-5"
            style={{ maxWidth: contentDims?.w }}
          >
            {(buildMediaLabel(activeMedia) || title) && (
              <p className="mb-1 text-[0.70rem] font-bold uppercase tracking-wider text-sky-300">
                {buildMediaLabel(activeMedia) || title}
              </p>
            )}
            {activeMedia.description && (
              <p className="text-sm leading-relaxed text-slate-400">
                {activeMedia.description}
              </p>
            )}
            {footer && <div className="pt-3">{footer}</div>}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function MediaFittedContent({
  media,
  title,
  captionHeight,
  onReady,
  onDimensionsChange,
}: {
  media: BaseMediaItem;
  title: string;
  captionHeight: number;
  onReady: () => void;
  onDimensionsChange: (dims: { w: number; h: number }) => void;
}) {
  if (media.type === "image") {
    return (
      <FittedImage
        src={media.src}
        alt={media.alt ?? title}
        captionHeight={captionHeight}
        onReady={onReady}
        onDimensionsChange={onDimensionsChange}
      />
    );
  }

  if (media.type === "video") {
    return (
      <NativeVideoContent
        media={media}
        captionHeight={captionHeight}
        onReady={onReady}
        onDimensionsChange={onDimensionsChange}
      />
    );
  }

  return (
    <ExternalVideoContained
      media={media}
      title={title}
      captionHeight={captionHeight}
      onReady={onReady}
      onDimensionsChange={onDimensionsChange}
    />
  );
}

function FittedImage({
  src,
  alt,
  captionHeight,
  onReady,
  onDimensionsChange,
}: {
  src: string;
  alt: string;
  captionHeight: number;
  onReady: () => void;
  onDimensionsChange: (dims: { w: number; h: number }) => void;
}) {
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const [ratio, setRatio] = useState<number | null>(null);

  const recomputeBox = useCallback(
    (r: number) => {
      if (typeof window === "undefined") return;

      const isMobile = window.innerWidth < 640;
      const widthFactor = isMobile ? 0.98 : 0.8;
      const heightFactor = isMobile ? 0.90 : 0.8;

      const maxW = window.innerWidth * widthFactor;
      const baseMaxH = window.innerHeight * heightFactor;
      const maxH = Math.max(0, baseMaxH - captionHeight);

      const { w, h } = fitContain(r, maxW, maxH);
      setBox({ w, h });
    },
    [captionHeight],
  );

  const handleLoadingComplete = useCallback(
    (img: HTMLImageElement) => {
      if (!img.naturalWidth || !img.naturalHeight) return;
      const r = img.naturalWidth / img.naturalHeight;
      setRatio(r);
      recomputeBox(r);
      onReady();
    },
    [recomputeBox, onReady],
  );

  useEffect(() => {
    if (ratio == null) return;
    const onResize = () => recomputeBox(ratio);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [ratio, recomputeBox]);

  useEffect(() => {
    if (box) {
      onDimensionsChange(box);
    }
  }, [box, onDimensionsChange]);

  const style: React.CSSProperties = box
    ? {
      width: `${box.w}px`,
      height: `${box.h}px`,
      position: "relative",
    }
    : {
      width: 0,
      height: 0,
      position: "relative",
    };

  return (
    <div style={style}>
      <Image
        src={src}
        alt={alt}
        fill
        style={{
          objectFit: "contain",
          display: "block",
        }}
        sizes="80vw"
        onLoadingComplete={handleLoadingComplete}
      />
    </div>
  );
}

function NativeVideoContent({
  media,
  captionHeight,
  onReady,
  onDimensionsChange,
}: {
  media: BaseMediaItem;
  captionHeight: number;
  onReady: () => void;
  onDimensionsChange: (dims: { w: number; h: number }) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    onReady();
  }, [onReady]);

  useLayoutEffect(() => {
    if (!videoRef.current) return;
    const el = videoRef.current;

    const report = () => {
      // Use getBoundingClientRect for rendered size
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        onDimensionsChange({ w: rect.width, h: rect.height });
      }
    };

    const ro = new ResizeObserver(() => report());
    ro.observe(el);
    report(); // initial

    return () => ro.disconnect();
  }, [onDimensionsChange]);

  return (
    <video
      ref={videoRef}
      src={media.src}
      poster={media.poster ?? media.thumbnail}
      controls
      autoPlay
      playsInline
      className="max-w-[95svw] sm:max-w-[80svw]"
      style={{
        maxHeight: `calc(90svh - ${captionHeight}px)`,
        width: "auto",
        height: "auto",
        display: "block",
        objectFit: "contain",
      }}
    />
  );
}

function ExternalVideoContained({
  media,
  title,
  captionHeight,
  onReady,
  onDimensionsChange,
}: {
  media: BaseMediaItem;
  title: string;
  captionHeight: number;
  onReady: () => void;
  onDimensionsChange: (dims: { w: number; h: number }) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  const ratio =
    media.aspectRatio && media.aspectRatio > 0 ? media.aspectRatio : 16 / 9;

  useLayoutEffect(() => {
    const roundToDpr = (n: number) => {
      const dpr = window.devicePixelRatio || 1;
      return Math.round(n * dpr) / dpr;
    };

    const update = () => {
      const isMobile = window.innerWidth < 640;
      const widthFactor = isMobile ? 0.98 : 0.8;
      const heightFactor = isMobile ? 0.90 : 0.8;

      const maxW = roundToDpr(window.innerWidth * widthFactor);
      const baseMaxH = roundToDpr(window.innerHeight * heightFactor);
      const maxH = Math.max(0, baseMaxH - captionHeight);
      const { w, h } = fitContain(ratio, maxW, maxH);
      setBox({ w, h });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ratio, captionHeight]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  useEffect(() => {
    if (box.w > 0 && box.h > 0) {
      onDimensionsChange(box);
    }
  }, [box, onDimensionsChange]);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{ width: `${box.w}px`, height: `${box.h}px` }}
    >
      <iframe
        src={getEmbeddedVideoSource(media)}
        title={media.alt ?? title}
        className="block w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

function fitContain(ar: number, maxW: number, maxH: number) {
  const hByW = maxW / ar;
  if (hByW <= maxH) return { w: maxW, h: hByW };
  return { w: maxH * ar, h: maxH };
}

function buildMediaLabel(item: BaseMediaItem) {
  const parts: string[] = [];
  if (item.captionLabel) parts.push(item.captionLabel);
  if (item.figureNumber) parts.push(item.figureNumber);
  return parts.join(" ");
}

function getEmbeddedVideoSource(item: BaseMediaItem) {
  if (item.type !== "externalVideo") return item.src;
  const base = item.embedUrl ?? item.src;
  if (base.includes("youtube")) {
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}rel=0&playsinline=1`;
  }
  return base;
}
