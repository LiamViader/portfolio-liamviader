import Image from "next/image";
import { Sparkles } from "lucide-react";
import clsx from "clsx";
import { TranslatedProject } from "@/data/projects";


interface FeaturedCarouselCardProps {
  project: TranslatedProject;
  isCenter: boolean;
  shouldHide: boolean;
  titleClassName?: string;       // default: "text-2xl md:text-3xl"
  descriptionClassName?: string; // default: "text-sm md:text-base"
  tagClassName?: string;         // default: "text-xs"
}

export function FeaturedCarouselCard({
  project,
  isCenter,
  shouldHide,
  titleClassName,
  descriptionClassName,
  tagClassName,
}: FeaturedCarouselCardProps) {
  const titleSize = titleClassName ?? "text-2xl md:text-3xl";
  const descSize = descriptionClassName ?? "text-sm md:text-base";
  const tagSize = tagClassName ?? "text-xs";

  return (
    <div
      className={`
        relative flex h-full flex-col cursor-pointer overflow-hidden rounded-3xl
        border border-white/10
        bg-white/5
        shadow-[0_0_10px_rgba(0,0,0,0.40)]
        backdrop-blur-sm
        transition-transform
        will-change-transform
        hover:-translate-y-1
        hover:border-sky-400/90 hover:bg-sky-500/10
      `}
    >
      <div
        className={`
          relative z-10 flex h-full flex-col transition-opacity duration-300
          ${shouldHide ? "opacity-0" : "opacity-100"}
        `}
      >
        <div className="relative h-2/3 overflow-hidden">
          <Image
            src={project.media_preview}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 60vw, (min-width: 1024px) 68vw, (min-width: 768px) 78vw, 90vw"
            priority={isCenter}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/96 via-gray-900/40 to-transparent" />

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
    </div>
  );
}
