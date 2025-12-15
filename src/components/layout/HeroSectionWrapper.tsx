import clsx from "clsx";
import { ReactNode } from "react";

export function HeroSectionWrapper({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        "pt-24 sm:pt-28 lg:pt-36 pb-16 sm:pb-20 lg:pb-28",
        className
      )}
    >
      {children}
    </section>
  );
}