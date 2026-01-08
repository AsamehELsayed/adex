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

// GET - Fetch a single service by ID
export async function GET(request, { params }) {
  try {
    await initDB();
    
    const { id } = params;
    const service = await Service.findByPk(id);

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a service
export async function PUT(request, { params }) {
  try {
    await initDB();
    
    const { id } = params;
    const body = await request.json();

    const service = await Service.findByPk(id);

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    // Update JSON fields
    if (body.capabilities) {
      service.capabilities = body.capabilities;
    }
    if (body.serviceData) {
      service.serviceData = { ...service.serviceData, ...body.serviceData };
    }
    if (body.metadata) {
      service.metadata = { ...service.metadata, ...body.metadata };
    }

    // Update other fields
    Object.keys(body).forEach((key) => {
      if (key !== 'capabilities' && key !== 'serviceData' && key !== 'metadata' && key !== 'id') {
        service[key] = body[key];
      }
    });

    await service.save();

    return NextResponse.json({
      success: true,
      data: service,
      message: 'Service updated successfully',
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a service
export async function DELETE(request, { params }) {
  try {
    await initDB();
    
    const { id } = params;
    const service = await Service.findByPk(id);

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    await service.destroy();

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}





