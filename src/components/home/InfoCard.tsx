import { motion, Variants } from "framer-motion";
import { useState } from "react";

const BASE_BG   = "rgba(255,255,255,0.05)";
const BASE_BORD = "rgba(255,255,255,0.10)";
const HOVER_BG  = "rgba(56,189,248,0.10)";
const HOVER_BOR = "rgba(56,189,248,0.60)";
const HOVER_SH  = "0 0 30px rgba(56,189,248,0.30)";
const BASE_SH = "0 0 30px rgba(56,189,248,0.01)";

const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    backgroundColor: BASE_BG, 
    borderColor: BASE_BORD, 
    boxShadow: BASE_SH
  },
  show: { 
    opacity: 1, 
    y: 0,  
    backgroundColor: BASE_BG, 
    borderColor: BASE_BORD, 
    boxShadow: BASE_SH,
    transition: { 
      duration: 0.5, 
      ease: "easeOut", 
      staggerChildren: 0.1, 
    } 
  },
  hover: { 
    y: -10, 
    backgroundColor: HOVER_BG, 
    borderColor: HOVER_BOR, 
    boxShadow: HOVER_SH,
    transition: { 
      duration: 0.25, 
      ease: "easeOut" 
    } 
  },
  tap: { 
    y: -2, 
    transition: { 
      duration: 0.08, 
      ease: "easeOut" 
    } 

  },
};

const textVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 8 
  },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.2, 
      ease: "easeInOut" 
    } 
  },
};

export function InfoCard({ title, info }: { title: string; info: string }) {
  const [ready, setReady] = useState(false);

  return (
    <motion.li
      variants={cardVariants}
      onAnimationComplete={() => setReady(true)}
      whileHover={ready ? "hover" : undefined}
      whileTap={ready ? "tap" : undefined}
      className="rounded-2xl border p-5 backdrop-blur-sm transform-gpu will-change-[transform, opacity] transition-none"
      style={{
        backgroundColor: BASE_BG,
        borderColor: BASE_BORD,
        pointerEvents: ready ? "auto" : "none",
      }}
    >
      <motion.p variants={textVariants} className="text-2xl font-semibold text-white transition-none will-change-[transform, opacity]">{title}</motion.p>
      <motion.p variants={textVariants} className="mt-2 text-sm text-white/60 transition-none will-change-[transform, opacity]">{info}</motion.p>
    </motion.li>
  );
}
