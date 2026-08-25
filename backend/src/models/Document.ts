import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDocument extends MongooseDocument {
  student: mongoose.Types.ObjectId;
  name: string;
  category: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true }
}, { timestamps: true });

export const DocumentModel = mongoose.model<IDocument>('Document', DocumentSchema);
