import mongoose, { Document, Schema } from 'mongoose';

export interface ICareerGoal extends Document {
  student: mongoose.Types.ObjectId;
  targetRole: string;
  targetIndustry: string;
  desiredSalaryMin?: number;
  desiredSalaryMax?: number;
  preferredLocations: string[];
  timeline: string;
  targetCompanies: string[];
  priority: 'High' | 'Medium' | 'Low';
  notes?: string;
  readinessPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const CareerGoalSchema = new Schema<ICareerGoal>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetRole: { type: String, required: true, trim: true },
    targetIndustry: { type: String, default: 'Information Technology' },
    desiredSalaryMin: { type: Number },
    desiredSalaryMax: { type: Number },
    preferredLocations: [{ type: String }],
    timeline: { type: String, default: 'Graduation 2027' },
    targetCompanies: [{ type: String }],
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' },
    notes: { type: String },
    readinessPercentage: { type: Number, default: 0, min: 0, max: 100 }
  },
  { timestamps: true }
);

export const CareerGoal = mongoose.model<ICareerGoal>('CareerGoal', CareerGoalSchema);
