import clsx from "clsx";
import { forwardRef, ReactNode, HTMLAttributes } from "react";

type StackSize = "xs" | "sm" | "md" | "lg" | "xl";

interface EyebrowProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  size?: StackSize;
  className?: string;
}

export const Stack = forwardRef<HTMLParagraphElement, EyebrowProps>(
  ({ children, size = "md", className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "flex flex-col",
          {
            xs: "gap-2 sm:gap-3",
            sm: "gap-3 sm:gap-4",
            md: "gap-5 sm:gap-6",
            lg: "gap-8 sm:gap-10",
            xl: "gap-10 sm:gap-12 lg:gap-16",
          }[size],
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = "Stack";
