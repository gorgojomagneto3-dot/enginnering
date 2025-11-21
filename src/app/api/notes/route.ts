import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import { Note } from '@/lib/models/Note';
import { z } from 'zod';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  subjectId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isFavorite: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const notes = await Note.find({ userId: session.user.id }).sort({ updatedAt: -1 });

    return NextResponse.json({ notes });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const validatedData = noteSchema.parse(body);

    await connectDB();
    const note = await Note.create({
      ...validatedData,
      userId: session.user.id,
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
