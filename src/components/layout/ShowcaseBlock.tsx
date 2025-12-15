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
    <div className={clsx("mx-auto max-w-[1400px]", className)}>
      {children}
    </div>
  );
}
