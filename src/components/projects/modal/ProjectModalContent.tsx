"use client";

import { useRef, useState, useMemo, useEffect } from "react";
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

  // ----------- OVERVIEW: texto truncado + "Ver más" ----------- //
  const [isExpanded, setIsExpanded] = useState(false);
  const [pendingScrollOnCollapse, setPendingScrollOnCollapse] = useState(false);

  // ref solo para el botón "Ver más / Ver menos"
  const overviewToggleRef = useRef<HTMLButtonElement | null>(null);

  const fullDescription = project.full_description ?? "";
  const descriptionParagraphs = useMemo(
    () => fullDescription.split(/\n+/).filter((p) => p.trim().length > 0),
    [fullDescription]
  );

  const MAX_WORDS = 90; // ajusta esto al gusto

  const { isTruncated, collapsedParagraphs } = useMemo(() => {
    const allWords = fullDescription.trim().split(/\s+/).filter(Boolean);
    if (!fullDescription || allWords.length <= MAX_WORDS) {
      return {
        isTruncated: false,
        collapsedParagraphs: descriptionParagraphs,
      };
    }

    let remaining = MAX_WORDS;
    const result: string[] = [];

    for (const para of descriptionParagraphs) {
      const words = para.trim().split(/\s+/).filter(Boolean);
      if (words.length <= remaining) {
        result.push(para);
        remaining -= words.length;
      } else {
        const partial = words.slice(0, remaining).join(" ") + "…";
        result.push(partial);
        remaining = 0;
        break;
      }
      if (remaining <= 0) break;
    }

    return {
      isTruncated: true,
      collapsedParagraphs: result,
    };
  }, [fullDescription, descriptionParagraphs]);

  const paragraphsToRender =
    isExpanded || !isTruncated ? descriptionParagraphs : collapsedParagraphs;

  const handleToggleExpand = () => {
    if (isExpanded) {
      // Vamos a colapsar: después del render veremos si hay que recolocar el scroll
      setPendingScrollOnCollapse(true);
      setIsExpanded(false);
    } else {
      // En "Ver más" NO tocamos el scroll
      setIsExpanded(true);
    }
  };

  useEffect(() => {
    if (!pendingScrollOnCollapse) return;
    if (!scrollRef.current || !overviewToggleRef.current) {
      setPendingScrollOnCollapse(false);
      return;
    }

    const container = scrollRef.current;
    const button = overviewToggleRef.current;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    // margen extra para que se vea algo por encima del "Ver más"
    const margin = 20; 
    const offset = buttonRect.top - containerRect.top;

    // Solo corregimos si el botón ha quedado por encima del viewport del contenedor
    if (offset < margin) {
      container.scrollTop = container.scrollTop + offset - margin;
    }

    setPendingScrollOnCollapse(false);
  }, [pendingScrollOnCollapse]);
  // ------------------------------------------------------------- //

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
        className="group absolute cursor-pointer top-3 right-3 z-[1000001] inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-950/90 backdrop-blur-xl text-white shadow-[0_3px_14px_rgba(0,0,0,1)] ring-2 ring-gray-600"
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
        <motion.header
          className="relative overflow-hidden h-35 md:h-40 border-b border-white/20"
          variants={modalItemVariants2}
          initial="hidden"
          animate={animationState}
        >
          {heroMedia && (
            <motion.div
              className="absolute inset-0 saturate-80"
              variants={heroMediaVariants}
              initial="hidden"
              animate={animationState}
            >
              <motion.img
                src={heroMedia}
                alt={heroAlt}
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950/10 via-transparent to-white/4" />
            </motion.div>
          )}
        </motion.header>
        <div className="px-6 py-6 md:py-8 md:px-8">
          <motion.div
            className="grid gap-6 md:gap-8"
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
              <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between text-center md:text-left border-b border-white/20 pb-8">
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-center gap-3 text-[0.68rem] uppercase tracking-[0.28em] text-slate-100/80 md:justify-start">
                    {project.is_featured && (
                      <span className="inline-flex items-center gap-1.5 rounded-full pr-3 py-1 text-sky-200/90">
                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                        <span className="tracking-[0.35em]">{t("featuredBadge")}</span>
                      </span>
                    )}
                    {categoryLabels.length > 0 && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 text-gray-50/75">
                        {categoryLabels.join(" • ")}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-[2.15rem] font-semibold leading-tight text-white md:text-[2.7rem]">
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

              {/* OVERVIEW */}
              <div className="space-y-4 text-left pb-4">
                <h2 className="text-2xl font-semibold text-white text-center md:text-left">
                  {t("overviewTitle")}
                </h2>

                <div className="space-y-3 text-base leading-relaxed text-white/65 text-justify">
                  {paragraphsToRender.map((paragraph, i) => (
                    <p className="" key={i}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {isTruncated && (
                  <button
                    ref={overviewToggleRef}
                    type="button"
                    onClick={handleToggleExpand}
                    className="cursor-pointer mt-1 text-sm font-semibold text-sky-300/85 hover:underline underline-offset-4 decoration-sky-300/80 drop-shadow-[0_4px_4px_rgba(0,0,0,1)]"
                  >
                    {isExpanded ? t("read_less") : t("read_more")}
                  </button>
                )}
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
              className="flex flex-col gap-6 md:gap-8 md:flex-row md:items-stretch"
              variants={modalItemVariants}
              initial="hidden"
              animate={animationState}
            >
              <motion.div
                className="rounded-[26px] border border-white/20 bg-white/2 p-6 shadow-[0_8px_16px_rgba(8,15,35,0.55)] md:flex-auto md:min-w-0"
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
                      className="cursor-pointer rounded-full border border-white/30 bg-white/2 px-3.5 py-1 text-sm font-medium text-sky-100/90 shadow-[0_5px_4px_rgba(200,200,200,0.05)]"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.1 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {(project.github_url || project.live_url) && (
                <motion.div
                  className="rounded-[26px] border border-sky-400/40 bg-gradient-to-br from-sky-500/22 via-sky-400/13 to-transparent p-6 shadow-[0_8px_16px_rgba(8,47,73,0.5)] md:flex-auto md:min-w-[250px]"
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
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/30 bg-gradient-to-r from-sky-500/28 via-sky-400/18 to-transparent px-4 py-3 text-sm font-semibold text-white shadow-[0_5px_4px_rgba(0,0,0,0.25)]"
                        whileHover={{ scale: 1.02, y: -1 }}
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
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/30 bg-gradient-to-r from-purple-900/70 via-purple-900/40 to-transparent px-4 py-3 text-sm font-semibold text-white/85 shadow-[0_5px_4px_rgba(0,0,0,0.25)]"
                        whileHover={{ scale: 1.02, y: -1 }}
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
