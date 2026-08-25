import mongoose, { Schema, Document } from 'mongoose';

export interface IExam extends Document {
  student: mongoose.Types.ObjectId;
  name: string;
  subject: string;
  type: 'Internal' | 'Mid' | 'Semester' | 'Practical' | 'Project';
  date: Date;
  maximumMarks: number;
  obtainedMarks: number;
  grade: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['Internal', 'Mid', 'Semester', 'Practical', 'Project']
  },
  date: { type: Date, required: true },
  maximumMarks: { type: Number, required: true },
  obtainedMarks: { type: Number, required: true },
  grade: { type: String, required: true }
}, { timestamps: true });

export const Exam = mongoose.model<IExam>('Exam', ExamSchema);
