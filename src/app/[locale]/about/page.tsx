"use client";

import { useState, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import PageLayout from "@/components/layout/PageLayout";
import { InfoCard } from "@/components/home/InfoCard";
import {
  User2,
  MapPin,
  Languages,
  GraduationCap,
  Briefcase,
  Sparkles,
  Quote,
} from "lucide-react";
import { SkyButton, WhiteButton } from "@/components/home/Buttons";

import { BASE_DELAY_ENTRANCE } from "@/utils/constants";

const BACKGROUND_LAYERS = [
  {
    id: "primary",
    gridType: "Fill" as const,
    pixelsPerHex: 45,
    hue: 240,
    hueJitter: 5,
    s: 75,
    l: 1,
    className: "opacity-85",
  },
  {
    id: "secondary",
    gridType: "Strata" as const,
    pixelsPerHex: 45,
    hue: 240,
    hueJitter: 30,
    s: 60,
    l: 25,
  },
];

const BACKGROUND_OVERLAY = (
  <>
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.1),_transparent_55%)]" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gray-950/5 via-gray-950/15 to-gray-950/60" />
  </>
);

const PERSONAL_INFO = {
  fullName: "Liam Viader Molina",
  birthdate: "2001-02-16",
  city: "Barcelona, España",
  languages: ["Catalán", "Español", "Inglés"],
};

type TimelineItem = {
  period: string;
  title: string;
  place: string;
  description?: ReactNode;
};

const ACADEMIC_PATH: TimelineItem[] = [
  {
    period: "2020 - 2025",
    title: "Grado en Diseño y Desarrollo de Videojuegos",
    place: "Universitat de Girona (UdG)",
    description: (
      <>
        Media final de{" "}
        <span className="font-semibold text-sky-300/90">9,07</span> y{" "}
        <span className="font-semibold text-sky-300/90">
          18 matrículas de honor
        </span>{" "}
        durante el grado. Es una carrera muy centrada en informática
        (programación, estructuras de datos, arquitectura de software, redes,
        IA, cloud computing, informática gráfica, visión por computador...) y
        una parte aplicada a videojuegos y al diseño de sistemas interactivos.
      </>
    ),
  },
];

const EXPERIENCE_PATH: TimelineItem[] = [
  {
    period: "Jun 2024 - Sep 2024",
    title: "Desarrollador de software (prácticas)",
    place: "Grup de recerca eXiT · Universitat de Girona",
    description:
      "Proyecto en Python desarrollado en solitario: diseño e implementación desde cero de un simulador de comunidades energéticas. Modelado de hogares con distintos activos y patrones de uso configurables, generación de perfiles de consumo y producción y algoritmos para repartir energía y calcular costes dentro de la comunidad.",
  },
];

type TechIcon = {
  id: string;
  label: string;
  iconSrc?: string;
  color?: string;
};

const TECH_STACK: TechIcon[] = [
  // Languages
  { id: "csharp", label: "C#", iconSrc: "/icons/csharp.svg" },
  { id: "python", label: "Python", iconSrc: "/icons/python.svg" },
  { id: "javascript", label: "JavaScript", iconSrc: "/icons/javascript.svg" },
  { id: "typescript", label: "TypeScript", iconSrc: "/icons/typescript.svg" },
  { id: "php", label: "PHP", iconSrc: "/icons/php.svg" },
  { id: "cpp", label: "C++", iconSrc: "/icons/cplusplus.svg" },

  // Frontend
  { id: "html", label: "HTML", iconSrc: "/icons/html.svg" },
  { id: "css", label: "CSS", iconSrc: "/icons/css.svg" },
  { id: "react", label: "React", iconSrc: "/icons/react.svg" },
  { id: "nextjs", label: "Next.js", iconSrc: "/icons/nextjs.svg" },
  { id: "tailwind", label: "Tailwind CSS", iconSrc: "/icons/tailwind.svg" },

  // Backend / APIs
  { id: "node", label: "Node.js", iconSrc: "/icons/nodejs.svg" },
  { id: "nest", label: "NestJS", iconSrc: "/icons/nestjs.svg" },
  { id: "fastapi", label: "FastAPI", iconSrc: "/icons/fastapi.svg" },

  // Data / ML / BD
  { id: "pandas", label: "Pandas", iconSrc: "/icons/pandas.svg" },
  { id: "mysql", label: "MySQL", iconSrc: "/icons/mysql.svg" },
  { id: "mongodb", label: "MongoDB", iconSrc: "/icons/mongodb.svg" },
  { id: "jupyter", label: "Jupyter Notebook", iconSrc: "/icons/jupyter.svg" },

  // AI / tooling
  {
    id: "scikitlearn",
    label: "Scikit-Learn",
    iconSrc: "/icons/scikitlearn.svg",
  },
  { id: "tensorflow", label: "TensorFlow", iconSrc: "/icons/tensorflow.svg" },
  { id: "openai", label: "OpenAI API", iconSrc: "/icons/openai.svg" },
  {
    id: "langchain",
    label: "LangChain & LangGraph",
    iconSrc: "/icons/langchain.svg",
  },
  { id: "comfyui", label: "ComfyUI", iconSrc: "/icons/comfyui.svg" },

  // Tools
  { id: "git", label: "Git", iconSrc: "/icons/git.svg" },

  // Game dev
  { id: "unity", label: "Unity", iconSrc: "/icons/unity.svg" },
  { id: "godot", label: "Godot", iconSrc: "/icons/godot.svg" },
];

function getAge(dateString: string): number {
  const today = new Date();
  const birthDate = new Date(dateString);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

/** Variants para la sección de tecnologías **/
const techSectionContainerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const techTextVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const techItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    boxShadow: "0 0px 30px 1px rgba(56,189,248,0.01)",
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.05)",
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const techGridVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

/** Variants para la sección de trayectoria (académico + experiencia) **/

// Contenedor de la sección: solo mueve en Y, sin tocar opacidad
const pathSectionContainerVariants: Variants = {
  hidden: { y: 30 },
  show: {
    y: 0,
    transition: {
      duration: 0.05,
      ease: "easeOut",
      when: "beforeChildren", // mueve la sección y luego deja que los hijos se animen
    },
  },
};

// Header general: puede animar opacidad sin problema (no hay blur aquí)
const pathHeaderVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Wrapper de columnas: solo coordina stagger, no cambia opacity/y
const pathColumnsWrapperVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
      delay: 0.02,      // <-- aquí decides cuánto tarda en empezar lo de abajo
      when: "beforeChildren",
      staggerChildren: 0.12,
    },
  },
};

// Cada columna: también solo delega, no anima nada en sí
const pathColumnVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      when: "beforeChildren",
    },
  },
};

// Header de cada columna ("Formación académica", "Experiencia profesional")
const pathColumnHeaderVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

// Lista de items: solo stagger
const pathListVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.5,
    },
  },
};

// El <li> solo participa en el stagger, pero no anima nada en sí
const pathItemShellVariants: Variants = {
  hidden: {},
  show: {},
};

// El que realmente anima es el contenedor con el backdrop-blur (la hoja)
const pathCardVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    boxShadow: "0 0px 30px 1px rgba(56,189,248,0.01)",
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.04, // ahora el contenido interno también hace stagger
    },
  },
};

// Línea vertical de la timeline
const pathLineVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

// Flecha en la parte superior de la línea
const pathArrowVariants: Variants = {
  hidden: { opacity: 0, y: 4 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

// Bolitas de la timeline
const pathDotVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

// Contenido textual dentro de la card (periodo, título, lugar, descripción)
const pathCardInnerVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function Timeline({
  items,
  icon,
}: {
  items: TimelineItem[];
  icon: ReactNode;
}) {
  return (
    <div className="relative pl-0">
      {/* Flecha arriba indicando sentido temporal (de abajo hacia arriba) */}
      <motion.span
        variants={pathArrowVariants}
        className="pointer-events-none absolute left-2 top-0 -translate-x-1/2 flex items-center justify-center"
      >
        <span className="h-0 w-0 border-l-[5px] border-r-[5px] border-b-[7px] border-l-transparent border-r-transparent border-b-sky-400/80" />
      </motion.span>

      {/* Línea vertical continua (animada) */}
      <motion.span
        className="pointer-events-none absolute left-2 top-3 bottom-3 w-px bg-gradient-to-b from-sky-400/60 via-sky-400/60 to-transparent"
        variants={pathLineVariants}
      />

      <motion.ul className="space-y-6" variants={pathListVariants}>
        {items.map((item, index) => (
          <motion.li
            key={`${item.title}-${index}`}
            className="relative pl-6"
            variants={pathItemShellVariants}
          >
            {/* Nodo (bolita) animado */}
            <motion.span
              className="absolute left-0 top-2 flex h-4 w-4 items-center justify-center"
              variants={pathDotVariants}
            >
              <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-sky-400/80">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-950" />
              </span>
            </motion.span>

            {/* Contenedor animado (opacidad + y + backdrop-blur + hover) */}
            <motion.div
              variants={pathCardVariants}
              whileHover={{
                y: -6,
                rotateX: 2,
                rotateY: -2,
                boxShadow: "0 0px 30px 1px rgba(56,189,248,0.30)",
                transition: { duration: 0.3, ease: "easeOut" },
                borderColor: "rgba(56,189,248,0.60)",
                backgroundColor: "rgba(56,189,248,0.10)",
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 backdrop-blur-sm"
            >
              {/* Periodo */}
              <motion.div
                variants={pathCardInnerVariants}
                className="mb-1 flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.2em] text-sky-200/80"
              >
                {icon}
                <span>{item.period}</span>
              </motion.div>

              {/* Título */}
              <motion.p
                variants={pathCardInnerVariants}
                className="text-[17px] font-semibold text-white"
              >
                {item.title}
              </motion.p>

              {/* Lugar */}
              <motion.p
                variants={pathCardInnerVariants}
                className="text-[13px] text-white/60"
              >
                {item.place}
              </motion.p>

              {/* Descripción */}
              {item.description && (
                <motion.p
                  variants={pathCardInnerVariants}
                  className="mt-2 text-[15px] text-white/60 leading-relaxed"
                >
                  {item.description}
                </motion.p>
              )}
            </motion.div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

const portraitVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    boxShadow: "0 25px 60px -40px rgba(56,189,248,0.4)",
  },
  intro: {
    opacity: 1,
    y: 0,
    boxShadow: "0 25px 60px -40px rgba(56,189,248,0.4)",
    transition: { duration: 0.7, ease: "easeOut", delay: BASE_DELAY_ENTRANCE },
  },
  show: {
    opacity: 1,
    y: 0,
    boxShadow: "0 25px 60px -40px rgba(56,189,248,0.4)",
    transition: { duration: 0.45, ease: "easeOut" },
  },
  hover: {
    y: -8,
    boxShadow: "0 30px 80px -50px rgba(56,189,248,0.9)",
    transition: { duration: 0.25, ease: "easeOut" },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.08, ease: "easeOut" },
  },
};

function AboutPortrait() {
  const [phase, setPhase] = useState<"intro" | "show">("intro");
  const [ready, setReady] = useState(false);

  return (
    <motion.div
      variants={portraitVariants}
      initial="hidden"
      animate={phase}
      onAnimationComplete={(def) => {
        setReady(true);
        if (def === "intro") setPhase("show");
      }}
      whileHover={ready ? "hover" : undefined}
      whileTap={ready ? "tap" : undefined}
      className="relative w-38 aspect-square sm:w-46 md:w-54 rounded-2xl border border-white/20 overflow-hidden bg-gradient-to-br from-sky-500/30 via-sky-500/10 to-indigo-500/30"
      style={{
        pointerEvents: ready ? "auto" : "none",
      }}
    >
      <div
        className="pointer-events-none absolute -inset-10 rounded-[2rem] bg-sky-500/25 blur-3xl"
        aria-hidden
      />

      <div className="relative h-full w-full">
        <Image
          src="/images/test2_liam.png"
          alt="Retrato"
          fill
          sizes="(min-width: 1024px) 260px, (min-width: 768px) 220px, 190px"
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  const age = getAge(PERSONAL_INFO.birthdate);

  return (
    <PageLayout
      backgroundLayers={BACKGROUND_LAYERS}
      overlays={BACKGROUND_OVERLAY}
    >
      {/* HERO + SNAPSHOT */}
      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-12 lg:pb-20 lg:pt-36 md:min-h-[950px]">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/10 via-gray-950/50 to-gray-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.05),_transparent_50%)]" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
          <div className="flex flex-col-reverse gap-8 lg:flex-row items-center lg:gap-16">
            <div className="flex-1 space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                  delay: BASE_DELAY_ENTRANCE + 0.1,
                }}
                className="text-pretty text-4xl font-semibold tracking-tight text-white/95 sm:text-5xl md:text-6xl text-center lg:text-left"
              >
                Yo, como <span className="text-sky-300">persona</span> y como{" "}
                <span className="text-sky-300">profesional</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                  delay: BASE_DELAY_ENTRANCE + 0.2,
                }}
                className="lg:max-w-2xl text-pretty text-lg text-white/70 sm:text-xl text-center lg:text-left"
              >
                Esta página recoge un poco de contexto sobre quién soy, de dónde
                vengo y qué cosas me importan dentro y fuera del trabajo.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  ease: "easeOut",
                  delay: BASE_DELAY_ENTRANCE + 0.3,
                }}
                className="flex w-full flex-wrap justify-center gap-4 lg:justify-start"
              >
                <SkyButton href="/projects" text="Ver proyectos" />
                <WhiteButton href="/contact" text="Contacto" />
              </motion.div>
            </div>

            <div className="flex w-full justify-center lg:w-auto lg:justify-end">
              <AboutPortrait />
            </div>
          </div>

          <motion.ul
            variants={{
              hidden: { opacity: 1 },
              show: {
                opacity: 1,
                transition: {
                  delayChildren: BASE_DELAY_ENTRANCE + 0.3,
                  staggerChildren: 0.15,
                  when: "beforeChildren",
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="grid gap-4 sm:grid-cols-2"
          >
            <InfoCard
              title={PERSONAL_INFO.fullName}
              info={`${age} años · nacido el 16 de febrero de 2001.`}
              icon={<User2 className="h-6 w-6 text-sky-300" />}
            />

            <InfoCard
              title={PERSONAL_INFO.city}
              info="Actualmente vivo en un pueblo tranquilo cerca de Barcelona, donde nací y encuentro calma para pensar y construir. Estoy abierto vivir en otro lugar si el proyecto y el momento encajan."
              icon={<MapPin className="h-6 w-6 text-sky-300" />}
            />

            <InfoCard
              title="Idiomas"
              info={PERSONAL_INFO.languages.join(" · ")}
              icon={<Languages className="h-6 w-6 text-sky-300" />}
            />

            <InfoCard
              title="Qué hago"
              info="Ingeniero de software con enfoque técnico y creativo, cómodo tanto diseñando el sistema como construyéndolo."
              icon={<Sparkles className="h-6 w-6 text-sky-300" />}
            />
          </motion.ul>
        </div>
      </section>

      {/* TECNOLOGÍAS & HERRAMIENTAS */}
      <motion.section
        className="relative px-4 pb-20 pt-10 sm:px-6 lg:px-12 lg:pb-24 lg:pt-16 mx-0"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950 to-gray-950" />

        <motion.div
          className="relative mx-auto max-w-[1400px] space-y-8"
          variants={techSectionContainerVariants}
        >
          {/* Título + subtítulo */}
          <motion.div
            className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"
            variants={techTextVariants}
          >
            <div>
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                Tecnologías y herramientas
              </h2>
              <p className="mt-2 max-w-5xl text-sm text-pretty text-white/70 sm:text-base">
                Un vistazo rápido a las tecnologías con las que me siento
                cómodo trabajando.
              </p>
            </div>
          </motion.div>

          {/* GRID DE ICONOS con stagger + hover tipo InfoCard */}
          <motion.div
            className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(90px,1fr))]"
            variants={techGridVariants}
          >
            {TECH_STACK.map((tech) => (
              <motion.div
                key={tech.id}
                variants={techItemVariants}
                whileHover={{
                  y: -6,
                  rotateX: 2,
                  rotateY: -2,
                  boxShadow: "0 0px 30px 1px rgba(56,189,248,0.40)",
                  transition: { duration: 0.3, ease: "easeOut" },
                  borderColor: "rgba(56,189,248,0.60)",
                  backgroundColor: "rgba(56,189,248,0.10)",
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="group flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-1 py-2 backdrop-blur-sm"
              >
                <div className="flex h-20 w-20 items-center justify-center">
                  {tech.iconSrc ? (
                    <Image
                      src={tech.iconSrc}
                      alt={tech.label}
                      width={40}
                      height={40}
                      className="object-contain saturate-90"
                    />
                  ) : null}
                </div>
                <p className="text-xs text-white/70 text-center">
                  {tech.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Párrafo de TensorFlow / Scikit-Learn */}
          <motion.p
            className="mt-3 text-xs text-white/55 sm:text-[13px] leading-relaxed"
            variants={techTextVariants}
          >
            Algunas herramientas como{" "}
            <span className="font-medium text-sky-300/60">TensorFlow</span> y{" "}
            <span className="font-medium text-sky-300/60">Scikit-Learn</span>{" "}
            las he usado sobre todo en proyectos de aprendizaje: un clasificador
            de imágenes con redes convolucionales, pequeños experimentos de
            machine learning supervisado y no supervisado y algún proyecto de
            optimización. No me considero experto, pero sí tengo una base
            práctica sólida y sigo profundizando.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* ACADÉMICO + EXPERIENCIA */}
      <motion.section
        className="relative px-4 pb-20 pt-10 sm:px-6 lg:px-12 lg:pb-24 lg:pt-20"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-950" />

        <motion.div
          className="relative mx-auto max-w-6xl space-y-10"
          variants={pathSectionContainerVariants}
        >
          <motion.div className="space-y-3" variants={pathHeaderVariants}>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Trayectoria académica y experiencia
            </h2>
            <p className="text-sm max-w-4xl text-white/70 sm:text-base">
              De momento mi recorrido pasa por un grado en videojuegos, unas
              primeras prácticas en investigación aplicada y muchas horas de
              aprendizaje autodidacta. Prefiero centrarme en pocas cosas a la vez, 
              pero trabajarlas a fondo, de forma que cada etapa cambie 
              de verdad cómo pienso y cómo trabajo.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-10 lg:grid-cols-2"
            variants={pathColumnsWrapperVariants}
          >
            <motion.div className="space-y-4" variants={pathColumnVariants}>
              <motion.div
                className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.25em] text-white/60"
                variants={pathColumnHeaderVariants}
              >
                <GraduationCap className="h-4 w-4 text-sky-300" />
                <span>Formación académica</span>
              </motion.div>
              <Timeline
                items={ACADEMIC_PATH}
                icon={<GraduationCap className="h-3.5 w-3.5 text-sky-200" />}
              />
            </motion.div>

            <motion.div className="space-y-4" variants={pathColumnVariants}>
              <motion.div
                className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.25em] text-white/60"
                variants={pathColumnHeaderVariants}
              >
                <Briefcase className="h-4 w-4 text-sky-300" />
                <span>Experiencia profesional</span>
              </motion.div>
              <Timeline
                items={EXPERIENCE_PATH}
                icon={<Briefcase className="h-3.5 w-3.5 text-sky-200" />}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* PARTE PERSONAL */}
      <section className="relative px-4 pb-20 pt-10 sm:px-6 lg:px-12 lg:pb-24 lg:pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950 to-gray-950" />

        <div className="relative mx-auto flex max-w-[1400px] flex-col gap-10 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Más allá del código
            </h2>
            <p className="text-sm text-white/70 sm:text-base leading-relaxed">
              Aquí puedes hablar de las cosas que te gustan a nivel personal:
              qué te inspira, qué te relaja, qué te obsesiona un poco (en el
              buen sentido). Por ejemplo: el cielo, la luz de ciertas horas,
              videojuegos concretos, música, deporte, lo que te haga ser tú.
            </p>
            <p className="text-sm text-white/70 sm:text-base leading-relaxed">
              Intenta que no sea una lista fría, sino pequeños detalles
              concretos. En vez de “me gusta la naturaleza”, puedes escribir
              algo como “me encanta salir a caminar cuando el cielo está
              nublado y parece que todo va más lento”.
            </p>
            <p className="text-sm text-white/60 sm:text-base leading-relaxed">
              También puedes conectar esta parte con cómo te afecta al trabajo:
              cómo tus hobbies influyen en tu forma de diseñar sistemas, pensar
              en problemas o colaborar con otras personas.
            </p>
          </div>

          <div className="flex-1">
            <div className="relative mx-auto aspect-[4/3] max-w-md overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-sky-500/20 via-sky-500/5 to-indigo-500/10 shadow-[0_40px_80px_-60px_rgba(56,189,248,0.7)]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-center text-sm text-white/75 backdrop-blur-md">
                  Aquí puedes poner una foto tuya, del cielo, o cualquier imagen
                  que conecte con esta parte más personal.
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-white/50 text-center">
              Puedes sustituir el contenido de este recuadro por un{" "}
              <code className="font-mono text-[11px]">
                &lt;Image src=&quot;/ruta/a/tu/imagen.jpg&quot; /&gt;
              </code>{" "}
              usando el mismo estilo que en tu portada.
            </p>
          </div>
        </div>
      </section>

      {/* FILOSOFÍA / MANERA DE PENSAR */}
      <section className="relative px-4 pb-24 pt-10 sm:px-6 lg:px-12 lg:pb-32 lg:pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-950/50" />

        <div className="relative mx-auto max-w-6xl space-y-8">
          <div className="space-y-3 max-w-3xl">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Cómo pienso (y cómo trabajo)
            </h2>
            <p className="text-sm text-white/70 sm:text-base leading-relaxed">
              Aquí puedes hablar de tu filosofía personal: cómo tomas
              decisiones, qué valoras en un equipo, y qué cosas para ti son
              innegociables (calidad, honestidad, curiosidad, foco en el
              usuario, etc.).
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/80">
                <Quote className="h-4 w-4 text-sky-300" />
                <span>Principio 1</span>
              </div>
              <p>
                Escribe aquí una idea clave. Por ejemplo: “prefiero entender
                bien el problema antes de pensar en la solución”.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/80">
                <Quote className="h-4 w-4 text-sky-300" />
                <span>Principio 2</span>
              </div>
              <p>
                Otro principio. Por ejemplo: “me gusta escribir código que
                también cuente una historia clara para la próxima persona que lo
                lea”.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/80">
                <Quote className="h-4 w-4 text-sky-300" />
                <span>Principio 3</span>
              </div>
              <p>
                Y uno más. Por ejemplo: “prefiero avanzar de forma iterativa,
                con feedback real, antes que perseguir una perfección
                abstracta”.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
