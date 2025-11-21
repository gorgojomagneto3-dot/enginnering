import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import { PomodoroSession } from '@/lib/models/PomodoroSession';
import { z } from 'zod';

const sessionSchema = z.object({
  type: z.enum(['work', 'break', 'longBreak']),
  duration: z.number().min(1),
  completedAt: z.string().datetime(),
  wasCompleted: z.boolean(),
  taskId: z.string().optional(),
  subjectId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    
    // Optional: Filter by date range if needed in future
    const sessions = await PomodoroSession.find({ userId: session.user.id })
      .sort({ completedAt: -1 })
      .limit(50); // Limit to last 50 sessions for now

    return NextResponse.json({ sessions });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const validatedData = sessionSchema.parse(body);

    await connectDB();
    const pomodoroSession = await PomodoroSession.create({
      ...validatedData,
      userId: session.user.id,
    });

    return NextResponse.json({ pomodoroSession }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
