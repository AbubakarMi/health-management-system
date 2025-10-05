import { NextRequest, NextResponse } from 'next/server';
import Admission from '@/models/Admission';
import { testConnection } from '@/lib/db';

// GET single admission
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await testConnection();
    const { id } = await params;

    const admission = await Admission.findByPk(id);

    if (!admission) {
      return NextResponse.json(
        { error: 'Admission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(admission);
  } catch (error: any) {
    console.error('Error fetching admission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admission', details: error.message },
      { status: 500 }
    );
  }
}

// PUT update admission
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await testConnection();
    const { id } = await params;
    const body = await request.json();

    const admission = await Admission.findByPk(id);

    if (!admission) {
      return NextResponse.json(
        { error: 'Admission not found' },
        { status: 404 }
      );
    }

    await admission.update(body);
    return NextResponse.json(admission);
  } catch (error: any) {
    console.error('Error updating admission:', error);
    return NextResponse.json(
      { error: 'Failed to update admission', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE admission
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await testConnection();
    const { id } = await params;

    const admission = await Admission.findByPk(id);

    if (!admission) {
      return NextResponse.json(
        { error: 'Admission not found' },
        { status: 404 }
      );
    }

    await admission.destroy();
    return NextResponse.json({ message: 'Admission deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting admission:', error);
    return NextResponse.json(
      { error: 'Failed to delete admission', details: error.message },
      { status: 500 }
    );
  }
}
