"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useAnimation, Variants } from "framer-motion";
import { TranslatedProject } from "@/data/projects";

interface ModalPortalProps {
  project: TranslatedProject;
  originRect: DOMRect;
  onRevealOrigin?: () => void; // ← nuevo
  onClose: () => void;
}

const contentContainerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, when: "beforeChildren", staggerChildren: 0.08, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: "easeIn" } },
};

export function ProjectModalPortal({ project, originRect, onRevealOrigin, onClose }: ModalPortalProps) {
  const controls = useAnimation();
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const modalWidth = Math.min(window.innerWidth - 48, 960);
    const modalHeight = Math.min(window.innerHeight - 160, 800);
    const targetLeft = Math.max(24, (window.innerWidth - modalWidth) / 2);
    const targetTop = Math.max(48, (window.innerHeight - modalHeight) / 6);

    controls.set({
      left: originRect.left,
      top: originRect.top,
      width: originRect.width,
      height: originRect.height,
      opacity: 1,
      borderRadius: 16,
    });

    controls.start({
      left: targetLeft,
      top: targetTop,
      width: modalWidth,
      height: modalHeight,
      opacity: 1,
      borderRadius: 16,
      transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
    });

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [controls, originRect]);

  const handleClose = async () => {
    if (closing) return;
    setClosing(true);

    // 1) Encoge sin perder opacidad
    await controls.start({
      left: originRect.left,
      top: originRect.top,
      width: originRect.width,
      height: originRect.height,
      opacity: 1,
      borderRadius: 16,
      transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
    });

    // 2) Justo aquí — la card debe reaparecer sin animación
    onRevealOrigin?.();

    // 3) Fade final del panel ya encogido
    await controls.start({
      opacity: 0,
      transition: { duration: 0.1, ease: "easeOut" },
    });

    onClose();
  };

  const portal = (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[990] bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={{ duration: closing ? 0.3 : 0.25, ease: "easeOut", delay: closing ? 0.1 : 0 }}
        onClick={handleClose}
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 blur-3xl opacity-60"
            animate={{
              background: [
                "radial-gradient(circle at 20% 30%, #6366F1 0%, transparent 60%)",
                "radial-gradient(circle at 80% 70%, #8B5CF6 0%, transparent 60%)",
                "radial-gradient(circle at 50% 50%, #6366F1 0%, transparent 60%)",
              ],
              rotate: [0, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>

      {/* Panel/Contenedor: NO se desvanece hasta el final (lo controla controls) */}
      <motion.div
        animate={controls}
        initial={false}
        style={{
          position: "fixed",
          zIndex: 99999,
          boxShadow: "0 25px 70px rgba(0,0,0,0.6)",
          borderRadius: 16,
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel siempre opaco durante el shrink */}
        <div className="w-full h-full bg-gray-900 rounded-2xl border border-white/10 text-white flex flex-col">
          {/* Contenido: se desvanece desde el comienzo del cierre */}
          <motion.div
            variants={contentContainerVariants}
            initial="hidden"
            animate={closing ? "exit" : "visible"}
            className="flex-1 flex flex-col"
          >
            <motion.header
              className="flex justify-between items-start p-6 md:p-8 border-b border-white/10 sticky top-0 z-20 bg-gray-900/90 backdrop-blur-md"
              variants={itemVariants}
            >
              <div>
                <h1 className="text-3xl font-extrabold text-indigo-400">{project.title}</h1>
                {project.role && <p className="text-sm text-gray-400 mt-1">{project.role}</p>}
              </div>
              <button
                onClick={handleClose}
                aria-label="Cerrar"
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.header>

            <motion.div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 space-y-6" variants={itemVariants}>
              <p className="text-gray-300 whitespace-pre-line mt-2">{project.full_description}</p>

              {project.detailed_media?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.detailed_media.map((url, idx) => (
                    <motion.img
                      key={idx}
                      src={url}
                      alt={`Detalle ${idx + 1}`}
                      className="w-full rounded-lg shadow-xl"
                      variants={itemVariants}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              )}

              <h2 className="text-2xl font-bold mt-4">Tecnologías y Enlaces</h2>

              <div className="flex flex-wrap gap-3">
                {project.tags?.map((tag) => (
                  <motion.span key={tag} className="text-sm px-3 py-1 bg-indigo-700 rounded-full text-white font-medium" variants={itemVariants}>
                    {tag}
                  </motion.span>
                ))}
              </div>

              <div className="flex gap-4 mt-4">
                {project.github_url && (
                  <motion.a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    variants={itemVariants}
                  >
                    GitHub
                  </motion.a>
                )}
                {project.live_url && (
                  <motion.a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    variants={itemVariants}
                  >
                    Demo en Vivo
                  </motion.a>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(portal, document.body);
}
