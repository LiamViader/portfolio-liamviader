import { Quote } from "lucide-react";

export function PhilosophySection() {
  return (
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
  );
}
