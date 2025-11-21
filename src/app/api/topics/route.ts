import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import { Topic } from '@/lib/models/Topic';
import { Subject } from '@/lib/models/Subject';
import { z } from 'zod';

const topicSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subjectId: z.string().min(1, 'Subject ID is required'),
  description: z.string().optional(),
  isCompleted: z.boolean().optional(),
  order: z.number().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId');

    await connectDB();
    
    const query: any = { userId: session.user.id };
    if (subjectId) {
      query.subjectId = subjectId;
    }

    const topics = await Topic.find(query).sort({ order: 1, createdAt: 1 });

    return NextResponse.json({ topics });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const validatedData = topicSchema.parse(body);

    await connectDB();
    
    // Get highest order to append to end
    const lastTopic = await Topic.findOne({ subjectId: validatedData.subjectId })
      .sort({ order: -1 });
    const order = validatedData.order ?? (lastTopic ? lastTopic.order + 1 : 0);

    const topic = await Topic.create({
      ...validatedData,
      order,
      userId: session.user.id,
    });

    // Update subject progress
    await updateSubjectProgress(validatedData.subjectId, session.user.id);

    return NextResponse.json({ topic }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
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
