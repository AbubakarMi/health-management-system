import { NextRequest, NextResponse } from 'next/server';
import LabTest from '@/models/LabTest';
import { testConnection } from '@/lib/db';

// GET single lab test
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await testConnection();
    const { id } = await params;

    const labTest = await LabTest.findByPk(id);

    if (!labTest) {
      return NextResponse.json(
        { error: 'Lab test not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(labTest);
  } catch (error: any) {
    console.error('Error fetching lab test:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lab test', details: error.message },
      { status: 500 }
    );
  }
}

// PUT update lab test
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await testConnection();
    const { id } = await params;
    const body = await request.json();

    const labTest = await LabTest.findByPk(id);

    if (!labTest) {
      return NextResponse.json(
        { error: 'Lab test not found' },
        { status: 404 }
      );
    }

    await labTest.update(body);
    return NextResponse.json(labTest);
  } catch (error: any) {
    console.error('Error updating lab test:', error);
    return NextResponse.json(
      { error: 'Failed to update lab test', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE lab test
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await testConnection();
    const { id } = await params;

    const labTest = await LabTest.findByPk(id);

    if (!labTest) {
      return NextResponse.json(
        { error: 'Lab test not found' },
        { status: 404 }
      );
    }

    await labTest.destroy();
    return NextResponse.json({ message: 'Lab test deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting lab test:', error);
    return NextResponse.json(
      { error: 'Failed to delete lab test', details: error.message },
      { status: 500 }
    );
  }
}
