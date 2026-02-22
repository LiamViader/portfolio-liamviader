import cn from "clsx";
import { forwardRef, ReactNode, HTMLAttributes } from "react";

interface EyebrowProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export const Eyebrow = forwardRef<HTMLParagraphElement, EyebrowProps>(
  ({ children, align = "left", className, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        {...props}
        className={cn(
          "uppercase tracking-[0.3em] ",
          align === "center" && "text-center",
          className
        )}
      >
        {children}
      </h2>
    );
  }
);

Eyebrow.displayName = "Eyebrow";