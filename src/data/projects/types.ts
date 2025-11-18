import type { Locale } from "@/i18n/routing";

// TODO: Make possible that the detailed card has metadata, for SEO purposes,
// also make the detailed description be able to have html content or some
// formatting to be able to add links, bold, sections, media etc

export const projectCategories = ["AI", "Game"] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export type ProjectMediaType = "image" | "video" | "externalVideo";

export interface ProjectMediaLocalization {
  alt?: string;
  captionLabel?: string;
  description?: string;
}

export interface ProjectTranslations {
  title: string;
  short_description: string;
  full_description: string;
  role?: string;
}

export interface ProjectMediaItem {
  type: ProjectMediaType;
  src: string;
  thumbnail?: string;
  poster?: string;
  embedUrl?: string;
  figureNumber?: string;

  translations: Record<Locale, ProjectMediaLocalization>;
}

export interface ProjectData {
  id: number; // generated automatically
  slug: string; // for URLs
  tags: string[];
  media_preview: string;
  github_url?: string;
  live_url?: string;
  detailed_media: ProjectMediaItem[];
  categories: ProjectCategory[];
  is_featured?: boolean;
  translations: Record<Locale, ProjectTranslations>;
}


export type ProjectDefinition = Omit<ProjectData, "id">;

export type ProjectBase = Omit<ProjectData, "translations" | "detailed_media">;
export type ProjectTranslationBase = ProjectTranslations;


export type LocalizedProjectMedia = ProjectMediaItem & ProjectMediaLocalization;

export type TranslatedProject = ProjectBase &
  ProjectTranslationBase & {
    detailed_media: LocalizedProjectMedia[];
  };
