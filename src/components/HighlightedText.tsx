"use client";

import React from "react";
import { motion } from "framer-motion";
import type { ParsedNode } from "@/utils/parseHighlights";
import { HIGHLIGHT_STYLES } from "@/utils/highlightStyle";

export interface HighlightedTextProps {
  nodes: ParsedNode[];
}

export function HighlightedText({ nodes }: HighlightedTextProps) {
  return (
    <>
      {nodes.map((node, i) => {
        // Si es texto normal → render normal
        if (typeof node === "string") {
          return <span key={i}>{node}</span>;
        }

        // Si es highlight
        const { type, content } = node;

        const styleClass =
          HIGHLIGHT_STYLES[type ?? "default"] ?? HIGHLIGHT_STYLES.default;

        return (
          <motion.span
            key={i}
            className={styleClass}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.20 }}
          >
            {content}
          </motion.span>
        );
      })}
    </>
  );
}
