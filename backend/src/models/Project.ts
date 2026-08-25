import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  student: mongoose.Types.ObjectId;
  title: string;
  description: string;
  domain: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  teamMembers?: string[];
  startDate?: Date;
  endDate?: Date;
  isOngoing: boolean;
  status: 'In Progress' | 'Completed' | 'Archived';
  reportUrl?: string;
  images?: string[];
  aiAnalysis?: {
    detectedSkills: string[];
    domain: string;
    complexityLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    resumeBullets: string[];
    suggestedImprovements: string[];
  };
  folder?: mongoose.Types.ObjectId;
  folderName?: string;
  files?: {
    fileName: string;
    fileType: string;
    fileSize: number;
    storageUrl: string;
    uploadedAt: Date;
  }[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    domain: { type: String, default: 'Web Development', index: true },
    technologies: [{ type: String, trim: true }],
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    teamMembers: [{ type: String }],
    startDate: { type: Date },
    endDate: { type: Date },
    isOngoing: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Archived'],
      default: 'Completed',
      index: true
    },
    reportUrl: { type: String },
    images: [{ type: String }],
    aiAnalysis: {
      detectedSkills: [{ type: String }],
      domain: { type: String },
      complexityLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
      resumeBullets: [{ type: String }],
      suggestedImprovements: [{ type: String }]
    },
    folder: { type: Schema.Types.ObjectId, ref: 'ProjectFolder', index: true },
    folderName: { type: String, default: 'General' },
    files: [
      {
        fileName: { type: String, required: true },
        fileType: { type: String, required: true },
        fileSize: { type: Number, required: true },
        storageUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

ProjectSchema.index({ student: 1, createdAt: -1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
