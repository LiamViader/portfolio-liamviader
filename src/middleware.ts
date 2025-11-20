import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './i18n/routing';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export default function middleware(req: NextRequest) {
  const host = req.headers.get('host');

  // If comes from the vercel.app domain, redirect to custom domain
  if (host && host.endsWith('.vercel.app')) {
    const url = req.nextUrl.clone();
    url.host = 'liamviader.com'; // my domain
    url.protocol = 'https';
    return NextResponse.redirect(url);
  }

  // Otherwise, proceed with intl middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    '/',
    '/(es|en)/:path*',
    '/projects/:path*',
    '/contact/:path*',
    '/about/:path*'
  ]
};
