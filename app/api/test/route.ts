import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import {  User } from '@/models';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Check database connection
    await connectDB();
    const users = await User.find({});
    return NextResponse.json({ users });
  
  }catch
(err) {
    console.error('Database connection error:', err);
    return NextResponse.json(
      { error: 'Failed to connect to database' },
      { status: 500 }
    );
  }

  // If we made it here, the connection was successful
}
