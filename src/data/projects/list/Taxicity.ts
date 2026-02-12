import { ProjectDefinition } from "../types";

export const Taxicity: ProjectDefinition = {
  slug: "taxicity",
  date: "2022-05",
  tags: [
    "Godot",
    "GDscript"
  ],
  media_preview: "/images/projects/taxicity/preview.jpg",
  links: [
    {
      url: "https://github.com/LiamViader/taxicity/archive/refs/tags/v1.0.0.zip",
      label: "Download Game (Windows)",
      type: "live",
      icon: "Download",
      primaryColor: "rgba(16, 185, 129, 0.7)",
      secondaryColor: "rgba(5, 150, 105, 1)",
    },
    {
      url: "https://github.com/LiamViader/taxicity",
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
      src: "https://www.youtu.be.com/Zpp_uOPSszs",
      embedUrl: "https://www.youtube.com/embed/Zpp_uOPSszs",
      thumbnail: "https://img.youtube.com/vi/Zpp_uOPSszs/maxresdefault.jpg",
      figureNumber: "1.1",
      translations: {
        en: {
          alt: "YouTube preview for project 1",
          captionLabel: "Figure",
          description: "Full Gameplay of Taxicity",
        },
        es: {
          alt: "Vista previa de YouTube del proyecto 1",
          captionLabel: "Figura",
          description: "Gameplay completo de Taxicity",
        },
      },
    },
  ],
  categories: ["Game"],
  is_featured: false,
  translations: {
    en: {
      title: "Taxicity - Videogame",
      short_description:
        "A 2D arcade videogame made in godot where you drive a taxi around the city, picking up customers and dropping them off at their destinations.",
      full_description: `Taxicity was my <highlight type="important">first step into game development</highlight>. It is a 2D arcade game where you drive a taxi through an isometric city of straight streets. The control logic is inspired by <highlight type="accent">Pac-Man</highlight>, as the car is bound to the road and only turns at intersections, but with a twist: the player has full control over <highlight type="glow">acceleration and braking</highlight>, requiring precision to avoid overshooting turns and losing momentum.

        The core loop involves picking up and dropping off passengers within strict time limits. You start with only one seat, but as you earn money, you can reinvest it to unlock <highlight type="important">4 concurrent seats</highlight>. This shifts the game from a simple driving task to a <highlight type="accent">logistics challenge</highlight>, where finding the optimal route to pick up and deliver multiple passengers at once is the key to high scores. To keep the experience engaging, the <highlight type="glow">difficulty scales progressively</highlight>, increasing the pressure as you complete more jobs.

        The game has one mechanic to disrupt your routine: the <highlight type="important">Hospital Emergency</highlight>. Sometimes, a passenger will demand an urgent trip to the hospital, locking all other seats and forcing you to ignore your planned route until they are delivered. Between shifts, you can visit a <highlight type="soft">shop</highlight> to spend your earnings on vehicle upgrades like better top speed and acceleration, essential for keeping up with the rising difficulty.

        Developed in <highlight type="soft">Godot</highlight> with <highlight type="soft">GDScript</highlight>, this project allowed me to learn about game design, game loops and state management. While the environment assets are open-source, the <highlight type="tag">User Interface (UI)</highlight> and all the underlying logic were designed and implemented entirely by me.`,
      role: "Creator, Designer, and Developer of the Full Project",
    },
    es: {
      title: "Taxicity - Videojuego",
      short_description:
        "Un videojuego arcade 2D dónde conduces un taxi por la ciudad, recogiendo clientes y llevándolos a su destino.",
      full_description: `Taxicity fue mi <highlight type="important">primer paso en el desarrollo de videojuegos</highlight>. Es un título arcade 2D donde conduces un taxi a través de una ciudad isométrica de calles rectas. La lógica de control está inspirada en <highlight type="accent">Pac-Man</highlight>, ya que el coche está anclado a la carretera y solo gira en las intersecciones, pero con un matiz: el jugador tiene control total sobre la <highlight type="glow">aceleración y el frenado</highlight>, lo que requiere precisión para no pasarse de largo en los giros y mantener la inercia.

        El bucle principal consiste en recoger y dejar pasajeros dentro de límites de tiempo estrictos. Empiezas con un solo asiento, pero a medida que ganas dinero, puedes reinvertirlo para desbloquear hasta <highlight type="important">4 plazas simultáneas</highlight>. Esto transforma el juego de una simple tarea de conducción a un <highlight type="accent">desafío logístico</highlight>, donde encontrar la ruta óptima para recoger y entregar a varios pasajeros a la vez es la clave para obtener puntuaciones altas. Para mantener la experiencia interesante, la <highlight type="glow">dificultad escala progresivamente</highlight>, aumentando la presión a medida que completas más encargos.

        El juego cuenta con una mecánica diseñada para romper la rutina: la <highlight type="important">Urgencia Hospitalaria</highlight>. Ocasionalmente, un pasajero exigirá un viaje urgente al hospital, bloqueando el resto de asientos y obligándote a ignorar tu ruta planificada hasta completar el encargo. Entre turnos, puedes visitar una <highlight type="soft">tienda</highlight> para gastar tus ganancias en mejoras del vehículo, como velocidad punta y aceleración, esenciales para compensar el aumento de la dificultad.

        Desarrollado en <highlight type="soft">Godot</highlight> con <highlight type="soft">GDScript</highlight>, este proyecto me permitió aprender sobre diseño de videojuegos, <highlight type="soft">game loop</highlight> y gestión de estados. Mientras que los assets del entorno son de gratuitos de internet, la <highlight type="tag">Interfaz de Usuario (UI)</highlight> y toda la lógica subyacente fueron diseñadas e implementadas íntegramente por mí.`,
      role: "Creador, Diseñador y Desarrollador del Proyecto Completo",
    },
  },
};
