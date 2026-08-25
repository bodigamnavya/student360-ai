import mongoose, { Document, Schema } from 'mongoose';

export interface IShortlistedUniversity {
  universityName: string;
  country: string;
  program: string;
  applicationDeadline?: Date;
  status: 'Shortlisted' | 'Applied' | 'Admitted' | 'Waitlisted' | 'Rejected';
  scholarshipOffered?: string;
  feesPerYear?: string;
  ranking?: string;
}

export interface IHigherEducation extends Document {
  student: mongoose.Types.ObjectId;
  targetDegree: 'MS' | 'MBA' | 'M.Tech' | 'PhD' | 'Other';
  targetField: string;
  targetCountries: string[];
  intakeYear: string;
  intakeSeason: 'Fall' | 'Spring' | 'Summer';
  sopStatus: 'Not Started' | 'Drafting' | 'Review' | 'Finalized';
  sopUrl?: string;
  lorCount: number;
  universities: IShortlistedUniversity[];
  aiGuidance?: {
    recommendedFields: string[];
    requiredExams: string[];
    requiredSkills: string[];
    applicationChecklist: string[];
    roadmap: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const ShortlistedUniversitySchema = new Schema<IShortlistedUniversity>(
  {
    universityName: { type: String, required: true },
    country: { type: String, required: true },
    program: { type: String, required: true },
    applicationDeadline: { type: Date },
    status: {
      type: String,
      enum: ['Shortlisted', 'Applied', 'Admitted', 'Waitlisted', 'Rejected'],
      default: 'Shortlisted'
    },
    scholarshipOffered: { type: String },
    feesPerYear: { type: String },
    ranking: { type: String }
  },
  { _id: false }
);

const HigherEducationSchema = new Schema<IHigherEducation>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    targetDegree: {
      type: String,
      enum: ['MS', 'MBA', 'M.Tech', 'PhD', 'Other'],
      default: 'MS'
    },
    targetField: { type: String, default: 'Computer Science' },
    targetCountries: [{ type: String, default: 'USA' }],
    intakeYear: { type: String, default: '2027' },
    intakeSeason: { type: String, enum: ['Fall', 'Spring', 'Summer'], default: 'Fall' },
    sopStatus: {
      type: String,
      enum: ['Not Started', 'Drafting', 'Review', 'Finalized'],
      default: 'Drafting'
    },
    sopUrl: { type: String },
    lorCount: { type: Number, default: 0 },
    universities: [ShortlistedUniversitySchema],
    aiGuidance: {
      recommendedFields: [{ type: String }],
      requiredExams: [{ type: String }],
      requiredSkills: [{ type: String }],
      applicationChecklist: [{ type: String }],
      roadmap: [{ type: String }]
    }
  },
  { timestamps: true }
);

export const HigherEducation = mongoose.model<IHigherEducation>('HigherEducation', HigherEducationSchema);
