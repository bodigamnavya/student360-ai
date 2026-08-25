import mongoose, { Document, Schema } from 'mongoose';

export interface IInternship extends Document {
  student: mongoose.Types.ObjectId;
  company: string;
  role: string;
  location: string;
  locationType: 'On-site' | 'Remote' | 'Hybrid';
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  stipend?: string;
  technologies: string[];
  description: string;
  skillsAcquired: string[];
  certificateUrl?: string;
  offerLetterUrl?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipSchema = new Schema<IInternship>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, default: 'Bengaluru, India' },
    locationType: { type: String, enum: ['On-site', 'Remote', 'Hybrid'], default: 'Remote' },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    stipend: { type: String, default: '' },
    technologies: [{ type: String, trim: true }],
    description: { type: String, required: true },
    skillsAcquired: [{ type: String, trim: true }],
    certificateUrl: { type: String },
    offerLetterUrl: { type: String },
    verified: { type: Boolean, default: true }
  },
  { timestamps: true }
);

InternshipSchema.index({ student: 1, startDate: -1 });

export const Internship = mongoose.model<IInternship>('Internship', InternshipSchema);
