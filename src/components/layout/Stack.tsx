import clsx from "clsx";
import { ReactNode } from "react";

type StackSize = "sm" | "md" | "lg";

export function Stack({
  children,
  size = "md",
  className = "",
}: {
  children: ReactNode;
  size?: StackSize;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col",
        {
          sm: "gap-3 sm:gap-4",
          md: "gap-5 sm:gap-6",
          lg: "gap-8 sm:gap-10",
        }[size],
        className
      )}
    >
      {children}
    </div>
  );
}