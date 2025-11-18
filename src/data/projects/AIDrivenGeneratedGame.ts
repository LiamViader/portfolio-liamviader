import { ProjectDefinition } from "./types";

export const AIDrivenGeneratedGame: ProjectDefinition = {
  slug: "ai-driven-generated-game",
  tags: [
    "Python",
    "C#",
    "Unity",
    "LangChain",
    "LangGraph",
    "FastAPI",
    "TensorFlow",
    "ComfyUI",
    "Stable Diffusion",
    "OpenAI API",
  ],
  media_preview: "/images/projects/ai_driven_generated_game/preview.png",
  github_url: "https://github.com/LiamViader/tfg-ai-driven-generated-game",
  detailed_media: [
    {
      type: "externalVideo",
      src: "https://www.youtu.be.com/dk2FS6lLUzs",
      embedUrl: "https://www.youtube.com/embed/dk2FS6lLUzs",
      thumbnail: "https://img.youtube.com/vi/dk2FS6lLUzs/maxresdefault.jpg",
      figureNumber: "1.1",
      translations: {
        en: {
          alt: "YouTube preview for project 1",
          captionLabel: "Figure",
          description: "Summary video of two different runs of the system",
        },
        es: {
          alt: "Vista previa de YouTube del proyecto 1",
          captionLabel: "Figura",
          description: "Video resumen de dos ejecuciones distintas del sistema",
        },
      },
    },
    {
      type: "externalVideo",
      src: "https://www.youtu.be.com/7fzslPdg4xY",
      embedUrl: "https://www.youtube.com/embed/7fzslPdg4xY",
      thumbnail: "https://img.youtube.com/vi/7fzslPdg4xY/maxresdefault.jpg",
      figureNumber: "1.2",
      translations: {
        en: {
          alt: "Uncut video showing one run of the game",
          captionLabel: "Figure",
          description: "Uncut video showing one run of the game",
        },
        es: {
          alt: "Video sin cortes de una ejecución del videojuego",
          captionLabel: "Figura",
          description: "Video sin cortes de una ejecución del videojuego",
        },
      },
    },
    {
      type: "image",
      src: "/images/projects/ai_driven_generated_game/penguin_green_cave.jpg",
      figureNumber: "1.1",
      translations: {
        en: {
          alt: "Example overview of the main in-game interface",
          captionLabel: "Figure",
          description: "Example overview of the main in-game interface",
        },
        es: {
          alt: "Ejemplo de vista general de la interfaz in-game",
          captionLabel: "Figura",
          description: "Ejemplo de vista general de la interfaz in-game",
        },
      },
    },
    {
      type: "image",
      src: "/images/projects/ai_driven_generated_game/interaction_monkeys.jpg",
      figureNumber: "1.2",
      translations: {
        en: {
          alt: "Example of an interaction between the player and NPCs",
          captionLabel: "Figure",
          description: "Example of an interaction between the player and NPCs",
        },
        es: {
          alt: "Ejemplo de una interacción entre el jugador y los NPCs",
          captionLabel: "Figura",
          description: "Ejemplo de una interacción entre el jugador y NPCs",
        },
      },
    },
  ],
  categories: ["AI", "Game"],
  is_featured: true,
  translations: {
    en: {
      title: "Sistema de IA Multiagente para Generación y Dirección de Videojuegos",
      short_description:
        "Short description. ASDW Sasdsadd wasdda efsdfsd vvcasdas efdfsdf",
      full_description:
        "Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Large description here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      role: "Full-Stack Developer & ML Engineer",
    },
    es: {
      title: "Videojuego generado y dirigido por IA",
      short_description:
        "Sistema multiagente de IA que genera y dirige los componentes visuales, narrativos y estructurales de un videojuego a partir de una prompt inicial.",
      full_description: `Este proyecto presenta el desarrollo de un sistema de inteligencia artificial multiagente capaz de generar y dirigir un videojuego completo a partir de una única prompt inicial del jugador. La propuesta no se limita a generar texto, sino que establece una arquitectura modular donde distintos agentes basados en modelos de lenguaje colaboran para definir la narrativa, la estructura y el apartado visual del juego. La intención es que el sistema funcione como un director capaz de coordinar decisiones y adaptar la experiencia en función del contexto y de las acciones del jugador.

        A diferencia de un videojuego tradicional, donde el contenido está prefijado, aquí el mundo se construye dinámicamente a partir de la instrucción inicial del jugador. El sistema genera una ambientación, crea escenarios y personajes coherentes con el tono definido, establece una narrativa base y crea los eventos e interacciones disponibles. Aunque estas capacidades se limitan en este prototipo inicial a la primera generación del mundo, la arquitectura está diseñada para que, en versiones futuras, los agentes puedan modificar el estado del juego durante la partida: introducir nuevos eventos, ajustar relaciones entre personajes, expandir la trama o modificar los escenarios.

        Para habilitar estas dinámicas, se diseñó una arquitectura multiagente donde cada agente asume un rol especializado (generación narrativa, gestión de escenarios, gestión de personajes, gestión de eventos, agente director/coordinador, etc.). Estos agentes se coordinan mediante flujos definidos con herramientas como LangChain y LangGraph, y se apoyan en técnicas como el contexto aumentado (RAG) para mantener coherencia entre sus decisiones.

        El proyecto también incorpora un componente visual generado por IA. A través de modelos de imagen integrados en un flujo de trabajo personalizado en ComfyUI, el sistema transforma descripciones textuales (generadas por los LLMs) en representaciones visuales de escenarios y personajes. Este flujo incluye tambien una fase de posprocesado en la que se aplican transformaciones adicionales y se utiliza un pequeño clasificador de imágenes basado en una TinyCNN entrenada con TensorFlow. Todo este pipeline está diseñado para que, al servir las imágenes al cliente, sea posible componer los recursos visuales de forma consistente, de modo que encajen entre sí y con la estética general definida.

        El MVP se centra en una mecánica de interacción narrativa con personajes dentro de un mundo navegable compuesto por escenarios estáticos. Los diálogos están controlados por agentes de IA que deciden qué personaje interviene y qué debe decir. Para mantener estas conversaciones en streaming y saber el tipo de mensaje del personaje ([dialogue], [action], [player_thought]...), se emplea un pequeño sistema personalizado basado en tags, que permite identificar cada mensaje y mostrarlo progresivamente mientras se genera.

        A nivel técnico, el proyecto incluye el diseño completo de la arquitectura del sistema, la implementación del núcleo funcional en Python, la orquestación de agentes y flujos de generación, la integración con servicios de generación de imágenes, la gestión del estado y trazabilidad mínima mediante logs, así como el desarrollo de una API y un cliente en Unity para interactuar con el prototipo. Aunque esta primera versión es experimental y no incluye aún dirección dinámica, memoria persistente ni alteración del mundo por los agentes en tiempo real, sienta las bases para futuras extensiones en esa dirección.

        En conjunto, este proyecto explora cómo la IA generativa puede asumir parte del rol tradicional del diseñador y director de videojuegos, pasando de un modelo basado en contenido cerrado a uno en el que la experiencia surge dinámicamente de la colaboración entre jugador y sistema. Representa un primer paso hacia entornos interactivos donde la IA no solo genera contenido, sino que también está diseñada para influir, estructurar y expandir la experiencia jugable.`,
      role: "Creador, Diseñador y Desarrollador del Proyecto Completo",
    },
  },
};
