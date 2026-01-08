import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Service from '@/models/Service';

// Initialize database connection
let dbInitialized = false;
const initDB = async () => {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
};

// GET - Fetch all services
export async function GET(request) {
  try {
    await initDB();
    
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const where = {};
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const services = await Service.findAll({
      where,
      order: [['order', 'ASC'], ['createdAt', 'DESC']],
    });

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new service
export async function POST(request) {
  try {
    await initDB();
    
    const body = await request.json();
    const { title, subtitle, description, icon, capabilities, serviceData, metadata, order, isActive } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    // Store all service data as JSON
    const service = await Service.create({
      title,
      subtitle: subtitle || null,
      description: description || null,
      icon: icon || null,
      capabilities: capabilities || [],
      serviceData: serviceData || {
        title,
        subtitle,
        description,
        icon,
        capabilities,
      },
      metadata: metadata || {},
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json(
      {
        success: true,
        data: service,
        message: 'Service created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}





