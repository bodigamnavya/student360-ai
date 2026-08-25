import mongoose, { Document, Schema } from 'mongoose';

export interface IMentoringRecord extends Document {
  student: mongoose.Types.ObjectId;
  mentor: mongoose.Types.ObjectId;
  meetingDate: Date;
  academicIssues?: string;
  careerIssues?: string;
  personalIssues?: string;
  discussions: string;
  feedback: string;
  actionItems: {
    task: string;
    targetDate?: Date;
    completed: boolean;
  }[];
  followUpDate?: Date;
  status: 'Scheduled' | 'Completed' | 'Pending Follow-up';
  aiAlert?: {
    riskLevel: 'Low' | 'Medium' | 'High';
    reasons: string[];
    suggestedAction: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MentoringRecordSchema = new Schema<IMentoringRecord>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mentor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    meetingDate: { type: Date, required: true, default: Date.now },
    academicIssues: { type: String, default: '' },
    careerIssues: { type: String, default: '' },
    personalIssues: { type: String, default: '' },
    discussions: { type: String, required: true },
    feedback: { type: String, default: '' },
    actionItems: [
      {
        task: { type: String, required: true },
        targetDate: { type: Date },
        completed: { type: Boolean, default: false },
        _id: false
      }
    ],
    followUpDate: { type: Date },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Pending Follow-up'],
      default: 'Completed'
    },
    aiAlert: {
      riskLevel: { type: String, enum: ['Low', 'Medium', 'High'] },
      reasons: [{ type: String }],
      suggestedAction: { type: String }
    }
  },
  { timestamps: true }
);

MentoringRecordSchema.index({ student: 1, meetingDate: -1 });

export const MentoringRecord = mongoose.model<IMentoringRecord>('MentoringRecord', MentoringRecordSchema);
