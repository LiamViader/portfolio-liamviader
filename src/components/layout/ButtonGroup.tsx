import clsx from "clsx";
import { ReactNode } from "react";

type Alignment = "left" | "center" | "right";

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
  align?: Alignment | { 
    base?: Alignment; 
    sm?: Alignment; 
    md?: Alignment; 
    lg?: Alignment; 
    xl?: Alignment; 
  };
}

const alignClasses: Record<Alignment, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export function ButtonGroup({ 
  children, 
  className = "", 
  align = "left" 
}: ButtonGroupProps) {
  
  const alignmentClass = typeof align === "string" 
    ? alignClasses[align]
    : clsx( 
        align.base && alignClasses[align.base],
        align.sm && `sm:${alignClasses[align.sm]}`,
        align.md && `md:${alignClasses[align.md]}`,
        align.lg && `lg:${alignClasses[align.lg]}`,
        align.xl && `xl:${alignClasses[align.xl]}`
      );

  return (
    <div
      className={clsx(
        "flex flex-wrap gap-4",
        alignmentClass, 
        className
      )}
    >
      {children}
    </div>
  );
}