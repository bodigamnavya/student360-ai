import mongoose, { Document, Schema } from 'mongoose';

export type ExamType = 'GATE' | 'GRE' | 'CAT' | 'IELTS' | 'TOEFL' | 'GMAT' | 'UPSC' | 'Other';

export interface IMockScore {
  testName: string;
  date: Date;
  score: number;
  maxScore: number;
  percentile?: number;
}

export interface IStudyPlanTask {
  week: number;
  title: string;
  topics: string[];
  isCompleted: boolean;
}

export interface ICompetitiveExam extends Document {
  student: mongoose.Types.ObjectId;
  examType: ExamType;
  examName: string;
  targetScore: string;
  currentScore?: string;
  examDate?: Date;
  registered: boolean;
  registrationNumber?: string;
  preparationProgress: number; // 0 to 100
  studyHoursPerWeek: number;
  mockScores: IMockScore[];
  studyPlan: IStudyPlanTask[];
  scoreCardUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MockScoreSchema = new Schema<IMockScore>(
  {
    testName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    percentile: { type: Number }
  },
  { _id: false }
);

const StudyPlanTaskSchema = new Schema<IStudyPlanTask>(
  {
    week: { type: Number, required: true },
    title: { type: String, required: true },
    topics: [{ type: String }],
    isCompleted: { type: Boolean, default: false }
  },
  { _id: false }
);

const CompetitiveExamSchema = new Schema<ICompetitiveExam>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    examType: {
      type: String,
      enum: ['GATE', 'GRE', 'CAT', 'IELTS', 'TOEFL', 'GMAT', 'UPSC', 'Other'],
      required: true
    },
    examName: { type: String, required: true },
    targetScore: { type: String, required: true },
    currentScore: { type: String },
    examDate: { type: Date },
    registered: { type: Boolean, default: false },
    registrationNumber: { type: String },
    preparationProgress: { type: Number, default: 40, min: 0, max: 100 },
    studyHoursPerWeek: { type: Number, default: 15 },
    mockScores: [MockScoreSchema],
    studyPlan: [StudyPlanTaskSchema],
    scoreCardUrl: { type: String }
  },
  { timestamps: true }
);

export const CompetitiveExam = mongoose.model<ICompetitiveExam>('CompetitiveExam', CompetitiveExamSchema);
