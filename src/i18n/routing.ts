import { defineRouting } from 'next-intl/routing';


export const locales = ['en', 'es'] as const; 

export const defaultLocale = 'en' as const;

export type Locale = typeof locales[number]; 

export const routing = defineRouting({
  locales: locales, 
  defaultLocale: defaultLocale, 
});
