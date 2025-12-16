"use client";

import clsx from "clsx";
import { ReactNode } from "react";
import { Stack } from "./Stack";
import { motion, type Variants } from "framer-motion";

type Align = "left" | "center";

interface SectionHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  align?: Align;
  variants?: Variants;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  align = "left",
  variants,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={clsx(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      <Stack size="md">
        <motion.h2
          variants={variants}
          className="text-2xl sm:text-3xl font-semibold text-white"
        >
          {title}
        </motion.h2>

        {description && (
          <motion.p
            variants={variants}
            className="text-base sm:text-lg text-white/65"
          >
            {description}
          </motion.p>
        )}
      </Stack>
    </div>
  );
}