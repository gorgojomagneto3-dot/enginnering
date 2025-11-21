import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDailyProgress extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  tasksCompleted: number;
  pomodorosCompleted: number;
  totalFocusMinutes: number;
  topicsCompleted: number;
}

const DailyProgressSchema = new Schema<IDailyProgress>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  tasksCompleted: { type: Number, default: 0 },
  pomodorosCompleted: { type: Number, default: 0 },
  totalFocusMinutes: { type: Number, default: 0 },
  topicsCompleted: { type: Number, default: 0 },
});

DailyProgressSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyProgress: Model<IDailyProgress> =
  mongoose.models.DailyProgress || mongoose.model<IDailyProgress>('DailyProgress', DailyProgressSchema);
