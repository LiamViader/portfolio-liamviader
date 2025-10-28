"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { Play } from "lucide-react";

import type { TranslatedProject } from "@/data/projects";
import { modalItemVariants } from "./animations";

export type ProjectMediaItem = TranslatedProject["detailed_media"][number];

export const getMediaPreviewSource = (item?: ProjectMediaItem) => {
  if (!item) return undefined;
  if (item.thumbnail) return item.thumbnail;
  if (item.poster) return item.poster;
  if (item.type === "image") return item.src;
  return undefined;
};

const buildMediaLabel = (item: ProjectMediaItem) => {
  const parts: string[] = [];
  if (item.captionLabel) parts.push(item.captionLabel);
  if (item.figureNumber) parts.push(item.figureNumber);
  return parts.join(" ");
};

const isVideoMedia = (item: ProjectMediaItem) =>
  item.type === "video" || item.type === "externalVideo";

const getEmbeddedVideoSource = (item: ProjectMediaItem) => {
  if (item.type !== "externalVideo") return item.src;
  const base = item.embedUrl ?? item.src;
  if (base.includes("youtube")) {
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}rel=0&autoplay=1`;
  }
  return base;
};

interface ProjectMediaGalleryProps {
  project: TranslatedProject;
  galleryTitle: string;
  closeLabel: string;
  animationState: "hidden" | "visible" | "exit";
}

export function ProjectMediaGallery({
  project,
  galleryTitle,
  closeLabel,
  animationState,
}: ProjectMediaGalleryProps) {
  const media = project.detailed_media ?? [];
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const activeMedia = activeMediaIndex !== null ? media[activeMediaIndex] : null;

  const openMedia = useCallback((index: number) => setActiveMediaIndex(index), []);
  const closeActiveMedia = useCallback(() => setActiveMediaIndex(null), []);

  useEffect(() => {
    if (activeMediaIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeActiveMedia();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeMediaIndex, closeActiveMedia]);

  useEffect(() => {
    if (activeMediaIndex === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeButtonRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [activeMediaIndex]);

  if (media.length === 0) return null;

  const overlay = (
    <AnimatePresence>
      {activeMedia && (
        <FittedOverlay
          activeMedia={activeMedia}
          projectTitle={project.title}
          closeLabel={closeLabel}
          onClose={closeActiveMedia}
          closeButtonRef={closeButtonRef}
        />
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className="space-y-4 border-t border-white/10 pt-8">
        <h3 className="pb-2 text-2xl font-semibold text-white">{galleryTitle}</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          {media.map((item, idx) => {
            const figureLabel = buildMediaLabel(item);
            const hasCaptionContent = Boolean(figureLabel || item.description || item.alt);
            const previewSource = getMediaPreviewSource(item);
            const fallbackTitle = `${project.title} detail ${idx + 1}`;
            const buttonLabel = item.alt ?? figureLabel ?? fallbackTitle;

            return (
              <motion.figure
                key={`${project.id}-media-${idx}`}
                className="group overflow-hidden rounded-3xl border border-white/12 bg-slate-950/40 shadow-[0_24px_58px_rgba(8,15,35,0.55)] backdrop-blur"
                variants={modalItemVariants}
                initial="hidden"
                animate={animationState}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
              >
                <motion.button
                  type="button"
                  onClick={() => openMedia(idx)}
                  aria-label={buttonLabel}
                  className="relative block w-full cursor-pointer overflow-hidden text-left"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative aspect-video overflow-hidden">
                    {previewSource ? (
                      <motion.img
                        src={previewSource}
                        alt={item.alt ?? fallbackTitle}
                        className="h-full w-full object-cover will-change-transform"
                        initial={{ scale: 1.01 }}
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                      />
                    ) : item.type === "video" ? (
                      <video
                        src={item.src}
                        poster={item.poster}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-900 text-sm text-white/60">
                        {buttonLabel}
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/15 to-transparent opacity-60" />
                    {isVideoMedia(item) && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950/75 text-white shadow-[0_18px_40px_rgba(15,23,42,0.55)] backdrop-blur">
                          <Play className="h-8 w-8" aria-hidden="true" />
                        </span>
                      </div>
                    )}
                  </div>
                </motion.button>

                {hasCaptionContent && (
                  <div className="relative z-10 -mt-1 px-0 pb-0">
                    <figcaption className="relative space-y-1.5 border border-white/12 bg-slate-950/85 px-5 py-4 text-left shadow-[0_18px_38px_rgba(6,12,30,0.65)] backdrop-blur">
                      {(figureLabel || item.alt) && (
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.35em] text-slate-100/75">
                          {figureLabel || item.alt}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-sm leading-relaxed text-slate-100/80">
                          {item.description}
                        </p>
                      )}
                    </figcaption>
                  </div>
                )}
              </motion.figure>
            );
          })}
        </div>
      </div>

      {typeof document !== "undefined" ? createPortal(overlay, document.body) : null}
    </>
  );
}

/* ----------------- Overlay que SIEMPRE encaja todo ----------------- */

function FittedOverlay({
  activeMedia,
  projectTitle,
  closeLabel,
  onClose,
  closeButtonRef,
}: {
  activeMedia: ProjectMediaItem;
  projectTitle: string;
  closeLabel: string;
  onClose: () => void;
  closeButtonRef: React.MutableRefObject<HTMLButtonElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);
  const [captionH, setCaptionH] = useState(0);

  // Recalcula altura de caption y fuerza el límite del viewer
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

  // CSS var para limitar el viewer a (viewport - caption - cromos)
  const chromePadding = 54; // padding interior aprox (px)
  const borderPad = 2; // bordes, etc. (px)
  const totalChrome = chromePadding * 2 + borderPad;

  const panelStyle = {
    // @ts-ignore: CSS variable inline
    "--captionH": `${captionH}px`,
  } as React.CSSProperties;

  return (
    <motion.div
      className="fixed inset-0 z-[1000000] flex items-center justify-center bg-slate-950/85 p-3 sm:p-6 backdrop-blur-xl overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={buildMediaLabel(activeMedia) || activeMedia.alt || projectTitle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.button
        ref={closeButtonRef}
        type="button"
        aria-label={closeLabel}
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="group absolute cursor-pointer top-3 right-3 sm:top-6 sm:right-6 z-[1000001] inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-950/80 text-white shadow-[0_18px_48px_rgba(15,23,42,0.65)] backdrop-blur ring-2 ring-sky-400"
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
      <motion.div
        ref={panelRef}
        className="relative flex max-h-[98svh] max-w-[98svw] flex-col overflow-y-auto overflow-x-hidden rounded-[28px] border border-white/15 bg-slate-950/80 shadow-[0_30px_120px_rgba(10,15,35,0.75)]"
        style={panelStyle}
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        transition={{ type: "spring", stiffness: 210, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        

        {/* Viewer: altura exacta = viewport - caption - chrome. Centrado y sin recortes */}
        <div
          className="relative flex items-center justify-center bg-black overflow-hidden"
          style={{
            height: `calc(100svh - var(--captionH) - ${totalChrome}px)`,
            minHeight: 120, // por si el caption es enorme
          }}
        >
          <MediaFittedContent media={activeMedia} projectTitle={projectTitle} />
        </div>

        {(buildMediaLabel(activeMedia) || activeMedia.description || activeMedia.alt) && (
          <div
            ref={captionRef}
            className="shrink-0 space-y-2 border-t border-white/10 bg-slate-950/85 px-6 py-5"
          >
            {(buildMediaLabel(activeMedia) || activeMedia.alt) && (
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-100/80">
                {buildMediaLabel(activeMedia) || activeMedia.alt}
              </p>
            )}
            {activeMedia.description && (
              <p className="text-sm leading-relaxed text-slate-100/80">
                {activeMedia.description}
              </p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* Contenido ajustado: SIEMPRE visible. Imagen/Vídeo nativo con object-contain; iframes llenan contenedor */
function MediaFittedContent({
  media,
  projectTitle,
}: {
  media: ProjectMediaItem;
  projectTitle: string;
}) {
  if (media.type === "image") {
    return (
      <img
        src={media.src}
        alt={media.alt ?? projectTitle}
        className="h-full w-full object-contain"
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
        className="h-full w-full object-contain"
      />
    );
  }

  // externalVideo: dejamos que el reproductor gestione el letterboxing internamente
  return (
    <div className="w-full h-full">
      <iframe
        src={getEmbeddedVideoSource(media)}
        title={media.alt ?? projectTitle}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
