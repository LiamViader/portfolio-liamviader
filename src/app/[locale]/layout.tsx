import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import LayoutContent from "@/components/LayoutContent";
import getRequestConfig from '@/i18n/request'; 

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata({ 
		params,
}: { 
		params: { locale: string } | Promise<{ locale: string }> 
}): Promise<Metadata> {
	const resolvedParams = await params;
	const { locale } = resolvedParams;
	
	const t = await getTranslations({ 
			locale, 
			namespace: 'Metadata' 
	});

	return {
		title: t('title'),
		description: t('description'),

	};
}



export default async function RootLayout({
	children,
	params, 
}: {
	children: React.ReactNode;
	params: { locale: string } | Promise<{ locale: string }>; 
}) {
	
	const resolvedParams = await params;
	const { locale } = resolvedParams;

	const localePromise = Promise.resolve(locale);

	let messages = (await getRequestConfig({ requestLocale: localePromise })).messages;



	return (
		<html lang={locale}>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white min-h-screen flex flex-col`}>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<LayoutContent>
							{children} 
					</LayoutContent>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}