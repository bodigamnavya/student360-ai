import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  company: string;
  companyLogo?: string;
  jobRole: string;
  jobType: 'Full-time' | 'Internship' | 'Internship + PPO';
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minCgpa: number;
  maxBacklogsAllowed: number;
  eligibleBranches: string[];
  graduationYears: string[];
  location: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  applicationDeadline: Date;
  driveDate?: Date;
  status: 'Open' | 'Closed' | 'Draft';
  createdBy: mongoose.Types.ObjectId;
  totalApplicants: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    company: { type: String, required: true, trim: true, index: true },
    companyLogo: { type: String, default: '' },
    jobRole: { type: String, required: true, trim: true, index: true },
    jobType: {
      type: String,
      enum: ['Full-time', 'Internship', 'Internship + PPO'],
      default: 'Full-time'
    },
    description: { type: String, required: true },
    requiredSkills: [{ type: String, trim: true }],
    preferredSkills: [{ type: String, trim: true }],
    minCgpa: { type: Number, default: 6.0 },
    maxBacklogsAllowed: { type: Number, default: 0 },
    eligibleBranches: [{ type: String, trim: true }],
    graduationYears: [{ type: String, trim: true }],
    location: { type: String, default: 'Bengaluru / Hyderabad' },
    salaryRange: {
      min: { type: Number, default: 6 },
      max: { type: Number, default: 12 },
      currency: { type: String, default: 'LPA' }
    },
    applicationDeadline: { type: Date, required: true },
    driveDate: { type: Date },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Draft'],
      default: 'Open',
      index: true
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    totalApplicants: { type: Number, default: 0 }
  },
  { timestamps: true }
);

JobSchema.index({ status: 1, applicationDeadline: 1 });

export const Job = mongoose.model<IJob>('Job', JobSchema);
