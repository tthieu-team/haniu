import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang');

  if (lang && ['vi', 'en', 'ja', 'zh'].includes(lang)) {
    // Modify request headers so Server Components can read the cookie during the current request lifecycle
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('cookie', `haniu_lang=${lang}`);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Set cookie on response so it persists on subsequent requests
    response.cookies.set('haniu_lang', lang, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any files with common extensions (images, robots, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
