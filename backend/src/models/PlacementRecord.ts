import mongoose, { Document, Schema } from 'mongoose';

export interface IPlacementRecord extends Document {
  student: mongoose.Types.ObjectId;
  job?: mongoose.Types.ObjectId;
  company: string;
  jobRole: string;
  salaryCtcLpa: number;
  offerType: 'On-Campus' | 'Off-Campus' | 'PPO' | 'Pool Campus';
  offerDate: Date;
  joiningDate?: Date;
  offerLetterUrl?: string;
  department: string;
  batch: string;
  isDreamCompany: boolean;
  status: 'Accepted' | 'Declined' | 'Pending Decision';
  createdAt: Date;
  updatedAt: Date;
}

const PlacementRecordSchema = new Schema<IPlacementRecord>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    job: { type: Schema.Types.ObjectId, ref: 'Job' },
    company: { type: String, required: true, trim: true, index: true },
    jobRole: { type: String, required: true, trim: true },
    salaryCtcLpa: { type: Number, required: true },
    offerType: {
      type: String,
      enum: ['On-Campus', 'Off-Campus', 'PPO', 'Pool Campus'],
      default: 'On-Campus'
    },
    offerDate: { type: Date, required: true, default: Date.now },
    joiningDate: { type: Date },
    offerLetterUrl: { type: String },
    department: { type: String, required: true, index: true },
    batch: { type: String, required: true, index: true },
    isDreamCompany: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['Accepted', 'Declined', 'Pending Decision'],
      default: 'Accepted',
      index: true
    }
  },
  { timestamps: true }
);

export const PlacementRecord = mongoose.model<IPlacementRecord>('PlacementRecord', PlacementRecordSchema);
