import Image from "next/image";
import { Sparkles } from "lucide-react";
import clsx from "clsx";
import { TranslatedProject } from "@/data/projects";
import { motion, Variants } from "framer-motion";
import { useState } from "react";


const BASE_BG   = "rgba(255,255,255,0.05)";
const BASE_BORD = "rgba(255,255,255,0.10)";
const HOVER_BG  = "rgba(56,189,248,0.10)";
const HOVER_BOR = "rgba(56,189,248,0.60)";
const HOVER_SH  = "0 0 30px rgba(56,189,248,0.50)";
const BASE_SH = "0 0 30px rgba(56,189,248,0.01)";

const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30, 
    backgroundColor: BASE_BG, 
    borderColor: BASE_BORD, 
    boxShadow: BASE_SH
  },
  show: (c: { translate:boolean; order: number; isIntro: boolean } = { order: 0, isIntro: false, translate:true }) => ({
    opacity: 1,
    y: 0,
    backgroundColor: BASE_BG,
    borderColor: BASE_BORD,
    boxShadow: BASE_SH,
    transition: {
      duration: c.isIntro ? 0.65 : 0.5,
      delay: c.isIntro ? c.order * 0.15 : 0,
      ease: "easeOut",
    },
  }),
  hover: (c: {translate:boolean; order: number; isIntro: boolean} = {order: 0, isIntro: false, translate:true})=> ({ 
    y: c.translate ? -20 : 0, 
    backgroundColor: HOVER_BG, 
    borderColor: HOVER_BOR, 
    boxShadow: HOVER_SH,
    transition: { 
      duration: 0.15, 
      ease: "easeOut" 
    } 
  }),
};

const mediaVariants: Variants = {
  rest: { scale: 1, y: 0, },
  hover:  (c: {translate:boolean; order: number; isIntro: boolean} = {order: 0, isIntro: false, translate:true}) => ({ scale: c.translate ? 1.03 : 1, y: c.translate ? -8 : 0, transition: {duration: 0.3} }),
};

const overlayVariants: Variants = {
  rest: { opacity: 1 },
  hover: (c: {center:boolean} = {center:false})=> ({  opacity: c.center ? 0.4 : 1 }),
};


interface FeaturedCarouselCardProps {
  project: TranslatedProject;
  isCenter: boolean;
  shouldHide: boolean;
  titleClassName?: string;       // default: "text-2xl md:text-3xl"
  descriptionClassName?: string; // default: "text-sm md:text-base"
  tagClassName?: string;         // default: "text-xs"
  introStart?: boolean;
  introOrder?: number;
}

export function FeaturedCarouselCard({
  project,
  isCenter,
  shouldHide,
  titleClassName,
  descriptionClassName,
  tagClassName,
  introStart = false,
  introOrder = 0,
}: FeaturedCarouselCardProps) {
  const titleSize = titleClassName ?? "text-2xl md:text-3xl";
  const descSize = descriptionClassName ?? "text-sm md:text-base";
  const tagSize = tagClassName ?? "text-xs";

  const [introDone, setIntroDone] = useState(false);

  const isIntro = introStart && !introDone;
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={introStart ? "show" : "hidden"}
      custom={{ order: introOrder, isIntro, translate: !shouldHide }}
      onAnimationComplete={() => {
        if (isIntro) {
          setIntroDone(true);
        }
      }}
      whileHover={introDone ? "hover" : undefined}
      className={`
        relative flex h-full flex-col cursor-pointer overflow-hidden rounded-3xl
        border border-white/10
        bg-white/5
        shadow-[0_0_10px_rgba(0,0,0,0.40)]
        backdrop-blur-sm
        transform-gpu will-change-[transform,opacity]
        ${
          shouldHide
            ? "pointer-events-none select-none !opacity-0"
            : ""
        }
      `}
      style={{
        backgroundColor: BASE_BG,
        borderColor: BASE_BORD,
        pointerEvents: introDone ? "auto" : "none",
      }}
    >
      <div
        className={`
          relative z-10 flex h-full flex-col
        `}
      >
        <div className="relative h-2/3 overflow-hidden">
          <motion.div
            variants={mediaVariants}
            className="absolute inset-0"
            style={{ transformOrigin: "center" }}
            transition={{duration: 0.2}}
            custom={{ order: introOrder, isIntro, translate: isCenter }}
          >
            <Image
              src={project.media_preview}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 60vw, (min-width: 1024px) 68vw, (min-width: 768px) 78vw, 90vw"
              priority={isCenter}
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"
              custom={{ center: isCenter && !shouldHide }}
              variants={overlayVariants}
            />
          </motion.div>
          <div className="absolute bottom-5 inset-x-0 px-6 text-white flex flex-row items-center gap-1 justify-center text-center items-center">
            <Sparkles
              className={`h-[1.15em] w-[1.15em] shrink-0 self-center text-white/70 transition-colors duration-300`}
              aria-hidden="true"
            />
            <h3 className={clsx("font-semibold leading-tight", titleSize)}>
              {project.title}
            </h3>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-4 p-6">
          <p className={clsx("text-slate-200/90", descSize)}>
            {project.short_description}
          </p>

          <div className="flex flex-wrap gap-2">
            {(project.tags ?? []).slice(0, 4).map((tag) => (
              <span
                key={tag}
                className={clsx(
                  "rounded-full bg-white/10 border border-white/20 px-2 py-1 font-medium tracking-wide text-white/70",
                  tagSize
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
