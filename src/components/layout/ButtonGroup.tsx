import clsx from "clsx";
import { ReactNode } from "react";

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export function ButtonGroup({ 
  children, 
  className = "", 
  align = "left" 
}: ButtonGroupProps) {
  return (
    <div
      className={clsx(
        "flex flex-wrap gap-4",
        align === "center" && "justify-center",
        align === "right" && "justify-end",
        align === "left" && "justify-start",
        className
      )}
    >
      {children}
    </div>
  );
}