import clsx from "clsx";
import { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "mx-auto w-full px-4 sm:px-6 lg:px-12",
        className
      )}
    >
      {children}
    </div>
  );
}


