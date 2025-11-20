"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

import { type TranslatedProject } from "@/data/projects/types";
import { modalItemVariants } from "./animations";
import { FittedMediaOverlay } from "@/components/shared/FittedMediaOverlay";

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
      <div className="space-y-8">
        <div className="grid gap-8 sm:grid-cols-2">
          {media.map((item, idx) => {
            const figureLabel = buildMediaLabel(item);
            const hasCaptionContent = Boolean(figureLabel || item.description || item.alt);
            const previewSource = getMediaPreviewSource(item);
            const fallbackTitle = `${project.title} detail ${idx + 1}`;
            const buttonLabel = item.alt ?? figureLabel ?? fallbackTitle;

            return (
              <motion.figure
                key={`${project.id}-media-${idx}`}
                className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
                variants={modalItemVariants}
                initial="hidden"
                animate={animationState}
              >
                <motion.button
                  type="button"
                  onClick={() => openMedia(idx)}
                  aria-label={buttonLabel}
                  className="relative block w-full flex-1 cursor-pointer overflow-hidden"
                  
                  initial="idle"
                  whileHover="hover"
                  animate="idle"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    {previewSource ? (
                      <motion.img
                        src={previewSource}
                        alt={item.alt ?? fallbackTitle}
                        className="h-full w-full object-cover"
                        variants={{
                          idle: { scale: 1 },
                          hover: { 
                            scale: 1.05,
                            transition: { duration: 0.2, ease: "easeOut" }
                          }
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
                      className="absolute inset-0 bg-black/20"
                      variants={{
                        idle: { opacity: 0 },
                        hover: { opacity: 1, transition: { duration: 0.3 } }
                      }}
                    />

                    {isVideoMedia(item) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          className="flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-sm border shadow-lg"
                          
                          variants={{
                            idle: { 
                              scale: 1, 
                              backgroundColor: "rgba(4, 0, 43, 0.9)", 
                              borderColor: "rgba(255, 255, 255, 0.2)",
                              color: "rgba(33, 201, 235, 1)",
                            },
                            hover: { 
                              scale: 1.15, 
                              backgroundColor: "rgba(33, 201, 235, 1)",  
                              borderColor: "rgba(14, 165, 233, 0)",
                              color: "rgba(4, 0, 43, 0.9)",
                              transition: { ease: "easeIn", duration: 0.1}
                            }
                          }}
                        >
                          <Play className="h-5 w-5 fill-current" />
                        </motion.div>
                      </div>
                    )}
                  </div>
                </motion.button>

                {hasCaptionContent && (
                  <figcaption className="border-t border-white/5 px-5 py-4">
                    {(figureLabel || item.alt) && (
                      <div className="mb-1 text-[0.65rem] font-bold uppercase tracking-wider text-sky-400/90">
                        {figureLabel || item.alt}
                      </div>
                    )}
                    {item.description && (
                      <p className="text-sm leading-relaxed text-slate-400">
                        {item.description}
                      </p>
                    )}
                  </figcaption>
                )}
              </motion.figure>
            );
          })}
        </div>
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