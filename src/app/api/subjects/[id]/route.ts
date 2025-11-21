import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import { Subject } from '@/lib/models/Subject';
import { z } from 'zod';

const updateSubjectSchema = z.object({
  name: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  professor: z.string().optional(),
  schedule: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const validatedData = updateSubjectSchema.parse(body);

    await connectDB();
    const subject = await Subject.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      validatedData,
      { new: true }
    );

    if (!subject) return NextResponse.json({ error: 'Subject not found' }, { status: 404 });

    return NextResponse.json({ subject });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const subject = await Subject.findOneAndDelete({ _id: params.id, userId: session.user.id });

    if (!subject) return NextResponse.json({ error: 'Subject not found' }, { status: 404 });

    return NextResponse.json({ message: 'Subject deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
