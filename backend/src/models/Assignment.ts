import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  student: mongoose.Types.ObjectId;
  title: string;
  subject: string;
  description: string;
  dueDate: Date;
  status: 'Pending' | 'In Progress' | 'Submitted' | 'Late' | 'Graded' | 'Overdue';
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    default: 'Pending',
    enum: ['Pending', 'In Progress', 'Submitted', 'Late', 'Graded', 'Overdue']
  },
  attachments: [{ type: String }]
}, { timestamps: true });

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
