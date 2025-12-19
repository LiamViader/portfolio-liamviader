import clsx from "clsx";
import { ReactNode } from "react";

export function ContentBlock({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("mx-auto max-w-6xl z-10 relative", className)}>
      {children}
    </div>
  );
}