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
      className={`fixed inset-0 z-[990] overflow-hidden ${passThrough ? "pointer-events-none" : "cursor-pointer"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: closing ? 0.32 : 0.28, ease: "easeOut", delay: closing ? 0.08 : 0 }}
      onClick={onClose}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-slate-950/65 via-slate-950/40 to-slate-900/30 backdrop-blur-[14px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <div className="absolute inset-0 z-10 opacity-80">
        <BlobsBackground />
      </div>
      <motion.div
        aria-hidden
        className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950/50 via-slate-950/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
      />
    </motion.div>
  );
}
