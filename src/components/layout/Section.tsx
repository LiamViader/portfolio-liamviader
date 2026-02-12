import clsx from "clsx";
import { ReactNode, forwardRef } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}


export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, className = "", id }, ref) => {
    return (
      <section
        ref={ref}
        id={id}
        className={clsx(
          "py-16 sm:py-20 lg:py-28",
          className
        )}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";