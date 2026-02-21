import { ProjectDefinition } from "../types";

export const Molotov: ProjectDefinition = {
  slug: "molotov",
  date: "2022-05",
  tags: [
    "Phaser 3",
    "JavaScript",
    "HTML5",
    "CSS"
  ],
  media_preview: "/images/projects/molotov/preview.jpg",
  links: [
    {
      url: "https://molotov.liamviader.com",
      label: "Live Demo",
      type: "live",
      icon: "Play",
      primaryColor: "rgba(86, 139, 209, 0.7)",
      secondaryColor: "rgba(101, 154, 214, 1)",
    },
    {
      url: "https://github.com/LiamViader/molotov",
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
      src: "https://www.youtu.be.com/scyVOLySG-c",
      embedUrl: "https://www.youtube.com/embed/scyVOLySG-c",
      thumbnail: "https://img.youtube.com/vi/scyVOLySG-c/maxresdefault.jpg",
      figureNumber: "1.1",
      translations: {
        en: {
          alt: "Gameplay of Molotov",
          captionLabel: "Figure",
          description: "Full Gameplay of Molotov",
        },
        es: {
          alt: "Gameplay de Molotov",
          captionLabel: "Figura",
          description: "Gameplay completo de Molotov",
        },
      },
    },
  ],
  categories: ["Game"],
  is_featured: false,
  translations: {
    en: {
      title: "Molotov",
      short_description:
        "2D top-down survival shooter built with Phaser 3. Defend against enemy waves while scavenging for gasoline to fuel your escape vehicle.",
      full_description: `Molotov is a <highlight type="accent">2D top-down survival shooter</highlight> developed with <highlight type="soft">Phaser 3</highlight> and <highlight type="tag">JavaScript</highlight>. The player is placed in a hostile urban environment with the objective of escaping in an orange getaway vehicle. To achieve this, it is necessary to <highlight type="glow">scavenge for gasoline</highlight> by siphoning it from abandoned cars scattered throughout the map.

      The gameplay focuses on combat. The player must manage <highlight type="important">health, ammunition, and fuel capacity</highlight> while defending against <highlight type="soft">four types of enemies</highlight> (Melee, Pistol, Shotgun, and Rifle). To assist in combat, different weapons like <highlight type="code">Pistols</highlight>, <highlight type="code">Shotguns</highlight>, and <highlight type="code">Assault Rifles</highlight> can be looted. 

      As time progresses, the difficulty increases, requiring more precision in movements like the <highlight type="underline">dash</highlight> and effective use of the environment to survive. The game also includes a persistent <highlight type="dim">Save/Load system</highlight> using local storage to preserve progress across sessions.

      This project was developed in parallel with <highlight type="accent">Taxicity</highlight>, serving as a platform to dive into <highlight type="soft">web-based game development</highlight>. Through its implementation, I gained a deeper understanding of <highlight type="tag">game loops</highlight>, <highlight type="glow">state management</highlight>, and how to optimize performance within the browser using a dedicated gaming engine. The assets are open source from the internet.`,
      role: "Creator, Designer, and Developer of the Full Videogame",
    },
    es: {
      title: "Molotov",
      short_description:
        "Survival de disparos en vista cenital desarrollado con Phaser 3. Defiéndete de oleadas enemigas mientras buscas gasolina para alimentar tu vehículo de escape.",
      full_description: `Molotov es un <highlight type="accent">shooter de supervivencia 2D</highlight> con vista cenital desarrollado con <highlight type="soft">Phaser 3</highlight> y <highlight type="tag">JavaScript</highlight>. El jugador se encuentra en un entorno urbano hostil con el objetivo de escapar en un vehículo naranja. Para lograrlo, es necesario <highlight type="glow">buscar y recolectar gasolina</highlight> extrayéndola de los coches abandonados que se encuentran por el mapa.

      La jugabilidad se centra en el combate. El jugador debe administrar su <highlight type="important">salud, munición y capacidad de combustible</highlight> mientras se defiende de <highlight type="soft">cuatro tipos de enemigos</highlight> (Cuerpo a cuerpo, Pistola, Escopeta y Rifle). Durante la partida, se pueden encontrar diversas armas como <highlight type="code">Pistolas</highlight>, <highlight type="code">Escopetas</highlight> y <highlight type="code">Rifles de Asalto</highlight>. 

      A medida que avanza el tiempo, la dificultad aumenta progresivamente, exigiendo mayor precisión en los controles de <highlight type="underline">esquiva</highlight> y el uso del entorno para sobrevivir. El proyecto incluye un <highlight type="dim">sistema de guardado y carga</highlight> mediante almacenamiento local para mantener el progreso del jugador entre sesiones.

      Este juego fue desarrollado en paralelo a <highlight type="accent">Taxicity</highlight>, sirviendo como plataforma para profundizar en el <highlight type="soft">desarrollo de videojuegos web</highlight>. A través de su implementación, pude aprender conceptos fundamentales como los <highlight type="tag">game loops</highlight>, la <highlight type="glow">gestión de estados</highlight> y la optimización de rendimiento en el navegador utilizando un motor especializado. Los assets son open source de internet.`,
      role: "Creador, Diseñador y Desarrollador del Videojuego Completo",
    },
  },
};
