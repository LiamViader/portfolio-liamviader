import { ProjectDefinition } from "../types";

export const InfiniteDiver: ProjectDefinition = {
  slug: "infinite-diver",
  date: "2024-10",
  tags: [
    "Unity",
    "Mobile",
    "C#"
  ],
  media_preview: "/images/projects/infinite-diver/preview.png",
  links: [
    {
      url: "https://github.com/LiamViader/infinite-diver/releases/download/1.3/InfiniteDiver_v1.3.apk",
      label: "Download APK (Android)",
      type: "live",
      icon: "Download",
      primaryColor: "rgba(16, 185, 129, 0.7)",
      secondaryColor: "rgba(5, 150, 105, 1)",
    },
    {
      url: "https://github.com/LiamViader/infinite-diver",
      label: "GitHub",
      type: "github",
      icon: "Github",
      primaryColor: "rgba(150, 37, 255, 0.7)",
      secondaryColor: "rgba(168, 85, 247, 1)",
    },
  ],
  detailed_media: [

  ],
  categories: ["Game"],
  is_featured: false,
  translations: {
    en: {
      title: "Infinite Diver",
      short_description:
        "A 2D mobile arcade dropper made in Unity: free-fall through the night sky and dodge obstacles to survive.",
      full_description: `Infinite Diver was my <highlight type="important">first mobile game</highlight>. It is a 2D arcade title that flips the traditional runner formula into a "dropper" experience, where you play as an abstract diver falling infinitely through a stylized night sky. Using the <highlight type="accent">gyroscope</highlight> for horizontal movement, you must navigate between obstacles in a loop.

        The core mechanic revolves around <highlight type="glow">size management</highlight>. You encounter two types of birds during your descent: <highlight type="important">white birds</highlight> increase your size, while <highlight type="important">black birds</highlight> shrink you. If you lose all your size, the game ends. To help navigate tight spots, you can <highlight type="important">deploy a parachute</highlight> by holding the screen, slowing your descent for a brief period. This ability is balanced by a <highlight type="glow">cooldown</highlight>.

        To keep the challenge fresh, both the <highlight type="glow">falling speed</highlight> and the <highlight type="glow">spawn rate</highlight> of birds increase progressively as you descend further. Developed in <highlight type="soft">Unity</highlight> with <highlight type="soft">C#</highlight>, this project served as a comprehensive learning experience in mobile optimization and polish. Apart from designing and developing the game, I also created the <highlight type="tag">visual assets</highlight>.`,
      role: "Creator, Designer, and Developer of the Full Videogame",
    },
    es: {
      title: "Infinite Diver",
      short_description:
        "Un 'dropper' arcade 2D para móvil hecho en Unity. Cae por un cielo nocturno evitando obstáculos para sobrevivir.",
      full_description: `Infinite Diver fue mi <highlight type="important">primera experiencia en el desarrollo para móviles</highlight>. Es un título arcade 2D que invierte la fórmula tradicional del runner para convertirla en una experiencia "dropper", donde eres un paracaidista abstracto que cae infinitamente por un cielo nocturno estilizado. Controlando la posición horizontal mediante el <highlight type="accent">giroscopio</highlight>, debes navegar entre obstáculos en bucle.

        La mecánica principal gira en torno a la <highlight type="glow">gestión del tamaño</highlight>. Durante la caída, te encuentras con dos tipos de aves: las <highlight type="important">blancas</highlight> te hacen crecer, mientras que las <highlight type="important">negras</highlight> reducen tu tamaño. Si pierdes todo tu volumen, la partida termina. Para ayudarte en momentos críticos, puedes <highlight type="important">desplegar un paracaídas</highlight> manteniendo pulsada la pantalla, lo que reduce significativamente la velocidad de caída. Esta función cuenta con <highlight type="glow">tiempo de reutilización (cooldown)</highlight>.

        La <highlight type="glow">velocidad de caída</highlight> y la <highlight type="glow">frecuencia de aparición</highlight> de los pájaros aumentan progresivamente. Desarrollado en <highlight type="soft">Unity</highlight> con <highlight type="soft">C#</highlight>, este proyecto fue una experiencia de aprendizaje integral en optimización para móviles. Ademàs de diseñar y desarrollar el videojuego, también me encargué de crear los <highlight type="tag">assets visuales</highlight>.`,
      role: "Creador, Diseñador y Desarrollador del Videojuego Completo",
    },
  },
};
