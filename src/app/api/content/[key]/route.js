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

// GET - Fetch content by key
export async function GET(request, { params }) {
  try {
    await initDB();
    
    const { key } = params;
    const content = await Content.findOne({ where: { key } });

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update content by key
export async function PUT(request, { params }) {
  try {
    await initDB();
    
    const { key } = params;
    const body = await request.json();

    const content = await Content.findOne({ where: { key } });

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    // Update JSON fields
    if (body.data) {
      content.data = { ...content.data, ...body.data };
    }
    if (body.metadata) {
      content.metadata = { ...content.metadata, ...body.metadata };
    }

    // Update other fields
    Object.keys(body).forEach((key) => {
      if (key !== 'data' && key !== 'metadata' && key !== 'key') {
        content[key] = body[key];
      }
    });

    await content.save();

    return NextResponse.json({
      success: true,
      data: content,
      message: 'Content updated successfully',
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete content by key
export async function DELETE(request, { params }) {
  try {
    await initDB();
    
    const { key } = params;
    const content = await Content.findOne({ where: { key } });

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    await content.destroy();

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}





