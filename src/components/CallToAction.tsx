"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CallToAction() {
  const t = useTranslations("ProjectsPage");

  return (
    <section className="relative px-4 pb-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.2),_transparent_65%)]" />
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-12 text-center shadow-[0_30px_50px_-35px_rgba(56,189,248,0.65)] backdrop-blur">
        <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />

        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">{t("cta_title")}</h2>
          <p className="text-balance text-base text-white/70 md:text-lg">{t("cta_text")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-sky-500/90 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              {t("cta_button_contact")}
            </Link>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
            >
              {t("cta_button_cv")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

