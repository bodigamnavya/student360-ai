import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  student: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type: 'Short Term' | 'Medium Term' | 'Long Term';
  deadline: Date;
  priority: 'High' | 'Medium' | 'Low';
  progress: number;
  milestones: { title: string; completed: boolean }[];
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { 
    type: String, 
    required: true,
    enum: ['Short Term', 'Medium Term', 'Long Term']
  },
  deadline: { type: Date, required: true },
  priority: { 
    type: String, 
    required: true,
    enum: ['High', 'Medium', 'Low']
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  milestones: [{
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }]
}, { timestamps: true });

export const Goal = mongoose.model<IGoal>('Goal', GoalSchema);
