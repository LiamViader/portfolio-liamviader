import { Locale, defaultLocale } from "@/i18n/routing";

// TODO: Make possible thta the detailed card has metadata, for SEO purposes, also make the detailed description be able to have html content or some formatting to be able to add links, bold, sections, media etc

export const project_categorys = ["AI", "Game"] as const;

export type ProjectCategory = (typeof project_categorys)[number];

interface ProjectMediaLocalization {
  alt?: string;
  caption?: string;
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
  src: string;
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
        src: "/images/testImage.jpg",
      },
      {
        src: "/images/testImage.jpg",
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
            caption: "Figure 1.1",
            description: "Overview of the main interface.",
          },
          {
            alt: "Workflow detail for project 1",
            caption: "Figure 1.2",
            description: "Highlighted workflow diagram.",
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
            caption: "Figura 1.1",
            description: "Vista general de la interfaz.",
          },
          {
            alt: "Detalle del flujo de trabajo del proyecto 1",
            caption: "Figura 1.2",
            description: "Flujo de trabajo destacado.",
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
        src: "/images/testImage2.jpg",
      },
      {
        src: "/images/testImage2.jpg",
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
            caption: "Figure 2.1",
            description: "Gameplay sequence in progress.",
          },
          {
            alt: "Menu screen for project 2",
            caption: "Figure 2.2",
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
            caption: "Figura 2.1",
            description: "Gameplay en progreso.",
          },
          {
            alt: "Menú del juego 2",
            caption: "Figura 2.2",
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
        src: "/images/testImage2.jpg",
      },
      {
        src: "/images/testImage2.jpg",
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
            caption: "Figure 3.1",
            description: "Real-time combat encounter.",
          },
          {
            alt: "Progress board for project 3",
            caption: "Figure 3.2",
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
            caption: "Figura 3.1",
            description: "Combate en tiempo real.",
          },
          {
            alt: "Tablero de progreso del juego 3",
            caption: "Figura 3.2",
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
        src: "/images/testImage2.jpg",
      },
      {
        src: "/images/testImage2.jpg",
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
            caption: "Figure 4.1",
            description: "Map exploration sequence.",
          },
          {
            alt: "Configuration screen for project 4",
            caption: "Figure 4.2",
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
            caption: "Figura 4.1",
            description: "Exploración del mapa.",
          },
          {
            alt: "Configuración del juego 4",
            caption: "Figura 4.2",
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
        src: "/images/testImage2.jpg",
      },
      {
        src: "/images/testImage2.jpg",
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
            caption: "Figure 5.1",
            description: "Starting area of the experience.",
          },
          {
            alt: "Strategic map detail for project 5",
            caption: "Figure 5.2",
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
            caption: "Figura 5.1",
            description: "Nivel inicial.",
          },
          {
            alt: "Detalle del mapa del juego 5",
            caption: "Figura 5.2",
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
