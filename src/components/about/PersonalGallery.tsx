"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";

import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  FittedMediaOverlay,
  type BaseMediaItem,
} from "@/components/shared/FittedMediaOverlay";

type Photo = {
  src: string;
  alt?: string;
  caption?: string;
};

export default function PersonalGallery({
  photos,
  className = "",
}: {
  photos: Photo[];
  className?: string;
}) {
  const [idx, setIdx] = useState<number | null>(null);

  const displayTitle = useMemo(
    () => photos.map((p) => p.caption || undefined),
    [photos]
  );

  const altText = useMemo(
    () => photos.map((p) => p.alt || ""),
    [photos]
  );

  const mediaItems: BaseMediaItem[] = useMemo(
    () =>
      photos.map((p, i) => ({
        type: "image",
        src: p.src,
        alt: altText[i],
      })),
    [photos, altText]
  );

  const gridItemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      borderColor: "rgba(255,255,255,0.1)",
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const gridContainerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        variants={gridContainerVariants}
      >
        {photos.map((p, i) => (
          <motion.button
            key={p.src + i}
            onClick={() => setIdx(i)}
            variants={gridItemVariants}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{
              scale: 0.96,
              transition: { duration: 0.1, ease: "easeOut" }
            }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-0 cursor-pointer"
            aria-label={displayTitle[i] || altText[i] || undefined}
          >
            <div className="relative h-36 w-full">
              <Image
                src={p.src}
                alt={altText[i]}
                fill
                sizes="(min-width:1024px) 320px, (min-width: 768px) 220px, 150px"
                className="object-cover"
                priority={i === 0}
              />
            </div>

            {p.caption ? (
              <div className="px-3 py-2 text-xs text-white/60">{p.caption}</div>
            ) : null}
          </motion.button>
        ))}
      </motion.div>

      <FittedMediaOverlay
        isOpen={idx !== null}
        media={idx !== null ? mediaItems[idx] : null}
        title={idx !== null ? (displayTitle[idx] ?? "") : "Galería personal"}
        closeLabel="Cerrar"
        onClose={() => setIdx(null)}
        overlayControls={
          idx !== null && (
            <div className="pointer-events-none absolute bottom-6 inset-x-0 flex items-center justify-center gap-3 z-[60]">
              <motion.button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx((s) =>
                    s === null ? null : (s - 1 + photos.length) % photos.length
                  );
                }}
                className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10 transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-5 w-5 text-white/80 transition-colors group-hover:text-white" />
              </motion.button>

              <div className="rounded-full bg-black/50 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-md border border-white/10 min-w-[3rem] text-center">
                {idx + 1} <span className="text-white/40 mx-1">/</span> {photos.length}
              </div>

              <motion.button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx((s) => (s === null ? null : (s + 1) % photos.length));
                }}
                className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10 transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="h-5 w-5 text-white/80 transition-colors group-hover:text-white" />
              </motion.button>
            </div>
          )
        }
      />
    </div>
  );
}
