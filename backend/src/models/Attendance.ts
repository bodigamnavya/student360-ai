import mongoose, { Document, Schema } from 'mongoose';

export interface ISubjectAttendance {
  subjectCode: string;
  subjectName: string;
  facultyName?: string;
  classesHeld: number;
  classesAttended: number;
  attendancePercentage: number;
  status: 'Normal' | 'Shortage' | 'Critical';
}

export interface IAttendance extends Document {
  student: mongoose.Types.ObjectId;
  semester: number;
  academicYear: string;
  subjects: ISubjectAttendance[];
  totalClassesHeld: number;
  totalClassesAttended: number;
  overallPercentage: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  predictedFinalPercentage: number;
  monthlyTrend: {
    month: string;
    percentage: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const SubjectAttendanceSchema = new Schema<ISubjectAttendance>(
  {
    subjectCode: { type: String, required: true, uppercase: true, trim: true },
    subjectName: { type: String, required: true, trim: true },
    facultyName: { type: String, default: '' },
    classesHeld: { type: Number, required: true, default: 0 },
    classesAttended: { type: Number, required: true, default: 0 },
    attendancePercentage: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['Normal', 'Shortage', 'Critical'], default: 'Normal' }
  },
  { _id: false }
);

const AttendanceSchema = new Schema<IAttendance>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    semester: { type: Number, required: true, min: 1, max: 10, index: true },
    academicYear: { type: String, default: '2025-2026' },
    subjects: [SubjectAttendanceSchema],
    totalClassesHeld: { type: Number, default: 0 },
    totalClassesAttended: { type: Number, default: 0 },
    overallPercentage: { type: Number, default: 0, index: true },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low', index: true },
    predictedFinalPercentage: { type: Number, default: 0 },
    monthlyTrend: [
      {
        month: { type: String, required: true },
        percentage: { type: Number, required: true },
        _id: false
      }
    ]
  },
  { timestamps: true }
);

AttendanceSchema.index({ student: 1, semester: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
