import { Locale, defaultLocale } from "@/i18n/routing";

// TODO: Make possible thta the detailed card has metadata, for SEO purposes, also make the detailed description be able to have html content or some formatting to be able to add links, bold, sections, media etc

export const project_categorys = ["AI", "Game"] as const;

export type ProjectCategory = (typeof project_categorys)[number];

type ProjectMediaType = "image" | "video" | "externalVideo";

interface ProjectMediaLocalization {
  alt?: string;
  captionLabel?: string;
  description?: string;
}

interface ProjectTranslations {
  title: string;
  short_description: string;
  full_description: string;
  role?: string;
  media: ProjectMediaLocalization[];
}

interface ProjectMediaItem {
  type: ProjectMediaType;
  src: string;
  thumbnail?: string;
  poster?: string;
  embedUrl?: string;
  figureNumber?: string;
}

interface ProjectData {
  id: number;
  tags: string[];
  media_preview: string;
  github_url?: string;
  live_url?: string;
  detailed_media: ProjectMediaItem[];
  categorys: ProjectCategory[];
  is_featured?: boolean;
  translations: Record<Locale, ProjectTranslations>;
}

export const allProjects: ProjectData[] = [
  {
    id: 1,
    tags: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    media_preview: "/images/testImage.jpg",
    github_url: "https://github.com/liam/project1",
    live_url: "https://project1-live.com",
    detailed_media: [
      {
        type: "image",
        src: "/images/testImage.jpg",
        figureNumber: "1.1",
      },
      {
        type: "video",
        src: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
        poster: "/images/testImage2.jpg",
        thumbnail: "/images/testImage2.jpg",
        figureNumber: "1.2",
      },
      {
        type: "externalVideo",
        src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        figureNumber: "1.3",
      },
    ],
    categorys: ["AI", "Game"],
    is_featured: true,
    translations: {
      en: {
        title: "Example 1",
        short_description: "Short description. ASDW Sasdsadd wasdda efsdfsd vvcasdas efdfsdf",
        full_description:
          "Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        role: "Full-Stack Developer & ML Engineer",
        media: [
          {
            alt: "Primary interface view for project 1",
            captionLabel: "Figure",
            description: "Overview of the main interface.",
          },
          {
            alt: "Workflow detail for project 1",
            captionLabel: "Figure",
            description: "Highlighted workflow diagram.",
          },
          {
            alt: "YouTube preview for project 1",
            captionLabel: "Figure",
            description: "Embedded presentation hosted on YouTube.",
          },
        ],
      },
      es: {
        title: "Ejemplo 1",
        short_description: "Descripcion corta. ASDW Sasdsadd wasdda efsdfsd vvcasdas efdfsdf",
        full_description:
          "Descripcion larga aqui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit en voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt en culpa qui officia deserunt mollit anim id est laborum.",
        role: "Desarrollador Full-Stack e Ingeniero de ML",
        media: [
          {
            alt: "Vista principal del proyecto 1",
            captionLabel: "Figura",
            description: "Vista general de la interfaz.",
          },
          {
            alt: "Detalle del flujo de trabajo del proyecto 1",
            captionLabel: "Figura",
            description: "Flujo de trabajo destacado.",
          },
          {
            alt: "Vista previa de YouTube del proyecto 1",
            captionLabel: "Figura",
            description: "Presentación incrustada alojada en YouTube.",
          },
        ],
      },
    },
  },
  {
    id: 2,
    tags: ["Godot", "GdScript"],
    media_preview: "/images/testImage2.jpg",
    github_url: "https://github.com/liam/project1",
    live_url: "https://project1-live.com",
    detailed_media: [
      {
        type: "image",
        src: "/images/testImage2.jpg",
        figureNumber: "2.1",
      },
      {
        type: "image",
        src: "/images/testImage2.jpg",
        figureNumber: "2.2",
      },
    ],
    categorys: ["Game"],
    is_featured: true,
    translations: {
      en: {
        title: "Example 2",
        short_description: "Short description.",
        full_description:
          "Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        role: "Full-Stack Developer & ML Engineer",
        media: [
          {
            alt: "Main gameplay screen for project 2",
            captionLabel: "Figure",
            description: "Gameplay sequence in progress.",
          },
          {
            alt: "Menu screen for project 2",
            captionLabel: "Figure",
            description: "Main menu and options layout.",
          },
        ],
      },
      es: {
        title: "Ejemplo 2",
        short_description: "Descripcion corta.",
        full_description:
          "Descripcion larga aqui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor en reprehenderit en voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt en culpa qui officia deserunt mollit anim id est laborum.",
        role: "Desarrollador Full-Stack e Ingeniero de ML",
        media: [
          {
            alt: "Pantalla principal del juego 2",
            captionLabel: "Figura",
            description: "Gameplay en progreso.",
          },
          {
            alt: "Menú del juego 2",
            captionLabel: "Figura",
            description: "Menú principal y opciones.",
          },
        ],
      },
    },
  },
  {
    id: 3,
    tags: ["Godot", "GdScript"],
    media_preview: "/images/testImage2.jpg",
    github_url: "https://github.com/liam/project1",
    live_url: "https://project1-live.com",
    detailed_media: [
      {
        type: "image",
        src: "/images/testImage2.jpg",
        figureNumber: "3.1",
      },
      {
        type: "image",
        src: "/images/testImage2.jpg",
        figureNumber: "3.2",
      },
    ],
    categorys: ["Game"],
    is_featured: true,
    translations: {
      en: {
        title: "Example 3",
        short_description: "Short description.",
        full_description:
          "Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        role: "Full-Stack Developer & ML Engineer",
        media: [
          {
            alt: "Primary gameplay view for project 3",
            captionLabel: "Figure",
            description: "Real-time combat encounter.",
          },
          {
            alt: "Progress board for project 3",
            captionLabel: "Figure",
            description: "Player progression dashboard.",
          },
        ],
      },
      es: {
        title: "Ejemplo 3",
        short_description: "Descripcion corta.",
        full_description:
          "Descripcion larga aqui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor en reprehenderit en voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt en culpa qui officia deserunt mollit anim id est laborum.",
        role: "Desarrollador Full-Stack e Ingeniero de ML",
        media: [
          {
            alt: "Pantalla principal del juego 3",
            captionLabel: "Figura",
            description: "Combate en tiempo real.",
          },
          {
            alt: "Tablero de progreso del juego 3",
            captionLabel: "Figura",
            description: "Progresión del jugador.",
          },
        ],
      },
    },
  },
  {
    id: 4,
    tags: ["Godot", "GdScript"],
    media_preview: "/images/testImage2.jpg",
    github_url: "https://github.com/liam/project1",
    live_url: "https://project1-live.com",
    detailed_media: [
      {
        type: "image",
        src: "/images/testImage2.jpg",
        figureNumber: "4.1",
      },
      {
        type: "image",
        src: "/images/testImage2.jpg",
        figureNumber: "4.2",
      },
    ],
    categorys: ["Game"],
    is_featured: true,
    translations: {
      en: {
        title: "Example 4",
        short_description: "Short description.",
        full_description:
          "Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        role: "Full-Stack Developer & ML Engineer",
        media: [
          {
            alt: "World exploration view for project 4",
            captionLabel: "Figure",
            description: "Map exploration sequence.",
          },
          {
            alt: "Configuration screen for project 4",
            captionLabel: "Figure",
            description: "Customizable settings panel.",
          },
        ],
      },
      es: {
        title: "Ejemplo 4",
        short_description: "Descripcion corta.",
        full_description:
          "Descripcion larga aqui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor en reprehenderit en voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt en culpa qui officia deserunt mollit anim id est laborum.",
        role: "Desarrollador Full-Stack e Ingeniero de ML",
        media: [
          {
            alt: "Pantalla principal del juego 4",
            captionLabel: "Figura",
            description: "Exploración del mapa.",
          },
          {
            alt: "Configuración del juego 4",
            captionLabel: "Figura",
            description: "Ajustes personalizables.",
          },
        ],
      },
    },
  },
  {
    id: 5,
    tags: ["Godot", "GdScript"],
    media_preview: "/images/testImage2.jpg",
    github_url: "https://github.com/liam/project1",
    live_url: "https://project1-live.com",
    detailed_media: [
      {
        type: "image",
        src: "/images/testImage2.jpg",
        figureNumber: "5.1",
      },
      {
        type: "image",
        src: "/images/testImage2.jpg",
        figureNumber: "5.2",
      },
    ],
    categorys: ["Game"],
    is_featured: true,
    translations: {
      en: {
        title: "Example 5",
        short_description: "Short description.",
        full_description:
          "Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        role: "Full-Stack Developer & ML Engineer",
        media: [
          {
            alt: "Opening level view for project 5",
            captionLabel: "Figure",
            description: "Starting area of the experience.",
          },
          {
            alt: "Strategic map detail for project 5",
            captionLabel: "Figure",
            description: "Strategic map overview.",
          },
        ],
      },
      es: {
        title: "Ejemplo 5",
        short_description: "Descripcion corta.",
        full_description:
          "Descripcion larga aqui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor en reprehenderit en voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt en culpa qui officia deserunt mollit anim id est laborum.",
        role: "Desarrollador Full-Stack e Ingeniero de ML",
        media: [
          {
            alt: "Pantalla principal del juego 5",
            captionLabel: "Figura",
            description: "Nivel inicial.",
          },
          {
            alt: "Detalle del mapa del juego 5",
            captionLabel: "Figura",
            description: "Vista del mapa estratégico.",
          },
        ],
      },
    },
  },
];

type ProjectBase = Omit<ProjectData, "translations" | "detailed_media">;
type ProjectTranslationBase = Omit<ProjectTranslations, "media">;
type LocalizedProjectMedia = ProjectMediaItem & ProjectMediaLocalization;

export type TranslatedProject = ProjectBase &
  ProjectTranslationBase & {
    detailed_media: LocalizedProjectMedia[];
  };

export function getProjectsByLocale(locale: string): TranslatedProject[] {
  const currentLocale = locale as Locale;

  return allProjects.map((project) => {
    const { translations, detailed_media, ...projectRest } = project;
    const fallbackTranslation = translations[defaultLocale];
    const activeTranslation = translations[currentLocale] ?? fallbackTranslation;

    const mediaTranslations = activeTranslation.media ?? [];
    const fallbackMediaTranslations = fallbackTranslation.media ?? [];

    const localizedMedia = detailed_media.map((item, index) => ({
      ...item,
      ...(fallbackMediaTranslations[index] ?? {}),
      ...(mediaTranslations[index] ?? {}),
    }));

    const { media: _media, ...restTranslations } = activeTranslation;
    void _media;

    return {
      ...projectRest,
      ...restTranslations,
      detailed_media: localizedMedia,
    };
  });
}
