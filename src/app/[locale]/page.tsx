"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Home() {
	const t = useTranslations("HomePage");

	return (
		<section className="flex min-h-[80vh] flex-col items-center justify-center">
			<h1 className="text-5xl font-bold mb-6">{t("title")}</h1>
			<p className="text-lg text-gray-300 mb-10">{t("subtitle")}</p>
			<div className="flex gap-6">
				<Link
					href="/projects"
					className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
				>
					{t("ai")}
				</Link>
				<Link
					href="/projects"
					className="px-6 py-3 bg-green-600 rounded-xl hover:bg-green-700 transition"
				>
					{t("games")}
				</Link>
			</div>
		</section>
	);
}
