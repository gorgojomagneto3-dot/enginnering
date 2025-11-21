import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    pomodoroWork: number;
    pomodoroBreak: number;
    pomodoroLongBreak: number;
    notificationsEnabled: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    avatar: { type: String },
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      pomodoroWork: { type: Number, default: 25 },
      pomodoroBreak: { type: Number, default: 5 },
      pomodoroLongBreak: { type: Number, default: 15 },
      notificationsEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
