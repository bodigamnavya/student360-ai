import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType =
  | 'attendance_warning'
  | 'academic_alert'
  | 'mentoring_followup'
  | 'job_deadline'
  | 'application_status'
  | 'cert_expiry'
  | 'skill_recommendation'
  | 'exam_reminder'
  | 'system';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  meta?: any;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: [
        'attendance_warning',
        'academic_alert',
        'mentoring_followup',
        'job_deadline',
        'application_status',
        'cert_expiry',
        'skill_recommendation',
        'exam_reminder',
        'system'
      ],
      required: true,
      index: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false, index: true },
    meta: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
