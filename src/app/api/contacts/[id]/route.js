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

// GET - Fetch a single contact by ID
export async function GET(request, { params }) {
  try {
    await initDB();
    
    const { id } = await params;
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a contact
export async function PUT(request, { params }) {
  try {
    await initDB();
    
    const { id } = await params;
    const body = await request.json();

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Update contact, including JSON fields
    if (body.formData) {
      contact.formData = { ...contact.formData, ...body.formData };
    }
    if (body.metadata) {
      contact.metadata = { ...contact.metadata, ...body.metadata };
    }

    // Update other fields
    Object.keys(body).forEach((key) => {
      if (key !== 'formData' && key !== 'metadata' && key !== 'id') {
        contact[key] = body[key];
      }
    });

    await contact.save();

    return NextResponse.json({
      success: true,
      data: contact,
      message: 'Contact updated successfully',
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a contact
export async function DELETE(request, { params }) {
  try {
    await initDB();
    
    const { id } = await params;
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    await contact.destroy();

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}





