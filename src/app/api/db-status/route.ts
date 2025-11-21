import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    const dbStatus = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    return NextResponse.json({
      status: 'success',
      database: {
        state: states[dbStatus as keyof typeof states],
        name: mongoose.connection.name,
        host: mongoose.connection.host,
      },
      message: '✅ Conexión exitosa a MongoDB Atlas',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: '❌ Error al conectar con MongoDB',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
