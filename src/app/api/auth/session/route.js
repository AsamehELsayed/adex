import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getSession } from '@/lib/auth';
import User from '@/models/User';

let dbInitialized = false;
const initDB = async () => {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
};

export async function GET(request) {
  try {
    const { payload } = await getSession(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, authenticated: false },
        { status: 401 }
      );
    }

    await initDB();
    
    // Get fresh user data from database
    const user = await User.findByPk(payload.id, {
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

