"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
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
  // TODO: cambia esto por tu nombre real
  fullName: "Liam Viader Molina",
  birthdate: "2001-02-16",
  city: "Barcelona, España",
  languages: ["Catalán", "Español", "Inglés"],
};

type TimelineItem = {
  period: string;
  title: string;
  place: string;
  description: string;
};

const ACADEMIC_PATH: TimelineItem[] = [
  {
    period: "Año de inicio – Año de fin",
    title: "Tu grado / máster principal",
    place: "Universidad / centro",
    description:
      "Frase corta sobre qué estudiaste y en qué te especializaste.",
  },
  {
    period: "Opcional",
    title: "Otro curso, bootcamp o formación relevante",
    place: "Plataforma / institución",
    description:
      "Añade aquí formaciones complementarias que hayan marcado tu forma de trabajar.",
  },
];

const EXPERIENCE_PATH: TimelineItem[] = [
  {
    period: "Año – Año / Actualidad",
    title: "Tu rol actual o más reciente",
    place: "Empresa / proyecto",
    description:
      "Resumen breve del tipo de trabajo que haces: producto, cliente, stack, responsabilidades.",
  },
  {
    period: "Opcional",
    title: "Rol anterior relevante",
    place: "Empresa / proyecto",
    description:
      "Cuenta qué aportaste, qué aprendiste o qué tipo de problemas resolviste.",
  },
];

const TECH_STACK: Array<{
  name: string;
  short?: string;
  description?: string;
}> = [
  {
    name: "C#",
    short: "C#",
    description: "Backend, tooling o juegos. Pon aquí tu uso principal.",
  },
  {
    name: "Python",
    short: "Py",
    description: "Data, scripting, IA, automatización… lo que más encaje contigo.",
  },
  {
    name: "JavaScript / TypeScript",
    short: "JS",
    description: "Frontend, backend o full-stack. Ajusta según lo que hagas.",
  },
  {
    name: "React / Next.js",
    short: "R",
    description: "Interfaz, UX y aplicaciones web modernas.",
  },
  {
    name: "SQL / Bases de datos",
    short: "DB",
    description: "Diseño de modelos de datos y consultas.",
  },
  {
    name: "Git & GitHub",
    short: "Git",
    description: "Flujo de trabajo, ramas, PRs y colaboración.",
  },
  {
    name: "CI/CD & DevOps básico",
    short: "Ops",
    description: "Pipelines, despliegues y entornos.",
  },
  {
    name: "Otros",
    short: "+",
    description:
      "Añade aquí frameworks, motores de juegos, nubes o lo que tenga sentido.",
  },
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

function Timeline({
  items,
  icon,
}: {
  items: TimelineItem[];
  icon: ReactNode;
}) {
  return (
    <ul className="space-y-6">
      {items.map((item, index) => (
        <li key={`${item.title}-${index}`} className="relative pl-7">
          {/* Línea vertical */}
          <span className="pointer-events-none absolute left-1 top-2 -bottom-2 w-px bg-gradient-to-b from-sky-400/60 via-sky-400/20 to-transparent" />

          {/* Nodo */}
          <span className="absolute left-0 top-2 flex h-4 w-4 items-center justify-center">
            <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-sky-400/80">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-950" />
            </span>
          </span>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 backdrop-blur-sm">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-sky-200/80">
              {icon}
              <span>{item.period}</span>
            </div>
            <p className="text-sm font-medium text-white">{item.title}</p>
            <p className="text-xs text-white/60">{item.place}</p>
            {item.description && (
              <p className="mt-2 text-sm text-white/60 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function AboutPortrait() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
        boxShadow: "0 25px 60px -40px rgba(56,189,248,0.4)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: "0 25px 60px -40px rgba(56,189,248,0.4)",
        transition: { duration: 0.6, ease: "easeOut" }
      }}
      whileHover={{
        y: -8,
        boxShadow: "0 30px 80px -50px rgba(56,189,248,0.9)",
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-38 aspect-square sm:w-46 md:w-54 rounded-2xl border border-white/20 overflow-hidden bg-gradient-to-br from-sky-500/30 via-sky-500/10 to-indigo-500/30"
    >
      {/* Halo suave detrás */}
      <div
        className="pointer-events-none absolute -inset-10 rounded-[2rem] bg-sky-500/25 blur-3xl"
        aria-hidden
      />

      <div className="relative h-full w-full">
        <Image
          src="/images/test2_liam.png" // cámbialo si quieres otra imagen
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
          {/* Fila: título/subtítulo + imagen */}
          <div className="flex flex-col-reverse gap-8 lg:flex-row items-center lg:gap-16">
            {/* Columna texto */}
            <div className="flex-1 space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-pretty text-4xl font-semibold tracking-tight text-white/95 sm:text-5xl md:text-6xl text-center lg:text-left"
              >
                Yo, como <span className="text-sky-300">persona</span> y como{" "}
                <span className="text-sky-300">profesional</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="lg:max-w-2xl text-pretty text-lg text-white/70 sm:text-xl text-center lg:text-left"
              >
                Esta página recoge un poco de contexto sobre quién soy, de dónde
                vengo y qué cosas me importan dentro y fuera del trabajo.
              </motion.p>
            </div>

            {/* Columna imagen / avatar, más pequeña y cuadrada */}
            <div className="flex w-full justify-center lg:w-auto lg:justify-end">
              <AboutPortrait />
            </div>
          </div>

          {/* Snapshot / Datos rápidos – ahora debajo de la fila principal */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <InfoCard
              title={PERSONAL_INFO.fullName}
              info={`Nacido el 16 de febrero de 2001 (${age} años).`}
              icon={<User2 className="h-6 w-6 text-sky-300" />}
            />

            <InfoCard
              title={PERSONAL_INFO.city}
              info="Con base en Barcelona. Aquí puedes añadir una frase sobre qué te conecta con esta ciudad."
              icon={<MapPin className="h-6 w-6 text-sky-300" />}
            />

            <InfoCard
              title="Idiomas"
              info={PERSONAL_INFO.languages.join(" · ")}
              icon={<Languages className="h-6 w-6 text-sky-300" />}
            />

            <InfoCard
              title="Qué hago"
              info="Escribe aquí una frase corta que resuma tu rol: por ejemplo, “Desarrollador de software especializado en X e Y”."
              icon={<Sparkles className="h-6 w-6 text-sky-300" />}
            />
          </motion.div>
        </div>
      </section>

      {/* TECNOLOGÍAS */}
      <section className="relative px-4 pb-20 pt-10 sm:px-6 lg:px-12 lg:pb-24 lg:pt-16 mx-0">
        <div className="absolute border-t border-gray-700/50 inset-0 bg-gradient-to-br from-gray-950 via-transparent to-gray-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_rgba(56,189,248,0.05),_transparent_50%)]" />
        

        <div className="relative mx-auto max-w-[1400px] space-y-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                Tecnologías & herramientas
              </h2>
              <p className="mt-2 max-w-xl text-sm text-white/70 sm:text-base">
                Un vistazo rápido a las tecnologías con las que más cómodo te
                sientes. Puedes usar esta sección como referencia rápida para
                recruiters o colaboradores.
              </p>
            </div>

            <p className="text-xs text-white/40 max-w-sm">
              Consejo: piensa en esta lista como tu “zona de confort técnica”.
              No tienen por qué ser todas las cosas que conoces, solo las que
              usarías con confianza.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm transition hover:border-sky-400/70 hover:bg-sky-500/10"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-xs font-semibold text-sky-100">
                  {tech.short ?? tech.name[0]}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-white">
                    {tech.name}
                  </p>
                  {tech.description && (
                    <p className="text-xs text-white/65 leading-relaxed">
                      {tech.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-dashed border-sky-400/40 bg-sky-500/5 px-4 py-3 text-xs text-sky-100/80">
            <p>
              Si quieres usar iconos de cada tecnología (C#, Python, JS, etc.),
              puedes reemplazar el cuadrado con texto por un{" "}
              <code className="font-mono text-[11px]">
                &lt;Image /&gt;
              </code>{" "}
              o por un componente de icono. La estructura ya está preparada
              para ello.
            </p>
          </div>
        </div>
      </section>

      {/* ACADÉMICO + EXPERIENCIA */}
      <section className="relative border-t border-gray-700/50 px-4 pb-20 pt-10 sm:px-6 lg:px-12 lg:pb-24 lg:pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(56,189,248,0.05),_transparent_50%)]" />

        <div className="relative mx-auto max-w-6xl space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Trayectoria académica & experiencia
            </h2>
            <p className="max-w-2xl text-sm text-white/70 sm:text-base">
              Esta sección es el puente entre quién eres y lo que has hecho. No
              hace falta que sea un CV completo, sino una narrativa corta de
              cómo has ido tomando decisiones.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-white/60">
                <GraduationCap className="h-4 w-4 text-sky-300" />
                <span>Formación académica</span>
              </div>
              <Timeline
                items={ACADEMIC_PATH}
                icon={<GraduationCap className="h-3.5 w-3.5 text-sky-200" />}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-white/60">
                <Briefcase className="h-4 w-4 text-sky-300" />
                <span>Experiencia profesional</span>
              </div>
              <Timeline
                items={EXPERIENCE_PATH}
                icon={<Briefcase className="h-3.5 w-3.5 text-sky-200" />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* PARTE PERSONAL */}
      <section className="relative border-t border-gray-700/50 px-4 pb-20 pt-10 sm:px-6 lg:px-12 lg:pb-24 lg:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_rgba(56,189,248,0.05),_transparent_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-transparent to-transparent" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center">
          {/* Texto */}
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

          {/* Imagen / visual personal */}
          <div className="flex-1">
            <div className="relative mx-auto aspect-[4/3] max-w-md overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-sky-500/20 via-sky-500/5 to-indigo-500/10 shadow-[0_40px_80px_-60px_rgba(56,189,248,0.7)]">
              {/* TODO: reemplaza este bloque por tu propia imagen si quieres */}
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
      <section className="relative border-t border-gray-700/50 px-4 pb-24 pt-10 sm:px-6 lg:px-12 lg:pb-32 lg:pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(56,189,248,0.05),_transparent_50%)]" />

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
                con feedback real, antes que perseguir una perfección abstracta”.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
