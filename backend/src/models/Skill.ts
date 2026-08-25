import mongoose, { Document, Schema } from 'mongoose';

export type SkillCategory =
  | 'Programming'
  | 'Web Development'
  | 'Database'
  | 'Cloud & DevOps'
  | 'AI / Machine Learning'
  | 'Core CS / Tools'
  | 'Soft Skills';

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface ISkill extends Document {
  student: mongoose.Types.ObjectId;
  name: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
  experienceMonths: number;
  evidence: {
    projects: mongoose.Types.ObjectId[];
    certifications: mongoose.Types.ObjectId[];
    internships: mongoose.Types.ObjectId[];
    assessmentScore?: number;
  };
  verified: boolean;
  isTopSkill: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        'Programming',
        'Web Development',
        'Database',
        'Cloud & DevOps',
        'AI / Machine Learning',
        'Core CS / Tools',
        'Soft Skills'
      ],
      required: true,
      index: true
    },
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate'
    },
    experienceMonths: { type: Number, default: 6 },
    evidence: {
      projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
      certifications: [{ type: Schema.Types.ObjectId, ref: 'Certification' }],
      internships: [{ type: Schema.Types.ObjectId, ref: 'Internship' }],
      assessmentScore: { type: Number, min: 0, max: 100 }
    },
    verified: { type: Boolean, default: true },
    isTopSkill: { type: Boolean, default: false }
  },
  { timestamps: true }
);

SkillSchema.index({ student: 1, name: 1 }, { unique: true });

export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
