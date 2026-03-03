import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/routing';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export default function middleware(req: NextRequest) {
  const { nextUrl, headers } = req;
  const host = headers.get('host');

  // 1. If comes from the vercel.app domain, redirect to custom domain
  if (host && host.endsWith('.vercel.app')) {
    const url = nextUrl.clone();
    url.host = 'liamviader.com'; // my domain
    url.protocol = 'https';
    return NextResponse.redirect(url);
  }

  // 2. Project Param Redirect (Direct Entry Only)
  const project = nextUrl.searchParams.get('project');
  const pathname = nextUrl.pathname;

  // Check if it's the home page (with or without locale)
  const isHome = pathname === '/' || locales.some(l => pathname === `/${l}` || pathname === `/${l}/`);

  // --- REFINED DETECTION ---
  // A direct entry (typed URL, deep link, or refresh) will have 'navigate'
  const fetchMode = headers.get('sec-fetch-mode');
  const isDirectEntry = fetchMode === 'navigate' || !headers.has('x-nextjs-navigation');

  // Extra safety: Next.js specific headers for transitions
  const isNextTransition =
    headers.has('x-nextjs-navigation') ||
    headers.has('next-router-state-tree') ||
    headers.has('next-url') ||
    headers.has('x-next-router-prefetch');

  if (isHome && project && isDirectEntry && !isNextTransition) {
    const locale = locales.find(l => pathname.startsWith(`/${l}`)) || defaultLocale;
    const url = nextUrl.clone();
    url.pathname = `/${locale}/projects`;
    // We already have the 'project' param in the cloned URL's searchParams
    return NextResponse.redirect(url);
  }

  // 3. Otherwise, proceed with intl middleware
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
