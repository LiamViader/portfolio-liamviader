"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Sparkles } from "lucide-react";

import CustomScrollArea from "@/components/CustomScrollArea";
import { TranslatedProject } from "@/data/projects";

import { modalContentVariants, modalItemVariants } from "./animations";

const heroMediaVariants = {
  hidden: { scale: 1.05, opacity: 0.6 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { scale: 1.02, opacity: 0.3, transition: { duration: 0.3, ease: "easeIn" } },
};

interface ProjectModalContentProps {
  project: TranslatedProject;
  closing: boolean;
  onClose: () => void;
}

export function ProjectModalContent({
  project,
  closing,
  onClose,
}: ProjectModalContentProps) {
  const media = project.detailed_media ?? [];
  const tags = project.tags ?? [];
  const categories = project.categorys ?? [];

  const heroMedia = project.media_preview ?? media[0];
  const animationState = closing ? "exit" : "visible";

  return (
    <motion.div
      variants={modalContentVariants}
      initial="hidden"
      animate={animationState}
      className="flex h-full flex-col text-white"
    >
      <motion.header
        className="relative overflow-hidden border-b border-white/10"
        variants={modalItemVariants}
      >
        {heroMedia && (
          <motion.div
            className="absolute inset-0"
            variants={heroMediaVariants}
            initial="hidden"
            animate={animationState}
          >
            <motion.img
              src={heroMedia}
              alt={project.title}
              className="h-full w-full object-cover"
              initial={{ scale: 1.05, opacity: 0.75 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/80 to-slate-900/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />
          </motion.div>
        )}

        <div className="relative z-10 flex flex-col gap-6 p-6 md:p-10 lg:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-sky-200/80">
              <Sparkles className="h-4 w-4 text-sky-300" aria-hidden="true" />
              <span className="font-semibold text-white/70">
                {categories.length > 0 ? categories.join(" · ") : "Proyecto"}
              </span>
            </div>

            <motion.button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="group relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 shadow-[0_12px_40px_rgba(14,116,144,0.35)] backdrop-blur"
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.92 }}
            >
              <span className="sr-only">Cerrar</span>
              <svg
                className="h-5 w-5 transition-colors group-hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold leading-tight text-white drop-shadow-[0_10px_35px_rgba(56,189,248,0.35)] md:text-4xl">
              {project.title}
            </h1>
            {project.role && (
              <p className="text-base text-white/70 md:text-lg">{project.role}</p>
            )}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 4).map((tag, idx) => (
                <motion.span
                  key={`${project.id}-hero-tag-${idx}`}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white/80 shadow-[0_12px_30px_rgba(15,23,42,0.45)]"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.25 + idx * 0.04, ease: "easeOut" }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          )}
        </div>
      </motion.header>

      <CustomScrollArea className="flex-1" topOffset={28} bottomOffset={28}>
        <div className="px-6 pb-12 pt-8 md:px-10 lg:px-12">
          <motion.div
            className="grid gap-10 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)] lg:items-start"
            variants={modalItemVariants}
            initial="hidden"
            animate={animationState}
          >
            <motion.article
              className="space-y-8"
              variants={modalItemVariants}
              initial="hidden"
              animate={animationState}
            >
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Visión general</h2>
                <p className="whitespace-pre-line text-base leading-relaxed text-white/80">
                  {project.full_description}
                </p>
              </div>

              {media.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Galería del proyecto</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {media.map((url, idx) => (
                      <motion.div
                        key={`${project.id}-media-${idx}`}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_18px_45px_rgba(15,23,42,0.35)]"
                        variants={modalItemVariants}
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 260, damping: 26 }}
                      >
                        <motion.img
                          src={url}
                          alt={`${project.title} detalle ${idx + 1}`}
                          className="h-full w-full object-cover"
                          initial={{ scale: 1.02 }}
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.45, ease: "easeOut" }}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent opacity-60" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.article>

            <motion.aside
              className="flex flex-col gap-6"
              variants={modalItemVariants}
              initial="hidden"
              animate={animationState}
            >
              <motion.div
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.45)] backdrop-blur"
                variants={modalItemVariants}
                initial="hidden"
                animate={animationState}
              >
                <h3 className="text-sm uppercase tracking-[0.4em] text-white/50">Tecnologías</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <motion.span
                      key={`${project.id}-tag-${idx}`}
                      className="rounded-full border border-white/15 bg-gradient-to-r from-white/10 to-transparent px-3 py-1 text-sm font-medium text-white/80"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.25 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {(project.github_url || project.live_url) && (
                <motion.div
                  className="rounded-3xl border border-sky-400/20 bg-sky-400/10 p-6 shadow-[0_18px_45px_rgba(14,116,144,0.4)] backdrop-blur"
                  variants={modalItemVariants}
                  initial="hidden"
                  animate={animationState}
                >
                  <h3 className="text-sm uppercase tracking-[0.4em] text-sky-100/80">Explora más</h3>
                  <div className="mt-4 flex flex-col gap-3">
                    {project.github_url && (
                      <motion.a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white/80 shadow-[0_10px_30px_rgba(14,116,144,0.35)]"
                        whileHover={{ scale: 1.03, x: 4 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <span>Ver en GitHub</span>
                        <Github className="h-5 w-5" aria-hidden="true" />
                      </motion.a>
                    )}
                    {project.live_url && (
                      <motion.a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-gradient-to-r from-sky-500/30 via-sky-400/20 to-transparent px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(56,189,248,0.45)]"
                        whileHover={{ scale: 1.04, x: 4 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Demo en vivo</span>
                        <ExternalLink className="h-5 w-5" aria-hidden="true" />
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.aside>
          </motion.div>
        </div>
      </CustomScrollArea>
    </motion.div>
  );
}
