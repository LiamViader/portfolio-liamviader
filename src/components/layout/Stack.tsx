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
        {
          sm: "space-y-3 sm:space-y-4",
          md: "space-y-5 sm:space-y-6",
          lg: "space-y-8 sm:space-y-10",
        }[size],
        className
      )}
    >
      {children}
    </div>
  );
}