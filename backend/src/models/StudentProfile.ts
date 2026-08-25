import mongoose, { Document, Schema } from 'mongoose';

export interface IStudentProfile extends Document {
  user: mongoose.Types.ObjectId;
  rollNumber: string;
  admissionNumber?: string;
  college: string;
  department: string;
  degree: string;
  batch: string;
  currentYear: number;
  currentSemester: number;
  section?: string;
  dateOfBirth?: Date;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  careerObjective?: string;
  targetRole?: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    leetcode?: string;
    codechef?: string;
    hackerRank?: string;
  };
  mentor?: mongoose.Types.ObjectId;
  cgpa: number;
  totalBacklogs: number;
  activeBacklogs: number;
  placementStatus: 'Not Eligible' | 'Eligible' | 'Placed' | 'Opted Out';
  placementReadinessScore: number;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  isPublicPortfolio: boolean;
  publicSlug: string;
  publicSections: {
    about: boolean;
    academics: boolean;
    skills: boolean;
    projects: boolean;
    internships: boolean;
    certifications: boolean;
    achievements: boolean;
    contact: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    rollNumber: { type: String, required: true, unique: true, trim: true, uppercase: true, index: true },
    admissionNumber: { type: String, trim: true },
    college: { type: String, default: 'Institute of Technology & Science' },
    department: { type: String, required: true, index: true },
    degree: { type: String, default: 'B.Tech' },
    batch: { type: String, default: '2023-2027', index: true },
    currentYear: { type: Number, default: 3, min: 1, max: 5 },
    currentSemester: { type: Number, default: 6, min: 1, max: 10 },
    section: { type: String, default: 'A' },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'], default: 'Male' },
    phone: { type: String, trim: true },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' }
    },
    careerObjective: { type: String, default: '' },
    targetRole: { type: String, default: 'Software Engineer', index: true },
    socialLinks: {
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      leetcode: { type: String, default: '' },
      codechef: { type: String, default: '' },
      hackerRank: { type: String, default: '' }
    },
    mentor: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    cgpa: { type: Number, default: 0.0, min: 0, max: 10, index: true },
    totalBacklogs: { type: Number, default: 0, min: 0 },
    activeBacklogs: { type: Number, default: 0, min: 0, index: true },
    placementStatus: {
      type: String,
      enum: ['Not Eligible', 'Eligible', 'Placed', 'Opted Out'],
      default: 'Eligible',
      index: true
    },
    placementReadinessScore: { type: Number, default: 0, min: 0, max: 100, index: true },
    riskScore: { type: Number, default: 0, min: 0, max: 100, index: true },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low', index: true },
    isPublicPortfolio: { type: Boolean, default: true, index: true },
    publicSlug: { type: String, unique: true, lowercase: true, trim: true, index: true },
    publicSections: {
      about: { type: Boolean, default: true },
      academics: { type: Boolean, default: true },
      skills: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      internships: { type: Boolean, default: true },
      certifications: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
      contact: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

StudentProfileSchema.index({ department: 1, currentYear: 1, cgpa: -1 });

export const StudentProfile = mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
