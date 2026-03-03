import { ProjectDefinition } from "../types";

export const ButterflyCollector: ProjectDefinition = {
  slug: "butterfly-collector",
  date: "2025-01",
  tags: [
    "AR",
    "Mobile",
    "Unity",
    "C#"
  ],
  media_preview: "/images/projects/butterfly_collector/preview.jpg",
  links: [
    {
      url: "https://github.com/LiamViader/butterfly-collector/releases/download/v1.0.2/ButterflyCollector_v1.0.2.apk",
      label: "Download APK",
      type: "live",
      icon: "Download",
      primaryColor: "rgba(16, 185, 129, 0.7)",
      secondaryColor: "rgba(5, 150, 105, 1)",
    },
    {
      url: "https://github.com/LiamViader/butterfly-collector",
      label: "GitHub",
      type: "github",
      icon: "Github",
      primaryColor: "rgba(150, 37, 255, 0.7)",
      secondaryColor: "rgba(168, 85, 247, 1)",
    },
  ],
  detailed_media: [
    {
      type: "externalVideo",
      src: "https://www.youtu.be.com/i_bh9q6fqmk",
      embedUrl: "https://www.youtube.com/embed/i_bh9q6fqmk",
      thumbnail: "https://img.youtube.com/vi/i_bh9q6fqmk/hqdefault.jpg",
      figureNumber: "1.1",
      translations: {
        en: {
          alt: "Gameplay of Butterfly Collector",
          captionLabel: "Figure",
          description: "Gameplay of Butterfly Collector",
        },
        es: {
          alt: "Gameplay de Butterfly Collector",
          captionLabel: "Figura",
          description: "Gameplay de Butterfly Collector",
        },
      },
    },
    {
      type: "image",
      src: "/images/projects/butterfly_collector/ingame.jpg",
      thumbnail: "/images/projects/butterfly_collector/ingame.jpg",
      figureNumber: "1.2",
      translations: {
        en: {
          alt: "In-game image of Butterfly Collector",
          captionLabel: "Figure",
          description: "In-game image of Butterfly Collector",
        },
        es: {
          alt: "Imagen dentro del juego de Butterfly Collector",
          captionLabel: "Figura",
          description: "Imagen dentro del juego de Butterfly Collector",
        },
      },
    },
    {
      type: "image",
      src: "/images/projects/butterfly_collector/collection.jpg",
      thumbnail: "/images/projects/butterfly_collector/collection.jpg",
      figureNumber: "1.3",
      translations: {
        en: {
          alt: "Image of a butterfly collection",
          captionLabel: "Figure",
          description: "Image of a butterfly collection",
        },
        es: {
          alt: "Imagen de una colección de mariposas",
          captionLabel: "Figura",
          description: "Imagen de una colección de mariposas",
        },
      },
    },
  ],
  categories: ["Game"],
  is_featured: true,
  translations: {
    en: {
      title: "Butterfly Collector AR",
      short_description:
        "Augmented reality mobile game where you capture unique, procedurally generated butterflies based on your real-world environment.",
      full_description: `Butterfly Collector is an <highlight type="accent">augmented reality (AR) experience</highlight> where players find and capture butterflies in their own surroundings. By pressing and dragging on the screen, you create a net to catch them and add them to your growing <highlight type="important">collection</highlight>.

      The most distinctive feature is that every butterfly is <highlight type="glow">unique</highlight>. They are <highlight type="tag">procedurally generated</highlight> using patches of textures captured directly from what the camera sees, applying symmetry to the wings to create organic and varied designs. 

      Built with <highlight type="soft">Unity and AR Foundation</highlight>, the game features an intelligent navigation system. The butterflies move between <highlight type="underline">detected points of interest</highlight> in the real environment, alternating between flying and resting, ensuring they respect the physical space around the player.`,
      role: "Creator, Designer, and Developer of the Full Videogame",
    },
    es: {
      title: "Butterfly Collector AR",
      short_description:
        "Juego de realidad aumentada para móviles donde capturas mariposas únicas, generadas proceduralmente a partir de tu entorno real.",
      full_description: `Butterfly Collector es una <highlight type="accent">experiencia de realidad aumentada (AR)</highlight> donde el objetivo es encontrar y capturar mariposas en tu propio entorno. Al presionar y arrastrar en la pantalla, creas un cazamariposas para atraparlas y añadirlas a tu <highlight type="important">colección</highlight>.

      Lo que hace especial a este juego es que cada mariposa es <highlight type="glow">única</highlight>. Se generan de forma <highlight type="tag">procedural</highlight> utilizando fragmentos de texturas capturados directamente de lo que muestra la cámara, aplicando simetría a las alas para crear diseños orgánicos y variados.

      Desarrollado con <highlight type="soft">Unity y AR Foundation</highlight>, el juego incluye un sistema de navegación inteligente. Las mariposas se desplazan entre <highlight type="underline">puntos de interés detectados</highlight> en el entorno real, alternando entre el vuelo y el reposo, respetando siempre el espacio físico que rodea al jugador.`,
      role: "Creator, Designer, and Developer of the Full Videogame",
    },
  },
};
