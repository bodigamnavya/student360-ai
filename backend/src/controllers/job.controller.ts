import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Job } from '../models/Job';
import { JobApplication } from '../models/JobApplication';
import { StudentProfile } from '../models/StudentProfile';
import { Skill } from '../models/Skill';
import { Project } from '../models/Project';
import { Internship } from '../models/Internship';
import { JobMatchingService } from '../services/ai/JobMatchingService';
import { createJobSchema } from '../validators';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getJobs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { search, type, status } = req.query;
  const filter: any = {};

  if (status) {
    filter.status = status;
  } else {
    filter.status = 'Open';
  }

  if (type) {
    filter.jobType = type;
  }

  if (search) {
    filter.$or = [
      { company: { $regex: search, $options: 'i' } },
      { jobRole: { $regex: search, $options: 'i' } },
      { requiredSkills: { $in: [new RegExp(search as string, 'i')] } }
    ];
  }

  const jobs = await Job.find(filter).sort({ createdAt: -1 });

  // If student is querying, compute match scores for each job!
  if (req.user?.role === 'student') {
    const studentId = req.user._id;
    const [profile, skills, projects, internships, applications] = await Promise.all([
      StudentProfile.findOne({ user: studentId }),
      Skill.find({ student: studentId }),
      Project.find({ student: studentId }),
      Internship.find({ student: studentId }),
      JobApplication.find({ student: studentId })
    ]);

    const appliedJobIds = new Set(applications.map((a) => a.job.toString()));

    const jobsWithMatching = jobs.map((job) => {
      const match = JobMatchingService.calculateMatch({
        studentProfile: {
          cgpa: profile?.cgpa || 7.5,
          department: req.user?.department || 'Computer Science and Engineering',
          batch: profile?.batch || '2023-2027',
          activeBacklogs: profile?.activeBacklogs || 0,
          skills: skills.map((s) => s.name),
          projects: projects.map((p) => ({ title: p.title, technologies: p.technologies })),
          internships: internships.map((i) => ({ role: i.role, technologies: i.technologies }))
        },
        job: job.toObject() as any
      });

      return {
        ...job.toObject(),
        aiMatch: match,
        hasApplied: appliedJobIds.has(job._id.toString())
      };
    });

    return sendSuccess(res, 'Jobs retrieved with AI matching', jobsWithMatching);
  }

  return sendSuccess(res, 'Jobs retrieved', jobs);
});

export const getJobById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const job = await Job.findById(id).populate('createdBy', 'name email department');
  if (!job) return sendError(res, 'Job posting not found', 404);

  let aiMatch = null;
  let application = null;

  if (req.user?.role === 'student') {
    const studentId = req.user._id;
    const [profile, skills, projects, internships, app] = await Promise.all([
      StudentProfile.findOne({ user: studentId }),
      Skill.find({ student: studentId }),
      Project.find({ student: studentId }),
      Internship.find({ student: studentId }),
      JobApplication.findOne({ job: id, student: studentId })
    ]);

    application = app;

    aiMatch = JobMatchingService.calculateMatch({
      studentProfile: {
        cgpa: profile?.cgpa || 7.5,
        department: req.user?.department || 'Computer Science and Engineering',
        batch: profile?.batch || '2023-2027',
        activeBacklogs: profile?.activeBacklogs || 0,
        skills: skills.map((s) => s.name),
        projects: projects.map((p) => ({ title: p.title, technologies: p.technologies })),
        internships: internships.map((i) => ({ role: i.role, technologies: i.technologies }))
      },
      job: job.toObject() as any
    });
  }

  return sendSuccess(res, 'Job retrieved', { job, aiMatch, application });
});

export const createJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const validated = createJobSchema.parse(req.body);
  const job = await Job.create({
    ...validated,
    createdBy: req.user?._id
  });
  return sendSuccess(res, 'Job drive created successfully', job, 201);
});

export const updateJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const job = await Job.findByIdAndUpdate(id, { $set: req.body }, { new: true });
  if (!job) return sendError(res, 'Job not found', 404);
  return sendSuccess(res, 'Job updated successfully', job);
});

export const deleteJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const job = await Job.findByIdAndDelete(id);
  if (!job) return sendError(res, 'Job not found', 404);
  return sendSuccess(res, 'Job deleted successfully');
});

export const applyForJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const studentId = req.user?._id;

  const job = await Job.findById(id);
  if (!job) return sendError(res, 'Job not found', 404);

  const existingApp = await JobApplication.findOne({ job: id, student: studentId });
  if (existingApp) return sendError(res, 'You have already applied for this position.', 409);

  // Compute live AI match score & details
  const [profile, skills, projects, internships] = await Promise.all([
    StudentProfile.findOne({ user: studentId }),
    Skill.find({ student: studentId }),
    Project.find({ student: studentId }),
    Internship.find({ student: studentId })
  ]);

  const aiMatch = JobMatchingService.calculateMatch({
    studentProfile: {
      cgpa: profile?.cgpa || 7.5,
      department: req.user?.department || 'Computer Science and Engineering',
      batch: profile?.batch || '2023-2027',
      activeBacklogs: profile?.activeBacklogs || 0,
      skills: skills.map((s) => s.name),
      projects: projects.map((p) => ({ title: p.title, technologies: p.technologies })),
      internships: internships.map((i) => ({ role: i.role, technologies: i.technologies }))
    },
    job: job.toObject() as any
  });

  const application = await JobApplication.create({
    job: id,
    student: studentId,
    currentStage: 'Applied',
    aiMatchScore: aiMatch.matchScore,
    aiMatchDetails: {
      strengths: aiMatch.strengths,
      gaps: aiMatch.gaps,
      isEligible: aiMatch.isEligible,
      ineligibilityReasons: aiMatch.ineligibilityReasons
    },
    resumeUrl: req.body.resumeUrl,
    stageHistory: [{ stage: 'Applied', updatedAt: new Date(), notes: 'Application submitted successfully.' }]
  });

  await Job.findByIdAndUpdate(id, { $inc: { totalApplicants: 1 } });

  return sendSuccess(res, 'Application submitted successfully', application, 201);
});

export const getMyApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const applications = await JobApplication.find({ student: studentId })
    .populate('job')
    .sort({ appliedDate: -1 });

  return sendSuccess(res, 'My applications retrieved', applications);
});

export const getJobApplicants = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const applications = await JobApplication.find({ job: id })
    .populate('student', 'name email department avatar')
    .sort({ aiMatchScore: -1 });

  return sendSuccess(res, 'Job applicants retrieved with AI matching scores', applications);
});

export const updateApplicationStage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { appId } = req.params;
  const { stage, notes, scheduledTime, offerDetails } = req.body;

  const app = await JobApplication.findById(appId);
  if (!app) return sendError(res, 'Application not found', 404);

  app.currentStage = stage;
  if (offerDetails) app.offerDetails = offerDetails;
  app.stageHistory.push({
    stage,
    updatedAt: new Date(),
    notes,
    scheduledTime
  });

  await app.save();
  return sendSuccess(res, 'Application stage updated successfully', app);
});
