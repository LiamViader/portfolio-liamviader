import { ProjectDefinition } from "../types";

export const QuizGenerator: ProjectDefinition = {
  slug: "quiz-generator",
  date: "2024-05",
  tags: [
    "React",
    "NestJS",
    "OpenAI API",
    "MongoDB",
    "Google Oauth",
    "Google Cloud Platform",
    "TypeScript",
  ],
  media_preview: "/images/projects/quiz_generator/preview.jpg",
  links: [
    {
      url: "https://quiz-generator.liamviader.com",
      label: "Live Demo",
      type: "live",
      icon: "Play",
      primaryColor: "rgba(86, 139, 209, 0.7)",
      secondaryColor: "rgba(101, 154, 214, 1)",
    },
    {
      url: "https://github.com/LiamViader/Quiz-Generator",
      label: "GitHub",
      type: "github",
      icon: "Github",
      primaryColor: "rgba(150, 37, 255, 0.7)",
      secondaryColor: "rgba(168, 85, 247, 1)",
    },
  ],
  detailed_media: [
    {
      type: "image",
      src: "/images/projects/quiz_generator/main_page_full.jpg",
      thumbnail: "/images/projects/quiz_generator/main_page_full.jpg",
      figureNumber: "1.1",
      translations: {
        en: {
          alt: "Main page view",
          captionLabel: "Figure",
          description: "Main page of the app after generating a few quizzes",
        },
        es: {
          alt: "Vista de la página principal",
          captionLabel: "Figura",
          description: "Página principal de la aplicación después de generar algunos cuestionarios",
        },
      },
    },
    {
      type: "image",
      src: "/images/projects/quiz_generator/unsolved_quiz.jpg",
      thumbnail: "/images/projects/quiz_generator/unsolved_quiz.jpg",
      figureNumber: "1.2",
      translations: {
        en: {
          alt: "View of an unsolved quiz",
          captionLabel: "Figure",
          description: "Unsolved quiz about LLM's",
        },
        es: {
          alt: "Vista de un cuestionario sin resolver",
          captionLabel: "Figura",
          description: "Cuestionario sin resolver sobre LLM's",
        },
      },
    },
    {
      type: "image",
      src: "/images/projects/quiz_generator/solved_quiz.jpg",
      thumbnail: "/images/projects/quiz_generator/solved_quiz.jpg",
      figureNumber: "1.3",
      translations: {
        en: {
          alt: "View of a graded quiz",
          captionLabel: "Figure",
          description: "Graded quiz about LLM's",
        },
        es: {
          alt: "Vista de un cuestionario corregido",
          captionLabel: "Figura",
          description: "Cuestionario corregido sobre LLM's",
        },
      },
    },
  ],
  categories: ["AI"],
  is_featured: true,
  translations: {
    en: {
      title: "AI Quiz Generator",
      short_description:
        "Web application for generating AI-powered quizzes, featuring Google authentication and a fullstack cloud architecture.",
      full_description: `This project represents my <highlight type="important">first experience with generative AI</highlight>. Originally developed in early 2024 for an academic project, the initial version was born at a time when LLMs frameworks and structured output APIs were not yet the standard. Back then, I implemented a <highlight type="code">custom parser</highlight> to process raw responses from OpenAI, tackling the challenges of consistency in natural language. Initially, the app's infrastructure was hosted on <highlight type="soft">Microsoft Azure</highlight> under a student plan; later, in 2026, I performed a <highlight type="glow">migration and refactoring</highlight> to professionalize the application and move it to a new production environment for this portfolio.

        The core of the application allows any topic to be transformed into a <highlight type="important">quiz</highlight>. Users can configure parameters such as <highlight type="soft">length</highlight>, <highlight type="soft">language</highlight>, and <highlight type="soft">difficulty level</highlight>. The app encourages collaborative learning by allowing quizzes to be saved as <highlight type="accent">private</highlight> or published to a global feed on the <highlight type="accent">Public Quizzes</highlight> page—all within a minimalist interface designed to be <highlight type="glow">intuitive and fast</highlight>.

        For identity management, I implemented a robust authentication flow using <highlight type="soft">Google OAuth</highlight>. Once a user is validated, the system generates a custom <highlight type="important">JWT (JSON Web Token)</highlight> to manage sessions and request security. This system not only manages personal quiz libraries but also enforces <highlight type="important">dynamic usage limits</highlight> (restricting users to 5 generations per day), ensuring service sustainability and strict control over computing costs.

        On a technical level, the architecture is <highlight type="accent">modern and decoupled</highlight>. The frontend, developed with <highlight type="soft">React</highlight> and <highlight type="soft">Vite</highlight>, is served through <highlight type="soft">Vercel</highlight>. The backend is built with <highlight type="soft">NestJS</highlight> and deployed on <highlight type="soft">Google Cloud Run</highlight> using a <highlight type="important">serverless</highlight> infrastructure that scales to zero, optimizing resources and minimizing <highlight type="soft">cold start</highlight> impact. Data persistence relies on <highlight type="soft">MongoDB Atlas</highlight>, while the system's intelligence utilizes the <highlight type="code">gpt-4.1-nano</highlight> model to minimize costs and response times.

        This project demonstrates not only software development skills but also a solid capacity for <highlight type="tag">Cloud Architecture</highlight> design and infrastructure management in a real production environment.`,
      role: "Creator, Designer, and Developer of the Full Project",
    },
    es: {
      title: "Generador de Cuestionarios con IA",
      short_description:
        "Aplicación web para generar cuestionarios con IA, autenticación de Google y arquitectura fullstack en la nube.",
      full_description: `Este proyecto representa mi <highlight type="important">primer contacto con la IA generativa</highlight>. Desarrollado originalmente a principios de 2024 para un proyecto académico, la versión inicial nació en un contexto donde los frameworks para LLM's y APIs de salida estructurada aún no eran el estándar. En aquel momento, implementé un <highlight type="code">parser personalizado</highlight> para procesar las respuestas en bruto de OpenAI, enfrentándome a los retos de la consistencia en el lenguaje natural. En ese momento, la infraestructura de la app se encontraba en <highlight type="soft">Microsoft Azure</highlight> con un plan de estudiante, más adelante, en 2026, tuve que realizar una <highlight type="glow">migración y refactorización</highlight> para profesionalizar la aplicación y llevarla a otro entorno de producción y así poder subir-la a este portfolio.

        El núcleo de la aplicación permite transformar cualquier tópico en un <highlight type="important">cuestionario</highlight>. Los usuarios pueden configurar parámetros como la <highlight type="soft">longitud</highlight>, el <highlight type="soft">idioma</highlight> y el <highlight type="soft">nivel de dificultad</highlight>. La aplicación fomenta el aprendizaje colaborativo permitiendo guardar cuestionarios como <highlight type="accent">privados</highlight> o publicarlos en un feed global en la página de <highlight type="accent">Public Quizzes</highlight>. Todo esto bajo una interfaz minimalista diseñada para ser <highlight type="glow">intuitiva y rápida</highlight>.

        Para la gestión de identidad, implementé un flujo de autenticación robusto mediante <highlight type="soft">Google OAuth</highlight>. Una vez validado el usuario, el sistema genera un <highlight type="important">JWT (JSON Web Token)</highlight> propio de la aplicación para gestionar la sesión y la seguridad de las peticiones. Este sistema permite no solo administrar bibliotecas de cuestionarios personales, sino también aplicar <highlight type="important">límites de uso dinámicos</highlight> (restringiendo a 5 generaciones diarias por usuario), garantizando la sostenibilidad del servicio y un control estricto de los costes de computación.

        A nivel técnico, la arquitectura es <highlight type="accent">moderna y desacoplada</highlight>. El frontend, desarrollado con <highlight type="soft">React</highlight> y <highlight type="soft">Vite</highlight>, se sirve desde <highlight type="soft">Vercel</highlight>. El backend está construido con <highlight type="soft">NestJS</highlight> y se despliega en <highlight type="soft">Google Cloud Run</highlight> mediante una infraestructura <highlight type="important">serverless</highlight> que escala a cero, optimizando recursos y minimizando el impacto del <highlight type="soft">cold start</highlight>. La persistencia de datos se apoya en <highlight type="soft">MongoDB Atlas</highlight>, mientras que la inteligencia del sistema utiliza el modelo <highlight type="code">gpt-4.1-nano</highlight> para minimizar coste y tiempo de respuesta.

        Este proyecto no solo demuestra habilidades de desarrollo de software, sino también una sólida capacidad para el diseño de <highlight type="tag">Arquitecturas Cloud</highlight> y la gestión de infraestructuras en un entorno real de producción.`,
      role: "Creador, Diseñador y Desarrollador del Proyecto Completo",
    },
  },
};
