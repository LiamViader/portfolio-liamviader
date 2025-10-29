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
      <motion.header
        className="relative overflow-hidden rounded-b-[28px] border-b border-white/10 bg-slate-950/95 shadow-[0_14px_40px_rgba(10,21,40,0.6)]"
        variants={modalItemVariants2}
      >
        {heroMedia && (
          <motion.div
            className="absolute inset-0 opacity-65 mix-blend-luminosity saturate-150"
            variants={heroMediaVariants}
            initial="hidden"
            animate={animationState}
          >
            <motion.img
              src={heroMedia}
              alt={heroAlt}
              className="h-full w-full object-cover"
              initial={{ scale: 1.04, opacity: 0.75 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/80 to-slate-900/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/88 via-slate-950/45 to-transparent" />
          </motion.div>
        )}

        <div className="relative z-10 px-6 py-6 md:px-10 md:py-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-5 text-[0.68rem] uppercase tracking-[0.25em] text-slate-100/70">
                {project.is_featured && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 text-sky-200">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    <span>{t("featuredBadge")}</span>
                  </span>
                )}
                {categoryLabels.length > 0 && (
                  <span className="inline-flex items-center gap-2 px-2 py-1 text-slate-100/70">
                    {categoryLabels.join(" • ")}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <h1 className="text-[2.1rem] font-semibold leading-tight text-white drop-shadow-[0_10px_30px_rgba(56,189,248,0.22)] md:text-[2.6rem]">
                  {project.title}
                </h1>
                {project.role && (
                  <p className="text-sm text-white/70 md:text-base">{project.role}</p>
                )}
              </div>
            </div>

            <motion.button
              type="button"
              onClick={onClose}
              aria-label={closeAriaLabel}
              className="group relative inline-flex h-12 w-12 items-center justify-center rounded-full cursor-pointer rounded-full bg-slate-950/70 text-white shadow-[0_3px_14px_rgba(0,0,0,1)] ring-2 ring-sky-200/30"
              whileHover={{scale: 1.1, borderColor: "rgba(60, 183, 255, 0.6)"}}
              whileTap={{ scale: 0.94 }}
            >
              <span className="sr-only">{closeLabel}</span>
              <motion.div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full" >
                <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-80" />
                <svg
                  className="relative h-6 w-6 text-white"
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
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <CustomScrollArea className="flex-1" topOffset={28} bottomOffset={28}>
        <div className="px-7 pb-12 pt-10 md:px-10 lg:px-12">
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
                <h2 className="text-2xl font-semibold text-white">{t("overviewTitle")}</h2>
                <p className="whitespace-pre-line text-base leading-relaxed text-white/80">
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
                className="rounded-[26px] border border-white/10 bg-gradient-to-br from-white/10 via-white/3 to-transparent p-6 shadow-[0_5px_10px_rgba(250,250,250,0.15)] backdrop-blur-xl md:flex-auto md:min-w-0"
                variants={modalItemVariants}
                initial="hidden"
                animate={animationState}
              >
                <h3 className="text-sm text-center uppercase tracking-[0.4em] text-white/55">{t("technologiesTitle")}</h3>
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
                  className="rounded-[26px] border border-sky-400/35 bg-gradient-to-br from-sky-500/18 via-sky-400/8 to-transparent p-6 shadow-[0_5px_10px_rgba(14,116,144,0.45)] backdrop-blur-xl md:flex-auto md:min-w-[250px]"
                  variants={modalItemVariants}
                  initial="hidden"
                  animate={animationState}
                >
                  <h3 className="text-sm text-center uppercase tracking-[0.4em] text-sky-100/80">{t("exploreMoreTitle")}</h3>
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
