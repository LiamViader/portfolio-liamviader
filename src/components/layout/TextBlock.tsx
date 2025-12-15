import clsx from "clsx";
import { ReactNode } from "react";

export function TextBlock({
  children,
  className = "",
  center = false,
  big = false,
}: {
  children: ReactNode;
  className?: string;
  center?: boolean;
  big?: boolean;
}) {
  return (
    <div
      className={clsx(
        big && "max-w-4xl",
        !big && "max-w-3xl",
        center && "mx-auto text-center",
        !center && "text-left",
        className
      )}
    >
      {children}
    </div>
  );
}