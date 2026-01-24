import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';

let dbInitialized = false;
const initDB = async () => {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
};

// Helper to extract token from request
const getToken = (request) => {
  // Try Next.js cookies API first
  const cookieToken = request.cookies.get('auth-token')?.value;
  if (cookieToken) return cookieToken;
  
  // Fallback: parse cookie header manually
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/auth-token=([^;]+)/);
    if (match) {
      try {
        return decodeURIComponent(match[1]);
      } catch {
        return match[1];
      }
    }
  }
  
  return null;
};

export async function GET(request) {
  try {
    const token = getToken(request);
    
    if (!token) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      );
    }

    await initDB();
    
    // Get fresh user data from database
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'username', 'email', 'role', 'isActive'],
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { success: false, authenticated: false, error: error.message },
      { status: 500 }
    );
  }
}

