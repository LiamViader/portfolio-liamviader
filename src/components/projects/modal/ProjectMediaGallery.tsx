"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

import { type TranslatedProject } from "@/data/projects/types";
import { modalItemVariants } from "./animations";
import { FittedMediaOverlay } from "@/components/shared/FittedMediaOverlay";
import { useTranslations } from "next-intl";

import { Stack } from "@/components/layout/Stack";

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
  closeLabel: string;
  animationState: "hidden" | "visible" | "exit";
}

export function ProjectMediaGallery({
  project,
  closeLabel,
  animationState,
}: ProjectMediaGalleryProps) {
  const media = project.detailed_media ?? [];
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);
  const t = useTranslations("ProjectModal");
  const openMedia = useCallback((index: number) => setActiveMediaIndex(index), []);
  const closeActiveMedia = useCallback(() => setActiveMediaIndex(null), []);

  if (media.length === 0) return null;

  const activeMedia = activeMediaIndex !== null ? media[activeMediaIndex] : null;

  return (
    <>
      <div className="">
        <Stack size="md" className="text-left">

          <div className="grid gap-8 sm:grid-cols-2">
            {media.map((item, idx) => {
              const figureLabel = buildMediaLabel(item);
              const previewSource = getMediaPreviewSource(item);
              const fallbackTitle = `${project.title} detail ${idx + 1}`;
              const buttonLabel = item.alt ?? figureLabel ?? fallbackTitle;

              return (
                <motion.figure
                  key={`${project.id}-media-${idx}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 transition-colors bg-white/2 hover:bg-white/5"
                  variants={modalItemVariants}
                  initial="hidden"
                  animate={animationState}
                >
                  <motion.button
                    type="button"
                    onClick={() => openMedia(idx)}
                    aria-label={buttonLabel}
                    className="relative block w-full cursor-pointer overflow-hidden"

                    initial="idle"
                    whileHover="hover"
                    animate="idle"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-gray-950">
                      {previewSource ? (
                        <motion.img
                          src={previewSource}
                          alt={item.alt ?? fallbackTitle}
                          className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
                          variants={{
                            idle: { scale: 1 },
                            hover: { scale: 1.05 }
                          }}
                        />
                      ) : item.type === "video" ? (
                        <video src={item.src} poster={item.poster} className="h-full w-full object-cover" muted playsInline />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-slate-600">
                          Image not found
                        </div>
                      )}

                      <motion.div
                        className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />

                      {isVideoMedia(item) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-950/90 text-sky-300 transition-transform duration-300 group-hover:scale-110 group-hover:bg-sky-500/90 group-hover:text-sky-100"
                          >
                            <Play className="h-5 w-5 fill-current" />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.button>

                  {(figureLabel || item.description || item.alt) && (
                    <figcaption className="flex-1 border-t border-white/5 px-4 py-3 text-left">
                      {(figureLabel || item.alt) && (
                        <div className="mb-1 text-[0.65rem] font-bold uppercase tracking-wider text-sky-300">
                          {figureLabel || item.alt}
                        </div>
                      )}
                      {item.description && (
                        <p className="text-sm leading-relaxed text-slate-400 font-light">
                          {item.description}
                        </p>
                      )}
                    </figcaption>
                  )}
                </motion.figure>
              );
            })}
          </div>
        </Stack>
      </div>

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