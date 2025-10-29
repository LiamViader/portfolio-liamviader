"use client";

import { motion, type Variants } from "framer-motion";
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

  return (
    <motion.div
      variants={modalContentVariants}
      initial="hidden"
      animate={animationState}
      className="flex h-full flex-col text-white"
    >
      <CustomScrollArea className="flex-1" topOffset={28} bottomOffset={28}>
        <div className="px-7 pb-12 pt-9 md:px-10 lg:px-12">
          <motion.header
            className="relative overflow-hidden rounded-[36px] border border-white/10 bg-slate-950/80 px-7 pb-10 pt-9 shadow-[0_24px_60px_rgba(8,15,28,0.55)] backdrop-blur-xl md:px-10"
            variants={modalItemVariants2}
            initial="hidden"
            animate={animationState}
          >
            {heroMedia && (
              <motion.div
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
                variants={heroMediaVariants}
                initial="hidden"
                animate={animationState}
              >
                <motion.img
                  src={heroMedia}
                  alt={heroAlt}
                  className="h-full w-full object-cover opacity-80 mix-blend-luminosity"
                  initial={{ scale: 1.08, opacity: 0.65 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/92 via-slate-950/78 to-slate-900/70" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/94 via-slate-950/50 to-transparent" />
              </motion.div>
            )}
            <div className="pointer-events-none absolute inset-0 z-0">
              <div className="absolute inset-x-[-32%] top-[-48%] h-72 rounded-full bg-sky-500/20 blur-3xl" />
              <div className="absolute inset-x-[-36%] bottom-[-58%] h-72 rounded-full bg-indigo-500/18 blur-[120px]" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-slate-950/55" />
            </div>

            <motion.button
              type="button"
              onClick={onClose}
              aria-label={closeAriaLabel}
              className={[
                "group absolute right-6 top-6 inline-flex h-11 w-11 items-center justify-center overflow-hidden",
                "rounded-full border border-white/20 bg-white/5 text-white shadow-[0_12px_28px_rgba(15,23,42,0.45)]",
                "transition-transform duration-300 md:z-20",
              ].join(" ")}
              whileHover={{ scale: 1.08, boxShadow: "0 16px 38px rgba(56,189,248,0.35)" }}
              whileTap={{ scale: 0.94 }}
            >
              <span className="sr-only">{closeLabel}</span>
              <span className="absolute inset-0 bg-gradient-to-br from-sky-500/25 via-transparent to-slate-300/10 opacity-80" />
              <svg
                className="relative h-5 w-5"
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
            </motion.button>

            <div className="relative z-10 flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
              <div className="flex-1 space-y-5">
                <div className="flex flex-wrap items-center justify-center gap-3 text-[0.68rem] uppercase tracking-[0.28em] text-slate-100/80 md:justify-start">
                  {project.is_featured && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/40 bg-sky-500/15 px-3 py-1 text-sky-100/90 shadow-[0_6px_18px_rgba(56,189,248,0.25)]">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      <span className="tracking-[0.35em]">{t("featuredBadge")}</span>
                    </span>
                  )}
                  {categoryLabels.length > 0 && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-slate-50/85">
                      {categoryLabels.join(" • ")}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <h1 className="text-[2.15rem] font-semibold leading-tight text-white drop-shadow-[0_14px_36px_rgba(56,189,248,0.22)] md:text-[2.7rem]">
                    {project.title}
                  </h1>
                  {project.role && (
                    <p className="text-sm font-medium text-white/75 md:text-base">
                      {project.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.header>

          <motion.div
            className="mt-10 grid gap-10"
            variants={modalItemVariants}
            initial="hidden"
            animate={animationState}
          >
            <motion.article
              className="space-y-8 rounded-[26px] border border-white/10 bg-slate-900/40 p-8 shadow-[0_18px_48px_rgba(8,15,28,0.55)] backdrop-blur"
              variants={modalItemVariants}
              initial="hidden"
              animate={animationState}
            >
              <div className="space-y-4 ">
                <h2 className="text-2xl font-semibold text-white">{t("overviewTitle")}</h2>
                <p className="whitespace-pre-line text-base leading-relaxed text-white/85">
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
              className="flex flex-col gap-6 md:flex-row md:items-stretch"
              variants={modalItemVariants}
              initial="hidden"
              animate={animationState}
            >
              <motion.div
                className="rounded-[26px] border border-white/12 bg-slate-900/45 p-6 shadow-[0_12px_36px_rgba(8,15,28,0.45)] backdrop-blur-xl md:flex-auto md:min-w-0"
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
                      className="rounded-full border border-sky-300/30 bg-gradient-to-r from-sky-500/20 via-sky-400/10 to-transparent px-3.5 py-1 text-sm font-medium text-sky-100/90 shadow-[0_10px_24px_rgba(56,189,248,0.25)]"
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
                  className="rounded-[26px] border border-sky-400/40 bg-gradient-to-br from-sky-500/22 via-sky-400/12 to-transparent p-6 shadow-[0_12px_32px_rgba(14,116,144,0.45)] backdrop-blur-xl md:flex-auto md:min-w-[250px]"
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
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-gradient-to-r from-purple-900/70 via-purple-900/40 to-transparent px-4 py-3 text-sm font-semibold text-white/85 shadow-[0_2px_5px_rgba(142,36,170,0.45)]"
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
      </CustomScrollArea>
    </motion.div>
  );
}
