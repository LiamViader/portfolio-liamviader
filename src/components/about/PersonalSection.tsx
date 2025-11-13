import PersonalGallery from "./PersonalGallery";
import { motion, type Variants } from "framer-motion";

const sectionVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.05,
    },
  },
};

const blockFadeUp: Variants = {
  hidden: { opacity: 0, y: 0 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const textGroup: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const textItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export function PersonalSection() {
  return (
    <motion.section
      className="relative px-4 pb-20 pt-10 sm:px-6 lg:px-12 lg:pb-24 lg:pt-20"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={sectionVariants}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950 to-gray-950" />

      <div className="relative mx-auto max-w-[1400px] ">
        <motion.h2
          className="text-2xl font-semibold text-white sm:text-3xl"
          variants={textItem}
        >
          Más allá del código
        </motion.h2>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          {/* Bloque de texto: entra con fade+stagger de cada elemento */}
          <motion.div className="flex-1 space-y-4" variants={blockFadeUp}>
            <motion.div variants={textGroup}>

              <motion.p
                className="text-sm text-white/70 sm:text-base leading-relaxed pt-3"
                variants={textItem}
              >
                Siempre he sido una persona que le da muchas vueltas a las cosas. Pienso, analizo, conecto ideas, 
                y muchas veces me descubro imaginando soluciones o sistemas que ni siquiera voy a construir. 
                Me gusta reflexionar sobre temas muy distintos —desde cuestiones filosóficas hasta ideas sobre arte o tecnología—, 
                y creo que esa curiosidad constante define bastante mi forma de ser.
              </motion.p>

              <motion.p
                className="text-sm text-white/70 sm:text-base leading-relaxed pt-2"
                variants={textItem}
              >
                Por eso incluso en mi tiempo libre sigo creando. A veces simplemente escribo o dibujo, 
                otras diseño sistemas imaginarios o pequeños proyectos de software que me apetece explorar.
                No siempre busco un resultado tangible, a veces solo pretendo explorar una idea.
              </motion.p>

              <motion.p
                className="text-sm text-white/60 sm:text-base leading-relaxed pt-2"
                variants={textItem}
              >
                Pero a veces estar tan activo mentalmente me agota y necesito moverme para desconectar. 
                Me encanta caminar: por la ciudad, por la montaña, por los campos y montes a las afueras de donde vivo. 
                A veces solo es un paseo rutinario para recargar energía y volver más despejado; 
                otras me tomo mi tiempo para caminar sin rumbo y descubrir nuevos lugares que me sorprendan. 
                Me gusta estar presente cuando el sol empieza a desvanecerse y el cielo nos deleita con sus pinceladas más coloridas. 
                También suelo ir al gimnasio, salir a correr o hacer algo de bici; son momentos en los que dejo que el cuerpo tome el protagonismo 
                y la mente, por fin, se calme un poco.
              </motion.p>

              <motion.p
                className="text-sm text-white/70 sm:text-base leading-relaxed pt-2"
                variants={textItem}
              >
                También encuentro inspiración en momentos más tranquilos. Me gusta leer —desde libros sobre programación, inteligencia artificial o diseño de sistemas, 
                hasta ensayos de filosofía o narrativa fantástica— y a veces perderme en un buen videojuego. 
                Ambos me sirven para aprender, para inspirarme y para descubrir nuevas formas de pensar y crear.
              </motion.p>

              <motion.p
                className="text-sm text-white/70 sm:text-base leading-relaxed pt-2"
                variants={textItem}
              >
                Y, en medio de todo esto, están Neo e Iris —mi gato y mi perro—, que a veces se cuelan en mis fotos sin avisar.
              </motion.p>
            </motion.div>
          </motion.div>

          <motion.div className="flex-1" variants={blockFadeUp}>
            <PersonalGallery
              photos={[
                { src: "/images/personal_gallery/cala_arenys.jpg"},
                { src: "/images/personal_gallery/neo_taula.jpg"},
                { src: "/images/personal_gallery/llums_cel_alps.jpg"},
                { src: "/images/personal_gallery/landscape_alps.jpg"},
                { src: "/images/personal_gallery/posta_sol_pais_vasc.jpg"},
                { src: "/images/personal_gallery/emporda_original.jpg"},
                { src: "/images/personal_gallery/pineta_liam_croped.jpg"},
                { src: "/images/personal_gallery/iris_camps.jpg"},
                { src: "/images/personal_gallery/llibres.jpg"},

              ]}
            />
            <motion.p
              className="mt-3 text-xs text-white/50 text-center"
              variants={textItem}
            >
              Haz clic en una foto para verla ampliada.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
