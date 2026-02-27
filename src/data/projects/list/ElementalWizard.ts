import { ProjectDefinition } from "../types";

export const ElementalWizard: ProjectDefinition = {
  slug: "elemental-wizard",
  date: "2025-01",
  tags: [
    "VR",
    "Unity",
    "C#"
  ],
  media_preview: "/images/projects/elemental_wizard/preview.jpg",
  links: [
    {
      url: "https://github.com/LiamViader/elemental-wizard",
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
      src: "https://www.youtu.be.com/ePQGGtj_ebI",
      embedUrl: "https://www.youtube.com/embed/ePQGGtj_ebI",
      thumbnail: "https://img.youtube.com/vi/ePQGGtj_ebI/maxresdefault.jpg",
      figureNumber: "1.1",
      translations: {
        en: {
          alt: "Gameplay of Elemental Wizard",
          captionLabel: "Figure",
          description: "Gameplay of Elemental Wizard",
        },
        es: {
          alt: "Gameplay de Elemental Wizard",
          captionLabel: "Figura",
          description: "Gameplay de Elemental Wizard",
        },
      },
    },
  ],
  categories: ["Game"],
  is_featured: true,
  translations: {
    en: {
      title: "Elemental Wizard VR",
      short_description:
        "Virtual reality puzzle game where you master the four elements to solve environment-based challenges using a magical wand.",
      full_description: `Elemental Wizard VR is a <highlight type="accent">virtual reality puzzle experience</highlight> where players take on the role of a wizard capable of wielding the four elements. Using a specialized wand, you can <highlight type="important">cycle between four distinct spells</highlight> to interact with the environment and solve challenges.

      The elemental powers include:
      - <highlight type="glow">Fire</highlight>: Melts solid objects into a liquid state.
      - <highlight type="glow">Ice</highlight>: Solidifies liquids to create platforms or paths.
      - <highlight type="glow">Air</highlight>: Grants <highlight type="underline">telekinesis</highlight> to move and manipulate solid objects from a distance.
      - <highlight type="glow">Earth</highlight>: Enables <highlight type="important">teleportation</highlight> to specific totems, which must first be activated via weight-based pressure plates.

      Progress is made by <highlight type="tag">combining these mechanics</highlight>. For instance, you might need to solidify a liquid surface with ice before using telekinesis to reposition a heavy object and clear your path. 
      
      This project was developed by a <highlight type="soft">team of four</highlight> using Unity's XR Interaction Toolkit. My role was mainly as a developer, although I also participated in the design of mechanics and in the creation of some assets.`,
      role: "Developer",
    },
    es: {
      title: "Elemental Wizard VR",
      short_description:
        "Juego de puzles en realidad virtual donde dominas los cuatro elementos para resolver desafíos con una varita mágica.",
      full_description: `Elemental Wizard VR es una <highlight type="accent">experiencia de puzles en realidad virtual</highlight> donde encarnas a un mago capaz de dominar los cuatro elementos. A través de una varita, puedes <highlight type="important">rotar entre cuatro hechizos distintos</highlight> para interactuar con el entorno y superar desafíos.

      Los poderes disponibles son:
      - <highlight type="glow">Fuego</highlight>: Permite derretir objetos sólidos para pasarlos a estado líquido.
      - <highlight type="glow">Hielo</highlight>: Solidifica líquidos, permitiendo crear superficies estables.
      - <highlight type="glow">Aire</highlight>: Proporciona capacidades de <highlight type="underline">telequinesis</highlight> para desplazar y manipular objetos sólidos con la varita.
      - <highlight type="glow">Tierra</highlight>: Permite el <highlight type="important">teletransporte</highlight> hacia tótems específicos, siempre que hayan sido activados previamente mediante placas de presión.

      La resolución de los puzles se basa en la <highlight type="tag">combinación de estas mecánicas</highlight>. Por ejemplo, es posible que debas solidificar un fluido antes de usar la telequinesis para mover un obstáculo y abrirte camino. 
      
      Este proyecto fue desarrollado por un <highlight type="soft">equipo de cuatro personas</highlight> utilizando Unity XR Interaction Toolkit. Mi rol fue principalmente el de desarrollador, aunque también participé en el diseño de mecánicas y en la creación de algunos assets.`,
      role: "Desarrollador",
    },
  },
};
