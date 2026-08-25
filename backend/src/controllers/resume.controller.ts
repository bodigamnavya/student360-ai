import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Resume } from '../models/Resume';
import { StudentProfile } from '../models/StudentProfile';
import { AcademicRecord } from '../models/AcademicRecord';
import { Skill } from '../models/Skill';
import { Project } from '../models/Project';
import { Internship } from '../models/Internship';
import { Certification } from '../models/Certification';
import { Achievement } from '../models/Achievement';
import { ResumeGenerationService } from '../services/ai/ResumeGenerationService';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getResumes = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const resumes = await Resume.find({ student: studentId }).sort({ updatedAt: -1 });
  return sendSuccess(res, 'Resumes retrieved', resumes);
});

export const generateResumeData = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const { targetRole, template } = req.body;

  const [profile, academicRecords, skills, projects, internships, certifications, achievements] = await Promise.all([
    StudentProfile.findOne({ user: studentId }),
    AcademicRecord.find({ student: studentId }).sort({ semester: 1 }),
    Skill.find({ student: studentId }),
    Project.find({ student: studentId }),
    Internship.find({ student: studentId }),
    Certification.find({ student: studentId }),
    Achievement.find({ student: studentId })
  ]);

  const generated = ResumeGenerationService.generateFromProfile({
    user: { name: req.user?.name || 'Student Name', email: req.user?.email || 'student@university.edu' },
    profile,
    academicRecords,
    skills,
    projects,
    internships,
    certifications,
    achievements,
    targetRole,
    template: template || 'Modern'
  });

  return sendSuccess(res, 'AI Resume generated successfully', generated);
});

export const saveResume = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const resume = await Resume.create({
    student: studentId,
    ...req.body
  });
  return sendSuccess(res, 'Resume saved successfully', resume, 201);
});

export const updateResume = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const resume = await Resume.findOneAndUpdate(
    { _id: id, student: req.user?._id },
    { $set: req.body },
    { new: true }
  );
  if (!resume) return sendError(res, 'Resume not found', 404);
  return sendSuccess(res, 'Resume updated successfully', resume);
});

export const deleteResume = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const resume = await Resume.findOneAndDelete({ _id: id, student: req.user?._id });
  if (!resume) return sendError(res, 'Resume not found', 404);
  return sendSuccess(res, 'Resume deleted successfully');
});
