import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n/config';

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'as-needed'
});

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Skip middleware for API routes and static files
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
