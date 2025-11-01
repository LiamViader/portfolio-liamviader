import createMiddleware from 'next-intl/middleware';
import { routing, locales, defaultLocale } from './i18n/routing';

export default createMiddleware({
  locales: locales, 

  defaultLocale: defaultLocale, 

  localePrefix: 'as-needed', 
});

export const config = {
  matcher: [
    '/',
    '/(es|en)/:path*', 
    '/projects/:path*',
    '/contact/:path*',
    '/about/:path*'
  ]
};