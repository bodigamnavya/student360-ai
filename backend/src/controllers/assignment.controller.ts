import { Request, Response } from 'express';
import { Assignment } from '../models/Assignment';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAssignments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const assignments = await Assignment.find({ student: req.user?._id }).sort({ dueDate: 1 });
  return sendSuccess(res, 'Assignments fetched', assignments);
});

export const createAssignment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const assignment = await Assignment.create({ ...req.body, student: req.user?._id });
  return sendSuccess(res, 'Assignment created', assignment, 201);
});

export const updateAssignment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const assignment = await Assignment.findOneAndUpdate(
    { _id: req.params.id, student: req.user?._id },
    req.body,
    { new: true }
  );
  if (!assignment) return sendError(res, 'Assignment not found', 404);
  return sendSuccess(res, 'Assignment updated', assignment);
});

export const deleteAssignment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const assignment = await Assignment.findOneAndDelete({ _id: req.params.id, student: req.user?._id });
  if (!assignment) return sendError(res, 'Assignment not found', 404);
  return sendSuccess(res, 'Assignment deleted');
});
