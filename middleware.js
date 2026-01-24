import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get the origin from environment or construct from headers
  const getOrigin = () => {
    // Use APP_URL env var if set
    if (process.env.APP_URL) {
      return process.env.APP_URL;
    }
    
    // Otherwise construct from forwarded headers or request
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
    return `${proto}://${host}`;
  };

  // Helper function to get token from request
  const getToken = () => {
    // Try Next.js cookie API first
    let token = request.cookies.get('auth-token')?.value;
    
    // Fallback: parse cookie header manually (handles edge cases with proxies)
    if (!token) {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const match = cookieHeader.match(/auth-token=([^;]+)/);
        if (match) {
          try {
            token = decodeURIComponent(match[1]);
          } catch {
            token = match[1];
          }
        }
      }
    }
    
    return token;
  };

  // Protect admin routes (except login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = getToken();

    if (!token) {
      const loginUrl = new URL('/admin/login', getOrigin());
      return NextResponse.redirect(loginUrl);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      // Clear invalid cookie and redirect to login
      const loginUrl = new URL('/admin/login', getOrigin());
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('auth-token');
      return response;
    }

    return NextResponse.next();
  }

  // If on login page and already authenticated, redirect to dashboard
  if (pathname === '/admin/login') {
    const token = getToken();
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const adminUrl = new URL('/admin', getOrigin());
        return NextResponse.redirect(adminUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};





