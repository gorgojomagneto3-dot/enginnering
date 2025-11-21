import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  subjectId?: mongoose.Types.ObjectId;
  title: string;
  content: string;
  tags?: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    isFavorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
