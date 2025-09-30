import { Metadata } from "next";

import { Locale, defaultLocale } from '@/i18n/routing';

// TODO: Make possible thta the detailed card has metadata, for SEO purposes, also make the detailed description be able to have html content or some formatting to be able to add links, bold, sections, media etc

export const project_categorys = ['AI', 'Game'] as const; 

export type ProjectCategory = typeof project_categorys[number]; 

// Structure of the translatable parts of a project
interface ProjectTranslations {
  title: string;
  short_description: string;
  full_description: string;
  role: string;
}



// Structure of a Project with all its data
interface ProjectData {
  id: number;
  tags: string[]; // Tecnologys used etc
  media_preview: string; // URL of the preview image for the closed card
  github_url?: string;
  live_url?: string; // Live demo URL
  detailed_media: string[]; // URLs of images/videos for the detailed view
  categorys: ProjectCategory[]; // Categories for filtering

  // Object containing translations for each supported language
  translations: Record<Locale, ProjectTranslations>; 
}

// 4. El array de Proyectos
export const allProjects: ProjectData[] = [
  {
    id: 1,
    tags: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    media_preview: "/images/testImage.jpg",
    github_url: "https://github.com/liam/project1",
    live_url: "https://project1-live.com",
    detailed_media: ["/images/testImage.jpg", "/images/testImage.jpg"],
    categorys: ["AI", "Game"],
    
    translations: {
      en: {
        title: "Example 1",
        short_description: "Short description.",
        full_description: "Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        role: "Full-Stack Developer & ML Engineer"
      },
      es: {
        title: "Ejemplo 1",
        short_description: "Descripcion corta.",
        full_description: "Descripcion larga aqui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        role: "Desarrollador Full-Stack e Ingeniero de ML"
      }
    }
  },
  {
    id: 2,
    tags: ["Godot", "GdScript"],
    media_preview: "/images/testImage2.jpg",
    github_url: "https://github.com/liam/project1",
    live_url: "https://project1-live.com",
    detailed_media: ["/images/testImage2.jpg", "/images/testImage2.jpg"],
    categorys: ["Game"],
    
    translations: {
      en: {
        title: "Example 2",
        short_description: "Short description.",
        full_description: "Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        role: "Full-Stack Developer & ML Engineer"
      },
      es: {
        title: "Ejemplo 2",
        short_description: "Descripcion corta.",
        full_description: "Descripcion larga aqui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        role: "Desarrollador Full-Stack e Ingeniero de ML"
      }
    }
  },
];

// Function to extract data with the correct translations based on locale
export type TranslatedProject = Omit<ProjectData, 'translations'> & ProjectTranslations;

export function getProjectsByLocale(locale: string): TranslatedProject[] {
  const currentLocale = locale as Locale;
  
  return allProjects.map(project => {
    const translatedTexts = project.translations[currentLocale] || project.translations[defaultLocale]; 
    
    return {
      ...project,
      ...translatedTexts,
      translations: undefined, 
    } as TranslatedProject;
  });
}