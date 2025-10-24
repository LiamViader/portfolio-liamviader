"use client";

import { ReactNode, useEffect, useState } from "react";
import { HeroImage } from "@/components/home/HeroImage";
import { easeIn, easeOut, motion, useAnimationControls, type Variants } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { SkyButton, WhiteButton } from "./Buttons";

const buttonBaseClasses =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

const heroButtons = {
  primary: `${buttonBaseClasses} bg-sky-500/90 text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400`,
  secondary: `${buttonBaseClasses} inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-sky-400/60 hover:bg-sky-500/10`,
};


interface HeroSectionProps {
  title: ReactNode;
  subtitle: string, 
  projectsButtonText: string,
  contactButtonText: string
}

const titleVariants = {
  initial: { opacity: 0, y: 20, scale: 1, filter: "drop-shadow(0 0 12px rgba(56,189,248,0.01))"},
  animate: { opacity: 1, y: 0, scale: 1, filter: "drop-shadow(0 0 12px rgba(56,189,248,0.01))" },
  hover:   { scale: 1.02, y: -2, filter: "drop-shadow(0 0 12px rgba(56,189,248,0.35))"},
};

export function HeroSection({title, subtitle, projectsButtonText, contactButtonText}: HeroSectionProps){
  const controls = useAnimationControls();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    controls.start("animate", { delay: 1.15, duration: 0.7 });
  }, [controls]);

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-8 lg:gap-16 px-2 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
      <HeroImage/>

      <div className="flex max-w-2xl flex-col items-center gap-8 lg:items-start">
        <motion.h1
          variants={titleVariants}
          onAnimationComplete={() => setReady(true)}
          initial="initial"
          animate={controls}
          // animate -> hover (3s)
          onHoverStart={() =>{
            if (!ready) return;
            controls.start("hover", { duration: 0.25, delay: 0 })
          }}
          // hover -> animate (1s)
          onHoverEnd={() => {
            if (!ready) return;
            controls.start("animate", { duration: 0.2, delay: 0 } )
          }}
          className="whitespace-pre-line text-balance text-4xl font-semibold tracking-tight text-white/95 sm:text-5xl md:text-6xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.7 }}
          className="max-w-2xl text-pretty text-lg text-white/70 sm:text-xl"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.7 }}
          className="flex w-full flex-wrap justify-center gap-4 lg:justify-start"
        >
          <SkyButton href="/projects" text={projectsButtonText}/>
          <WhiteButton href="/contact" text={contactButtonText}/>
        </motion.div>
      </div>
    </div>
  );
}