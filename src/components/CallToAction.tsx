"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CallToAction() {
  const t = useTranslations("ProjectsPage");

  return (
    <section className="w-full rounded-3xl border border-white/10 bg-black/40 px-6 py-16 text-center shadow-2xl backdrop-blur md:px-10 md:py-20">
      <h2 className="text-2xl font-extrabold tracking-tight md:text-4xl">{t("cta_title")}</h2>
      <p className="mt-4 text-base text-gray-300 md:text-lg">{t("cta_text")}</p>

      <div className="mt-10 flex flex-wrap justify-center gap-4 md:gap-6">
        <Link
          href="/contact"
          className="rounded-full bg-cyan-400 px-8 py-3 font-semibold text-gray-900 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-300"
        >
          {t("cta_button_contact")}
        </Link>
        <a
          href="/cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/40 px-8 py-3 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
        >
          {t("cta_button_cv")}
        </a>
      </div>
    </section>
  );
}
