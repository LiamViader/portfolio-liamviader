import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import Navbar from "../../components/Navbar";

import getRequestConfig from '@/i18n/request'; 

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata({ 
    params: { locale } 
}: { 
    params: { locale: string } 
}): Promise<Metadata> {
  
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
          <header className="p-4 flex justify-between items-center border-b border-gray-800">
            <h1 className="font-bold text-lg">Liam Viader</h1>
            <Navbar />
          </header>

          <main className="flex-1">{children}</main>

          <footer className="p-4 text-center text-sm text-gray-500 border-t border-gray-800">
            © {new Date().getFullYear()} Liam Viader
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}