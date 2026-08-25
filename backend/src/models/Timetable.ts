import mongoose, { Schema, Document } from 'mongoose';

export interface ITimetable extends Document {
  subject: string;
  faculty: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  room: string;
  section: string;
  department: string;
  year: number;
  semester: number;
  createdAt: Date;
  updatedAt: Date;
}

const TimetableSchema = new Schema({
  subject: { type: String, required: true },
  faculty: { type: String, required: true },
  day: { 
    type: String, 
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  startTime: { type: String, required: true }, // e.g. "09:00"
  endTime: { type: String, required: true }, // e.g. "10:00"
  room: { type: String, required: true },
  section: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: Number, required: true },
  semester: { type: Number, required: true }
}, { timestamps: true });

export const Timetable = mongoose.model<ITimetable>('Timetable', TimetableSchema);
