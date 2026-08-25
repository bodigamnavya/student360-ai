import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { MentoringRecord } from '../models/MentoringRecord';
import { StudentProfile } from '../models/StudentProfile';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getMentoringRecords = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.query.studentId || req.user?._id;
  const records = await MentoringRecord.find({ student: studentId })
    .populate('mentor', 'name email department avatar')
    .populate('student', 'name email department avatar')
    .sort({ meetingDate: -1 });

  return sendSuccess(res, 'Mentoring records retrieved', records);
});

export const addMentoringRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const mentorId = req.user?._id;
  const { studentId, meetingDate, discussions, feedback, actionItems, followUpDate, academicIssues, careerIssues, status } = req.body;

  if (!studentId) {
    return sendError(res, 'Student ID is required', 400);
  }

  // Generate automated AI mentor alert based on student profile
  const profile = await StudentProfile.findOne({ user: studentId });
  const reasons: string[] = [];
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';

  if (profile) {
    if (profile.cgpa < 6.5) reasons.push('Low CGPA (< 6.5)');
    if (profile.activeBacklogs > 0) reasons.push(`${profile.activeBacklogs} active backlogs`);
    if (profile.riskLevel === 'High') {
      reasons.push('High systemic risk prediction');
      riskLevel = 'High';
    } else if (profile.riskLevel === 'Medium') {
      riskLevel = 'Medium';
    }
  }

  const record = await MentoringRecord.create({
    student: studentId,
    mentor: mentorId,
    meetingDate: meetingDate || new Date(),
    discussions,
    feedback,
    academicIssues,
    careerIssues,
    actionItems: actionItems || [],
    followUpDate,
    status: status || 'Completed',
    aiAlert: {
      riskLevel,
      reasons: reasons.length > 0 ? reasons : ['General periodic progress review'],
      suggestedAction: riskLevel === 'High' ? 'Create a 30-day strict academic improvement roadmap.' : 'Reinforce DSA and interview preparation consistency.'
    }
  });

  return sendSuccess(res, 'Mentoring session recorded', record, 201);
});

export const updateMentoringRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const record = await MentoringRecord.findByIdAndUpdate(id, req.body, { new: true });
  if (!record) return sendError(res, 'Mentoring record not found', 404);
  return sendSuccess(res, 'Mentoring record updated', record);
});
