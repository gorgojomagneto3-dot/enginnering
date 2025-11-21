import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
  estimatedPomodoros?: number;
  completedPomodoros: number;
  tags?: string[];
  createdAt: Date;
  completedAt?: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    estimatedPomodoros: { type: Number },
    completedPomodoros: { type: Number, default: 0 },
    tags: [{ type: String }],
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
