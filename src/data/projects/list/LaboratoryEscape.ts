import { ProjectDefinition } from "../types";

export const LaboratoryEscape: ProjectDefinition = {
  slug: "laboratory-escape",
  date: "2024-12",
  tags: [
    "Unity",
    "Shader Graph",
    "C#",
  ],
  media_preview: "/images/projects/laboratory_escape/preview.jpg",
  links: [
    {
      url: "https://github.com/LiamViader/laboratory-escape/releases/download/v1.0.1/LaboratoryEscape_Windows.zip",
      label: "Download (Windows)",
      type: "live",
      icon: "Download",
      primaryColor: "rgba(16, 185, 129, 0.7)",
      secondaryColor: "rgba(5, 150, 105, 1)",
    },
    {
      url: "https://github.com/LiamViader/laboratory-escape",
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
      src: "https://www.youtu.be.com/JUs6HSwfDCw",
      embedUrl: "https://www.youtube.com/embed/JUs6HSwfDCw",
      thumbnail: "https://img.youtube.com/vi/JUs6HSwfDCw/maxresdefault.jpg",
      figureNumber: "1.1",
      translations: {
        en: {
          alt: "Walkthrough gameplay of Laboratory Escape",
          captionLabel: "Figure",
          description: "Walkthrough gameplay of Laboratory Escape",
        },
        es: {
          alt: "Gameplay completo de Laboratory Escape",
          captionLabel: "Figura",
          description: "Gameplay completo de Laboratory Escape",
        },
      },
    },
    {
      type: "image",
      src: "/images/projects/laboratory_escape/main_room.jpg",
      thumbnail: "/images/projects/laboratory_escape/main_room.jpg",
      figureNumber: "1.2",
      translations: {
        en: {
          alt: "Main room of the laboratory",
          captionLabel: "Figure",
          description: "Main room of the laboratory",
        },
        es: {
          alt: "Sala principal del laboratorio",
          captionLabel: "Figura",
          description: "Sala principal del laboratorio",
        },
      },
    },
    {
      type: "image",
      src: "/images/projects/laboratory_escape/laser_room.jpg",
      thumbnail: "/images/projects/laboratory_escape/laser_room.jpg",
      figureNumber: "1.3",
      translations: {
        en: {
          alt: "Laser room of the laboratory",
          captionLabel: "Figure",
          description: "Laser room of the laboratory",
        },
        es: {
          alt: "Sala de los láser del laboratorio",
          captionLabel: "Figura",
          description: "Sala de los láser del laboratorio",
        },
      },
    },
    {
      type: "image",
      src: "/images/projects/laboratory_escape/using_laser.jpg",
      thumbnail: "/images/projects/laboratory_escape/using_laser.jpg",
      figureNumber: "1.4",
      translations: {
        en: {
          alt: "Player using the laser",
          captionLabel: "Figure",
          description: "Player using the laser",
        },
        es: {
          alt: "Jugador usando el láser",
          captionLabel: "Figura",
          description: "Jugador usando el láser",
        },
      },
    },
    {
      type: "image",
      src: "/images/projects/laboratory_escape/night_vision.jpg",
      thumbnail: "/images/projects/laboratory_escape/night_vision.jpg",
      figureNumber: "1.5",
      translations: {
        en: {
          alt: "Night vision in the closet",
          captionLabel: "Figure",
          description: "Night vision in the closet",
        },
        es: {
          alt: "Visión nocturna en el armario",
          captionLabel: "Figura",
          description: "Visión nocturna en el armario",
        },
      },
    },
  ],
  categories: ["Game"],
  is_featured: true,
  translations: {
    en: {
      title: "Laboratory Escape",
      short_description:
        "Puzzle game in third person. The player must solve puzzles using a laser that shrinks objects to escape from a laboratory",
      full_description: ``,
      role: "",
    },
    es: {
      title: "Laboratory Escape",
      short_description:
        "Videojuego de puzzles en tercera persona. El jugador debe resolver puzzles usando un láser que encoge objetos para escapar de un laboratorio",
      full_description: ``,
      role: "",
    },
  },
};
