"use client";

import { motion, type Variants } from "framer-motion";
import { ExternalLink, Github, Sparkles } from "lucide-react";

import CustomScrollArea from "@/components/CustomScrollArea";
import { TranslatedProject } from "@/data/projects";

import { modalContentVariants, modalItemVariants, modalItemVariants2 } from "./animations";

const heroMediaVariants: Variants = {
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

  const heroMedia = project.media_preview ?? media[0]?.src;
  const heroAlt = media[0]?.alt ?? project.title;
  const heroCaption = media[0]?.caption;
  const animationState = closing ? "exit" : "visible";

  return (
    <motion.div
      variants={modalContentVariants}
      initial="hidden"
      animate={animationState}
      className="flex h-full flex-col text-white"
    >
      <motion.header
        className="relative overflow-hidden rounded-b-[24px] border-b border-white/10 bg-slate-950/85 shadow-[0_18px_48px_rgba(10,31,48,0.55)]"
        variants={modalItemVariants2}
      >
        {heroMedia && (
          <motion.div
            className="absolute inset-0 opacity-75 mix-blend-luminosity saturate-150"
            variants={heroMediaVariants}
            initial="hidden"
            animate={animationState}
          >
            <motion.img
              src={heroMedia}
              alt={heroAlt}
              className="h-full w-full object-cover"
              initial={{ scale: 1.05, opacity: 0.75 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/96 via-slate-950/85 to-slate-900/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/45 to-transparent" />
            {heroCaption && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/65 to-transparent px-8 pb-6 pt-12 text-xs uppercase tracking-[0.3em] text-slate-200/70 md:px-12">
                {heroCaption}
              </div>
            )}
          </motion.div>
        )}

        <div className="relative z-10 flex flex-col gap-6 px-8 pb-9 pt-9 md:px-12">
          <div className="pointer-events-none absolute inset-x-8 top-0 z-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <div className="pointer-events-none absolute -top-16 right-10 z-0 h-40 w-40 rounded-full bg-sky-400/12 blur-3xl" />
          <div className="pointer-events-none absolute -top-12 left-4 z-0 h-28 w-28 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-2 text-[0.68rem] uppercase tracking-[0.35em] text-slate-100/75">
              {project.is_featured && (
                <span className="inline-flex items-center gap-2 text-sky-100/90">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Destacado
                </span>
              )}
              {categories.length > 0 && (
                <span className="text-slate-100/75">{categories.join(" · ")}</span>
              )}
            </div>

            <motion.button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 shadow-[0_14px_32px_rgba(12,74,110,0.45)] backdrop-blur"
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
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              />
            </motion.button>
          </div>
          <div className="relative z-10 space-y-2">
            <h1 className="text-4xl font-semibold leading-tight text-white drop-shadow-[0_14px_40px_rgba(56,189,248,0.32)] md:text-[2.75rem]">
              {project.title}
            </h1>
            {project.role && (
              <p className="text-base text-white/80 md:text-lg">{project.role}</p>
            )}
          </div>
        </div>
      </motion.header>

      <CustomScrollArea className="flex-1" topOffset={28} bottomOffset={28}>
        <div className="px-10 pb-12 pt-10 md:px-14 lg:px-16">
          <motion.div
            className="grid gap-10"
            variants={modalItemVariants}
            initial="hidden"
            animate={animationState}
          >
            <motion.article
              className="space-y-8 rounded-[26px] border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-transparent p-8 shadow-[0_18px_48px_rgba(15,23,42,0.45)] backdrop-blur"
              variants={modalItemVariants}
              initial="hidden"
              animate={animationState}
            >
              <div className="space-y-4 ">
                <h2 className="text-2xl font-semibold text-white">Visión general</h2>
                <p className="whitespace-pre-line text-base leading-relaxed text-white/80">
                  {project.full_description}
                </p>
              </div>

              {media.length > 0 && (
                <div className="space-y-4 border-t border-white/10 pt-8">
                  <h3 className="text-xl font-semibold text-white">Galería del proyecto</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {media.map((item, idx) => (
                      <motion.figure
                        key={`${project.id}-media-${idx}`}
                        className="group relative overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-white/10 via-white/0 to-transparent shadow-[0_20px_45px_rgba(15,23,42,0.4)] backdrop-blur"
                        variants={modalItemVariants}
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 260, damping: 26 }}
                      >
                        <motion.img
                          src={item.src}
                          alt={item.alt ?? `${project.title} detalle ${idx + 1}`}
                          className="h-full w-full object-cover"
                          initial={{ scale: 1.02 }}
                          whileHover={{ scale: 1.06 }}
                          transition={{ duration: 0.45, ease: "easeOut" }}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent opacity-60" />
                        {(item.caption || item.alt) && (
                          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent px-4 pb-4 pt-10 text-[0.75rem] font-medium text-slate-100/80">
                            {item.caption ?? item.alt}
                          </figcaption>
                        )}
                      </motion.figure>
                    ))}
                  </div>
                </div>
              )}
            </motion.article>

            <motion.aside
              className="flex flex-col gap-6 md:flex-row md:items-stretch"
              variants={modalItemVariants}
              initial="hidden"
              animate={animationState}
            >
              <motion.div
                className="rounded-[26px] border border-white/10 bg-gradient-to-br from-white/10 via-white/0 to-transparent p-6 shadow-[0_20px_48px_rgba(15,23,42,0.4)] backdrop-blur-xl md:flex-auto md:min-w-0"
                variants={modalItemVariants}
                initial="hidden"
                animate={animationState}
              >
                <h3 className="text-sm text-center uppercase tracking-[0.4em] text-white/55">Tecnologías</h3>
                <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                  {tags.map((tag, idx) => (
                    <motion.span
                      key={`${project.id}-tag-${idx}`}
                      className="rounded-full border border-white/15 bg-gradient-to-r from-white/15 via-white/5 to-transparent px-3.5 py-1 text-sm font-medium text-white/85 shadow-[0_8px_18px_rgba(15,23,42,0.35)]"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.25 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {(project.github_url || project.live_url) && (
                <motion.div
                  className="rounded-[26px] border border-sky-400/35 bg-gradient-to-br from-sky-500/18 via-sky-400/8 to-transparent p-6 shadow-[0_24px_55px_rgba(14,116,144,0.45)] backdrop-blur-xl md:flex-auto md:min-w-[250px]"
                  variants={modalItemVariants}
                  initial="hidden"
                  animate={animationState}
                >
                  <h3 className="text-sm text-center uppercase tracking-[0.4em] text-sky-100/80">Explora más</h3>
                  <div className="mt-4 flex flex-col gap-3">
                    {project.live_url && (
                      <motion.a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-gradient-to-r from-sky-500/28 via-sky-400/18 to-transparent px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(56,189,248,0.45)]"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Demo en vivo</span>
                        <ExternalLink className="h-5 w-5" aria-hidden="true" />
                      </motion.a>
                    )}
                    {project.github_url && (
                      <motion.a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-gradient-to-r from-slate-900/70 via-slate-900/40 to-transparent px-4 py-3 text-sm font-semibold text-white/85 shadow-[0_10px_30px_rgba(12,74,110,0.35)]"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <span>Ver en GitHub</span>
                        <Github className="h-5 w-5" aria-hidden="true" />
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
