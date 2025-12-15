import clsx from "clsx";
import { ReactNode } from "react";

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        "py-16 sm:py-20 lg:py-28",
        className
      )}
    >
      {children}
    </section>
  );
}