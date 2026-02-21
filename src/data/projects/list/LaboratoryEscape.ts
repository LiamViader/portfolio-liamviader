import { ProjectDefinition } from "../types";

export const LaboratoryEscape: ProjectDefinition = {
  slug: "laboratory-escape",
  date: "2023-12",
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
        "Puzzle game in third person. The player must solve puzzles with the help of a laser that shrinks objects to escape from a laboratory",
      full_description: `Laboratory Escape is a <highlight type="accent">third-person</highlight> puzzle game developed in <highlight type="tag">Unity 3D</highlight> by a team of 5 people. Viewed through security cameras, you play as a scientist trapped in a laboratory who must escape by solving various puzzles and challenges.

The core mechanic centers on a <highlight type="glow">laser flashlight</highlight> capable of <highlight type="important">shrinking and enlarging objects</highlight>. To acquire it, the player must navigate a <highlight type="accent">mirror room</highlight>, correctly orienting mirrors to bounce the laser toward the goal. In addition to classic escape room puzzles involving codes and clues, the game features sections where the protagonist must shrink objects or even themselves to perform <highlight type="important">parkour</highlight> inside laboratory cabinets.

The visual style is defined by <highlight type="accent">custom shaders</highlight> created with <highlight type="tag">Shader Graph</highlight>, featuring effects such as night vision, transformation distortion, dynamic liquids in lab glassware, intermittent glow systems for interactable objects and more.

Beyond the technical development, this project was a fundamental experience in <highlight type="accent">collaborative teamwork</highlight>, requiring close coordination within a multidisciplinary team to build a relatively complex and cohesive gameplay experience.

My role in the project included technical <highlight type="accent">mechanics design</highlight>, <highlight type="important">core programming</highlight> of the game logic, <highlight type="accent">level design and assembly</highlight> of the mirror room, and the <highlight type="glow">artistic design and development of all shaders</highlight>.`,
      role: "Lead Programmer and Technical Designer",
    },
    es: {
      title: "Laboratory Escape",
      short_description:
        "Videojuego de puzzles en tercera persona. El jugador debe resolver puzzles con la ayuda de un láser que encoge objetos para escapar de un laboratorio",
      full_description: `Laboratory Escape es un videojuego de puzzles en <highlight type="accent">tercera persona</highlight> desarrollado en <highlight type="tag">Unity 3D</highlight> por un equipo de 5 personas. Bajo una estética de cámaras de seguridad, el jugador encarna a un científico atrapado en un laboratorio que debe escapar resolviendo diversos acertijos y desafíos.

La mecánica central gira en torno a una <highlight type="glow">linterna láser</highlight> capaz de <highlight type="important">encoger y agrandar objetos</highlight>. Para obtenerla, el jugador debe navegar por una <highlight type="accent">sala de espejos</highlight>, orientando correctamente los espejos para hacer que el láser rebote hacia el objetivo. Además de los rompecabezas clásicos de escape room con códigos y pistas, el juego incluye secciones donde el protagonista debe encoger objetos o incluso a sí mismo para realizar <highlight type="important">parkour</highlight> por el mobiliario del laboratorio.

El estilo visual viene definido por <highlight type="accent">shaders personalizados</highlight> creados con <highlight type="tag">Shader Graph</highlight>, con efectos como visión nocturna, distorsión por transformación, líquidos dinámicos en recipientes de vidrio, sistemas de brillo intermitente para objetos interactuables y más.

Más allá del desarrollo técnico, este proyecto supuso una experiencia fundamental en el <highlight type="accent">trabajo en equipo colaborativo</highlight>, requiriendo una estrecha coordinación dentro de un equipo multidisciplinar para construir una experiencia de juego relativamente compleja y cohesiva.

Mi rol en el proyecto incluyó el <highlight type="accent">diseño técnico de mecánicas</highlight>, la <highlight type="important">programación base</highlight> de la lógica del juego, el <highlight type="accent">diseño y montaje</highlight> de la sala de espejos, y el <highlight type="glow">diseño artístico y desarrollo de todos los shaders</highlight>.`,
      role: "Programador Principal y Diseñador Técnico",
    },
  },
};
