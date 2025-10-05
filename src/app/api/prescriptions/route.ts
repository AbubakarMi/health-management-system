import { NextRequest, NextResponse } from 'next/server';
import Prescription from '@/models/Prescription';
import { testConnection } from '@/lib/db';

// GET all prescriptions
export async function GET(request: NextRequest) {
  try {
    await testConnection();

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const status = searchParams.get('status');

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    const prescriptions = await Prescription.findAll({
      where,
      order: [['dateIssued', 'DESC']]
    });

    return NextResponse.json(prescriptions);
  } catch (error: any) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prescriptions', details: error.message },
      { status: 500 }
    );
  }
}

// POST create new prescription
export async function POST(request: NextRequest) {
  try {
    await testConnection();
    const body = await request.json();

    const prescription = await Prescription.create({
      patientId: body.patientId,
      patientName: body.patientName,
      doctorName: body.doctorName,
      medication: body.medication,
      dosage: body.dosage,
      frequency: body.frequency,
      duration: body.duration,
      status: body.status || 'Pending',
      dateIssued: body.dateIssued || new Date(),
      notes: body.notes,
    });

    return NextResponse.json(prescription, { status: 201 });
  } catch (error: any) {
    console.error('Error creating prescription:', error);
    return NextResponse.json(
      { error: 'Failed to create prescription', details: error.message },
      { status: 500 }
    );
  }
}
