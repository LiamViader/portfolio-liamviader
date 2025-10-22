"use client";

import { Link, usePathname } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2">
      <Link href={pathname} locale="en" className="px-3 py-1 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10 rounded">
        EN
      </Link>
      <Link href={pathname} locale="es" className="px-3 py-1 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10 rounded h">
        ES
      </Link>
    </div>
  );
}
