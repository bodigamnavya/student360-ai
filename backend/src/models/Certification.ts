import mongoose, { Document, Schema } from 'mongoose';

export interface ICertification extends Document {
  student: mongoose.Types.ObjectId;
  title: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  doesNotExpire: boolean;
  credentialId?: string;
  credentialUrl?: string;
  certificateFileUrl?: string;
  extractedSkills: string[];
  category: string;
  verified: boolean;
  aiExtracted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificationSchema = new Schema<ICertification>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date },
    doesNotExpire: { type: Boolean, default: true },
    credentialId: { type: String, default: '' },
    credentialUrl: { type: String, default: '' },
    certificateFileUrl: { type: String },
    extractedSkills: [{ type: String, trim: true }],
    category: { type: String, default: 'Technical' },
    verified: { type: Boolean, default: true },
    aiExtracted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

CertificationSchema.index({ student: 1, issueDate: -1 });

export const Certification = mongoose.model<ICertification>('Certification', CertificationSchema);
