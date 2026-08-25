import mongoose, { Document, Schema } from 'mongoose';

export type ApplicationStage =
  | 'Applied'
  | 'Shortlisted'
  | 'Online Assessment'
  | 'Technical Interview'
  | 'HR Interview'
  | 'Selected'
  | 'Rejected'
  | 'Offer Accepted'
  | 'Offer Declined';

export interface IJobApplication extends Document {
  job: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  currentStage: ApplicationStage;
  aiMatchScore: number;
  aiMatchDetails?: {
    strengths: string[];
    gaps: string[];
    isEligible: boolean;
    ineligibilityReasons?: string[];
  };
  resumeUrl?: string;
  appliedDate: Date;
  stageHistory: {
    stage: ApplicationStage;
    updatedAt: Date;
    notes?: string;
    scheduledTime?: Date;
  }[];
  notes?: string;
  offerDetails?: {
    ctc: number;
    joiningDate?: Date;
    offerLetterUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    currentStage: {
      type: String,
      enum: [
        'Applied',
        'Shortlisted',
        'Online Assessment',
        'Technical Interview',
        'HR Interview',
        'Selected',
        'Rejected',
        'Offer Accepted',
        'Offer Declined'
      ],
      default: 'Applied',
      index: true
    },
    aiMatchScore: { type: Number, default: 0, min: 0, max: 100 },
    aiMatchDetails: {
      strengths: [{ type: String }],
      gaps: [{ type: String }],
      isEligible: { type: Boolean, default: true },
      ineligibilityReasons: [{ type: String }]
    },
    resumeUrl: { type: String },
    appliedDate: { type: Date, default: Date.now },
    stageHistory: [
      {
        stage: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now },
        notes: { type: String },
        scheduledTime: { type: Date },
        _id: false
      }
    ],
    notes: { type: String },
    offerDetails: {
      ctc: { type: Number },
      joiningDate: { type: Date },
      offerLetterUrl: { type: String }
    }
  },
  { timestamps: true }
);

JobApplicationSchema.index({ job: 1, student: 1 }, { unique: true });

export const JobApplication = mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
