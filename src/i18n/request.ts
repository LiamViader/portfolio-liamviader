import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "./routing"; 

const locales = routing.locales;

export default getRequestConfig(async ({ requestLocale }) => {
  
  const locale = await requestLocale; 
  
  if (locale === undefined || !locales.includes(locale as any)) {
      notFound();
  }

  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    // 4. El objeto de retorno es el mismo (locale es un string resuelto)
    locale, 
    messages,
  };
});