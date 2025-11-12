"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";

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

  // Título consistente con la figura
  const figureTitle = useMemo(
    () => photos.map((p, i) => p.caption ?? p.alt ?? `Foto ${i + 1}`),
    [photos]
  );

  // Adaptación a BaseMediaItem
  const mediaItems: BaseMediaItem[] = useMemo(
    () =>
      photos.map((p, i) => ({
        type: "image",
        src: p.src,
        alt: figureTitle[i],
      })),
    [photos, figureTitle]
  );

  const gridItemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      boxShadow: "0 0px 50px 2px rgba(56,189,248,0.01)",
      borderColor: "rgba(255,255,255,0.1)",
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const gridContainerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        variants={gridContainerVariants} // ← hereda initial/show del padre (la sección)
      >
        {photos.map((p, i) => (
          <motion.button
            key={p.src + i}
            onClick={() => setIdx(i)}
            variants={gridItemVariants}
            whileHover={{
              y: -6,
              rotateX: 2,
              rotateY: -2,
              boxShadow: "0 0px 50px 2px rgba(56,189,248,0.30)",
              transition: { duration: 0.25, ease: "easeOut" },
              borderColor: "rgba(56,189,248,0.60)",
              backgroundColor: "rgba(56,189,248,0.06)",
            }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-0 cursor-pointer"
            aria-label={figureTitle[i]}
          >
            <div className="relative h-36 w-full">
              <Image
                src={p.src}
                alt={figureTitle[i]}
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
        title={idx !== null ? figureTitle[idx] : "Galería personal"}
        closeLabel="Cerrar"
        onClose={() => setIdx(null)}
        footer={
          idx !== null && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setIdx((s) =>
                      s === null ? null : (s - 1 + photos.length) % photos.length
                    )
                  }
                  className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80"
                >
                  ←
                </button>

                <button
                  onClick={() =>
                    setIdx((s) => (s === null ? null : (s + 1) % photos.length))
                  }
                  className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80"
                >
                  →
                </button>
              </div>

              <div className="text-xs text-white/60">
                {idx + 1} / {photos.length}
              </div>
            </div>
          )
        }
      />
    </div>
  );
}
