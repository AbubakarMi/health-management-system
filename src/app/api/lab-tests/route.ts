import { NextRequest, NextResponse } from 'next/server';
import LabTest from '@/models/LabTest';
import { testConnection } from '@/lib/db';

// GET all lab tests
export async function GET(request: NextRequest) {
  try {
    await testConnection();

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const status = searchParams.get('status');

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    const labTests = await LabTest.findAll({
      where,
      order: [['dateOrdered', 'DESC']]
    });

    return NextResponse.json(labTests);
  } catch (error: any) {
    console.error('Error fetching lab tests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lab tests', details: error.message },
      { status: 500 }
    );
  }
}

// POST create new lab test
export async function POST(request: NextRequest) {
  try {
    await testConnection();
    const body = await request.json();

    const labTest = await LabTest.create({
      patientId: body.patientId,
      patientName: body.patientName,
      doctorName: body.doctorName,
      testType: body.testType,
      status: body.status || 'Pending',
      dateOrdered: body.dateOrdered || new Date(),
      dateCompleted: body.dateCompleted,
      results: body.results,
      notes: body.notes,
    });

    return NextResponse.json(labTest, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lab test:', error);
    return NextResponse.json(
      { error: 'Failed to create lab test', details: error.message },
      { status: 500 }
    );
  }
}
