import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { StudentProfile } from '../models/StudentProfile';
import { Skill } from '../models/Skill';
import { Project } from '../models/Project';
import { Internship } from '../models/Internship';
import { Certification } from '../models/Certification';
import { CareerGoal } from '../models/CareerGoal';
import { CareerRecommendationService } from '../services/ai/CareerRecommendationService';
import { SkillGapService } from '../services/ai/SkillGapService';
import { CareerChatService } from '../services/ai/CareerChatService';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getCareerRecommendations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.query.studentId || req.user?._id;

  const [profile, skills, projects, internships, certifications] = await Promise.all([
    StudentProfile.findOne({ user: studentId }),
    Skill.find({ student: studentId }),
    Project.find({ student: studentId }),
    Internship.find({ student: studentId }),
    Certification.find({ student: studentId })
  ]);

  const result = CareerRecommendationService.analyze({
    studentName: req.user?.name || 'Student',
    cgpa: profile?.cgpa || 8.0,
    skills: skills.map((s) => s.name),
    projects: projects.map((p) => ({ title: p.title, technologies: p.technologies })),
    internships: internships.map((i) => ({ role: i.role, company: i.company, technologies: i.technologies })),
    certifications: certifications.map((c) => ({ title: c.title })),
    targetRole: profile?.targetRole
  });

  return sendSuccess(res, 'AI Career recommendations generated', result);
});

export const getSkillGapAnalysis = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.query.studentId || req.user?._id;
  const targetRole = (req.query.role as string) || 'Software Engineer';

  const skills = await Skill.find({ student: studentId });

  const result = SkillGapService.analyzeRoleGap({
    targetRole,
    studentSkills: skills.map((s) => ({ name: s.name, proficiency: s.proficiency }))
  });

  return sendSuccess(res, `Skill gap analysis for ${targetRole}`, result);
});

export const chatWithCareerAssistant = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const { messages, userPrompt } = req.body;

  if (!userPrompt || userPrompt.trim() === '') {
    return sendError(res, 'User prompt is required', 400);
  }

  const [profile, skills, projects, internships] = await Promise.all([
    StudentProfile.findOne({ user: studentId }),
    Skill.find({ student: studentId }),
    Project.find({ student: studentId }),
    Internship.find({ student: studentId })
  ]);

  const result = await CareerChatService.generateResponse({
    studentContext: {
      name: req.user?.name || 'Student',
      cgpa: profile?.cgpa || 8.2,
      department: req.user?.department || 'Computer Science and Engineering',
      targetRole: profile?.targetRole || 'Software Development Engineer',
      placementReadiness: profile?.placementReadinessScore || 78,
      riskScore: profile?.riskScore || 25,
      riskLevel: profile?.riskLevel || 'Low',
      skills: skills.map((s) => s.name),
      projects: projects.map((p) => p.title),
      internships: internships.map((i) => `${i.role} at ${i.company}`),
      activeBacklogs: profile?.activeBacklogs || 0,
      attendancePercentage: 84
    },
    messages: messages || [],
    userPrompt
  });

  return sendSuccess(res, 'AI Career Assistant response', result);
});

export const getCareerGoal = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  let goal = await CareerGoal.findOne({ student: studentId });
  if (!goal) {
    goal = await CareerGoal.create({
      student: studentId,
      targetRole: 'Software Development Engineer',
      targetIndustry: 'Information Technology & Software',
      desiredSalaryMin: 8,
      desiredSalaryMax: 18,
      preferredLocations: ['Bengaluru', 'Hyderabad', 'Remote'],
      timeline: 'Graduation 2027',
      targetCompanies: ['Google', 'Microsoft', 'Amazon', 'Atlassian', 'Uber'],
      readinessPercentage: 78
    });
  }
  return sendSuccess(res, 'Career goal retrieved', goal);
});

export const saveCareerGoal = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const goal = await CareerGoal.findOneAndUpdate(
    { student: studentId },
    { $set: { student: studentId, ...req.body } },
    { upsert: true, new: true, runValidators: true }
  );

  if (req.body.targetRole) {
    await StudentProfile.findOneAndUpdate({ user: studentId }, { targetRole: req.body.targetRole });
  }

  return sendSuccess(res, 'Career goal updated', goal);
});
