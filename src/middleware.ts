import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing'; // Asegúrate de que la ruta a tu routing.ts sea correcta

export default createMiddleware({
  locales: routing.locales, 

  defaultLocale: routing.defaultLocale, 

  localePrefix: 'as-needed', 
});

export const config = {
  matcher: [
    '/',
    '/(es|en)/:path*', 
  ]
};