import { NextRequest, NextResponse } from 'next/server';
import Admission from '@/models/Admission';
import { testConnection } from '@/lib/db';

// GET all admissions
export async function GET(request: NextRequest) {
  try {
    await testConnection();

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const status = searchParams.get('status');

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    const admissions = await Admission.findAll({
      where,
      order: [['admissionDate', 'DESC']]
    });

    return NextResponse.json(admissions);
  } catch (error: any) {
    console.error('Error fetching admissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admissions', details: error.message },
      { status: 500 }
    );
  }
}

// POST create new admission
export async function POST(request: NextRequest) {
  try {
    await testConnection();
    const body = await request.json();

    const admission = await Admission.create({
      patientId: body.patientId,
      patientName: body.patientName,
      roomNumber: body.roomNumber,
      bedNumber: body.bedNumber,
      admissionDate: body.admissionDate || new Date(),
      dischargeDate: body.dischargeDate,
      reason: body.reason,
      status: body.status || 'Active',
      assignedDoctor: body.assignedDoctor,
      notes: body.notes,
    });

    return NextResponse.json(admission, { status: 201 });
  } catch (error: any) {
    console.error('Error creating admission:', error);
    return NextResponse.json(
      { error: 'Failed to create admission', details: error.message },
      { status: 500 }
    );
  }
}
