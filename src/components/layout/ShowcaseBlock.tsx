import clsx from "clsx";
import { ReactNode } from "react";

export function ShowcaseBlock({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("mx-auto max-w-8xl", className)}>
      {children}
    </div>
  );
}
