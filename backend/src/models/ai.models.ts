import mongoose, { Document, Schema } from 'mongoose';

// 1. Weekly Action Plan Model
export interface IWeeklyTask {
  id: string;
  title: string;
  category: 'DSA' | 'Development' | 'Resume' | 'Application' | 'Interview' | 'Core CS' | 'General';
  completed: boolean;
  dueDate?: string;
  notes?: string;
}

export interface IWeeklyActionPlan extends Document {
  student: mongoose.Types.ObjectId;
  weekNumber: number;
  year: number;
  startDate: Date;
  endDate: Date;
  tasks: IWeeklyTask[];
  completionRate: number;
  aiFeedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WeeklyActionPlanSchema = new Schema<IWeeklyActionPlan>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    weekNumber: { type: Number, required: true },
    year: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    tasks: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        category: {
          type: String,
          enum: ['DSA', 'Development', 'Resume', 'Application', 'Interview', 'Core CS', 'General'],
          default: 'General'
        },
        completed: { type: Boolean, default: false },
        dueDate: { type: String },
        notes: { type: String }
      }
    ],
    completionRate: { type: Number, default: 0 },
    aiFeedback: { type: String }
  },
  { timestamps: true }
);

WeeklyActionPlanSchema.index({ student: 1, year: 1, weekNumber: 1 }, { unique: true });

export const WeeklyActionPlan = mongoose.model<IWeeklyActionPlan>('WeeklyActionPlan', WeeklyActionPlanSchema);

// 2. Personalized Learning Roadmap Model
export interface IRoadmapStep {
  month: number;
  title: string;
  skill: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration: string;
  learningObjective: string;
  practiceTasks: string[];
  projectTask: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Skipped';
}

export interface ILearningRoadmapRecord extends Document {
  student: mongoose.Types.ObjectId;
  targetRole: string;
  overallReadiness: number;
  steps: IRoadmapStep[];
  status: 'Active' | 'Archived' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}

const LearningRoadmapSchema = new Schema<ILearningRoadmapRecord>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetRole: { type: String, required: true },
    overallReadiness: { type: Number, default: 0 },
    steps: [
      {
        month: { type: Number, required: true },
        title: { type: String, required: true },
        skill: { type: String, required: true },
        difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
        estimatedDuration: { type: String, default: '4 weeks' },
        learningObjective: { type: String, required: true },
        practiceTasks: [{ type: String }],
        projectTask: { type: String, required: true },
        status: { type: String, enum: ['Not Started', 'In Progress', 'Completed', 'Skipped'], default: 'Not Started' }
      }
    ],
    status: { type: String, enum: ['Active', 'Archived', 'Completed'], default: 'Active' }
  },
  { timestamps: true }
);

LearningRoadmapSchema.index({ student: 1, targetRole: 1 });

export const LearningRoadmapRecord = mongoose.model<ILearningRoadmapRecord>('LearningRoadmapRecord', LearningRoadmapSchema);

// 3. AI Interview Coach & Mock Interview Session Model
export interface IInterviewQnA {
  questionNumber: number;
  question: string;
  category: 'Technical' | 'HR' | 'Behavioral' | 'Project-based';
  studentAnswer?: string;
  evaluation?: {
    technicalAccuracy: number;
    communication: number;
    clarity: number;
    structure: number;
    relevance: number;
    overallScore: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    sampleIdealAnswer: string;
  };
  answeredAt?: Date;
}

export interface IInterviewSession extends Document {
  student: mongoose.Types.ObjectId;
  role: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior';
  interviewType: 'Technical' | 'HR' | 'Behavioral' | 'Project-based' | 'Comprehensive Mock';
  status: 'In Progress' | 'Completed' | 'Abandoned';
  currentQuestionIndex: number;
  questions: IInterviewQnA[];
  finalReport?: {
    technicalScore: number;
    communicationScore: number;
    confidenceScore: number;
    problemSolvingScore: number;
    overallScore: number;
    strongAreas: string[];
    weakAreas: string[];
    recommendedTopics: string[];
    summary: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSessionSchema = new Schema<IInterviewSession>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, required: true },
    experienceLevel: { type: String, enum: ['Entry', 'Mid', 'Senior'], default: 'Entry' },
    interviewType: {
      type: String,
      enum: ['Technical', 'HR', 'Behavioral', 'Project-based', 'Comprehensive Mock'],
      default: 'Comprehensive Mock'
    },
    status: { type: String, enum: ['In Progress', 'Completed', 'Abandoned'], default: 'In Progress' },
    currentQuestionIndex: { type: Number, default: 0 },
    questions: [
      {
        questionNumber: { type: Number, required: true },
        question: { type: String, required: true },
        category: { type: String, enum: ['Technical', 'HR', 'Behavioral', 'Project-based'], default: 'Technical' },
        studentAnswer: { type: String },
        evaluation: {
          technicalAccuracy: Number,
          communication: Number,
          clarity: Number,
          structure: Number,
          relevance: Number,
          overallScore: Number,
          feedback: String,
          strengths: [String],
          improvements: [String],
          sampleIdealAnswer: String
        },
        answeredAt: Date
      }
    ],
    finalReport: {
      technicalScore: Number,
      communicationScore: Number,
      confidenceScore: Number,
      problemSolvingScore: Number,
      overallScore: Number,
      strongAreas: [String],
      weakAreas: [String],
      recommendedTopics: [String],
      summary: String
    }
  },
  { timestamps: true }
);

InterviewSessionSchema.index({ student: 1, createdAt: -1 });

export const InterviewSession = mongoose.model<IInterviewSession>('InterviewSession', InterviewSessionSchema);

// 4. AI Career Chat Session Model
export interface IChatMessage {
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  suggestedActions?: string[];
}

export interface IChatSession extends Document {
  student: mongoose.Types.ObjectId;
  title: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatSessionSchema = new Schema<IChatSession>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'Career Planning Session' },
    messages: [
      {
        sender: { type: String, enum: ['user', 'assistant', 'system'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        suggestedActions: [{ type: String }]
      }
    ]
  },
  { timestamps: true }
);

ChatSessionSchema.index({ student: 1, updatedAt: -1 });

export const ChatSession = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);

// 5. Opportunity Recommendation Feed Item Model
export interface IOpportunityRecommendation extends Document {
  student: mongoose.Types.ObjectId;
  title: string;
  type: 'Job' | 'Internship' | 'Hackathon' | 'Workshop' | 'Certification' | 'Competition' | 'Research';
  provider: string;
  location?: string;
  deadline?: string;
  matchScore: number;
  matchReasons: string[];
  requiredSkills: string[];
  url?: string;
  saved: boolean;
  applied: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OpportunityRecommendationSchema = new Schema<IOpportunityRecommendation>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['Job', 'Internship', 'Hackathon', 'Workshop', 'Certification', 'Competition', 'Research'],
      required: true
    },
    provider: { type: String, required: true },
    location: { type: String },
    deadline: { type: String },
    matchScore: { type: Number, required: true },
    matchReasons: [{ type: String }],
    requiredSkills: [{ type: String }],
    url: { type: String },
    saved: { type: Boolean, default: false },
    applied: { type: Boolean, default: false }
  },
  { timestamps: true }
);

OpportunityRecommendationSchema.index({ student: 1, matchScore: -1 });

export const OpportunityRecommendation = mongoose.model<IOpportunityRecommendation>(
  'OpportunityRecommendation',
  OpportunityRecommendationSchema
);

// 6. Resume Optimization & Job Fit Record
export interface IResumeOptimizationRecord extends Document {
  student: mongoose.Types.ObjectId;
  targetRole: string;
  jobTitle: string;
  company?: string;
  jobDescriptionText: string;
  atsMatchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  missingSkills: string[];
  strongMatches: string[];
  weakAreas: string[];
  suggestedBulletImprovements: {
    original?: string;
    optimized: string;
    reason: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ResumeOptimizationRecordSchema = new Schema<IResumeOptimizationRecord>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetRole: { type: String, required: true },
    jobTitle: { type: String, required: true },
    company: { type: String },
    jobDescriptionText: { type: String, required: true },
    atsMatchScore: { type: Number, required: true },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    missingSkills: [{ type: String }],
    strongMatches: [{ type: String }],
    weakAreas: [{ type: String }],
    suggestedBulletImprovements: [
      {
        original: String,
        optimized: { type: String, required: true },
        reason: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

ResumeOptimizationRecordSchema.index({ student: 1, createdAt: -1 });

export const ResumeOptimizationRecord = mongoose.model<IResumeOptimizationRecord>(
  'ResumeOptimizationRecord',
  ResumeOptimizationRecordSchema
);
