"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "./ScrollReveal";

export default function CallToAction() {
  const t = useTranslations("ProjectsPage");

  return (
    <section className="relative px-4 py-24 ">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/40 to-gray-950" />
      <ScrollReveal className="w-full">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-12 text-center shadow-[0_20px_10px_-30px_rgba(56,189,248,0.6)] backdrop-blur-sm">

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
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-sky-400/60 hover:bg-sky-500/10"
              >
                {t("cta_button_cv")}
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

