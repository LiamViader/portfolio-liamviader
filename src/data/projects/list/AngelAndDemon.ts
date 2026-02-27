import { ProjectDefinition } from "../types";

export const AngelAndDemon: ProjectDefinition = {
  slug: "angel-and-demon",
  date: "2024-12",
  tags: [
    "Multiplayer",
    "Unity",
    "C#"
  ],
  media_preview: "/images/projects/angel_and_demon/preview.jpg",
  links: [
    {
      url: "https://github.com/LiamViader/angel-demon-multiplayer",
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
      src: "https://www.youtu.be.com/020T4SUarGk",
      embedUrl: "https://www.youtube.com/embed/020T4SUarGk",
      thumbnail: "https://img.youtube.com/vi/020T4SUarGk/maxresdefault.jpg",
      figureNumber: "1.1",
      translations: {
        en: {
          alt: "Gameplay of Angel and Demon",
          captionLabel: "Figure",
          description: "Gameplay of Angel and Demon",
        },
        es: {
          alt: "Gameplay de Angel and Demon",
          captionLabel: "Figura",
          description: "Gameplay de Angel and Demon",
        },
      },
    },
  ],
  categories: ["Game"],
  is_featured: false,
  translations: {
    en: {
      title: "Angel and Demon Multiplayer",
      short_description:
        "2D online cooperative dungeon crawler where an Angel and a Demon combine unique abilities to overcome puzzles and enemies.",
      full_description: `Angel and Demon is a <highlight type="accent">cooperative 2D dungeon crawler</highlight> developed in Unity with a strong focus on character synergy. The game features two distinct protagonists:

      - <highlight type="glow">The Angel</highlight>: Specializes in <highlight type="important">ranged attacks</highlight> that deal light damage to enemies while <highlight type="important">healing the ally</highlight>. Additionally, it can hover over spikes without taking damage.
      - <highlight type="glow">The Demon</highlight>: Focuses on <highlight type="important">melee combat</highlight> with high area damage. Its signature ability is a <highlight type="underline">dash</highlight> used for mobility and <highlight type="important">destroying specific walls</highlight> to clear paths.

      The project implements <highlight type="tag">low-level networking</highlight> using the <highlight type="code">Unity.Networking.Transport</highlight> API. It utilizes an <highlight type="accent">authoritative server architecture</highlight> combined with <highlight type="code">client-side prediction</highlight> and <highlight type="code">interpolation</highlight> to ensure smooth synchronized gameplay. The dungeon challenges include varied AI enemies with pathfinding and puzzles that require coordinated use of both characters' skills. 
      
      Developed by a team of three. I was responsible for nearly the entire development: I implemented the client-server communication, the game loop, and the core mechanics. Additionally, I designed the mechanics and a large portion of the game, with my contribution covering almost everything except level design.`,
      role: "Lead Developer & Game Designer",
    },
    es: {
      title: "Angel and Demon Multijugador",
      short_description:
        "Dungeon crawler 2D cooperativo online donde un Ángel y un Demonio combinan habilidades únicas para superar puzles y enemigos.",
      full_description: `Angel and Demon es un <highlight type="accent">dungeon crawler cooperativo en 2D</highlight> desarrollado en Unity fundamentado en la sinergia entre personajes. El juego presenta dos protagonistas con mecánicas diferenciadas:

      - <highlight type="glow">El Ángel</highlight>: Se especializa en <highlight type="important">ataques a distancia</highlight> que infligen daño leve a los enemigos a la vez que <highlight type="important">curan al aliado</highlight>. Además, posee la habilidad de sobrevolar pinchos sin que le hagan daño.
      - <highlight type="glow">El Demonio</highlight>: Se centra en el <highlight type="important">combate cuerpo a cuerpo</highlight> con gran daño de área. Su habilidad principal es un <highlight type="underline">dash</highlight> direccional que permite la movilidad y <highlight type="important">destruir paredes específicas</highlight> para abrir nuevos caminos.

      A nivel técnico, el proyecto implementa <highlight type="tag">comunicación de red de bajo nivel</highlight> mediante el uso de la API <highlight type="code">Unity.Networking.Transport</highlight>. Utiliza una arquitectura de <highlight type="accent">servidor autoritativo</highlight> con <highlight type="code">predicción en el cliente</highlight> e <highlight type="code">interpolación</highlight> tecnológica para garantizar una experiencia multijugador fluida. El juego incluye enemigos con pathfinding y puzles que exigen el uso coordinado de las habilidades de ambos jugadores. 
      
      Desarrollado por un equipo de tres personas. Fui responsable de casi todo el desarrollo: implementé la comunicación cliente-servidor, el game loop y las mecánicas principales. Además, diseñé las mecánicas y gran parte del juego; mi contribución abarcó casi todo excepto el diseño de niveles.`,
      role: "Desarrollador Principal y Diseñador",
    },
  },
};
