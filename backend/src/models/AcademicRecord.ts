import mongoose, { Document, Schema } from 'mongoose';

export interface ISubjectMark {
  subjectCode: string;
  subjectName: string;
  credits: number;
  internalMarks: number;
  maxInternalMarks: number;
  externalMarks: number;
  maxExternalMarks: number;
  totalMarks: number;
  grade: string;
  gradePoints: number;
  status: 'Pass' | 'Fail' | 'Detained';
}

export interface IAcademicRecord extends Document {
  student: mongoose.Types.ObjectId;
  semester: number;
  academicYear: string;
  subjects: ISubjectMark[];
  sgpa: number;
  cgpaAfterSemester: number;
  totalCredits: number;
  earnedCredits: number;
  backlogsInSemester: number;
  isCleared: boolean;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectMarkSchema = new Schema<ISubjectMark>(
  {
    subjectCode: { type: String, required: true, uppercase: true, trim: true },
    subjectName: { type: String, required: true, trim: true },
    credits: { type: Number, required: true, default: 3 },
    internalMarks: { type: Number, default: 0 },
    maxInternalMarks: { type: Number, default: 30 },
    externalMarks: { type: Number, default: 0 },
    maxExternalMarks: { type: Number, default: 70 },
    totalMarks: { type: Number, default: 0 },
    grade: { type: String, default: 'A' },
    gradePoints: { type: Number, default: 8 },
    status: { type: String, enum: ['Pass', 'Fail', 'Detained'], default: 'Pass' }
  },
  { _id: false }
);

const AcademicRecordSchema = new Schema<IAcademicRecord>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    semester: { type: Number, required: true, min: 1, max: 10, index: true },
    academicYear: { type: String, default: '2025-2026' },
    subjects: [SubjectMarkSchema],
    sgpa: { type: Number, required: true, min: 0, max: 10 },
    cgpaAfterSemester: { type: Number, required: true, min: 0, max: 10 },
    totalCredits: { type: Number, default: 20 },
    earnedCredits: { type: Number, default: 20 },
    backlogsInSemester: { type: Number, default: 0 },
    isCleared: { type: Boolean, default: true },
    remarks: { type: String }
  },
  { timestamps: true }
);

AcademicRecordSchema.index({ student: 1, semester: 1 }, { unique: true });

export const AcademicRecord = mongoose.model<IAcademicRecord>('AcademicRecord', AcademicRecordSchema);
