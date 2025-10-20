"use client";

import { motion } from "framer-motion";
import CustomScrollArea from "@/components/CustomScrollArea";
import { TranslatedProject } from "@/data/projects";

// Puedes ajustar estos variants en tu archivo "animations".
// Aquí los defino inline por claridad:
const modalContentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      delay: 0.18,          // 👈 pequeño retraso para revelar DESPUÉS de que el shell “llegue”
      when: "beforeChildren",
      staggerChildren: 0.06 // 👈 los items se revelan en cascada
    },
  },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

const modalItemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22 },
  },
  exit: { opacity: 0, y: 6, transition: { duration: 0.16 } },
};

interface ProjectModalContentProps {
  project: TranslatedProject;
  closing: boolean;
  onClose: () => void;
}

export function ProjectModalContent({
  project,
  closing,
  onClose,
}: ProjectModalContentProps) {
  const media = project.detailed_media ?? [];
  const tags = project.tags ?? [];

  return (
    <motion.div
      variants={modalContentVariants}
      initial="hidden"
      animate={closing ? "exit" : "visible"}
      className="flex flex-col h-full text-white"
    >
      <motion.header
        className="flex justify-between items-start p-6 md:p-8 border-b border-white/10 sticky top-0 z-20 bg-gray-900"
        variants={modalItemVariants}
      >
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-400">{project.title}</h1>
          {project.role && (
            <p className="text-sm text-gray-400 mt-1">{project.role}</p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="p-2 text-gray-300 hover:text-white transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.header>

      <CustomScrollArea className="flex-1" topOffset={16} bottomOffset={16}>
        <motion.div className="px-6 md:px-8 pb-8 space-y-6" variants={modalItemVariants}>
          <p className="text-gray-300 whitespace-pre-line mt-2">
            {project.full_description}
          </p>

          {media.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {media.map((url, idx) => (
                <motion.img
                  key={`${project.id}-media-${idx}`} // 👈 evita duplicados aunque se repita la URL
                  src={url}
                  alt={`Detalle ${idx + 1}`}
                  className="w-full rounded-lg shadow-xl"
                  variants={modalItemVariants}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          )}

          <h2 className="text-2xl font-bold mt-4">Tecnologías y Enlaces</h2>

          <div className="flex flex-wrap gap-3">
            {tags.map((tag, idx) => (
              <motion.span
                key={`${project.id}-tag-${idx}`} // 👈 key estable
                className="text-sm px-3 py-1 bg-indigo-700 rounded-full text-white font-medium"
                variants={modalItemVariants}
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
                variants={modalItemVariants}
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
                variants={modalItemVariants}
              >
                Demo en Vivo
              </motion.a>
            )}
          </div>
        </motion.div>
      </CustomScrollArea>
    </motion.div>
  );
}
