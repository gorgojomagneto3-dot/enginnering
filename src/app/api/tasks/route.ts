import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import { Task } from '@/lib/models/Task';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  subjectId: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['pending', 'in-progress', 'completed']).optional(),
  estimatedPomodoros: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const tasks = await Task.find({ userId: session.user.id }).sort({ createdAt: -1 }).populate('subjectId');

    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = taskSchema.parse(body);

    await connectDB();
    const task = await Task.create({
      ...validatedData,
      userId: session.user.id,
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
