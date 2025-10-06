"use client";

import { useTranslations } from "next-intl";

export default function CallToAction() {
	const t = useTranslations("ProjectsPage");

	return (
		<section className="text-center py-24 px-4 mt-20 max-w-4xl mx-auto border-t border-white/20">
			<h2 className="text-2xl md:text-4xl font-extrabold mb-4 tracking-tight">
				{t("cta_title")}
			</h2>
			<p className="text-lg text-gray-400 mb-8">
				{t("cta_text")}
			</p>
			<div className="flex justify-center gap-6 flex-wrap">
				<a 
					href="/contact" 
					className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-[1.03] shadow-lg"
				>
					{t("cta_button_contact")}
				</a>
				<a 
					href="/cv.pdf" 
					target="_blank" 
					rel="noopener noreferrer" 
					className="border border-white/50 text-white hover:bg-white/10 font-bold py-3 px-8 rounded-lg transition duration-300"
				>
					{t("cta_button_cv")}
				</a>
			</div>
		</section>
	);
}