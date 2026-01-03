"use client";

import clsx from "clsx";
import { ReactNode } from "react";
import { Stack } from "./Stack";
import { motion, type Variants } from "framer-motion";

type Align = "left" | "center";

interface SectionHeaderShadowProps {
  title: ReactNode;
  description?: ReactNode;
  align?: Align;
  variants?: Variants;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionHeaderShadow({
  title,
  description,
  align = "left",
  variants,
  className,
  subtitleClassName,
  titleClassName,
}: SectionHeaderShadowProps) {
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
          className={clsx("text-2xl sm:text-3xl font-semibold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,1)]", titleClassName)}
        >
          {title}
        </motion.h2>

        {description && (
          <motion.p
            variants={variants}
            className={clsx("text-base sm:text-lg text-white/80 drop-shadow-[0_4px_4px_rgba(0,0,0,1)]", subtitleClassName)}
          >
            {description}
          </motion.p>
        )}
      </Stack>
    </div>
  );
}