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
    // Try username first, then email
    let user = await User.findOne({
      where: { username }
    });
    
    if (!user) {
      user = await User.findOne({
        where: { email: username }
      });
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

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

    // Clear any existing auth-token cookie first to avoid conflicts
    response.cookies.delete('auth-token');
    
    // Determine if we're in production with HTTPS
    const isProduction = process.env.NODE_ENV === 'production';
    const isSecure = isProduction || request.headers.get('x-forwarded-proto') === 'https';
    
    // Set cookie with explicit path and domain
    try {
      const cookieOptions = {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? 'lax' : 'lax', // Use 'lax' for same-site, 'none' only if cross-site
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      };
      
      // Don't set domain explicitly - let browser handle it
      // Setting domain explicitly can cause issues with subdomains and localhost
      
      response.cookies.set('auth-token', token, cookieOptions);
      
      // Log cookie setting for debugging (remove in production if needed)
      if (!isProduction) {
        console.log('Cookie set with options:', cookieOptions);
      }
    } catch (cookieError) {
      // If cookie setting fails due to too many cookies, fall back to header
      console.error('Failed to set cookie:', cookieError.message);
      response.headers.set('X-Auth-Token', token);
      // Return response with token in body as well for client-side handling
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token: token, // Include token in response body as fallback
      });
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

