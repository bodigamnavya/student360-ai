import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Internship } from '../models/Internship';
import { Skill } from '../models/Skill';
import { Project } from '../models/Project';
import { StudentProfile } from '../models/StudentProfile';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getInternships = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.query.studentId || req.user?._id;
  const internships = await Internship.find({ student: studentId }).sort({ startDate: -1 });
  return sendSuccess(res, 'Internships retrieved', internships);
});

export const addInternship = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const internship = await Internship.create({
    student: studentId,
    ...req.body
  });
  return sendSuccess(res, 'Internship record added', internship, 201);
});

export const updateInternship = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const internship = await Internship.findOneAndUpdate(
    { _id: id, student: req.user?._id },
    { $set: req.body },
    { new: true }
  );
  if (!internship) return sendError(res, 'Internship not found', 404);
  return sendSuccess(res, 'Internship updated', internship);
});

export const deleteInternship = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const internship = await Internship.findOneAndDelete({ _id: id, student: req.user?._id });
  if (!internship) return sendError(res, 'Internship not found', 404);
  return sendSuccess(res, 'Internship deleted');
});

export const getInternshipRecommendations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const [skills, projects, profile] = await Promise.all([
    Skill.find({ student: studentId }),
    Project.find({ student: studentId }),
    StudentProfile.findOne({ user: studentId })
  ]);

  const skillNames = skills.map((s) => s.name);
  const targetRole = profile?.targetRole || 'Full Stack Developer';

  const recommendations = [
    {
      role: 'Backend Engineering Intern',
      companyType: 'Product SaaS / Fintech Scaleups',
      matchScore: 92,
      matchingSkills: skillNames.slice(0, 4),
      why: 'Strong alignment with your database, API design, and backend projects.',
      suggestedPlatforms: ['Wellfound', 'Internshala', 'LinkedIn Jobs']
    },
    {
      role: 'Full-Stack Developer Intern',
      companyType: 'Fast-Growing Startups',
      matchScore: 86,
      matchingSkills: skillNames.slice(0, 5),
      why: 'Demonstrated capability in Next.js, React, and REST services.',
      suggestedPlatforms: ['Y-Combinator Work at a Startup', 'Cutshort']
    },
    {
      role: 'Cloud & DevOps Intern',
      companyType: 'Enterprise Cloud Consultancies',
      matchScore: 78,
      matchingSkills: ['Docker', 'Linux', 'Git'],
      why: 'Upskilling in Kubernetes and AWS will make you a top contender.',
      suggestedPlatforms: ['LinkedIn Jobs', 'Naukri']
    }
  ];

  return sendSuccess(res, 'AI Internship recommendations', recommendations);
});
