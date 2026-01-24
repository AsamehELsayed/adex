import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

let dbInitialized = false;
const initDB = async () => {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
};

export async function POST(request) {
  try {
    await initDB();
    
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user by username or email
    let user = await User.findOne({ where: { username } });
    
    if (!user) {
      user = await User.findOne({ where: { email: username } });
    }

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user);

    // Create response
    const response = NextResponse.json({
      success: true,
      token, // include token for client-side fallback in case proxies strip Set-Cookie
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

    // Detect if connection is secure (HTTPS)
    // Check x-forwarded-proto header (set by reverse proxies like nginx, cloudflare, etc.)
    const forwardedProto = request.headers.get('x-forwarded-proto');
    const appUrl = process.env.APP_URL || '';
    const isSecure = forwardedProto === 'https' || appUrl.startsWith('https://');

    // Set auth cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    // Also expose token via header for debugging/fallback (not used by browser automatically)
    response.headers.set('X-Auth-Token', token);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

