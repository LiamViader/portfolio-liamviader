import { AIDrivenGeneratedGame } from "./list/AIDrivenGeneratedGame";
import { QuizGenerator } from "./list/QuizGenerator";
import { Taxicity } from "./list/Taxicity";
import { Molotov } from "./list/Molotov";
import { FrogSoldierRobot } from "./list/FrogSoldierRobot";

import {
  ProjectData,
  ProjectDefinition,
  TranslatedProject,
  LocalizedProjectMedia,
} from "./types";
import { Locale, defaultLocale } from "@/i18n/routing";

const projectDefinitions: ProjectDefinition[] = [
  AIDrivenGeneratedGame,
  QuizGenerator,
  Taxicity,
  Molotov,
  FrogSoldierRobot,
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

    const localizedMedia: LocalizedProjectMedia[] = detailed_media.map(
      (item) => {
        const fallbackMediaLoc = item.translations[defaultLocale] ?? {};
        const activeMediaLoc =
          item.translations[currentLocale] ?? fallbackMediaLoc;

        const { translations: _mediaTranslations, ...restItem } = item;

        return {
          ...restItem,
          ...activeMediaLoc,
          translations: _mediaTranslations,
        };
      }
    );

    return {
      ...projectRest,
      ...activeTranslation,
      detailed_media: localizedMedia,
    };
  });
}
