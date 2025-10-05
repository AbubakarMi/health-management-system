import { NextRequest, NextResponse } from 'next/server';
import Invoice from '@/models/Invoice';
import { testConnection } from '@/lib/db';

// GET all invoices
export async function GET(request: NextRequest) {
  try {
    await testConnection();

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const status = searchParams.get('status');

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    const invoices = await Invoice.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    return NextResponse.json(invoices);
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices', details: error.message },
      { status: 500 }
    );
  }
}

// POST create new invoice
export async function POST(request: NextRequest) {
  try {
    await testConnection();
    const body = await request.json();

    const invoice = await Invoice.create({
      invoiceNumber: body.invoiceNumber || `INV-${Date.now()}`,
      patientId: body.patientId,
      patientName: body.patientName,
      amount: body.amount,
      status: body.status || 'Pending',
      dueDate: body.dueDate,
      paidDate: body.paidDate,
      description: body.description,
      items: body.items ? JSON.stringify(body.items) : null,
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice', details: error.message },
      { status: 500 }
    );
  }
}
