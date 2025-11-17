import { AIDrivenGeneratedGame } from "./AIDrivenGeneratedGame";
import {
  ProjectData,
  ProjectDefinition,
  TranslatedProject,
  LocalizedProjectMedia,
} from "./types";
import { Locale, defaultLocale } from "@/i18n/routing";

const projectDefinitions: ProjectDefinition[] = [
  AIDrivenGeneratedGame,

];

export const allProjects: ProjectData[] = projectDefinitions.map(
  (project, index) => ({
    id: index + 1,
    ...project,
  })
);

export function getProjectsByLocale(locale: string): TranslatedProject[] {
  const currentLocale = locale as Locale;

  return allProjects.map((project) => {
    const { translations, detailed_media, ...projectRest } = project;
    const fallbackTranslation = translations[defaultLocale];
    const activeTranslation = translations[currentLocale] ?? fallbackTranslation;

    const mediaTranslations = activeTranslation.media ?? [];
    const fallbackMediaTranslations = fallbackTranslation.media ?? [];

    const localizedMedia: LocalizedProjectMedia[] = detailed_media.map(
      (item, index) => ({
        ...item,
        ...(fallbackMediaTranslations[index] ?? {}),
        ...(mediaTranslations[index] ?? {}),
      })
    );

    const { media: _media, ...restTranslations } = activeTranslation;
    void _media;

    return {
      ...projectRest,
      ...restTranslations,
      detailed_media: localizedMedia,
    };
  });
}
