import clsx from "clsx";
import { ReactNode } from "react";

export function LastSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        "py-16 sm:py-20 lg:py-28 pb-24 sm:pb-32 lg:pb-40",
        className
      )}
    >
      {children}
    </section>
  );
}