import clsx from "clsx";
import { ReactNode } from "react";

export function OneSectionPageSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        "pt-24 sm:pt-28 lg:pt-36 pb-24 sm:pb-26 lg:pb-32",
        className
      )}
    >
      {children}
    </section>
  );
}