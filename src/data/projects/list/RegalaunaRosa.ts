import { ProjectDefinition } from "../types";

export const RegalaunaRosa: ProjectDefinition = {
  slug: "regala-una-rosa",
  date: "2026-04",
  tags: [
    "Next.js",
    "React",
    "Three.js",
    "React Three Fiber",
    "TypeScript",
    "Supabase",
    "Stripe",
    "Resend",
    "Vercel",
  ],
  media_preview: "/images/projects/regala_una_rosa/preview.png",
  links: [
    {
      url: "https://www.regalaunarosa.es",
      label: "Live",
      type: "live",
      icon: "Play",
      primaryColor: "rgba(139, 26, 46, 0.7)",
      secondaryColor: "rgba(160, 40, 60, 1)",
    },
  ],
  detailed_media: [
    {
      type: "externalVideo",
      src: "https://youtube.com/shorts/FoF2b-fiT9M",
      embedUrl: "https://www.youtube.com/embed/FoF2b-fiT9M",
      thumbnail: "https://img.youtube.com/vi/FoF2b-fiT9M/maxresdefault.jpg",
      figureNumber: "1.1",
      translations: {
        en: {
          alt: "Promotional video for Sant Jordi",
          captionLabel: "Figure",
          description: "Promotional video released for Sant Jordi.",
        },
        es: {
          alt: "Vídeo promocional para Sant Jordi",
          captionLabel: "Figura",
          description: "Vídeo promocional publicado para Sant Jordi.",
        },
      },
    },
  ],
  categories: ["Game", "Art"],
  is_featured: true,
  translations: {
    en: {
      title: "Gift a Rose",
      short_description:
        "A digital gift platform where you create a personalized 3D rose, hide messages in it, and send it as a unique emotional experience for a special person.",
      full_description: `Gift a Rose is a <highlight type="important">digital gift platform</highlight> where users create a personalized 3D rose and send it as an interactive experience. It was launched for <highlight type="accent">Sant Jordi</highlight> — the Catalan celebration of books and roses — but designed for any occasion. It was my <highlight type="tag">first project with real users and real sales</highlight>, which meant going through a complete cycle of building, launching, collecting feedback, and iterating on a live product.

The core of the experience is an <highlight type="important">interactive 3D rose</highlight> built with <highlight type="soft">Three.js</highlight> and <highlight type="soft">React Three Fiber</highlight>. The rose is composed of multiple petal layers, each with a different number of petals, shapes, and colors. The sender personalizes the rose by choosing from various predefined color palettes and placing messages that will be revealed during the recipient's experience. Premium users can also select a background music track and use fully custom colors for the palette.

Once payment is completed, a <highlight type="accent">unique gift link</highlight> is generated and stored along with the full rose configuration. The payment flow is handled via <highlight type="soft">Stripe</highlight>. Each gift is single-use, but the sender gets a reusable preview link to see the result before sending it.

On the recipient's side, opening the link reveals an <highlight type="important">interactive puzzle</highlight>: the rose starts closed and blooms as the user correctly sorts the petals by their gradient. Each solved layer reveals a hidden message. Once the rose fully blooms, a final message is revealed — the rose and its messages live forever at the link, but the puzzle cannot be replayed.

The full stack runs on <highlight type="soft">Next.js 15</highlight> with <highlight type="soft">TypeScript</highlight>, deployed on <highlight type="soft">Vercel</highlight>, with <highlight type="soft">Supabase</highlight> as the database layer. The app supports multiple languages (currently Catalan, Spanish, and English) and a <highlight type="accent">two-tier pricing model</highlight> (Basic / Premium) with promo code support.`,
      role: "Creator, Designer, and Developer of the Full Project",
    },
    es: {
      title: "Regala una Rosa",
      short_description:
        "Una plataforma de regalo digital donde creas una rosa 3D personalizada, escondes mensajes en ella y la envías como una experiencia emocional única para una persona especial.",
      full_description: `Regala una Rosa es una <highlight type="important">plataforma de regalo digital</highlight> donde los usuarios crean una rosa 3D personalizada y la envían como una experiencia interactiva. Nació para <highlight type="accent">Sant Jordi</highlight> — la celebración catalana de libros y rosas — pero está pensada para cualquier ocasión. Fue mi <highlight type="tag">primer proyecto con usuarios reales y ventas reales</highlight>, lo que implicó pasar por un ciclo completo de construcción, lanzamiento, recogida de feedback e iteración sobre un producto en producción.

El núcleo de la experiencia es una <highlight type="important">rosa 3D interactiva</highlight> construida con <highlight type="soft">Three.js</highlight> y <highlight type="soft">React Three Fiber</highlight>. La rosa está compuesta por múltiples capas de pétalos, cada una con diferente número de pétalos, formas y colores. El remitente personaliza la rosa eligiendo entre diversas paletas de colores predefinidas, colocando mensajes que serán revelados durante la experiencia del destinatario. Los usuarios premium también pueden elegir una pista musical de fondo y usar colores completamente personalizados para la paleta de colores.

Una vez realizado el pago, se genera un <highlight type="accent">enlace de regalo único</highlight> y se almacena junto con toda la configuración de la rosa. El flujo de pago se gestiona mediante <highlight type="soft">Stripe</highlight>. Cada regalo es de un solo uso, pero el remitente puede usar un enlace de previsualización reutilizable para ver el resultado antes de enviarlo.

En el lado del destinatario, abrir el enlace revela un <highlight type="important">puzzle interactivo</highlight>: la rosa comienza cerrada y florece a medida que el usuario ordena correctamente los pétalos según su degradado. Cada capa resuelta desvela un mensaje oculto. Una vez la rosa florece por completo, se revela un mensaje final y esa rosa y mensajes viven para siempre en el enlace, pero el puzzle no se puede volver a jugar.

El stack completo corre sobre <highlight type="soft">Next.js 15</highlight> con <highlight type="soft">TypeScript</highlight>, desplegado en <highlight type="soft">Vercel</highlight>, con <highlight type="soft">Supabase</highlight> como capa de base de datos. La app soporta diferentes idiomas (actualmente catalán, español, inglés) y un <highlight type="accent">modelo de precios de dos niveles</highlight> (Básico / Premium) con soporte de códigos promocionales.`,
      role: "Creador, Diseñador y Desarrollador del Proyecto Completo",
    },
  },
};
