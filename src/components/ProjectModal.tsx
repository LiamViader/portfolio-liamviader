"use client";

import { TranslatedProject } from "@/data/projects";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect } from "react";
import { useModal } from "@/providers/ModalContext";

interface ProjectModalProps {
  project: TranslatedProject | null;
  onClose: () => void;
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.08,
      ease: "easeOut",
    },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } },
};

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { setIsModalOpen } = useModal();

  if (!project) return null;

  const cardId = `card-${project.id}`;

  useEffect(() => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "";
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-md"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleClose}
      >
        {/* 🌈 Fondo animado discreto (corregido) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 blur-3xl"
            animate={{
              background: [
                "radial-gradient(circle at 20% 30%, #6366F1 0%, transparent 60%)",
                "radial-gradient(circle at 80% 70%, #8B5CF6 0%, transparent 60%)",
                "radial-gradient(circle at 50% 50%, #6366F1 0%, transparent 60%)",
              ],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* 🪄 Contenedor principal */}
        <motion.div
          key={project.id}
          layoutId={cardId}
          className="relative z-10 mt-20 mb-20 max-w-4xl w-full bg-gray-900/90 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-10 border border-white/10 min-h-fit"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <motion.header
            className="flex justify-between items-start mb-8"
            variants={itemVariants}
          >
            <div>
              <h1 className="text-4xl font-extrabold text-indigo-400">
                {project.title}
              </h1>
              <p className="text-lg text-gray-400 mt-1">{project.role}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </motion.header>

          {/* Contenido */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <p className="text-gray-300 whitespace-pre-line">
              {project.full_description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.detailed_media.map((mediaUrl, idx) => (
                <motion.img
                  key={idx}
                  src={mediaUrl}
                  alt={`Detalle ${idx + 1}`}
                  className="w-full rounded-lg shadow-xl"
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>

            <h2 className="text-2xl font-bold mt-10">Tecnologías y Enlaces</h2>
            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag) => (
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
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  variants={itemVariants}
                >
                  Demo en Vivo
                </motion.a>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
