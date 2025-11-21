import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  color: string;
  icon?: string;
  professor?: string;
  schedule?: string;
  progress: number;
  totalTopics: number;
  completedTopics: number;
  createdAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
    icon: { type: String },
    professor: { type: String },
    schedule: { type: String },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    totalTopics: { type: Number, default: 0 },
    completedTopics: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Subject: Model<ISubject> = mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);
