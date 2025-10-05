import { NextRequest, NextResponse } from 'next/server';
import Prescription from '@/models/Prescription';
import { testConnection } from '@/lib/db';

// GET single prescription
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await testConnection();
    const { id } = await params;

    const prescription = await Prescription.findByPk(id);

    if (!prescription) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(prescription);
  } catch (error: any) {
    console.error('Error fetching prescription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prescription', details: error.message },
      { status: 500 }
    );
  }
}

// PUT update prescription
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await testConnection();
    const { id } = await params;
    const body = await request.json();

    const prescription = await Prescription.findByPk(id);

    if (!prescription) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }

    await prescription.update(body);
    return NextResponse.json(prescription);
  } catch (error: any) {
    console.error('Error updating prescription:', error);
    return NextResponse.json(
      { error: 'Failed to update prescription', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE prescription
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await testConnection();
    const { id } = await params;

    const prescription = await Prescription.findByPk(id);

    if (!prescription) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }

    await prescription.destroy();
    return NextResponse.json({ message: 'Prescription deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting prescription:', error);
    return NextResponse.json(
      { error: 'Failed to delete prescription', details: error.message },
      { status: 500 }
    );
  }
}
