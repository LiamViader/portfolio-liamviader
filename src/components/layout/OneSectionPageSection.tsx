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
        "pt-24 sm:pt-28 lg:pt-36 pb-24 sm:pb-32 lg:pb-40",
        className
      )}
    >
      {children}
    </section>
  );
}