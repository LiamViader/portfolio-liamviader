import { Variants } from "framer-motion";

export const modalContentVariants: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, when: "beforeChildren", staggerChildren: 0.08, ease: "easeOut" },
  },
  exit: { opacity: 0, y: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

export const modalItemVariants: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: 0, transition: { duration: 0.3, ease: "easeIn" } },
};

export const modalItemVariants2: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: 0, transition: { duration: 0.3, ease: "easeIn" } },
};