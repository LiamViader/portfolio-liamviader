import { ProjectDefinition } from "../types";

export const FrogSoldierRobot: ProjectDefinition = {
  slug: "frog-soldier-robot",
  date: "2023-10",
  tags: [
    "Blender",
    "Substance Painter",
  ],
  media_preview: "/images/projects/frog_soldier_robot/preview.jpg",
  links: [
    {
      url: "https://drive.google.com/uc?export=download&id=1gxjmXaL9l6rfbx34RjBrE3h8I_Dn-BTb",
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
      src: "https://www.youtu.be.com/7KYMXBA4h14",
      embedUrl: "https://www.youtube.com/embed/7KYMXBA4h14",
      thumbnail: "https://img.youtube.com/vi/7KYMXBA4h14/maxresdefault.jpg",
      figureNumber: "1.1",
      translations: {
        en: {
          alt: "Render of the Walk animation",
          captionLabel: "Figure",
          description: "Render of the Walk animation",
        },
        es: {
          alt: "Render de la animación Walk",
          captionLabel: "Figura",
          description: "Render de la animación Walk",
        },
      },
    },
    {
      type: "image",
      src: "/images/projects/frog_soldier_robot/render.jpg",
      thumbnail: "/images/projects/frog_soldier_robot/render.jpg",
      figureNumber: "1.2",
      translations: {
        en: {
          alt: "Render of the robot",
          captionLabel: "Figure",
          description: "Render of the robot",
        },
        es: {
          alt: "Render del robot",
          captionLabel: "Figura",
          description: "Render del robot",
        },
      },
    },
    {
      type: "image",
      src: "/images/projects/frog_soldier_robot/wireframe.jpg",
      thumbnail: "/images/projects/frog_soldier_robot/wireframe.jpg",
      figureNumber: "1.3",
      translations: {
        en: {
          alt: "Wireframe of the robot",
          captionLabel: "Figure",
          description: "Wireframe of the robot",
        },
        es: {
          alt: "Wireframe del robot",
          captionLabel: "Figura",
          description: "Wireframe del robot",
        },
      },
    },
    {
      type: "image",
      src: "/images/projects/frog_soldier_robot/rig.jpg",
      thumbnail: "/images/projects/frog_soldier_robot/rig.jpg",
      figureNumber: "1.4",
      translations: {
        en: {
          alt: "Rig of the robot",
          captionLabel: "Figure",
          description: "Rig of the robot",
        },
        es: {
          alt: "Rig del robot",
          captionLabel: "Figura",
          description: "Rig del robot",
        },
      },
    },
  ],
  categories: ["Art", "Game"],
  is_featured: true,
  translations: {
    en: {
      title: "Frog Soldier Robot",
      short_description:
        "3D character model and animations of a robot, optimized for games with high and low poly versions.",
      full_description: `This project showcases a <highlight type="accent">3D character model</highlight> of a combat robot nicknamed "Frog Soldier" due to its distinctive amphibian-inspired structure. Designed specifically for <highlight type="glow">video game integration</highlight>, the workflow involved creating both a <highlight type="soft">High Poly</highlight> version for detail and a <highlight type="code">Low Poly</highlight> version optimized for performance.

      The robot was meticulously <highlight type="underline">modeled and rigged in Blender</highlight>, where I also developed its core animation set, including <highlight type="important">Idle and Walk</highlight> cycles. The texturing process was handled in <highlight type="tag">Substance Painter</highlight>, applying a rugged military aesthetic with realistic wear and tear to emphasize its tactical nature.`,
      role: "3D Modeler and Animator",
    },
    es: {
      title: "Robot Soldado Rana",
      short_description:
        "Modelo 3D y animaciones de un robot, optimizado para videojuegos con versiones high y low poly.",
      full_description: `Este proyecto presenta un <highlight type="accent">modelo de personaje 3D</highlight> de un robot de combate apodado "Frog Soldier" por su estructura inspirada en un anfibio. Diseñado específicamente para su <highlight type="glow">integración en videojuegos</highlight>, el flujo de trabajo incluyó la creación de una versión <highlight type="soft">High Poly</highlight> para el detalle y una <highlight type="code">Low Poly</highlight> optimizada para rendimiento.

      El robot fue <highlight type="underline">modelado y riggeado en Blender</highlight>, donde también desarrollé su set de animaciones básicas, incluyendo <highlight type="important">Idle y Walk</highlight>. El proceso de texturizado se realizó en <highlight type="tag">Substance Painter</highlight>, aplicando una estética militar con desgaste realista para enfatizar su naturaleza táctica.`,
      role: "Modelador 3D y Animador",
    },
  },
};
