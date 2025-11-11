// components/PersonalGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";

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

  const gridItemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.25 } },
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
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
              boxShadow: "0 0px 30px 1px rgba(56,189,248,0.70)",
              transition: { duration: 0.25, ease: "easeOut" },
              borderColor: "rgba(56,189,248,0.60)",
              backgroundColor: "rgba(56,189,248,0.06)",
            }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-0"
            aria-label={p.alt ?? `Foto ${i + 1}`}
          >
            <div className="relative h-36 w-full">
              <Image
                src={p.src}
                alt={p.alt ?? `Personal photo ${i + 1}`}
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

      {/* Lightbox / modal */}
      {idx !== null && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={overlayVariants}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
        >
          {/* backdrop */}
          <div
            onClick={() => setIdx(null)}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          />

          <div className="relative z-10 max-w-[1100px] w-full rounded-3xl overflow-hidden border border-white/10 bg-white/5 p-4">
            <button
              onClick={() => setIdx(null)}
              aria-label="Cerrar"
              className="absolute right-3 top-3 z-20 rounded-md border border-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-sm"
            >
              Cerrar
            </button>

            <div className="relative aspect-[16/9] w-full">
              <Image
                src={photos[idx].src}
                alt={photos[idx].alt ?? `Foto ${idx + 1}`}
                fill
                sizes="(min-width:1024px) 1000px, (min-width: 768px) 800px, 600px"
                className="object-contain"
              />
            </div>

            {photos[idx].caption ? (
              <div className="mt-3 text-sm text-white/70">{photos[idx].caption}</div>
            ) : null}

            {/* controls */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setIdx((s) => (s === null ? null : (s - 1 + photos.length) % photos.length))
                  }
                  className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80"
                >
                  ←
                </button>

                <button
                  onClick={() => setIdx((s) => (s === null ? null : (s + 1) % photos.length))}
                  className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80"
                >
                  →
                </button>
              </div>

              <div className="text-xs text-white/60">
                {idx + 1} / {photos.length}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
