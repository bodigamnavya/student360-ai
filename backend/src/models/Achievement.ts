import mongoose, { Document, Schema } from 'mongoose';

export type AchievementCategory =
  | 'Hackathon'
  | 'Competition'
  | 'Award'
  | 'Research'
  | 'Publication'
  | 'Certification'
  | 'Leadership'
  | 'Sports'
  | 'Cultural'
  | 'Academic'
  | 'Volunteering'
  | 'Other';

export interface IEvidenceMetadata {
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  fileUrl?: string;
  storageProvider?: string;
  uploadedAt?: Date;
  documentHash?: string;
}

export interface IAIAnalysisData {
  confidence?: number; // e.g. 0.92
  confidenceCategory?: 'High' | 'Medium' | 'Low';
  category?: string;
  impactLevel?: 'College' | 'Department' | 'University' | 'State' | 'National' | 'International' | 'Needs Review';
  careerRelevance?: 'High' | 'Medium' | 'Low';
  resumeValue?: 'Strong' | 'Moderate' | 'Fair';
  summary?: string;
  resumeBullet?: string;
  extractedSkills?: string[];
  certificateId?: string;
  credentialId?: string;
  credentialUrl?: string;
  competitionLevel?: string;
  analyzedAt?: Date;
}

export interface IAchievement extends Document {
  student: mongoose.Types.ObjectId;
  title: string;
  category: AchievementCategory;
  issuerOrg: string;
  date: Date;
  description: string;
  position?: string;
  evidenceUrl?: string;
  evidence?: IEvidenceMetadata;
  skillsDemonstrated: string[];
  aiCategorized: boolean;
  aiAnalysis?: IAIAnalysisData;
  documentHash?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        'Hackathon',
        'Competition',
        'Award',
        'Research',
        'Publication',
        'Certification',
        'Leadership',
        'Sports',
        'Cultural',
        'Academic',
        'Volunteering',
        'Other'
      ],
      required: true,
      index: true
    },
    issuerOrg: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    position: { type: String, default: 'Winner / Participant' },
    evidenceUrl: { type: String },
    evidence: {
      fileName: String,
      fileType: String,
      fileSize: Number,
      fileUrl: String,
      storageProvider: { type: String, default: 'local' },
      uploadedAt: Date,
      documentHash: String
    },
    skillsDemonstrated: [{ type: String, trim: true }],
    aiCategorized: { type: Boolean, default: false },
    aiAnalysis: {
      confidence: Number,
      confidenceCategory: String,
      category: String,
      impactLevel: String,
      careerRelevance: String,
      resumeValue: String,
      summary: String,
      resumeBullet: String,
      extractedSkills: [String],
      certificateId: String,
      credentialId: String,
      credentialUrl: String,
      competitionLevel: String,
      analyzedAt: Date
    },
    documentHash: { type: String, index: true },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

AchievementSchema.index({ student: 1, date: -1 });
AchievementSchema.index({ student: 1, title: 1, issuerOrg: 1 });

export const Achievement = mongoose.model<IAchievement>('Achievement', AchievementSchema);
