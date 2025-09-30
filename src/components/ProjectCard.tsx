import { TranslatedProject } from '@/data/projects';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: TranslatedProject;
  onClick: () => void; 
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <motion.div
      layoutId={`card-${project.id}`}
      onClick={onClick}
      className="relative overflow-hidden rounded-xl bg-gray-800 shadow-2xl transition-transform hover:scale-[1.03] cursor-pointer"
    >
      <img 
        src={project.media_preview} 
        alt={project.title} 
        className="w-full h-48 object-cover" // Altura fija por ahora
      />


      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.short_description}</p>
        
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map(tag => ( // Muestra solo 3 tags principales
            <span key={tag} className="text-xs px-2 py-0.5 bg-indigo-600 rounded-full text-white font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}