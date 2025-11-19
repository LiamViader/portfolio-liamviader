// ProjectMediaGallery.tsx
"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

import { type TranslatedProject } from "@/data/projects/types";
import { modalItemVariants } from "./animations";
import { FittedMediaOverlay } from "@/components/shared/FittedMediaOverlay"; // ajusta ruta

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

  const openMedia = useCallback((index: number) => setActiveMediaIndex(index), []);
  const closeActiveMedia = useCallback(() => setActiveMediaIndex(null), []);

  if (media.length === 0) return null;

  const activeMedia = activeMediaIndex !== null ? media[activeMediaIndex] : null;

  return (
    <>
      <div className="space-y-4 border-t border-white/20 pt-8 text-center sm:text-left">
        <h3 className="pb-2 text-2xl font-semibold text-white">{galleryTitle}</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          {media.map((item, idx) => {
            const figureLabel = buildMediaLabel(item);
            const hasCaptionContent = Boolean(
              figureLabel || item.description || item.alt,
            );
            const previewSource = getMediaPreviewSource(item);
            const fallbackTitle = `${project.title} detail ${idx + 1}`;
            const buttonLabel = item.alt ?? figureLabel ?? fallbackTitle;

            return (
              <motion.figure
                key={`${project.id}-media-${idx}`}
                className="group overflow-hidden rounded-3xl border border-gray-700 shadow-[0_0px_10px_rgba(100,100,100,0.2)] backdrop-blur"
                variants={modalItemVariants}
                initial="hidden"
                animate={animationState}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
              >
                <motion.button
                  type="button"
                  onClick={() => openMedia(idx)}
                  aria-label={buttonLabel}
                  className="relative block w-full cursor-pointer overflow-hidden text-left"
                  whileHover={{scale: 1.02}}
                  transition={{duration: 0.3, ease: "easeOut"}}
                >
                  <div className="relative aspect-video overflow-hidden">
                    {previewSource ? (
                      <motion.img
                        src={previewSource}
                        alt={item.alt ?? fallbackTitle}
                        className="h-full w-full object-cover will-change-transform"
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
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950/70  text-sky-200/70 shadow-[0_0px_30px_rgba(15,23,42,1)] backdrop-blur">
                          <Play className="h-8 w-8" aria-hidden="true" />
                        </span>
                      </div>
                    )}
                  </div>
                </motion.button>

                {hasCaptionContent && (
                  <div className="relative z-10 px-0 pb-0">
                    <figcaption className="relative space-y-1.5 bg-slate-950/50 border-t border-white/20 px-5 py-4 text-left shadow-[0_18px_38px_rgba(6,12,30,0.65)] backdrop-blur">
                      {(figureLabel || item.alt) && (
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.35em] text-sky-200/90">
                          {figureLabel || item.alt}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-sm leading-relaxed text-sky-100/80">
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

      {/* Nuevo visor reutilizable */}
      <FittedMediaOverlay
        isOpen={activeMediaIndex !== null}
        media={activeMedia}
        title={project.title}
        closeLabel={closeLabel}
        onClose={closeActiveMedia}
      />
    </>
  );
}
