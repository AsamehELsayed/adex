import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Helper function to get token from request
  const getToken = () => {
    // Try cookie first
    let token = request.cookies.get('auth-token')?.value;
    
    // Fallback: parse cookie header manually
    if (!token) {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = decodeURIComponent(value);
          return acc;
        }, {});
        token = cookies['auth-token'] || null;
      }
    }
    
    // Fallback: check header
    if (!token) {
      token = request.headers.get('X-Auth-Token');
    }
    
    return token;
  };

  // Protect admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = getToken();

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
    const token = getToken();
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





