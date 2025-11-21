import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import { Topic } from '@/lib/models/Topic';
import { Subject } from '@/lib/models/Subject';
import { z } from 'zod';

const updateTopicSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  isCompleted: z.boolean().optional(),
  order: z.number().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const validatedData = updateTopicSchema.parse(body);

    await connectDB();
    const topic = await Topic.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      validatedData,
      { new: true }
    );

    if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 });

    // Update subject progress
    await updateSubjectProgress(topic.subjectId.toString(), session.user.id);

    return NextResponse.json({ topic });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const topic = await Topic.findOneAndDelete({ _id: params.id, userId: session.user.id });

    if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 });

    // Update subject progress
    await updateSubjectProgress(topic.subjectId.toString(), session.user.id);

    return NextResponse.json({ message: 'Topic deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function updateSubjectProgress(subjectId: string, userId: string) {
  const topics = await Topic.find({ subjectId, userId });
  const totalTopics = topics.length;
  const completedTopics = topics.filter(t => t.isCompleted).length;
  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  await Subject.findByIdAndUpdate(subjectId, {
    totalTopics,
    completedTopics,
    progress
  });
}
