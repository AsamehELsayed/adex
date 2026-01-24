import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { attachAuthCookie, signAuthToken } from '@/lib/auth';

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

    const token = await signAuthToken(user);

    const response = NextResponse.json({
      success: true,
      token, // exposed only as a fallback for non-browser clients
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

    attachAuthCookie(response, token, request);
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

