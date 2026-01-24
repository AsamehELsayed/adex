import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, extractAuthToken, verifyAuthToken } from '@/lib/auth';

const LOGIN_PATH = '/admin/login';
const DASHBOARD_PATH = '/admin';

export async function middleware(request) {
  const { pathname, origin } = request.nextUrl;

  const redirectToLogin = () => NextResponse.redirect(`${origin}${LOGIN_PATH}`);
  const redirectToDashboard = () => NextResponse.redirect(`${origin}${DASHBOARD_PATH}`);

  // Protect admin routes (except login page)
  if (pathname.startsWith('/admin') && pathname !== LOGIN_PATH) {
    const token = extractAuthToken(request);

    if (!token) {
      return redirectToLogin();
    }

    const decoded = await verifyAuthToken(token);
    if (!decoded) {
      const response = redirectToLogin();
      response.cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
      return response;
    }

    return NextResponse.next();
  }

  // If on login page and already authenticated, redirect to dashboard
  if (pathname === LOGIN_PATH) {
    const token = extractAuthToken(request);
    const decoded = await verifyAuthToken(token);
    if (decoded) {
      return redirectToDashboard();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};





