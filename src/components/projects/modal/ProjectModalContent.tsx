"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { motion, type Variants, useScroll, useTransform, useSpring } from "framer-motion";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import { useTranslations, useFormatter } from "next-intl";
import Image from "next/image";

import { type TranslatedProject } from "@/data/projects/types";

import { modalContentVariants, modalItemVariants, modalItemVariants2 } from "./animations";
import { ProjectMediaGallery, getMediaPreviewSource } from "./ProjectMediaGallery";
import { parseHighlights } from "@/utils/parseHighlights";
import { HighlightedText } from "@/components/HighlightedText";

import { Stack } from "@/components/layout/Stack";


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
  const format = useFormatter();

  const dateLabel = project.date
    ? format.dateTime(new Date(project.date), {
      month: "short",
      year: "numeric",
    })
    : null;

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
          className="relative h-48 w-full shrink-0 overflow-hidden bg-gray-950 lg:h-72"
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
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/60 to-gray-950" />
            </motion.div>
          )}
        </motion.header>

        <div className="px-6 pt-8 pb-12 sm:px-10 sm:pt-10 sm:pb-16 lg:px-12">
          <MotionStack
            size="lg"
            variants={modalItemVariants}
            initial="hidden"
            animate={animationState}
          >
            <div className="relative z-10 text-center sm:text-left">
              <Stack size="md">
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-sky-300 sm:justify-start">
                  {project.is_featured && (
                    <span className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-widest text-sky-300 ">
                      <Sparkles className="h-3 w-3" />
                      {t("featuredBadge")}
                    </span>
                  )}
                  {dateLabel && (
                    <span className="text-[0.65rem] tracking-widest text-slate-500 uppercase">
                      {dateLabel}
                    </span>
                  )}
                  {categoryLabels.length > 0 && (
                    <span className="text-[0.65rem] tracking-widest text-slate-400">
                      {categoryLabels.join(" • ")}
                    </span>
                  )}
                </div>

                <Stack size="xs">
                  <h1 className="text-3xl font-bold leading-tight text-slate-100 lg:text-4xl">
                    {project.title}
                  </h1>

                  {project.role && (
                    <p className="text-lg font-medium text-slate-400 lg:text-xl">
                      {project.role}
                    </p>
                  )}
                </Stack>
              </Stack>
            </div>

            {/* OVERVIEW */}
            <Stack size="sm" className="text-left">
              <Stack size="xs" className="text-sm leading-relaxed text-slate-300 lg:text-base lg:leading-loose text-justify">
                {paragraphsToRender.map((paragraph, i) => {
                  const nodes = parseHighlights(paragraph);

                  return (
                    <p key={i}>
                      <HighlightedText nodes={nodes} />
                    </p>
                  );
                })}

                {isTruncated && (
                  <button
                    ref={overviewToggleRef}
                    type="button"
                    onClick={handleToggleExpand}
                    className="group mt-2 w-fit inline-flex items-center text-sm font-semibold text-sky-300 transition-colors hover:text-sky-200 cursor-pointer hover:underline"
                  >
                    <span>{isExpanded ? t("read_less") : t("read_more")}</span>
                  </button>
                )}
              </Stack>
            </Stack>

            {project.detailed_media?.length ? (
              <>
                <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-slate-400/10 to-slate-400/20" />
                <ProjectMediaGallery
                  project={project}
                  closeLabel={closeLabel}
                  animationState={animationState}
                />
              </>
            ) : null}

            <div className="my-2 h-px w-full bg-gradient-to-r from-slate-400/20 via-slate-400/10 to-transparent" />

            <div className="px-1">
              <motion.aside
                className="grid gap-10 md:grid-cols-2 lg:gap-12"
                variants={modalItemVariants}
                initial="hidden"
                animate={animationState}
              >
                {project.links && project.links.length > 0 && (
                  <MotionStack
                    size="md"
                    variants={modalItemVariants}
                  >
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
                      {t("exploreMoreTitle")}
                    </h3>

                    <div className="flex flex-col gap-3">
                      {project.links.map((link, idx) => {
                        const Icon = link.icon === "Github" ? Github : ExternalLink;

                        return (
                          <motion.a
                            key={`${project.id}-link-${idx}`}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group relative flex w-full items-center gap-4 rounded-xl px-4 py-3 border shadow-sm"
                            initial="idle"
                            whileHover="hover"
                            whileTap={{ scale: 0.98 }}
                            variants={{
                              idle: {
                                scale: 1,
                                y: 0,
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                borderColor: "rgba(255, 255, 255, 0.15)",
                              },
                              hover: {
                                scale: 1.01,
                                y: -1,
                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                                borderColor: "rgba(255, 255, 255, 0.2)",
                              },
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <motion.div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
                              style={{ backgroundColor: link.primaryColor }}
                              variants={{
                                hover: {
                                  backgroundColor: link.secondaryColor || link.primaryColor,
                                }
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <motion.div
                                variants={{
                                  hover: { rotate: 12, scale: 1.1 }
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                <Icon className="h-5 w-5" />
                              </motion.div>
                            </motion.div>

                            <span className="text-sm font-bold text-slate-200 group-hover:text-white">
                              {link.label}
                            </span>

                            <motion.span
                              className="ml-auto flex items-center justify-center"
                              variants={{
                                idle: {
                                  color: "rgba(255, 255, 255, 0.3)",
                                },
                                hover: {
                                  color: "rgba(255, 255, 255, 0.9)",
                                },
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <ExternalLink className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </motion.span>
                          </motion.a>
                        );
                      })}
                    </div>
                  </MotionStack>
                )}
                <MotionStack
                  size="md"
                  variants={modalItemVariants}
                >
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
                    {t("technologiesTitle")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                      <motion.span
                        key={`${project.id}-tag-${idx}`}
                        className="cursor-default rounded-lg border border-white/8 bg-white/4 px-3 py-1.5 text-xs font-medium text-slate-300"
                        whileHover={{
                          scale: 1.05,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </MotionStack>
              </motion.aside>
            </div>



          </MotionStack>
        </div>
      </div>
    </motion.div>
  );
}
