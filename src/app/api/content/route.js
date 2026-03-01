import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Content from '@/models/Content';

// Initialize database connection
let dbInitialized = false;
const initDB = async () => {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
};

// GET - Fetch all content or by key/type
export async function GET(request) {
  try {
    await initDB();
    
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const type = searchParams.get('type');
    const isActive = searchParams.get('isActive');

    const where = {};
    if (key) {
      where.key = key;
    }
    if (type) {
      where.type = type;
    }
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const contents = await Content.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json({
      success: true,
      data: contents,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create or update content
export async function POST(request) {
  try {
    await initDB();
    
    const body = await request.json();
    const { key, type, data, metadata, isActive } = body;

    // Validate required fields
    if (!key || !data) {
      return NextResponse.json(
        { success: false, error: 'Key and data are required' },
        { status: 400 }
      );
    }

    // Check if content with this key already exists
    let content = await Content.findOne({ where: { key } });

    if (content) {
      // Update existing content
      content.data = { ...content.data, ...data };
      content.changed('data', true);
      if (metadata) {
        content.metadata = { ...content.metadata, ...metadata };
        content.changed('metadata', true);
      }
      if (type) {
        content.type = type;
      }
      if (isActive !== undefined) {
        content.isActive = isActive;
      }
      await content.save();
    } else {
      // Create new content
      content = await Content.create({
        key,
        type: type || 'general',
        data,
        metadata: metadata || {},
        isActive: isActive !== undefined ? isActive : true,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: content,
        message: 'Content saved successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}





