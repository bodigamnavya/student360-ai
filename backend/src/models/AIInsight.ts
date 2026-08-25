import mongoose, { Document, Schema } from 'mongoose';

export type InsightType =
  | 'Academic'
  | 'Attendance'
  | 'SkillGap'
  | 'CareerRecommendation'
  | 'JobMatch'
  | 'RiskPrediction'
  | 'PlacementReadiness'
  | 'General';

export interface IAIInsight extends Document {
  student: mongoose.Types.ObjectId;
  type: InsightType;
  title: string;
  summary: string;
  score?: number;
  details: any;
  recommendations: string[];
  severity: 'info' | 'warning' | 'alert' | 'success';
  isRead: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AIInsightSchema = new Schema<IAIInsight>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: [
        'Academic',
        'Attendance',
        'SkillGap',
        'CareerRecommendation',
        'JobMatch',
        'RiskPrediction',
        'PlacementReadiness',
        'General'
      ],
      required: true,
      index: true
    },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    score: { type: Number },
    details: { type: Schema.Types.Mixed, default: {} },
    recommendations: [{ type: String }],
    severity: {
      type: String,
      enum: ['info', 'warning', 'alert', 'success'],
      default: 'info'
    },
    isRead: { type: Boolean, default: false },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

AIInsightSchema.index({ student: 1, createdAt: -1 });

export const AIInsight = mongoose.model<IAIInsight>('AIInsight', AIInsightSchema);
