import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Notification } from '../models/Notification';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 }).limit(30);
  const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });

  return sendSuccess(res, 'Notifications retrieved', { notifications, unreadCount });
});

export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const notification = await Notification.findOneAndUpdate(
    { _id: id, recipient: req.user?._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) return sendError(res, 'Notification not found', 404);
  return sendSuccess(res, 'Marked as read', notification);
});

export const markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  await Notification.updateMany({ recipient: req.user?._id, isRead: false }, { isRead: true });
  return sendSuccess(res, 'All notifications marked as read');
});

export const deleteNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const notification = await Notification.findOneAndDelete({ _id: id, recipient: req.user?._id });
  if (!notification) return sendError(res, 'Notification not found', 404);
  return sendSuccess(res, 'Notification removed');
});

export const createNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, message, type, link } = req.body;
  const notification = await Notification.create({
    recipient: req.user?._id,
    title,
    message,
    type: type || 'system',
    link: link || '/dashboard'
  });
  return sendSuccess(res, 'Notification created', notification, 201);
});

