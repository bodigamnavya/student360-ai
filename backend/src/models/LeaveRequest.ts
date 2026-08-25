import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaveRequest extends Document {
  student: mongoose.Types.ObjectId;
  from: Date;
  to: Date;
  reason: string;
  description?: string;
  attachment?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LeaveRequestSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  reason: { type: String, required: true },
  description: { type: String },
  attachment: { type: String },
  status: { 
    type: String, 
    default: 'Pending',
    enum: ['Pending', 'Approved', 'Rejected']
  },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const LeaveRequest = mongoose.model<ILeaveRequest>('LeaveRequest', LeaveRequestSchema);
