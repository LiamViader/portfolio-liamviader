// ProjectModalPortal.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useAnimation, Variants } from "framer-motion";
import { TranslatedProject } from "@/data/projects";
import CustomScrollArea from "./CustomScrollArea";
import { measureStableRect } from "@/utils/measureStableRect";

interface ModalPortalProps {
  project: TranslatedProject;
  originRect: DOMRect;
  originEl?: HTMLElement;
  onRevealOrigin?: () => void;
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

export function ProjectModalPortal({
  project,
  originRect,
  originEl,
  onRevealOrigin,
  onClose,
}: ModalPortalProps) {
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [closing, setClosing] = useState(false);
  const [passThrough, setPassThrough] = useState(false);

  const r = (n: number) => Math.round(n);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const ease = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic

  useEffect(() => {
    const modalWidth = Math.min(window.innerWidth - 48, 960);
    const modalHeight = Math.min(window.innerHeight - 160, 800);
    const targetLeft = Math.max(24, (window.innerWidth - modalWidth) / 2);
    const targetTop = Math.max(48, (window.innerHeight - modalHeight) / 6);

    controls.set({
      left: r(originRect.left),
      top: r(originRect.top),
      width: r(originRect.width),
      height: r(originRect.height),
      opacity: 1,
      borderRadius: 16,
    });

    controls.start({
      left: r(targetLeft),
      top: r(targetTop),
      width: r(modalWidth),
      height: r(modalHeight),
      opacity: 1,
      borderRadius: 16,
      transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
    });
  }, [controls, originRect]);

  const handleClose = async () => {
    if (closing) return;
    setClosing(true);
    setPassThrough(true); // deja pasar el scroll al fondo durante el cierre

    // 1) Encogido con seguimiento continuo (FLIP con rAF)
    const duration = 450; // ms
    const startTime = performance.now();

    const current = (controls as any).get?.() ?? {};
    const startRect =
      containerRef.current?.getBoundingClientRect() ??
      new DOMRect(
        current.left ?? originRect.left,
        current.top ?? originRect.top,
        current.width ?? originRect.width,
        current.height ?? originRect.height
      );

    const r = (n: number) => Math.round(n);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic

    await new Promise<void>((resolve) => {
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const k = ease(t);

        const liveTarget = originEl ? measureStableRect(originEl) : originRect;

        controls.set({
          left: r(lerp(startRect.left,   liveTarget.left,   k)),
          top:  r(lerp(startRect.top,    liveTarget.top,    k)),
          width:  r(lerp(startRect.width,  liveTarget.width,  k)),
          height: r(lerp(startRect.height, liveTarget.height, k)),
          opacity: 1, // mantener opaco durante el shrink
          borderRadius: 16,
        });

        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });

    // 2) La card reaparece ya encajados
    onRevealOrigin?.();

    // 3) Fade final PERO siguiendo la card mientras dura el fade
    let follow = true;
    const followTick = () => {
      if (!follow) return;
      const liveTarget = originEl ? measureStableRect(originEl) : originRect;
      controls.set({
        left: r(liveTarget.left),
        top: r(liveTarget.top),
        width: r(liveTarget.width),
        height: r(liveTarget.height),
        borderRadius: 16,
        // no tocamos opacity aquí: la anima framer
      });
      requestAnimationFrame(followTick);
    };
    requestAnimationFrame(followTick);

    await controls.start({
      opacity: 0,
      transition: { duration: 0.12, ease: "easeOut" },
    });

    follow = false; // cortar el seguimiento
    onClose();
  };

  const portal = (
    <AnimatePresence>
      {/* Backdrop (passThrough permite scroll del fondo) */}
      <motion.div
        className={`fixed inset-0 z-[990] bg-black/60 backdrop-blur-md ${
          passThrough ? "pointer-events-none" : ""
        }`}
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

      {/* Contenedor del modal (pos: fixed, sin transforms; movemos con left/top/width/height) */}
      <motion.div
        ref={containerRef}
        animate={controls}
        initial={false}
        style={{
          position: "fixed",
          zIndex: 99999,
          boxShadow: "0 25px 70px rgba(0,0,0,0.6)",
          borderRadius: 16,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
        className={`bg-gray-900 rounded-2xl border border-white/10 ${
          passThrough ? "pointer-events-none" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          variants={contentContainerVariants}
          initial="hidden"
          animate={closing ? "exit" : "visible"}
          className="flex flex-col h-full text-white"
        >
          <motion.header
            className="flex justify-between items-start p-6 md:p-8 border-b border-white/10 sticky top-0 z-20 bg-gray-900"
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

          <CustomScrollArea className="flex-1" topOffset={16} bottomOffset={16}>
            <motion.div className="px-6 md:px-8 pb-8 space-y-6" variants={itemVariants}>
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
                  <motion.span
                    key={tag}
                    className="text-sm px-3 py-1 bg-indigo-700 rounded-full text-white font-medium"
                    variants={itemVariants}
                  >
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
          </CustomScrollArea>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(portal, document.body);
}
