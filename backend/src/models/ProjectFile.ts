import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectFile extends Document {
  student: mongoose.Types.ObjectId;
  project?: mongoose.Types.ObjectId;
  folder?: mongoose.Types.ObjectId;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageUrl: string;
  createdAt: Date;
}

const ProjectFileSchema = new Schema<IProjectFile>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', index: true },
    folder: { type: Schema.Types.ObjectId, ref: 'ProjectFolder', index: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    storageUrl: { type: String, required: true }
  },
  { timestamps: true }
);

ProjectFileSchema.index({ student: 1, project: 1 });

export const ProjectFile = mongoose.model<IProjectFile>('ProjectFile', ProjectFileSchema);
