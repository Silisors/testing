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

    const token = request.cookies.get("next-auth.session-token")?.value || request.cookies.get("__Secure-next-auth.session-token")?.value;

    if (token) {
        // Paths that logged in users shouldn't see
        const isGuestRoute =
            pathname === "/" ||
            /^\/(en|es|pt)$/.test(pathname) ||
            /^\/(en|es|pt)\/(login|register)$/.test(pathname);

        if (isGuestRoute) {
            const locale = pathname.match(/^\/(en|es|pt)/)?.[1] || defaultLocale;
            return NextResponse.redirect(new URL(`/${locale}/home`, request.url));
        }
    } else {
        // Paths that require login
        const isProtectedRoute =
            pathname.includes('/home') ||
            pathname.includes('/dashboard');

        if (isProtectedRoute) {
            const locale = pathname.match(/^\/(en|es|pt)/)?.[1] || defaultLocale;
            return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        }
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
