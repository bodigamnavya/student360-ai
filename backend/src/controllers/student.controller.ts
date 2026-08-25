import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { StudentProfile } from '../models/StudentProfile';
import { User } from '../models/User';
import { AcademicRecord } from '../models/AcademicRecord';
import { Attendance } from '../models/Attendance';
import { Project } from '../models/Project';
import { Internship } from '../models/Internship';
import { Certification } from '../models/Certification';
import { Achievement } from '../models/Achievement';
import { Skill } from '../models/Skill';
import { AIInsight } from '../models/AIInsight';
import { PlacementReadinessService } from '../services/ai/PlacementReadinessService';
import { RiskAnalysisService } from '../services/ai/RiskAnalysisService';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { updateProfileSchema } from '../validators';

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.params.id || req.user?._id;
  const profile = await StudentProfile.findOne({ user: studentId })
    .populate('user', 'name email avatar department role')
    .populate('mentor', 'name email department avatar');

  if (!profile) {
    return sendError(res, 'Student profile not found', 404);
  }

  return sendSuccess(res, 'Student profile retrieved successfully', profile);
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const validated = updateProfileSchema.parse(req.body);

  if (validated.name && req.user) {
    await User.findByIdAndUpdate(req.user._id, { name: validated.name });
  }

  const profile = await StudentProfile.findOneAndUpdate(
    { user: req.user?._id },
    { $set: validated },
    { new: true, runValidators: true }
  ).populate('user', 'name email avatar department');

  return sendSuccess(res, 'Profile updated successfully', profile);
});

export const getPublicPortfolio = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const profile = await StudentProfile.findOne({ publicSlug: slug.toLowerCase() })
    .populate('user', 'name email avatar department');

  if (!profile || !profile.isPublicPortfolio) {
    return sendError(res, 'Portfolio not found or is set to private by the student.', 404);
  }

  const studentUserId = profile.user._id;

  // Retrieve allowed public components
  const [skills, projects, internships, certifications, achievements, academics] = await Promise.all([
    profile.publicSections.skills ? Skill.find({ student: studentUserId }).sort({ proficiency: -1 }) : [],
    profile.publicSections.projects ? Project.find({ student: studentUserId }).sort({ createdAt: -1 }) : [],
    profile.publicSections.internships ? Internship.find({ student: studentUserId }).sort({ startDate: -1 }) : [],
    profile.publicSections.certifications ? Certification.find({ student: studentUserId }).sort({ issueDate: -1 }) : [],
    profile.publicSections.achievements ? Achievement.find({ student: studentUserId }).sort({ date: -1 }) : [],
    profile.publicSections.academics ? AcademicRecord.find({ student: studentUserId }).sort({ semester: 1 }) : []
  ]);

  return sendSuccess(res, 'Public portfolio retrieved successfully', {
    profile,
    skills,
    projects,
    internships,
    certifications,
    achievements,
    academics
  });
});

export const getStudentDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentUserId = req.user?._id;

  let profile = await StudentProfile.findOne({ user: studentUserId }).populate('mentor', 'name email department avatar');
  if (!profile) {
    // Auto-create initial profile if missing
    profile = await StudentProfile.create({
      user: studentUserId,
      rollNumber: `23CS${Math.floor(100 + Math.random() * 900)}`,
      department: req.user?.department || 'Computer Science and Engineering',
      publicSlug: req.user?.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000)
    });
  }

  const [
    academicRecords,
    attendanceRecords,
    projects,
    internships,
    certifications,
    achievements,
    skills,
    insights
  ] = await Promise.all([
    AcademicRecord.find({ student: studentUserId }).sort({ semester: 1 }),
    Attendance.find({ student: studentUserId }).sort({ semester: -1 }),
    Project.find({ student: studentUserId }).sort({ createdAt: -1 }),
    Internship.find({ student: studentUserId }).sort({ startDate: -1 }),
    Certification.find({ student: studentUserId }).sort({ issueDate: -1 }),
    Achievement.find({ student: studentUserId }).sort({ date: -1 }),
    Skill.find({ student: studentUserId }),
    AIInsight.find({ student: studentUserId }).sort({ createdAt: -1 }).limit(5)
  ]);

  // Compute live CGPA and active backlogs
  let currentCgpa = profile.cgpa || 8.2;
  let activeBacklogs = profile.activeBacklogs || 0;

  if (academicRecords.length > 0) {
    const latestRecord = academicRecords[academicRecords.length - 1];
    currentCgpa = latestRecord.cgpaAfterSemester;
    activeBacklogs = academicRecords.reduce((acc, r) => acc + (r.isCleared ? 0 : r.backlogsInSemester), 0);
  }

  // Compute Overall Attendance
  const latestAttendance = attendanceRecords[0];
  const overallAttendance = latestAttendance ? latestAttendance.overallPercentage : 82.5;

  // Run AI Placement Readiness Score
  const readinessResult = PlacementReadinessService.calculate({
    cgpa: currentCgpa,
    activeBacklogs,
    skillsCount: skills.length,
    advancedSkillsCount: skills.filter((s) => s.proficiency === 'Advanced' || s.proficiency === 'Expert').length,
    projectsCount: projects.length,
    internshipsCount: internships.length,
    certificationsCount: certifications.length,
    achievementsCount: achievements.length,
    hasGithubOrPortfolio: !!(profile.socialLinks?.github || profile.socialLinks?.portfolio)
  });

  // Run AI Risk Analysis
  const riskResult = RiskAnalysisService.evaluateRisk({
    cgpa: currentCgpa,
    activeBacklogs,
    attendancePercentage: overallAttendance,
    academicHistory: academicRecords.map((r) => ({ semester: r.semester, sgpa: r.sgpa })),
    projectsCount: projects.length,
    internshipsCount: internships.length,
    skillsCount: skills.length,
    mentoringIssuesCount: 0
  });

  // Sync computed scores back to profile
  if (
    profile.placementReadinessScore !== readinessResult.overallScore ||
    profile.riskScore !== riskResult.riskScore ||
    profile.cgpa !== currentCgpa
  ) {
    profile.placementReadinessScore = readinessResult.overallScore;
    profile.riskScore = riskResult.riskScore;
    profile.riskLevel = riskResult.riskLevel;
    profile.cgpa = currentCgpa;
    profile.activeBacklogs = activeBacklogs;
    await profile.save();
  }

  return sendSuccess(res, 'Student dashboard aggregated data', {
    profile,
    summary: {
      cgpa: currentCgpa,
      attendance: overallAttendance,
      projectsCount: projects.length,
      internshipsCount: internships.length,
      certificationsCount: certifications.length,
      achievementsCount: achievements.length,
      skillsCount: skills.length,
      placementReadiness: readinessResult.overallScore,
      riskScore: riskResult.riskScore,
      riskLevel: riskResult.riskLevel
    },
    academicTrends: academicRecords.map((r) => ({
      semester: `Sem ${r.semester}`,
      sgpa: r.sgpa,
      cgpa: r.cgpaAfterSemester
    })),
    attendanceOverview: latestAttendance ? {
      overallPercentage: latestAttendance.overallPercentage,
      predictedFinalPercentage: latestAttendance.predictedFinalPercentage || Math.max(latestAttendance.overallPercentage - 3, 60),
      riskLevel: latestAttendance.riskLevel,
      subjects: latestAttendance.subjects,
      monthlyTrend: latestAttendance.monthlyTrend
    } : null,
    readinessDetails: readinessResult,
    riskDetails: riskResult,
    recentProjects: projects.slice(0, 3),
    recentCertifications: certifications.slice(0, 3),
    recentAchievements: achievements.slice(0, 3),
    insights
  });
});
