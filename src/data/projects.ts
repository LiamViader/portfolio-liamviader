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
    media_preview: "/images/project1-preview.jpg",
    github_url: "https://github.com/liam/project1",
    live_url: "https://project1-live.com",
    detailed_media: ["/images/p1-detail1.png", "/videos/p1-demo.mp4"],
    categorys: ["AI", "Game"],
    
    translations: {
      en: {
        title: "AI Portfolio Predictor",
        short_description: "A machine learning model to predict market trends.",
        full_description: "The main challenge was handling vast datasets. I implemented an LSTM network with a custom attention layer to improve prediction accuracy by 15%...",
        role: "Full-Stack Developer & ML Engineer"
      },
      es: {
        title: "Predictor de Portafolio con IA",
        short_description: "Un modelo de aprendizaje automático para predecir tendencias bursátiles.",
        full_description: "El reto principal fue manejar grandes conjuntos de datos. Implementé una red LSTM con una capa de atención personalizada para mejorar la precisión de la predicción en un 15%...",
        role: "Desarrollador Full-Stack e Ingeniero de ML"
      }
    }
  },
  {
    id: 2,
    tags: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    media_preview: "/images/project1-preview.jpg",
    github_url: "https://github.com/liam/project1",
    live_url: "https://project1-live.com",
    detailed_media: ["/images/p1-detail1.png", "/videos/p1-demo.mp4"],
    categorys: ["Game"],
    
    translations: {
      en: {
        title: "AI Portfolio Predictor",
        short_description: "A machine learning model to predict market trends.",
        full_description: "The main challenge was handling vast datasets. I implemented an LSTM network with a custom attention layer to improve prediction accuracy by 15%...",
        role: "Full-Stack Developer & ML Engineer"
      },
      es: {
        title: "Predictor de Portafolio con IA",
        short_description: "Un modelo de aprendizaje automático para predecir tendencias bursátiles.",
        full_description: "El reto principal fue manejar grandes conjuntos de datos. Implementé una red LSTM con una capa de atención personalizada para mejorar la precisión de la predicción en un 15%...",
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