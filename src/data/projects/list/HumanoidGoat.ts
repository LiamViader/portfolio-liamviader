import { ProjectDefinition } from "../types";

export const HumanoidGoat: ProjectDefinition = {
  slug: "humanoid-goat",
  date: "2023-11",
  tags: [
    "Blender",
    "Substance Painter",
  ],
  media_preview: "/images/projects/humanoid_goat/preview.png",
  links: [
    {
      url: "https://drive.google.com/uc?export=download&id=1zTvVovTRX8fRa7EM6iiNcqc6UqPFJBQ4",
      label: "Download",
      type: "live",
      icon: "Download",
      primaryColor: "rgba(16, 185, 129, 0.7)",
      secondaryColor: "rgba(5, 150, 105, 1)",
    },
  ],
  detailed_media: [
    {
      type: "externalVideo",
      src: "https://www.youtu.be.com/-UYgJMBY_kE",
      embedUrl: "https://www.youtube.com/embed/-UYgJMBY_kE",
      thumbnail: "https://img.youtube.com/vi/-UYgJMBY_kE/maxresdefault.jpg",
      figureNumber: "1.1",
      translations: {
        en: {
          alt: "Render of the Run animation",
          captionLabel: "Figure",
          description: "Render of the Run animation",
        },
        es: {
          alt: "Render de la animación Run",
          captionLabel: "Figura",
          description: "Render de la animación Run",
        },
      },
    },
    {
      type: "image",
      src: "/images/projects/humanoid_goat/render_front.jpg",
      thumbnail: "/images/projects/humanoid_goat/render_front.jpg",
      figureNumber: "1.2",
      translations: {
        en: {
          alt: "Render of the humanoid goat",
          captionLabel: "Figure",
          description: "Render of the humanoid goat",
        },
        es: {
          alt: "Render de la cabra humanoide",
          captionLabel: "Figura",
          description: "Render de la cabra humanoide",
        },
      },
    },
    {
      type: "image",
      src: "/images/projects/humanoid_goat/wireframe.jpg",
      thumbnail: "/images/projects/humanoid_goat/wireframe.jpg",
      figureNumber: "1.3",
      translations: {
        en: {
          alt: "Wireframe of the humanoid goat",
          captionLabel: "Figure",
          description: "Wireframe of the humanoid goat",
        },
        es: {
          alt: "Wireframe de la cabra humanoide",
          captionLabel: "Figura",
          description: "Wireframe de la cabra humanoide",
        },
      },
    },
    {
      type: "image",
      src: "/images/projects/humanoid_goat/rig.jpg",
      thumbnail: "/images/projects/humanoid_goat/rig.jpg",
      figureNumber: "1.4",
      translations: {
        en: {
          alt: "Rig of the humanoid goat",
          captionLabel: "Figure",
          description: "Rig of the humanoid goat",
        },
        es: {
          alt: "Rig de la cabra humanoide",
          captionLabel: "Figura",
          description: "Rig de la cabra humanoide",
        },
      },
    },
  ],
  categories: ["Art", "Game"],
  is_featured: false,
  translations: {
    en: {
      title: "Humanoid Goat",
      short_description:
        "3D character model and animations of a humanoid goat, optimized for games with high and low poly versions.",
      full_description: `This project showcases a <highlight type="accent">3D character model</highlight> of a humanoid goat. Designed specifically for <highlight type="glow">video game integration</highlight>, the workflow involved creating both a <highlight type="soft">High Poly</highlight> version for detail and a <highlight type="code">Low Poly</highlight> version optimized for performance.

      The textures are mostly solid to achieve a <highlight type="important">stylized, cartoon-inspired aesthetic</highlight>. The goat was meticulously <highlight type="underline">modeled and rigged in Blender</highlight>, where I also developed its core animation set, including <highlight type="important">Idle and Run</highlight> cycles. The texturing process was handled in <highlight type="tag">Substance Painter</highlight>.`,
      role: "3D Modeler and Animator",
    },
    es: {
      title: "Cabra Humanoide",
      short_description:
        "Modelo 3D y animaciones de un cabra humanoide, optimizado para videojuegos con versiones high y low poly.",
      full_description: `Este proyecto presenta un <highlight type="accent">modelo de personaje 3D</highlight> de una cabra humanoide. Diseñado específicamente para su <highlight type="glow">integración en videojuegos</highlight>, el flujo de trabajo incluyó la creación de una versión <highlight type="soft">High Poly</highlight> para el detalle y una <highlight type="code">Low Poly</highlight> optimizada para rendimiento.

      Las texturas son mayormente sólidas para lograr una <highlight type="important">estética más estilizada y de estilo cartoon</highlight>. El personaje fue <highlight type="underline">modelado y riggeado en Blender</highlight>, donde también desarrollé su set de animaciones básicos, incluyendo <highlight type="important">Idle y Run</highlight>. El proceso de texturizado se realizó en <highlight type="tag">Substance Painter</highlight>.`,
      role: "Modelador 3D y Animador",
    },
  },
};
