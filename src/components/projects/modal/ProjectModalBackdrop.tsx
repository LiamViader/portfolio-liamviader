import { motion } from "framer-motion";

import BlobsBackground from "@/components/BlobsBackground";

interface ProjectModalBackdropProps {
  closing: boolean;
  passThrough: boolean;
  onClose: () => void;
}

export function ProjectModalBackdrop({ closing, passThrough, onClose }: ProjectModalBackdropProps) {
  return (
    <motion.div
      key="backdrop"
      className={`fixed inset-0 z-[990] bg-black/60 backdrop-blur-md ${passThrough ? "pointer-events-none" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: closing ? 0.3 : 0.25, ease: "easeOut", delay: closing ? 0.1 : 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <BlobsBackground />
      </div>
    </motion.div>
  );
}
