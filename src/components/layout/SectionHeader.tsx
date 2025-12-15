import clsx from "clsx";
import { ReactNode } from "react";
import { Stack } from "./Stack";

type Align = "left" | "center";

export function SectionHeader({
  title,
  description,
  align = "left",
}: {
  title: ReactNode;
  description?: ReactNode;
  align?: Align;
}) {
  return (
    <div
      className={clsx(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      <Stack size="md">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white">
          {title}
        </h2>

        {description && (
          <p className="text-base sm:text-lg text-white/65">
            {description}
          </p>
        )}
      </Stack>
    </div>
  );
}
