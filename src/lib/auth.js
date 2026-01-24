import { SignJWT, jwtVerify } from 'jose';

export const AUTH_COOKIE_NAME = 'auth-token';
const DEFAULT_EXPIRY_SECONDS = 60 * 60 * 24 * 7; // 7 days

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  return new TextEncoder().encode(secret);
};

export async function signAuthToken(user, expiresInSeconds = DEFAULT_EXPIRY_SECONDS) {
  return new SignJWT({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error('verifyAuthToken error:', error);
    return null;
  }
}

export function isSecureRequest(request) {
  const forwardedProto = request.headers?.get?.('x-forwarded-proto');
  if (forwardedProto) return forwardedProto === 'https';

  if (request.nextUrl?.protocol) {
    return request.nextUrl.protocol === 'https:';
  }

  if (process.env.APP_URL) {
    return process.env.APP_URL.startsWith('https://');
  }

  return false;
}

export function buildAuthCookieOptions(request) {
  return {
    httpOnly: true,
    secure: isSecureRequest(request),
    sameSite: 'lax',
    maxAge: DEFAULT_EXPIRY_SECONDS,
    path: '/',
  };
}

export function attachAuthCookie(response, token, request) {
  response.cookies.set(AUTH_COOKIE_NAME, token, buildAuthCookieOptions(request));
  return response;
}

export function clearAuthCookie(response) {
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}

export function extractAuthToken(request) {
  const cookieToken = request.cookies?.get?.(AUTH_COOKIE_NAME)?.value;
  if (cookieToken) return cookieToken;

  const cookieHeader = request.headers?.get?.('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(new RegExp(`${AUTH_COOKIE_NAME}=([^;]+)`));
    if (match?.[1]) {
      try {
        return decodeURIComponent(match[1]);
      } catch {
        return match[1];
      }
    }
  }

  const authHeader = request.headers?.get?.('authorization') || request.headers?.get?.('Authorization');
  if (authHeader?.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7);
  }

  const headerToken = request.headers?.get?.('x-auth-token') || request.headers?.get?.('X-Auth-Token');
  if (headerToken) return headerToken;

  return null;
}

export async function getSession(request) {
  const token = extractAuthToken(request);
  if (!token) return { token: null, payload: null };

  const payload = await verifyAuthToken(token);
  return { token, payload };
}

