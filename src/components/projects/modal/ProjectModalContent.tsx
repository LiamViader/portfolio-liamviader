"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { motion, type Variants, useScroll, useTransform, useSpring } from "framer-motion";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { type TranslatedProject } from "@/data/projects/types";

import { modalContentVariants, modalItemVariants, modalItemVariants2 } from "./animations";
import { ProjectMediaGallery, getMediaPreviewSource } from "./ProjectMediaGallery";
import { parseHighlights } from "@/utils/parseHighlights";
import { HighlightedText } from "@/components/HighlightedText";

import { Stack } from "@/components/layout/Stack";
import { ContentBlock } from "@/components/layout/ContentBlock";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";


const heroMediaVariants: Variants = {
  hidden: { scale: 1.0, opacity: 0.6 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { scale: 1.5, opacity: 0.3, transition: { duration: 0.3, ease: "easeIn" } },
};

interface ProjectModalContentProps {
  project: TranslatedProject;
  closing: boolean;
  onClose: () => void;
}

const MotionStack = motion(Stack);

export function ProjectModalContent({
  project,
  closing,
  onClose,
}: ProjectModalContentProps) {
  const t = useTranslations("ProjectModal");
  const tags = project.tags ?? [];
  const categories = project.categories ?? [];

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

  const [isExpanded, setIsExpanded] = useState(false);
  const [pendingScrollOnCollapse, setPendingScrollOnCollapse] = useState(false);

  const overviewToggleRef = useRef<HTMLButtonElement | null>(null);

  const fullDescription = project.full_description ?? "";
  const descriptionParagraphs = useMemo(
    () => fullDescription.split(/\n+/).filter((p) => p.trim().length > 0),
    [fullDescription]
  );

  const MAX_WORDS = 90;

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
      setPendingScrollOnCollapse(true);
      setIsExpanded(false);
    } else {
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

    const margin = 20;
    const offset = buttonRect.top - containerRect.top;

    if (offset < margin) {
      container.scrollTop = container.scrollTop + offset - margin;
    }

    setPendingScrollOnCollapse(false);
  }, [pendingScrollOnCollapse]);

  return (
    <motion.div
      variants={modalContentVariants}
      initial="hidden"
      animate={animationState}
      className="flex h-full flex-col text-white bg-gray-950"
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
        className="cursor-pointer group absolute top-4 right-4 z-[50] inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-colors hover:bg-white/10 hover:text-white hover:border-white/20"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M18 6 6 18" /><path d="M6 6l12 12" />
        </svg>
      </motion.button>

      <div ref={scrollRef} className="relative flex-1 overflow-auto no-scrollbar scroll-smooth">
        <motion.header
          className="relative h-48 md:h-64 lg:h-72 w-full overflow-hidden bg-gray-950"
          variants={modalItemVariants2}
          initial="hidden"
          animate={animationState}
        >
          {heroMedia && (
            <motion.div
              className="absolute inset-0"
              variants={heroMediaVariants}
              initial="hidden"
              animate={animationState}
            >
              <Image
                src={heroMedia}
                alt={heroAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 1024px, 100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/40 to-gray-950" />
            </motion.div>
          )}
        </motion.header>
        <div className="px-6 sm:px-12 pt-6 pb-5 sm:pb-10">
          <MotionStack
            size="md"
            variants={modalItemVariants}
            initial="hidden"
            animate={animationState}
          >
            <MotionStack
              size="md"
              className=""
              variants={modalItemVariants}
              initial="hidden"
              animate={animationState}
            >
              <div className="relative z-10 text-center md:text-left">
                <Stack size="xs">
                  <div className="flex flex-wrap items-center justify-center gap-3 text-[0.58rem] md:text-xs uppercase tracking-[0.28em] text-white/80 md:justify-start">
                    {project.is_featured && (
                      <span className="inline-flex items-center gap-1.5 rounded-full pr-3 text-sky-200/90">
                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                        <span className="tracking-[0.35em]">{t("featuredBadge")}</span>
                      </span>
                    )}
                    {categoryLabels.length > 0 && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 text-white/75">
                        {categoryLabels.join(" • ")}
                      </span>
                    )}
                  </div>

                  <h1 className="text-[1.8rem] font-semibold leading-tight text-white md:text-4xl">
                    {project.title}
                  </h1>

                  {project.role && (
                    <p className="text-sm font-medium text-white/75 md:text-base">
                      {project.role}
                    </p>
                  )}
                </Stack>
              </div>

              <div className="border-b h-px border-white/20"></div>

              {/* OVERVIEW */}
              <div className="space-y-4 text-left pb-4">
                <h2 className="text-2xl font-semibold text-white text-center md:text-left">
                  {t("overviewTitle")}
                </h2>

                <div className="space-y-3 text-base leading-relaxed text-white/80 text-justify">
                  {paragraphsToRender.map((paragraph, i) => {
                    const nodes = parseHighlights(paragraph);

                    return (
                      <p key={i}>
                        <HighlightedText nodes={nodes} />
                      </p>
                    );
                  })}
                </div>

                {isTruncated && (
                  <button
                    ref={overviewToggleRef}
                    type="button"
                    onClick={handleToggleExpand}
                    className="cursor-pointer mt-1 text-sm font-semibold text-sky-300/90 hover:underline underline-offset-4 decoration-sky-300/80 drop-shadow-[0_4px_4px_rgba(0,0,0,1)]"
                  >
                    {isExpanded ? t("read_less") : t("read_more")}
                  </button>
                )}
              </div>

              {project.detailed_media?.length ? (
                <ProjectMediaGallery
                  project={project}
                  closeLabel={closeLabel}
                  animationState={animationState}
                />
              ) : null}
            </MotionStack>

            <div className="mt-2 border-t border-white/10 pt-8">
              <motion.aside
                className="grid gap-6 md:grid-cols-2 items-stretch"
                variants={modalItemVariants}
                initial="hidden"
                animate={animationState}
              >

                <motion.div
                  className="flex flex-col rounded-2xl border border-white/10 bg-slate-900/40 p-6"
                  variants={modalItemVariants}
                >
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                    {t("technologiesTitle")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                      <motion.span
                        key={`${project.id}-tag-${idx}`}
                        className="cursor-default rounded-md border px-3 py-1.5 text-xs font-medium bg-[rgba(30,41,59,0.5)]"
                        initial="idle"
                        whileHover="hover"
                        variants={{
                          idle: {
                            y: 0,
                            scale: 1,
                            backgroundColor: "rgba(30, 41, 59, 0.5)",
                            borderColor: "rgba(51, 65, 85, 1)",
                            color: "rgba(203, 213, 225, 1)",
                          },
                          hover: {
                            y: -2,
                            scale: 1.05,
                            backgroundColor: "rgba(14, 165, 233, 0.1)",
                            borderColor: "rgba(14, 165, 233, 0.5)",
                            color: "rgba(186, 230, 253, 1)",
                            transition: { type: "spring", stiffness: 300, damping: 20 }
                          }
                        }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {(project.github_url || project.live_url) && (
                  <motion.div
                    className="flex flex-col rounded-2xl border border-white/10 bg-slate-900/40 p-6"
                    variants={modalItemVariants}
                  >
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                      {t("exploreMoreTitle")}
                    </h3>

                    <div className="flex flex-1 flex-col justify-start gap-3">
                      {project.live_url && (
                        <motion.a
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="relative flex w-full items-center justify-between overflow-hidden rounded-xl border bg-gradient-to-r from-sky-600/20 to-sky-600/10 px-4 py-3.5 text-sm font-bold"
                          initial="idle"
                          whileHover="hover"
                          whileTap="tap"
                          variants={{
                            idle: {
                              y: 0,
                              scale: 1,
                              borderColor: "rgba(14, 165, 233, 0.3)",
                              color: "rgba(224, 242, 254, 1)",
                              boxShadow: "0 10px 15px -3px rgba(12, 74, 110, 0.2)",
                            },
                            hover: {
                              y: -1,
                              scale: 1.02,
                              borderColor: "rgba(56, 189, 248, 0.6)",
                              color: "rgba(255, 255, 255, 1)",
                              boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.25)",
                              transition: { type: "spring", stiffness: 400, damping: 25 }
                            },
                            tap: {
                              scale: 0.98,
                              y: 0,
                              borderColor: "rgba(14, 165, 233, 0.5)",
                            }
                          }}
                        >
                          <span>{t("liveDemoCta")}</span>

                          <motion.span
                            variants={{
                              idle: { x: 0, y: 0, color: "rgba(186, 230, 253, 1)" },
                              hover: {
                                x: 2,
                                y: -2,
                                color: "rgba(255, 255, 255, 1)", // white
                                transition: { type: "spring", stiffness: 300 }
                              }
                            }}
                          >
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          </motion.span>
                        </motion.a>
                      )}

                      {project.github_url && (
                        <motion.a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="relative flex w-full items-center justify-between overflow-hidden rounded-xl border bg-gradient-to-r from-purple-900/40 to-purple-900/20 px-4 py-3.5 text-sm font-bold"
                          initial="idle"
                          whileHover="hover"
                          whileTap="tap"

                          variants={{
                            idle: {
                              y: 0,
                              scale: 1,
                              borderColor: "rgba(168, 85, 247, 0.3)",
                              color: "rgba(243, 232, 255, 1)",
                              boxShadow: "0 10px 15px -3px rgba(88, 28, 135, 0.2)",
                            },
                            hover: {
                              y: -1,
                              scale: 1.02,
                              borderColor: "rgba(192, 132, 252, 0.6)",
                              color: "rgba(255, 255, 255, 1)",
                              boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.25)",
                              transition: { type: "spring", stiffness: 400, damping: 25 }
                            },
                            tap: {
                              scale: 0.98,
                              y: 0,
                              borderColor: "rgba(168, 85, 247, 0.5)"
                            }
                          }}
                        >
                          <span>{t("viewOnGithubCta")}</span>
                          <motion.span
                            variants={{
                              idle: { rotate: 0, color: "rgba(233, 213, 255, 1)" },
                              hover: {
                                rotate: 12,
                                color: "rgba(255, 255, 255, 1)",
                                transition: { type: "spring", stiffness: 300 }
                              }
                            }}
                          >
                            <Github className="h-4 w-4" aria-hidden="true" />
                          </motion.span>
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.aside>
            </div>
          </MotionStack>
        </div>
      </div>
    </motion.div>
  );
}
