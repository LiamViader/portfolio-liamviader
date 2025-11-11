import PersonalGallery from "./PersonalGallery";

export function PersonalSection() {
  return (
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
          <PersonalGallery
            photos={[
              { src: "/images/emporda_original.jpg", alt: "Caminata en la montaña", caption: "Montaña · Octubre 2025" },
              { src: "/images/test2_liam.png", alt: "Puesta de sol", caption: "Atardecer que me inspiró" },
              { src: "/images/emporda_original.jpg", alt: "Libros que leo ahora", caption: "Lecturas actuales" },
            ]}
          />
          <p className="mt-3 text-xs text-white/50 text-center">
            Haz clic en una foto para verla ampliada.
          </p>
        </div>
      </div>
    </section>
  );
}
