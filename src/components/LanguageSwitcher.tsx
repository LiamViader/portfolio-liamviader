"use client";

import { Link, usePathname } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2">
      <Link href={pathname} locale="en" className="px-3 py-1 bg-white/20 backdrop-blur-xl hover:bg-white/30 rounded">
        EN
      </Link>
      <Link href={pathname} locale="es" className="px-3 py-1 bg-white/20 backdrop-blur-xl hover:bg-white/30 rounded h">
        ES
      </Link>
    </div>
  );
}
