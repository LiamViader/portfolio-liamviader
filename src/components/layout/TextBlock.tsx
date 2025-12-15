import clsx from "clsx";
import { ReactNode } from "react";

export function TextBlock({
  children,
  className = "",
  center = false,
}: {
  children: ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <div
      className={clsx(
        "max-w-2xl",
        center && "mx-auto text-center",
        !center && "text-left",
        className
      )}
    >
      {children}
    </div>
  );
}