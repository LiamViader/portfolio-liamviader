"use client";

import { useRef } from "react";
import { motion, type Variants, useScroll, useTransform, useSpring } from "framer-motion";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import CustomScrollArea from "@/components/CustomScrollArea";
import { TranslatedProject } from "@/data/projects";

import { modalContentVariants, modalItemVariants, modalItemVariants2 } from "./animations";
import { ProjectMediaGallery, getMediaPreviewSource } from "./ProjectMediaGallery";

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
  const t = useTranslations("ProjectModal");
  const tags = project.tags ?? [];
  const categories = project.categorys ?? [];

  const heroMedia =
    project.media_preview ?? getMediaPreviewSource(project.detailed_media?.[0]);
  const heroAlt = project.detailed_media?.[0]?.alt ?? project.title;
  const categoryLabels = categories.map((category) =>
    t(`categories.${category}`)
  );
  const closeLabel = t("closeButton");
  const closeAriaLabel = t("closeAriaLabel");
  const animationState = closing ? "exit" : "visible";

  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY, scrollYProgress } = useScroll({ container: scrollRef });
  const topShadowOpacity = useTransform(scrollY, [0, 16], [0, 1]);
  const bottomShadowOpacity = useTransform(scrollYProgress, [0.95, 1], [1, 0]);
  const topShadowSmooth = useSpring(topShadowOpacity, {
    stiffness: 120,
    damping: 26,
    mass: 0.5,
  });
  const bottomShadowSmooth = useSpring(bottomShadowOpacity, {
    stiffness: 320,
    damping: 26,
    mass: 0.5,
  });

  return (
    <motion.div
      variants={modalContentVariants}
      initial="hidden"
      animate={animationState}
      className="flex h-full flex-col text-white"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20"
        style={{ opacity: topShadowSmooth }}
      >
        <div className="h-full w-full bg-gradient-to-b from-black/60 via-black/25 to-transparent" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20"
        style={{ opacity: bottomShadowSmooth }}
      >
        <div className="h-full w-full bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
      </motion.div>
      <motion.button
        type="button"
        onClick={onClose}
        aria-label={closeAriaLabel}
        className="group absolute cursor-pointer top-3 right-3 z-[1000001] inline-flex h-11 w-11 items-center justify-center rounded-full bg-gray-950/90 text-white shadow-[0_3px_14px_rgba(0,0,0,1)] ring-2 ring-gray-600"
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
      <div ref={scrollRef} className="relative flex-1 overflow-auto no-scrollbar">
        <div className="px-7 py-8 md:px-7 lg:px-8">
          <motion.header
            className="relative overflow-hidden rounded-[36px] border border-white/20 bg-white/4 px-7 py-6 shadow-[0_18px_48px_rgba(8,15,28,0.55)] md:px-10"
            variants={modalItemVariants2}
            initial="hidden"
            animate={animationState}
          >
            {heroMedia && (
              <motion.div
                className="absolute inset-0 mix-blend-luminosity saturate-10"
                variants={heroMediaVariants}
                initial="hidden"
                animate={animationState}
              >
                <motion.img
                  src={heroMedia}
                  alt={heroAlt}
                  className="h-full w-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/10 via-transparent to-white/4" />
              </motion.div>
            )}

            <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between text-left">
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-center gap-3 text-[0.68rem] uppercase tracking-[0.28em] text-slate-100/80 sm:justify-start">
                  {project.is_featured && (
                    <span className="inline-flex items-center gap-1.5 rounded-full pr-3 py-1 text-sky-200/90 drop-shadow-[0_2px_3px_rgba(0,0,0,1)]">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      <span className="tracking-[0.35em]">{t("featuredBadge")}</span>
                    </span>
                  )}
                  {categoryLabels.length > 0 && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 text-gray-50/55 drop-shadow-[0_2px_3px_rgba(0,0,0,1)]">
                      {categoryLabels.join(" • ")}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h1 className="text-[2.15rem] font-semibold leading-tight text-white drop-shadow-[0_4px_9px_rgba(0,0,0,1)] md:text-[2.7rem]">
                    {project.title}
                  </h1>
                  {project.role && (
                    <p className="text-sm font-medium text-white/75 md:text-base drop-shadow-[0_2px_3px_rgba(0,0,0,1)]">
                      {project.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.header>

          <motion.div
            className="mt-10 grid gap-8"
            variants={modalItemVariants}
            initial="hidden"
            animate={animationState}
          >
            <motion.article
              className="space-y-8 rounded-[26px] border border-white/20 bg-white/4 p-8 shadow-[0_18px_48px_rgba(8,15,28,0.55)]"
              variants={modalItemVariants}
              initial="hidden"
              animate={animationState}
            >
              <div className="space-y-4 text-left">
                <h2 className="text-2xl font-semibold text-white text-center md:text-left">{t("overviewTitle")}</h2>
                <p className="whitespace-pre-line text-base leading-relaxed text-white/65 text-justify">
                  {project.full_description}
                </p>
              </div>

              {project.detailed_media?.length ? (
                <ProjectMediaGallery
                  project={project}
                  galleryTitle={t("galleryTitle")}
                  closeLabel={closeLabel}
                  animationState={animationState}
                />
              ) : null}
            </motion.article>

            <motion.aside
              className="flex flex-col gap-8 md:flex-row md:items-stretch"
              variants={modalItemVariants}
              initial="hidden"
              animate={animationState}
            >
              <motion.div
                className="rounded-[26px] border border-white/20 bg-white/4 p-6 shadow-[0_12px_36px_rgba(8,15,28,0.45)] md:flex-auto md:min-w-0"
                variants={modalItemVariants}
                initial="hidden"
                animate={animationState}
              >
                <h3 className="text-sm text-center uppercase tracking-[0.38em] text-white/65">
                  {t("technologiesTitle")}
                </h3>
                <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                  {tags.map((tag, idx) => (
                    <motion.span
                      key={`${project.id}-tag-${idx}`}
                      className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1 text-sm font-medium text-sky-100/90 shadow-[0_5px_14px_rgba(0,0,0,0.15)]"
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
                  className="rounded-[26px] border border-sky-400/40 bg-gradient-to-br from-sky-500/22 via-sky-400/13 to-transparent p-6 shadow-[0_12px_32px_rgba(0,0,0,0.25)] md:flex-auto md:min-w-[250px]"
                  variants={modalItemVariants}
                  initial="hidden"
                  animate={animationState}
                >
                  <h3 className="text-sm text-center uppercase tracking-[0.38em] text-sky-100/85">
                    {t("exploreMoreTitle")}
                  </h3>
                  <div className="mt-4 flex flex-col gap-3">
                    {project.live_url && (
                      <motion.a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-gradient-to-r from-sky-500/28 via-sky-400/18 to-transparent px-4 py-3 text-sm font-semibold text-white shadow-[0_2px_5px_rgba(56,189,248,0.45)]"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>{t("liveDemoCta")}</span>
                        <ExternalLink className="h-5 w-5" aria-hidden="true" />
                      </motion.a>
                    )}
                    {project.github_url && (
                      <motion.a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-gradient-to-r from-purple-900/70 via-purple-900/40 to-transparent px-4 py-3 text-sm font-semibold text-white/85 shadow-[0_2px_5px_rgba(142,36,170,0.45)]"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <span>{t("viewOnGithubCta")}</span>
                        <Github className="h-5 w-5" aria-hidden="true" />
                      </motion.a>
                    )}
                    
                  </div>
                </motion.div>
              )}
            </motion.aside>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
