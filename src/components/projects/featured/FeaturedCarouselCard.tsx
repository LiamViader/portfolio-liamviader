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
        bg-gradient-to-br from-white-900/80 via-white-900/20 to-white-900/10
        ${isCenter ? "shadow-[0_0_10px_rgba(0,0,0,0.50)]" : ""}
        backdrop-blur-xl
        transition-transform
        will-change-transform
        hover:scale-102
        md:hover:scale-103
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
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="text-xs uppercase tracking-widest text-white/70">
              {badgeLabel}
            </p>
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
