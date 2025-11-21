import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPomodoroSession extends Document {
  userId: mongoose.Types.ObjectId;
  taskId?: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  type: 'work' | 'break' | 'longBreak';
  duration: number;
  completedAt: Date;
  wasCompleted: boolean;
}

const PomodoroSessionSchema = new Schema<IPomodoroSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    type: { type: String, enum: ['work', 'break', 'longBreak'], required: true },
    duration: { type: Number, required: true },
    completedAt: { type: Date, required: true },
    wasCompleted: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PomodoroSession: Model<IPomodoroSession> =
  mongoose.models.PomodoroSession || mongoose.model<IPomodoroSession>('PomodoroSession', PomodoroSessionSchema);
