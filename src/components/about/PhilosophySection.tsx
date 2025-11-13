import { motion, type Variants } from "framer-motion";
import { InfoCard } from "../home/InfoCard";
import { ListChecks, Workflow, AlertTriangle, Rocket } from "lucide-react";

const sectionVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.10, delayChildren: 0.05 } },
};

const headerGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const headerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export function PhilosophySection() {
  return (
    <motion.section
      className="relative px-4 pb-24 pt-10 sm:px-6 lg:px-12 lg:pb-32 lg:pt-20"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={sectionVariants}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-950/50" />

      <div className="relative mx-auto max-w-6xl space-y-8">
        {/* Cabecera con animación */}
        <motion.div className="space-y-2 max-w-3xl" variants={headerGroup}>
          <motion.h2
            className="text-2xl font-semibold text-white sm:text-3xl"
            variants={headerItem}
          >
            Cómo pienso y cómo trabajo
          </motion.h2>
          <motion.p
            className="text-sm text-white/70 sm:text-base leading-relaxed"
            variants={headerItem}
          >
            Mi manera de diseñar, construir y mantener.
          </motion.p>
        </motion.div>

        {/* Tarjetas (heredan animación de la sección) */}
        <motion.ul
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          variants={listVariants}
        >
          <InfoCard
            title="Requisitos del sistema"
            info="Casos de uso y restricciones claras. Delimito el alcance mínimo con ejemplos de entrada/salida."
            icon={<ListChecks className="h-5 w-5 text-sky-300" />}
          />

          <InfoCard
            title="Diseño con diagramas"
            info="Diagramas de flujo/actividad y clases para fijar límites, tener mejor visión global y detectar dependencias temprano."
            icon={<Workflow className="h-5 w-5 text-sky-300" />}
          />

          <InfoCard
            title="Supuestos y riesgos"
            info="Anoto supuestos y riesgos. Los valido con pruebas rápidas y preparo un plan B si no se cumplen."
            icon={<AlertTriangle className="h-5 w-5 text-sky-300" />}
          />

          <InfoCard
            title="Prototipado rápido"
            info="Primero prototipo módulos críticos con interfaces claras; después una bala trazadora que recorre todo el sistema; luego iteraciones de refinado."
            icon={<Rocket className="h-5 w-5 text-sky-300" />}
          />
        </motion.ul>
      </div>
    </motion.section>
  );
}
