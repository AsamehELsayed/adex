import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Allow access to admin routes
    return NextResponse.next();
  }

  // Allow access to login page
  if (pathname === '/admin/login') {
    const token = request.cookies.get('auth-token')?.value;
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        // Already logged in, redirect to dashboard
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};





