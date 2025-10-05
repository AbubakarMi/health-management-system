import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { testConnection } from '@/lib/db';

// GET all users
export async function GET() {
  try {
    await testConnection();
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // Don't send passwords
      order: [['createdAt', 'DESC']]
    });
    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
}

// POST create new user
export async function POST(request: NextRequest) {
  try {
    await testConnection();
    const body = await request.json();

    // TODO: Hash password before saving (use bcrypt)
    const user = await User.create({
      email: body.email,
      password: body.password, // Should be hashed!
      firstName: body.firstName,
      lastName: body.lastName,
      role: body.role,
      phone: body.phone,
      isActive: body.isActive ?? true,
    });

    // Don't return password
    const userResponse = user.toJSON();
    delete (userResponse as any).password;

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}
