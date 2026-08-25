import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectFolder extends Document {
  student: mongoose.Types.ObjectId;
  name: string;
  parentFolder?: mongoose.Types.ObjectId;
  color?: string;
  projectCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectFolderSchema = new Schema<IProjectFolder>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    parentFolder: { type: Schema.Types.ObjectId, ref: 'ProjectFolder' },
    color: { type: String, default: '#6366f1' },
    projectCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

ProjectFolderSchema.index({ student: 1, name: 1 });

export const ProjectFolder = mongoose.model<IProjectFolder>('ProjectFolder', ProjectFolderSchema);
