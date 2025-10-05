import { NextResponse } from 'next/server';
import { testConnection, syncDatabase } from '@/lib/db';
import { initializeModels } from '@/models';

// GET endpoint to initialize database
export async function GET() {
  try {
    console.log('🚀 Starting database initialization...');

    // Test connection
    const connected = await testConnection();
    if (!connected) {
      return NextResponse.json(
        { error: 'Failed to connect to database' },
        { status: 500 }
      );
    }

    // Initialize models
    await initializeModels();

    // Sync database
    await syncDatabase(false);

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      tables: ['users', 'patients', 'prescriptions', 'lab_tests', 'invoices', 'admissions']
    });
  } catch (error: any) {
    console.error('Database initialization failed:', error);
    return NextResponse.json(
      { error: 'Database initialization failed', details: error.message },
      { status: 500 }
    );
  }
}
