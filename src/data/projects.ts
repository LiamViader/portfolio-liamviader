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

export const testProjects: ProjectData[] = [
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
        title: "Sistema de IA Multiagente para Generación y Dirección de Videojuegos",
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
        title: "Videojuego generado y dirigido por IA",
        short_description: "Sistema multiagente de IA que genera y dirige los componentes visuales, narrativos y estructurales de un videojuego a partir de una prompt inicial.",
        full_description: `Este proyecto presenta el desarrollo de un sistema de inteligencia artificial multiagente capaz de generar y dirigir un videojuego completo a partir de una única prompt inicial del jugador. La propuesta no se limita a generar texto, sino que establece una arquitectura modular donde distintos agentes basados en modelos de lenguaje colaboran para definir la narrativa, la estructura y el apartado visual del juego. La intención es que el sistema funcione como un director capaz de coordinar decisiones y adaptar la experiencia en función del contexto y de las acciones del jugador.

          A diferencia de un videojuego tradicional, donde el contenido está prefijado, aquí el mundo se construye dinámicamente a partir de la instrucción inicial del jugador. El sistema genera una ambientación, crea escenarios y personajes coherentes con el tono definido, establece una narrativa base y crea los eventos e interacciones disponibles. Aunque estas capacidades se limitan en este prototipo inicial a la primera generación del mundo, la arquitectura está diseñada para que, en versiones futuras, los agentes puedan modificar el estado del juego durante la partida: introducir nuevos eventos, ajustar relaciones entre personajes, expandir la trama o modificar los escenarios.

          Para habilitar estas dinámicas, se diseñó una arquitectura multiagente donde cada agente asume un rol especializado (generación narrativa, gestión de escenarios, gestión de personajes, gestión de eventos, agente director/coordinador, etc.). Estos agentes se coordinan mediante flujos definidos con herramientas como LangChain y LangGraph, y se apoyan en técnicas como el contexto aumentado (RAG) para mantener coherencia entre sus decisiones.

          El proyecto también incorpora un componente visual generado por IA. A través de modelos de imagen integrados en un flujo de trabajo personalizado en ComfyUI, el sistema transforma descripciones textuales (generadas por los LLMs) en representaciones visuales de escenarios y personajes. Estas imágenes se integran posteriormente en un cliente desarrollado en Unity, donde el jugador puede navegar un mapa compuesto por escenarios estáticos y acceder a interacciones con los personajes.

          El MVP se centra en una mecánica de interacción narrativa con personajes dentro de escenarios estáticos. Los diálogos están controlados por agentes de IA que deciden qué personaje interviene y qué debe decir. Para mantener estas conversaciones en streaming y saber el tipo de mensaje del personaje ([dialogue], [action], [player_thought]...), se emplea un pequeño sistema personalizado basado en tags, que permite identificar cada mensaje y mostrarlo progresivamente mientras se genera.

          A nivel técnico, el proyecto incluye el diseño completo de la arquitectura del sistema, la implementación del núcleo funcional en Python, la orquestación de agentes y flujos de generación, la integración con servicios de generación de imágenes, la gestión del estado y trazabilidad mínima mediante logs, así como el desarrollo de una API y un cliente en Unity para interactuar con el prototipo. Aunque esta primera versión es experimental y no incluye aún dirección dinámica, memoria persistente ni alteración del mundo por los agentes en tiempo real, sienta las bases para futuras extensiones en esa dirección.

          En conjunto, este proyecto explora cómo la IA generativa puede asumir parte del rol tradicional del diseñador y director de videojuegos, pasando de un modelo basado en contenido cerrado a uno en el que la experiencia surge dinámicamente de la colaboración entre jugador y sistema. Representa un primer paso hacia entornos interactivos donde la IA no solo genera contenido, sino que también está diseñada para influir, estructurar y expandir la experiencia jugable.`,
        role: "Creador, Diseñador y Desarrollador Completo del Proyecto",
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
