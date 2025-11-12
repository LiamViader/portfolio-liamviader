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

  // Esc + bloqueo de scroll (sin timeout de focus)
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  // Importante: no devolvemos null cuando isOpen=false,
  // para que AnimatePresence pueda reproducir el `exit`.
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
};

function InnerFittedOverlay({
  activeMedia,
  title,
  closeLabel,
  onClose,
  closeButtonRef,
  footer,
}: InnerFittedOverlayProps) {
  const captionRef = useRef<HTMLDivElement | null>(null);
  const [captionH, setCaptionH] = useState(0);

  const recalc = useCallback(() => {
    const h = captionRef.current ? captionRef.current.offsetHeight : 0;
    setCaptionH(h);
  }, []);
  useLayoutEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    if (captionRef.current) ro.observe(captionRef.current);
    const onWin = () => recalc();
    window.addEventListener("resize", onWin);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onWin);
    };
  }, [recalc]);

  const hasCaption =
    Boolean(buildMediaLabel(activeMedia) || activeMedia.description || activeMedia.alt) ||
    Boolean(footer);

  return (
    <motion.div
      className="fixed inset-0 z-[1000000] flex items-center justify-center bg-slate-950/15 p-3 sm:p-6 backdrop-blur-xl overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={buildMediaLabel(activeMedia) || activeMedia.alt || title}
      // animación de entrada/salida del overlay (incluye fondo)
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: "none" }} // ← fade-out + liberar clics durante el exit
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClose}
    >
      <motion.div
        className="relative flex w-auto max-w-[100svw] max-h-[100svh] flex-col overflow-y-auto overflow-x-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_30px_120px_rgba(10,15,35,0.75)]"
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        transition={{ type: "spring", stiffness: 210, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mx-auto inline-flex items-center justify-center overflow-hidden">
          <motion.button
            ref={closeButtonRef}
            type="button"
            aria-label={closeLabel}
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="group absolute cursor-pointer top-3 right-3 z-[1000001] inline-flex h-11 w-11 items-center justify-center rounded-full bg-gray-950/90 text-white shadow-[0_3px_14px_rgba(0,0,0,1)] backdrop-blur ring-2 ring-gray-600"
            initial={{ opacity: 0, scale: 0.92, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -6 }}
            whileHover={{ scale: 1.06, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
            <span className="sr-only">{closeLabel}</span>
          </motion.button>

          <MediaFittedContent media={activeMedia} title={title} />
        </div>

        {hasCaption && (
          <div
            ref={captionRef}
            className="shrink-0 space-y-2 border-t border-white/10 bg-slate-950/85 px-6 py-5"
          >
            {(buildMediaLabel(activeMedia) || activeMedia.alt) && (
              <p className="text-xs uppercase tracking-[0.35em] text-slate-100/80">
                {buildMediaLabel(activeMedia) || activeMedia.alt}
              </p>
            )}
            {activeMedia.description && (
              <p className="text-sm leading-relaxed text-slate-100/80">
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
}: {
  media: BaseMediaItem;
  title: string;
}) {
  if (media.type === "image") {
    return (
      <img
        src={media.src}
        alt={media.alt ?? title}
        style={{
          maxWidth: "80svw",
          maxHeight: "70svh",
          width: "auto",
          height: "auto",
          display: "block",
        }}
      />
    );
  }

  if (media.type === "video") {
    return (
      <video
        src={media.src}
        poster={media.poster ?? media.thumbnail}
        controls
        autoPlay
        playsInline
        style={{
          maxWidth: "80svw",
          maxHeight: "70svh",
          width: "auto",
          height: "auto",
          display: "block",
          objectFit: "contain",
        }}
      />
    );
  }

  return <ExternalVideoContained media={media} title={title} />;
}

function ExternalVideoContained({
  media,
  title,
}: {
  media: BaseMediaItem;
  title: string;
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
      const maxW = roundToDpr(window.innerWidth * 0.8);
      const maxH = roundToDpr(window.innerHeight * 0.8);
      const { w, h } = fitContain(ratio, maxW, maxH);
      setBox({ w, h });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ratio]);

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
    return `${base}${separator}rel=0&autoplay=1`;
  }
  return base;
}
