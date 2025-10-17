import Image from "next/image";
import { TranslatedProject } from "@/data/projects";

interface FeaturedCarouselCardProps {
  project: TranslatedProject;
  badgeLabel: string;
  isCenter: boolean;
  shouldHide: boolean;
  dimmed: boolean;
}

export function FeaturedCarouselCard({
  project,
  badgeLabel,
  isCenter,
  shouldHide,
  dimmed,
}: FeaturedCarouselCardProps) {
  return (
    <div
      className={`
        relative flex h-full flex-col cursor-pointer overflow-hidden rounded-3xl
        border border-white/10
        bg-white/5
        shadow-[0_0_10px_rgba(0,0,0,0.40)]
        backdrop-blur
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
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-200/80 lg:mx-0">
              {badgeLabel}
            </span>
            <h3 className="mt-2 text-2xl font-semibold md:text-3xl">
              {project.title}
            </h3>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-4 p-6">
          <p className="text-sm text-slate-200/90 md:text-base">
            {project.short_description}
          </p>

          <div className="flex flex-wrap gap-2">
            {(project.tags ?? []).slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-indigo-200"
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
