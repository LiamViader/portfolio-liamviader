"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";

import { usePerfTier } from "@/hooks/usePerfTier";

const BASE_BG   = "rgba(255,255,255,0.05)";
const BASE_BORD = "rgba(255,255,255,0.10)";
const HOVER_BG  = "rgba(56,189,248,0.10)";
const HOVER_BOR = "rgba(56,189,248,0.60)";
const HOVER_SH  = "0 0 30px rgba(56,189,248,0.30)";
const BASE_SH = "0 0 30px rgba(56,189,248,0.01)";



const textVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 8 
  },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: "easeInOut" 
    } 
  },
};

export function InfoCard({
  title,
  info,
  icon,
}: {
  title: string;
  info: string;
  icon?: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const { canHover } = usePerfTier();

  const cardVariants: Variants = canHover
    ? {
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
            duration: 0.6, 
            ease: "easeOut", 
            staggerChildren: 0.15, 
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
          scale: 0.96, 
          transition: { 
            duration: 0.08, 
            ease: "easeOut" 
          } 
        },
      }
    : {
        hidden: { 
          opacity: 0, 
          y: 20, 
          backgroundColor: BASE_BG, 
          borderColor: BASE_BORD, 
        },
        show: { 
          opacity: 1, 
          y: 0,  
          backgroundColor: BASE_BG, 
          borderColor: BASE_BORD, 
          transition: { 
            duration: 0.6, 
            ease: "easeOut", 
            staggerChildren: 0.15, 
          } 
        },
        tap: { 
          scale: 0.96, 
          transition: { 
            duration: 0.08, 
            ease: "easeOut" 
          } 
        },
      };


  return (
    <motion.li
      variants={cardVariants}
      onAnimationComplete={() => setReady(true)}
      whileHover={ready ? "hover" : undefined}
      whileTap={ready ? "tap" : undefined}
      className="rounded-2xl border p-5 backdrop-blur-sm transform-gpu will-change-[transform,opacity] transition-none flex flex-col gap-3"
      style={{
        backgroundColor: BASE_BG,
        borderColor: BASE_BORD,
        pointerEvents: ready ? "auto" : "none",
      }}
    >
      <motion.div
        variants={textVariants}
        className="flex items-center gap-3 text-white"
      >
        {icon && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center rounded-md bg-white/5 p-2"
          >
            {icon}
          </motion.div>
        )}
        <p className="text-xl font-semibold">{title}</p>
      </motion.div>

      <motion.p
        variants={textVariants}
        className="text-sm text-white/60 leading-relaxed"
      >
        {info}
      </motion.p>
    </motion.li>
  );
}
