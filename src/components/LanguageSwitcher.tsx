"use client";

import { Link, usePathname } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2">
      <Link href={pathname} locale="en" className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-300 transition">
        EN
      </Link>
      <Link href={pathname} locale="es" className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-300 transition">
        ES
      </Link>
    </div>
  );
}
