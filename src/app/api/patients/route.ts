import { NextRequest, NextResponse } from 'next/server';
import Patient from '@/models/Patient';
import { testConnection } from '@/lib/db';

// GET all patients
export async function GET() {
  try {
    await testConnection();
    const patients = await Patient.findAll({
      order: [['createdAt', 'DESC']]
    });
    return NextResponse.json(patients);
  } catch (error: any) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients', details: error.message },
      { status: 500 }
    );
  }
}

// POST create new patient
export async function POST(request: NextRequest) {
  try {
    await testConnection();
    const body = await request.json();

    // Check for duplicate patient (same name + DOB + phone)
    const duplicatePatient = await Patient.findOne({
      where: {
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
      }
    });

    if (duplicatePatient) {
      return NextResponse.json(
        { error: 'Duplicate patient', details: 'A patient with the same name and phone number already exists.' },
        { status: 409 } // 409 Conflict
      );
    }

    // Clean email field - convert empty string or null to undefined
    const cleanEmail = body.email && body.email.trim() !== '' ? body.email : null;

    const patient = await Patient.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: cleanEmail,
      phone: body.phone,
      dateOfBirth: body.dateOfBirth,
      gender: body.gender,
      address: body.address,
      bloodGroup: body.bloodGroup,
      emergencyContact: body.emergencyContact,
      emergencyPhone: body.emergencyPhone,
      condition: body.condition || 'Stable',
      isAdmitted: body.isAdmitted || false,
      roomNumber: body.roomNumber,
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error: any) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: 'Failed to create patient', details: error.message },
      { status: 500 }
    );
  }
}
