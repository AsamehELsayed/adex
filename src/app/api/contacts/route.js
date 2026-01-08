import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Contact from '@/models/Contact';

// Initialize database connection
let dbInitialized = false;
const initDB = async () => {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
};

// GET - Fetch all contacts
export async function GET(request) {
  try {
    await initDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    const where = {};
    if (status) {
      where.status = status;
    }

    const contacts = await Contact.findAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const total = await Contact.count({ where });

    return NextResponse.json({
      success: true,
      data: contacts,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new contact
export async function POST(request) {
  try {
    await initDB();
    
    const body = await request.json();
    const { name, email, company, message, metadata, formData } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Store form data as JSON
    const contactData = {
      name,
      email,
      company: company || null,
      message,
      formData: formData || {
        name,
        email,
        company: company || '',
        message,
      },
      metadata: metadata || {},
      status: 'new',
    };

    const contact = await Contact.create(contactData);

    return NextResponse.json(
      {
        success: true,
        data: contact,
        message: 'Contact created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}





