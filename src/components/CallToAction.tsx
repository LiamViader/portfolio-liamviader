"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CallToAction() {
  const t = useTranslations("ProjectsPage");

  return (
    <section className="relative py-24 px-4 mt-20">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-64 w-full max-w-3xl rounded-full bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/15 to-cyan-500/20 blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto text-center border border-white/10 bg-white/[0.02] backdrop-blur-sm rounded-3xl p-12 shadow-lg shadow-black/20">
        <h2 className="text-2xl md:text-4xl font-extrabold mb-6 tracking-tight text-white">
          {t("cta_title")}
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
          {t("cta_text")}
        </p>
        <div className="flex justify-center gap-4 md:gap-6 flex-wrap">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-cyan-500/90 hover:bg-cyan-500 text-gray-900 font-semibold py-3 px-8 rounded-xl transition duration-300 transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            {t("cta_button_contact")}
          </Link>
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-white/40 text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-xl transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            {t("cta_button_cv")}
          </a>
        </div>
      </div>
    </section>
  );
}

