import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  student: mongoose.Types.ObjectId;
  name: string;
  category: string;
  role: string;
  organization: string;
  date: Date;
  description?: string;
  evidence?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  role: { type: String, required: true },
  organization: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  evidence: { type: String }
}, { timestamps: true });

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
