import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITopic extends Document {
  userId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  isCompleted: boolean;
  order: number;
  resources?: string[];
  createdAt: Date;
}

const TopicSchema = new Schema<ITopic>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
    name: { type: String, required: true },
    description: { type: String },
    isCompleted: { type: Boolean, default: false },
    order: { type: Number, required: true },
    resources: [{ type: String }],
  },
  { timestamps: true }
);

export const Topic: Model<ITopic> = mongoose.models.Topic || mongoose.model<ITopic>('Topic', TopicSchema);
