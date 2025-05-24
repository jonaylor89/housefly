import { locales } from 'app/i18n/constants';
import { NextRequest, NextResponse } from 'next/server';

// List of supported locales
const defaultLocale = 'en';

// Get the preferred locale from the request
function getLocale(request: NextRequest): string {
  // Get locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  let locale = defaultLocale;

  if (acceptLanguage) {
    // Parse the Accept-Language header and find the best match
    const preferredLocale = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim())
      .find(lang => locales.some(locale => lang.startsWith(locale)));

    if (preferredLocale) {
      // Get the two-letter language code
      locale = preferredLocale.substring(0, 2);

      // Make sure it's one of our supported locales
      if (!locales.includes(locale)) {
        locale = defaultLocale;
      }
    }
  }

  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the pathname already has a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /en/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`,
        request.url
      )
    );
  }
}

export const config = {
  matcher: [
    /*
    * Match all request paths except for the ones starting with:
    * - api (API routes)
    * - _next/static (static files)
    * - _next/image (image optimization files)
    * - favicon.ico, sitemap.xml, robots.txt (metadata files)
    * - rss (RSS feed)
    * - Files with extensions (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|rss|.*\\.[a-zA-Z]+$).*)',
  ],
}