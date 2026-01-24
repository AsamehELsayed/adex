import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Helper function to build proper redirect URL respecting proxy headers
  const buildRedirectUrl = (path) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    
    // In production, respect X-Forwarded headers from reverse proxy
    const forwardedProto = request.headers.get('x-forwarded-proto');
    const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
    
    if (forwardedProto) {
      url.protocol = forwardedProto + ':';
    }
    if (forwardedHost) {
      url.host = forwardedHost;
      url.port = ''; // Clear port when using forwarded host
    }
    
    return url;
  };

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
          if (key && value) {
            acc[key] = decodeURIComponent(value);
          }
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
      return NextResponse.redirect(buildRedirectUrl('/admin/login'));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      // Clear invalid cookie and redirect
      const response = NextResponse.redirect(buildRedirectUrl('/admin/login'));
      response.cookies.delete('auth-token');
      return response;
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
        return NextResponse.redirect(buildRedirectUrl('/admin'));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};





