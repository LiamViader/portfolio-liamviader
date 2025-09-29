"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Category = "ai" | "games";

export default function Projects() {
  const [category, setCategory] = useState<Category>("ai");

  const t = useTranslations("ProjectsPage");

  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-8 text-white">{t("projects")}</h1>

      <div
        className={`${
          category === "ai" ? "bg-blue-900" : "bg-green-900"
        } transition-colors duration-500 min-h-screen`}
      >
        <section className="p-8">
          <div className="flex gap-4 mb-6 justify-center">
            <button
              className={`px-4 py-2 rounded ${
                category === "ai" ? "bg-blue-600" : "bg-gray-700"
              }`}
              onClick={() => setCategory("ai")}
            >
              {t("ai")}
            </button>
            <button
              className={`px-4 py-2 rounded ${
                category === "games" ? "bg-green-600" : "bg-gray-700"
              }`}
              onClick={() => setCategory("games")}
            >
              {t("games")}
            </button>
          </div>

        </section>
      </div>
    </div>
  );
}
