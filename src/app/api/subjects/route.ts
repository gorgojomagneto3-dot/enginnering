import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import { Subject } from '@/lib/models/Subject';
import { z } from 'zod';

const subjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  color: z.string().min(1, 'Color is required'),
  icon: z.string().optional(),
  professor: z.string().optional(),
  schedule: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const subjects = await Subject.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json({ subjects });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const validatedData = subjectSchema.parse(body);

    await connectDB();
    const subject = await Subject.create({
      ...validatedData,
      userId: session.user.id,
    });

    return NextResponse.json({ subject }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
