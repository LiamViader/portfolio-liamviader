"use client";

import clsx from "clsx";
import { ReactNode } from "react";
import { Stack } from "./Stack";
import { motion, type Variants } from "framer-motion";

type Align = "left" | "center";

interface SectionHeaderBigProps {
  title: ReactNode;
  description?: ReactNode;
  align?: Align;
  variants?: Variants;
  className?: string;
  subtitleClassName?: string;
  titleClassName?: string;
}

export function SectionHeaderBig({
  title,
  description,
  align = "left",
  variants,
  className,
  subtitleClassName,
  titleClassName,
}: SectionHeaderBigProps) {
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
          className={clsx("text-3xl sm:text-4xl font-semibold text-white", titleClassName)}
        >
          {title}
        </motion.h2>

        {description && (
          <motion.p
            variants={variants}
            className={clsx("text-lg sm:text-xl text-white/65", subtitleClassName)}
          >
            {description}
          </motion.p>
        )}
      </Stack>
    </div>
  );
}