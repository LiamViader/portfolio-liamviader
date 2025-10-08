import { TranslatedProject } from '@/data/projects';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ProjectCardProps {
  project: TranslatedProject;
  onClick: () => void; 
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [isHoverEnabled, setIsHoverEnabled] = useState(true);

  return (
    <motion.div
      layoutId={`card-${project.id}`}
      onClick={onClick}
      className="relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-lg shadow-2xl cursor-pointer"
      transition={{ type: 'spring', stiffness: 200, damping: 70 }}
      whileHover={isHoverEnabled ? { scale: 1.1 } : undefined} // ✅ Solo aplicar hover si está habilitado
    >
      <img
        src={project.media_preview}
        alt={project.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.short_description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-indigo-600 rounded-full text-white font-medium">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

