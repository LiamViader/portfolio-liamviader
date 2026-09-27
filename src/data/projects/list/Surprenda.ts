import { ProjectDefinition } from "../types";

export const Surprenda: ProjectDefinition = {
  slug: "surprenda",
  date: "2026-04",
  tags: [
    "Next.js",
    "React",
    "Three.js",
    "React Three Fiber",
    "TypeScript",
    "Supabase",
    "Stripe",
    "Brevo",
    "Playwright",
    "Vercel",
  ],
  media_preview: "/images/projects/surprenda/preview.png",
  links: [
    {
      url: "https://surprenda.com",
      label: "Live",
      type: "live",
      icon: "Play",
      primaryColor: "rgba(139, 26, 46, 0.7)",
      secondaryColor: "rgba(160, 40, 60, 1)",
    },
  ],
  detailed_media: [
    {
      type: "image",
      src: "/images/projects/surprenda/i-love-you.webp",
      thumbnail: "/images/projects/surprenda/i-love-you.webp",
      figureNumber: "1.1",
      translations: {
        en: {
          alt: "A fully bloomed rose with its messages revealed",
          captionLabel: "Figure",
          description: "A completed rose: the final message on top and the messages revealed along the stem.",
        },
        es: {
          alt: "Una rosa florecida con sus mensajes revelados",
          captionLabel: "Figura",
          description: "Una rosa completada: el mensaje final arriba y los mensajes revelados a lo largo del tallo.",
        },
      },
    },
    {
      type: "externalVideo",
      src: "https://youtube.com/shorts/FoF2b-fiT9M",
      embedUrl: "https://www.youtube.com/embed/FoF2b-fiT9M",
      thumbnail: "https://img.youtube.com/vi/FoF2b-fiT9M/maxresdefault.jpg",
      figureNumber: "1.2",
      translations: {
        en: {
          alt: "Original launch video",
          captionLabel: "Figure",
          description: "Original launch video, from when the project was still called Regala una Rosa.",
        },
        es: {
          alt: "Vídeo del lanzamiento original",
          captionLabel: "Figura",
          description: "Vídeo del lanzamiento original, cuando el proyecto aún se llamaba Regala una Rosa.",
        },
      },
    },
  ],
  categories: ["Game", "Art"],
  is_featured: true,
  translations: {
    en: {
      title: "Surprenda",
      short_description:
        "A digital gift brand whose first product is a personalized 3D rose: you hide your messages in it, and it blooms petal by petal as the recipient solves it.",
      full_description: `Surprenda is a <highlight type="important">digital gift brand</highlight> whose first product is a personalized, interactive 3D rose sent as a link — no app, no account. It is my <highlight type="tag">first project with real users and real sales</highlight>, which meant going through the full cycle of building, launching, collecting feedback and iterating on a live product.

It started in April 2026 as <highlight type="accent">Regala una Rosa</highlight>, a Catalan-focused launch. After that first release I <highlight type="important">rebranded it to Surprenda</highlight> (surprenda.com): a name that works in any language and can grow beyond the rose, positioned as an original, personal gift for any moment — including when the other person is far away.

The core of the experience is the <highlight type="important">3D rose</highlight>, built with <highlight type="soft">Three.js</highlight> and <highlight type="soft">React Three Fiber</highlight>. It is made of several petal layers, each with its own number of petals, shapes and colors. The sender writes the messages, picks a palette and a typeface, and on the Premium plan designs their own palette and chooses the background music. The recipient opens the link, goes through a short gesture tutorial and then solves an <highlight type="important">interactive puzzle</highlight>: the rose starts closed and blooms as the petals are sorted by their gradient, revealing a message on the stem with each solved layer and a final message at the end. The puzzle can only be played once; after that the finished rose lives at the link forever.

Payments go through <highlight type="soft">Stripe</highlight> with prices read from Stripe itself: a single USD price per plan with <highlight type="accent">multi-currency options</highlight>, so Checkout charges each buyer in their own currency and offers their local payment methods. Every gift gets a single-use link for the recipient and a <highlight type="accent">reusable preview link</highlight> for the sender, and whoever finishes a rose is offered their own at a <highlight type="accent">referral discount</highlight>, enforced in the database so it can only be redeemed once.

The stack is <highlight type="soft">Next.js 15</highlight> and <highlight type="soft">TypeScript</highlight> on <highlight type="soft">Vercel</highlight>, with <highlight type="soft">Supabase</highlight> (versioned migrations and row-level security) as the database, transactional email over <highlight type="soft">Brevo</highlight> from the brand's own domain, scheduled jobs that clean up unpaid gifts and settle each sale's euro figure for accounting, and privacy-friendly analytics with no cookie banner. The site is available in <highlight type="accent">nine languages</highlight> (English, Spanish, Catalan, Portuguese, French, German, Italian, Polish and Romanian), each with its own free demo and link-preview cards. The marketing images are produced by a <highlight type="soft">Playwright</highlight> pipeline that renders real roses from a spec — or from a text prompt through an LLM — which generated the gallery of example roses for eighteen occasions in every language.`,
      role: "Creator, Designer, and Developer of the Full Project",
    },
    es: {
      title: "Surprenda",
      short_description:
        "Una marca de regalos digitales cuyo primer producto es una rosa 3D personalizada: escondes tus mensajes en ella y florece pétalo a pétalo mientras quien la recibe la resuelve.",
      full_description: `Surprenda es una <highlight type="important">marca de regalos digitales</highlight> cuyo primer producto es una rosa 3D interactiva y personalizada que se envía como un enlace, sin apps ni cuentas. Es mi <highlight type="tag">primer proyecto con usuarios reales y ventas reales</highlight>, lo que implicó pasar por el ciclo completo de construir, lanzar, recoger feedback e iterar sobre un producto en producción.

Nació en abril de 2026 como <highlight type="accent">Regala una Rosa</highlight>, con un lanzamiento centrado en Cataluña. Tras esa primera versión lo <highlight type="important">rebauticé como Surprenda</highlight> (surprenda.com): un nombre que funciona en cualquier idioma y que puede crecer más allá de la rosa, posicionado como un regalo original y personal para cualquier momento, también cuando la otra persona está lejos.

El núcleo de la experiencia es la <highlight type="important">rosa 3D</highlight>, construida con <highlight type="soft">Three.js</highlight> y <highlight type="soft">React Three Fiber</highlight>. Está formada por varias capas de pétalos, cada una con su propio número de pétalos, formas y colores. El remitente escribe los mensajes, elige una paleta y una tipografía y, con el plan Premium, diseña su propia paleta y elige la música de fondo. El destinatario abre el enlace, pasa por un breve tutorial de gestos y resuelve un <highlight type="important">puzzle interactivo</highlight>: la rosa empieza cerrada y florece a medida que ordena los pétalos según su degradado, desvelando un mensaje en el tallo con cada capa resuelta y un mensaje final al terminar. El puzzle solo se juega una vez; después, la rosa completa vive para siempre en el enlace.

Los pagos pasan por <highlight type="soft">Stripe</highlight> y los precios se leen del propio Stripe: un único precio en dólares por plan con <highlight type="accent">opciones multimoneda</highlight>, de modo que el Checkout cobra a cada comprador en su moneda y le ofrece sus métodos de pago locales. Cada regalo tiene un enlace de un solo uso para el destinatario y un <highlight type="accent">enlace de previsualización reutilizable</highlight> para el remitente, y quien termina una rosa recibe la oferta de regalar la suya con un <highlight type="accent">descuento por referido</highlight>, garantizado en la base de datos para que solo se pueda canjear una vez.

El stack es <highlight type="soft">Next.js 15</highlight> y <highlight type="soft">TypeScript</highlight> en <highlight type="soft">Vercel</highlight>, con <highlight type="soft">Supabase</highlight> (migraciones versionadas y seguridad a nivel de fila) como base de datos, correo transaccional por <highlight type="soft">Brevo</highlight> desde el dominio de la marca, tareas programadas que limpian los regalos no pagados y fijan el importe en euros de cada venta para la contabilidad, y analítica respetuosa con la privacidad, sin banner de cookies. La web está disponible en <highlight type="accent">nueve idiomas</highlight> (inglés, español, catalán, portugués, francés, alemán, italiano, polaco y rumano), cada uno con su propia demo gratuita y sus tarjetas de previsualización de enlaces. Las imágenes de marketing salen de un pipeline con <highlight type="soft">Playwright</highlight> que renderiza rosas reales a partir de una especificación —o de una descripción en texto mediante un LLM—, con el que se generó la galería de rosas de ejemplo para dieciocho ocasiones en todos los idiomas.`,
      role: "Creador, Diseñador y Desarrollador del Proyecto Completo",
    },
  },
};
