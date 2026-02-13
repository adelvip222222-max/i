import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Check database connection
    await connectDB();
    
    const dbState = mongoose.connection.readyState;
    const isConnected = dbState === 1;

    if (!isConnected) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          database: 'disconnected',
          readyState: dbState,
          uptime: process.uptime(),
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      dbHost: mongoose.connection.host || 'unknown',
      dbName: mongoose.connection.name || 'unknown',
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        uptime: process.uptime(),
      },
      { status: 503 }
    );
  }
}
