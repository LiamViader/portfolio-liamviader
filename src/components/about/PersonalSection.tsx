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
            Siempre he sido una persona que le da muchas vueltas a las cosas. Pienso, analizo, conecto ideas, 
            y muchas veces me descubro imaginando soluciones o sistemas que ni siquiera voy a construir. 
            Me gusta reflexionar sobre temas muy distintos —desde cuestiones filosóficas hasta ideas sobre arte o tecnología—, 
            y creo que esa curiosidad constante define bastante mi forma de ser.
          </p>
          <p className="text-sm text-white/70 sm:text-base leading-relaxed">
            Por eso incluso en mi tiempo libre sigo creando. A veces simplemente escribo o dibujo, 
            otras diseño sistemas imaginarios o pequeños proyectos de software que me apetece explorar.
            No siempre busco un resultado tangible, a veces solo pretendo explorar una idea.
          </p>

          <p className="text-sm text-white/60 sm:text-base leading-relaxed">
            Pero a veces estar tan activo mentalmente me agota y necesito moverme para desconectar. 
            Me encanta caminar: por la ciudad, por la montaña, por los campos y montes a las afueras de donde vivo. 
            A veces solo es un paseo rutinario para recargar energía y volver más despejado; 
            otras me tomo mi tiempo para caminar sin rumbo y descubrir nuevos lugares que me sorprendan. 
            Me gusta estar presente cuando el sol empieza a desvanecerse y el cielo nos deleita con sus pinceladas más coloridas. 
            También suelo ir al gimnasio, salir a correr o hacer algo de bici; son momentos en los que dejo que el cuerpo tome el protagonismo 
            y la mente, por fin, se calme un poco.
          </p>
                    
          <p className="text-sm text-white/70 sm:text-base leading-relaxed">
            También encuentro inspiración en momentos más tranquilos. Me gusta leer —desde libros sobre programación, inteligencia artificial o diseño de sistemas, 
            hasta ensayos de filosofía o narrativa fantástica— y a veces perderme en un buen videojuego. 
            Ambos me sirven para aprender, para inspirarme y para descubrir nuevas formas de pensar y crear.
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
