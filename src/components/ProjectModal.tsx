// src/components/ProjectModal.tsx
import { TranslatedProject } from '@/data/projects';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useModal } from '@/providers/ModalContext';

interface ProjectModalProps {
  project: TranslatedProject | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {

  if (!project) return null;

  const { setIsModalOpen } = useModal();

  const cardId = `card-${project.id}`;

  useEffect(() => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";

  }, []);

  const handleClose = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "";
    onClose();
  };

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={project.id}
        layoutId={cardId}
        className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/95 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="max-w-4xl mx-auto p-6 md:p-10 text-white">
          <header className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-indigo-400">{project.title}</h1>
              <p className="text-lg text-gray-400 mt-1">{project.role}</p>
            </div>
            <button onClick={handleClose} className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div className="space-y-8">
            <p className="text-gray-300 whitespace-pre-line">{project.full_description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.detailed_media.map((mediaUrl, idx) => (
                <img key={idx} src={mediaUrl} alt={`Detalle ${idx + 1}`} className="w-full rounded-lg shadow-xl" />
              ))}
            </div>

            <h2 className="text-2xl font-bold mt-10">Tecnologías y Enlaces</h2>
            <div className="flex flex-wrap gap-3">
              {project.tags.map(tag => (
                <span key={tag} className="text-sm px-3 py-1 bg-indigo-700 rounded-full text-white font-medium">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-4 mt-4">
              {project.github_url && (
                <a href={project.github_url} target="_blank" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">GitHub</a>
              )}
              {project.live_url && (
                <a href={project.live_url} target="_blank" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">Demo en Vivo</a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
