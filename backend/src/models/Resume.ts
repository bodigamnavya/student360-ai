import mongoose, { Document, Schema } from 'mongoose';

export type ResumeTemplate = 'Modern' | 'Professional' | 'Minimal' | 'ATS-Friendly';

export interface IResume extends Document {
  student: mongoose.Types.ObjectId;
  title: string;
  template: ResumeTemplate;
  targetRole: string;
  summary: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  education: {
    institution: string;
    degree: string;
    department: string;
    startYear: string;
    endYear: string;
    cgpa: string;
  }[];
  skills: {
    category: string;
    skills: string[];
  }[];
  experience: {
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }[];
  projects: {
    title: string;
    technologies: string[];
    link?: string;
    bullets: string[];
  }[];
  certifications: {
    title: string;
    issuer: string;
    date: string;
    credentialId?: string;
  }[];
  achievements: string[];
  atsScore: number;
  atsFeedback: string[];
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, default: 'Software Engineer Resume' },
    template: {
      type: String,
      enum: ['Modern', 'Professional', 'Minimal', 'ATS-Friendly'],
      default: 'Modern'
    },
    targetRole: { type: String, default: 'Software Development Engineer' },
    summary: { type: String, required: true },
    personalInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' }
    },
    education: [
      {
        institution: String,
        degree: String,
        department: String,
        startYear: String,
        endYear: String,
        cgpa: String,
        _id: false
      }
    ],
    skills: [
      {
        category: String,
        skills: [String],
        _id: false
      }
    ],
    experience: [
      {
        company: String,
        role: String,
        location: String,
        startDate: String,
        endDate: String,
        bullets: [String],
        _id: false
      }
    ],
    projects: [
      {
        title: String,
        technologies: [String],
        link: String,
        bullets: [String],
        _id: false
      }
    ],
    certifications: [
      {
        title: String,
        issuer: String,
        date: String,
        credentialId: String,
        _id: false
      }
    ],
    achievements: [String],
    atsScore: { type: Number, default: 88, min: 0, max: 100 },
    atsFeedback: [String],
    isPrimary: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Resume = mongoose.model<IResume>('Resume', ResumeSchema);
