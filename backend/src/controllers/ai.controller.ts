import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AIService } from '../ai/ai.service';
import { AICareerService } from '../ai/career.service';
import { AISkillGapService } from '../ai/skillGap.service';
import { AIInterviewService } from '../ai/interview.service';
import { AIJobMatchingService } from '../ai/jobMatching.service';
import { AIProjectService } from '../ai/project.service';
import { AIResumeService } from '../ai/resume.service';
import { AIRiskAnalysisService } from '../ai/riskAnalysis.service';
import { AICertificateService } from '../ai/certificate.service';
import { AchievementAIService } from '../services/ai/AchievementAIService';
import { CareerChatService } from '../services/ai/CareerChatService';
import { StudentProfile } from '../models/StudentProfile';
import { AcademicRecord } from '../models/AcademicRecord';
import { Attendance } from '../models/Attendance';
import { Project } from '../models/Project';
import { Internship } from '../models/Internship';
import { Certification } from '../models/Certification';
import { Achievement } from '../models/Achievement';
import { Skill } from '../models/Skill';
import { WeeklyActionPlan, LearningRoadmapRecord, InterviewSession, ResumeOptimizationRecord } from '../models/ai.models';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * 1. AI Student 360 Score (POST /api/ai/student-score)
 */
export const getStudent360Score = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.body.studentId || req.user?._id;

  const [profile, academicRecords, attendanceRecords, skills, projects, internships, certs, achs] = await Promise.all([
    StudentProfile.findOne({ user: studentId }),
    AcademicRecord.find({ student: studentId }),
    Attendance.find({ student: studentId }).sort({ semester: -1 }),
    Skill.find({ student: studentId }),
    Project.find({ student: studentId }),
    Internship.find({ student: studentId }),
    Certification.find({ student: studentId }),
    Achievement.find({ student: studentId })
  ]);

  let cgpa = profile?.cgpa || 8.0;
  let activeBacklogs = profile?.activeBacklogs || 0;
  if (academicRecords.length > 0) {
    const latest = academicRecords[academicRecords.length - 1];
    cgpa = latest.cgpaAfterSemester;
    activeBacklogs = academicRecords.reduce((acc, r) => acc + (r.isCleared ? 0 : r.backlogsInSemester), 0);
  }

  const attendance = attendanceRecords[0]?.overallPercentage || 85;

  const scoreResult = AIService.calculateStudent360Score({
    cgpa,
    activeBacklogs,
    attendancePercentage: attendance,
    skillsCount: skills.length,
    advancedSkillsCount: skills.filter((s) => s.proficiency === 'Advanced' || s.proficiency === 'Expert').length,
    projectsCount: projects.length,
    internshipsCount: internships.length,
    certificationsCount: certs.length,
    achievementsCount: achs.length,
    hasGithub: !!profile?.socialLinks?.github,
    hasPortfolio: !!profile?.socialLinks?.portfolio,
    hasResume: !!profile?.targetRole
  });

  return sendSuccess(res, 'AI Student 360 Score calculated', scoreResult);
});

/**
 * 2. AI Career Recommendation (POST /api/ai/career-recommendation)
 */
export const getCareerRecommendations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.body.studentId || req.user?._id;

  const [profile, skills, projects, internships, certs, achs] = await Promise.all([
    StudentProfile.findOne({ user: studentId }),
    Skill.find({ student: studentId }),
    Project.find({ student: studentId }),
    Internship.find({ student: studentId }),
    Certification.find({ student: studentId }),
    Achievement.find({ student: studentId })
  ]);

  const recommendations = AICareerService.analyzeCareerSuitability({
    skills: skills.map((s) => ({ name: s.name, proficiency: s.proficiency })),
    projects: projects.map((p) => ({ title: p.title, technologies: p.technologies })),
    internships: internships.map((i) => ({ role: i.role, company: i.company, technologies: i.technologies })),
    certifications: certs.map((c) => ({ title: c.title })),
    achievements: achs.map((a) => ({ title: a.title, category: a.category })),
    cgpa: profile?.cgpa || 8.2,
    department: req.user?.department || 'Computer Science and Engineering'
  });

  return sendSuccess(res, 'AI Career Recommendations generated', recommendations);
});

/**
 * 3. AI Skill Gap Analysis (POST /api/ai/skill-gap)
 */
export const getSkillGapAnalysis = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.body.studentId || req.user?._id;
  const targetRole = req.body.targetRole || 'Full Stack Developer';

  const skills = await Skill.find({ student: studentId });

  const result = AISkillGapService.analyzeRoleGap({
    targetRole,
    studentSkills: skills.map((s) => ({ name: s.name, proficiency: s.proficiency }))
  });

  return sendSuccess(res, `AI Skill Gap Analysis for ${targetRole}`, result);
});

/**
 * 4. AI Personalized Learning Roadmap (POST /api/ai/learning-roadmap)
 */
export const getLearningRoadmap = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const targetRole = req.body.targetRole || 'Full Stack Developer';

  let roadmap = await LearningRoadmapRecord.findOne({ student: studentId, targetRole });
  if (!roadmap) {
    const skills = await Skill.find({ student: studentId });
    const gapAnalysis = AISkillGapService.analyzeRoleGap({
      targetRole,
      studentSkills: skills.map((s) => ({ name: s.name, proficiency: s.proficiency }))
    });

    const steps = (gapAnalysis.missingCriticalSkills || ['Architecture', 'System Design', 'Testing']).map((skill, index) => ({
      month: index + 1,
      title: `Master ${skill} & Real-World Integration`,
      skill,
      difficulty: (index === 0 ? 'Beginner' : index === 1 ? 'Intermediate' : 'Advanced') as any,
      estimatedDuration: '4 weeks',
      learningObjective: `Achieve end-to-end competency in ${skill} matching industry standards for ${targetRole}.`,
      practiceTasks: [
        `Complete guided capstone exercises in ${skill}`,
        `Build 2 interactive module features demonstrating ${skill}`,
        `Write comprehensive test suites and benchmark performance`
      ],
      projectTask: `Integrate ${skill} into a production portfolio project with CI/CD deployment.`,
      status: 'Not Started' as any
    }));

    roadmap = await LearningRoadmapRecord.create({
      student: studentId,
      targetRole,
      overallReadiness: gapAnalysis.matchPercentage,
      steps
    });
  }

  return sendSuccess(res, 'AI Learning Roadmap retrieved', roadmap);
});

/**
 * 5. AI Weekly Action Plan (POST /api/ai/weekly-plan)
 */
export const getWeeklyActionPlan = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const now = new Date();
  const weekNumber = Math.ceil(now.getDate() / 7);
  const year = now.getFullYear();

  let plan = await WeeklyActionPlan.findOne({ student: studentId, weekNumber, year });
  if (!plan) {
    const startDate = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    const endDate = new Date(now.setDate(now.getDate() - now.getDay() + 7));

    const defaultTasks = [
      { id: '1', title: 'Solve 3 LeetCode Medium problems (Arrays & Dynamic Programming)', category: 'DSA' as const, completed: false },
      { id: '2', title: 'Optimize React render cycle using useMemo and Profiler in project', category: 'Development' as const, completed: false },
      { id: '3', title: 'Review ATS Resume formatting and keyword alignment for target role', category: 'Resume' as const, completed: false },
      { id: '4', title: 'Conduct AI Mock Technical Interview for full-stack role', category: 'Interview' as const, completed: false },
      { id: '5', title: 'Review OS concepts: Process scheduling and Virtual Memory', category: 'Core CS' as const, completed: false }
    ];

    plan = await WeeklyActionPlan.create({
      student: studentId,
      weekNumber,
      year,
      startDate,
      endDate,
      tasks: defaultTasks,
      completionRate: 0,
      aiFeedback: 'Consistent weekly execution across DSA and project development increases placement conversion by 4.2x.'
    });
  }

  return sendSuccess(res, 'AI Weekly Action Plan', plan);
});

/**
 * 6. AI Project Analyzer (POST /api/ai/project-analysis)
 */
export const analyzeProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description, technologies, githubUrl, liveDemoUrl } = req.body;

  if (!title || !description) {
    return sendError(res, 'Project title and description are required', 400);
  }

  const analysis = AIProjectService.analyzeProject({
    title,
    description,
    technologies: technologies || [],
    hasGithub: !!githubUrl,
    hasLiveDemo: !!liveDemoUrl
  });

  return sendSuccess(res, 'AI Project Analysis complete', analysis);
});

/**
 * 7. AI Achievement Analysis (POST /api/ai/achievement-analysis)
 */
export const analyzeAchievement = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { textHint = '', filename = '' } = req.body;
  const extracted = await AchievementAIService.analyzeCertificate(textHint, filename);
  return sendSuccess(res, 'AI Achievement Extraction complete', extracted);
});

/**
 * 8. AI Certificate Analysis (POST /api/ai/certificate-analysis)
 */
export const analyzeCertificate = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { filename = '', textHint = '' } = req.body;
  const analysis = AICertificateService.analyzeCertificate({
    filename,
    textHint,
    studentName: req.user?.name || 'Student'
  });
  return sendSuccess(res, 'AI Certificate Analysis complete', analysis);
});

/**
 * 9. AI Job Matching (POST /api/ai/job-match)
 */
export const matchJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const { jobDescription, jobTitle = 'Software Engineer', requiredSkills = [] } = req.body;

  if (!jobDescription && requiredSkills.length === 0) {
    return sendError(res, 'Job description or required skills are required', 400);
  }

  const [profile, skills, projects, internships, certs] = await Promise.all([
    StudentProfile.findOne({ user: studentId }),
    Skill.find({ student: studentId }),
    Project.find({ student: studentId }),
    Internship.find({ student: studentId }),
    Certification.find({ student: studentId })
  ]);

  const matchResult = AIJobMatchingService.matchJob({
    jobTitle,
    jobDescription: jobDescription || '',
    requiredSkills,
    studentProfile: {
      cgpa: profile?.cgpa || 8.0,
      skills: skills.map((s) => s.name),
      projects: projects.map((p) => ({ title: p.title, technologies: p.technologies })),
      internships: internships.map((i) => ({ role: i.role, company: i.company })),
      certifications: certs.map((c) => ({ title: c.title }))
    }
  });

  return sendSuccess(res, 'AI Job Fit Analysis complete', matchResult);
});

/**
 * 10. AI Placement Readiness (POST /api/ai/placement-readiness)
 */
export const getPlacementReadiness = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.body.studentId || req.user?._id;

  const [profile, skills, projects, internships, certs, achs] = await Promise.all([
    StudentProfile.findOne({ user: studentId }),
    Skill.find({ student: studentId }),
    Project.find({ student: studentId }),
    Internship.find({ student: studentId }),
    Certification.find({ student: studentId }),
    Achievement.find({ student: studentId })
  ]);

  const readiness = AIService.calculateStudent360Score({
    cgpa: profile?.cgpa || 8.2,
    activeBacklogs: profile?.activeBacklogs || 0,
    skillsCount: skills.length,
    advancedSkillsCount: skills.filter((s) => s.proficiency === 'Advanced' || s.proficiency === 'Expert').length,
    projectsCount: projects.length,
    internshipsCount: internships.length,
    certificationsCount: certs.length,
    achievementsCount: achs.length,
    hasGithub: !!profile?.socialLinks?.github,
    hasPortfolio: !!profile?.socialLinks?.portfolio,
    hasResume: true
  });

  return sendSuccess(res, 'AI Placement Readiness Calculated', readiness);
});

/**
 * 11. AI Resume Generation (POST /api/ai/resume-generation)
 */
export const generateResume = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const { targetRole = 'Software Development Engineer', template = 'ATS Friendly' } = req.body;

  const [profile, skills, projects, internships, certs, achs, academics] = await Promise.all([
    StudentProfile.findOne({ user: studentId }),
    Skill.find({ student: studentId }),
    Project.find({ student: studentId }),
    Internship.find({ student: studentId }),
    Certification.find({ student: studentId }),
    Achievement.find({ student: studentId }),
    AcademicRecord.find({ student: studentId }).sort({ semester: 1 })
  ]);

  const resume = AIResumeService.generateATSResume({
    student: {
      name: req.user?.name || 'Student Name',
      email: req.user?.email || 'student@university.edu',
      department: req.user?.department || 'Computer Science and Engineering',
      targetRole,
      template,
      cgpa: profile?.cgpa || 8.5,
      skills: skills.map((s) => s.name),
      projects: projects.map((p) => ({
        title: p.title,
        description: p.description,
        technologies: p.technologies,
        bullets: p.aiAnalysis?.resumeBullet ? [p.aiAnalysis.resumeBullet] : undefined
      })),
      internships: internships.map((i) => ({
        role: i.role,
        company: i.company,
        duration: i.duration,
        description: i.description
      })),
      certifications: certs.map((c) => ({ title: c.title, issuer: c.issuerOrg })),
      achievements: achs.map((a) => ({ title: a.title, position: a.position, org: a.issuerOrg })),
      academics: academics.map((ac) => ({ semester: ac.semester, sgpa: ac.sgpa }))
    }
  });

  return sendSuccess(res, 'AI ATS Resume Generated successfully', resume);
});

/**
 * 12. AI Resume Optimizer (POST /api/ai/resume-optimize)
 */
export const optimizeResume = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const { jobDescription, targetRole = 'Software Engineer', jobTitle = 'Software Engineer' } = req.body;

  if (!jobDescription) {
    return sendError(res, 'Job description text is required for ATS optimization', 400);
  }

  const skills = await Skill.find({ student: studentId });
  const studentSkillNames = skills.map((s) => s.name.toLowerCase());

  const jdLower = jobDescription.toLowerCase();
  const commonKeywords = ['react', 'node.js', 'typescript', 'mongodb', 'docker', 'aws', 'rest api', 'sql', 'python', 'git', 'microservices'];
  
  const matchedKeywords = commonKeywords.filter((kw) => jdLower.includes(kw) && studentSkillNames.some((sk) => sk.includes(kw)));
  const missingKeywords = commonKeywords.filter((kw) => jdLower.includes(kw) && !studentSkillNames.some((sk) => sk.includes(kw)));

  const atsMatchScore = Math.round(Math.min(96, Math.max(45, (matchedKeywords.length / (matchedKeywords.length + missingKeywords.length || 1)) * 95)));

  const optimization = await ResumeOptimizationRecord.create({
    student: studentId,
    targetRole,
    jobTitle,
    jobDescriptionText: jobDescription,
    atsMatchScore,
    matchedKeywords,
    missingKeywords,
    missingSkills: missingKeywords,
    strongMatches: [`Matched ${matchedKeywords.length} critical skills with required qualifications`],
    weakAreas: missingKeywords.length > 0 ? [`Missing keywords: ${missingKeywords.join(', ')}`] : [],
    suggestedBulletImprovements: [
      {
        original: 'Built a full stack web application for students.',
        optimized: `Architected and deployed a distributed full-stack application using ${matchedKeywords.slice(0, 3).join(', ')}, improving query response times by 35%.`,
        reason: 'Quantifies impact and aligns with target job description keywords.'
      }
    ]
  });

  return sendSuccess(res, 'AI Resume Optimization Complete', optimization);
});

/**
 * 13. AI Mock Interview - Start (POST /api/ai/interview/start)
 */
export const startInterview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const { role = 'Full Stack Developer', interviewType = 'Comprehensive Mock', experienceLevel = 'Entry' } = req.body;

  const session = await AIInterviewService.startSession({
    studentId: studentId.toString(),
    role,
    interviewType,
    experienceLevel
  });

  return sendSuccess(res, 'AI Interview Session Started', session, 201);
});

/**
 * 14. AI Mock Interview - Answer (POST /api/ai/interview/answer)
 */
export const submitInterviewAnswer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { sessionId, answer, questionNumber } = req.body;

  if (!sessionId || answer === undefined) {
    return sendError(res, 'sessionId and answer are required', 400);
  }

  const evaluation = await AIInterviewService.submitAnswer({
    sessionId,
    questionNumber: questionNumber || 1,
    studentAnswer: answer
  });

  return sendSuccess(res, 'Answer Evaluated by AI Coach', evaluation);
});

/**
 * 15. AI Mock Interview - Final Report (POST /api/ai/interview/report)
 */
export const getInterviewReport = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return sendError(res, 'sessionId is required', 400);
  }

  const report = await AIInterviewService.generateFinalReportForSession(sessionId);
  return sendSuccess(res, 'AI Mock Interview Final Performance Report', report);
});

/**
 * 16. AI Career Chatbot (POST /api/ai/chat)
 */
export const chatWithAssistant = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const { messages, userPrompt } = req.body;

  if (!userPrompt || userPrompt.trim() === '') {
    return sendError(res, 'userPrompt is required', 400);
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
      targetRole: profile?.targetRole || 'Software Engineer',
      placementReadiness: profile?.placementReadinessScore || 78,
      riskScore: profile?.riskScore || 20,
      riskLevel: profile?.riskLevel || 'Low',
      skills: skills.map((s) => s.name),
      projects: projects.map((p) => p.title),
      internships: internships.map((i) => `${i.role} at ${i.company}`),
      activeBacklogs: profile?.activeBacklogs || 0,
      attendancePercentage: 85
    },
    messages: messages || [],
    userPrompt
  });

  return sendSuccess(res, 'AI Career Assistant Response', result);
});

/**
 * 17. AI Academic Insights (POST /api/ai/academic-insights)
 */
export const getAcademicInsights = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.body.studentId || req.user?._id;

  const records = await AcademicRecord.find({ student: studentId }).sort({ semester: 1 });
  const profile = await StudentProfile.findOne({ user: studentId });

  const cgpa = profile?.cgpa || (records.length > 0 ? records[records.length - 1].cgpaAfterSemester : 8.0);
  const backlogs = profile?.activeBacklogs || 0;

  const trends = records.map((r) => ({
    semester: `Sem ${r.semester}`,
    sgpa: r.sgpa,
    cgpa: r.cgpaAfterSemester
  }));

  const recommendations = [];
  if (backlogs > 0) {
    recommendations.push('Focus on clearing active backlogs before placement season begins.');
  }
  if (cgpa >= 8.5) {
    recommendations.push('Excellent academic velocity (>8.5 CGPA). Maintain consistent performance for Tier-1 Day 0 eligibility.');
  } else if (cgpa >= 7.5) {
    recommendations.push('Solid academic standing. Aim for >8.0 SGPA in upcoming semesters to maximize shortlisting opportunities.');
  } else {
    recommendations.push('Prioritize core subject revision and peer study sessions to boost cumulative GPA above 7.5.');
  }

  return sendSuccess(res, 'AI Academic Insights', {
    cgpa,
    activeBacklogs: backlogs,
    trends,
    strongSubjects: ['Data Structures and Algorithms', 'Database Management Systems', 'Object Oriented Programming'],
    improvementAreas: backlogs > 0 ? ['Backlog Course Clearance'] : ['Computer Networks & Distributed Systems'],
    recommendations
  });
});

/**
 * 18. AI Attendance Insights (POST /api/ai/attendance-insights)
 */
export const getAttendanceInsights = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.body.studentId || req.user?._id;

  const records = await Attendance.find({ student: studentId }).sort({ semester: -1 });
  const current = records[0]?.overallPercentage || 84.5;
  const required = 75.0;

  const status = current >= 80 ? 'Safe' : current >= 75 ? 'Moderate' : 'Critical Warning';
  const recommendations = current < 75
    ? ['Attend the next 12 consecutive classes to cross the mandatory 75% institutional threshold.']
    : ['Attendance is compliant with university exam and placement eligibility criteria.'];

  return sendSuccess(res, 'AI Attendance Insights', {
    currentAttendance: current,
    requiredAttendance: required,
    status,
    riskLevel: current < 75 ? 'High' : current < 80 ? 'Medium' : 'Low',
    monthlyTrend: records[0]?.monthlyTrend || [],
    recommendations
  });
});

/**
 * 19. AI Mentor Assistant Insights (POST /api/ai/mentor-insights)
 */
export const getMentorInsights = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { studentId } = req.body;
  if (!studentId) {
    return sendError(res, 'studentId is required for mentor evaluation', 400);
  }

  const [profile, academics, attendance, projects, skills] = await Promise.all([
    StudentProfile.findOne({ user: studentId }).populate('user', 'name email department'),
    AcademicRecord.find({ student: studentId }).sort({ semester: 1 }),
    Attendance.find({ student: studentId }).sort({ semester: -1 }),
    Project.find({ student: studentId }),
    Skill.find({ student: studentId })
  ]);

  const cgpa = profile?.cgpa || 8.0;
  const overallAttendance = attendance[0]?.overallPercentage || 82;

  const mentorReport = {
    studentName: (profile?.user as any)?.name || 'Student',
    department: profile?.department,
    cgpa,
    attendance: overallAttendance,
    skillsCount: skills.length,
    projectsCount: projects.length,
    placementReadiness: profile?.placementReadinessScore || 75,
    riskScore: profile?.riskScore || 20,
    strengths: [
      `Consistent academic performance with CGPA ${cgpa.toFixed(1)}`,
      `Demonstrated active development across ${projects.length} technical projects`
    ],
    concerns: overallAttendance < 75 ? ['Attendance below institutional threshold'] : [],
    recommendedMentorActions: [
      'Encourage completion of at least one cloud-native full-stack project.',
      'Schedule a progress check-in before placement drives begin.'
    ]
  };

  return sendSuccess(res, 'AI Mentor Insights generated', mentorReport);
});

/**
 * 20. AI Risk Analysis (POST /api/ai/risk-analysis)
 */
export const getRiskAnalysis = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.body.studentId || req.user?._id;

  const [profile, academics, attendance, projects, internships, skills] = await Promise.all([
    StudentProfile.findOne({ user: studentId }),
    AcademicRecord.find({ student: studentId }).sort({ semester: 1 }),
    Attendance.find({ student: studentId }).sort({ semester: -1 }),
    Project.find({ student: studentId }),
    Internship.find({ student: studentId }),
    Skill.find({ student: studentId })
  ]);

  const riskResult = AIRiskAnalysisService.analyzeStudentRisk({
    cgpa: profile?.cgpa || 8.0,
    activeBacklogs: profile?.activeBacklogs || 0,
    attendancePercentage: attendance[0]?.overallPercentage || 82,
    semesters: academics.map((a) => ({ sgpa: a.sgpa })),
    internshipsCount: internships.length,
    skillsCount: skills.length
  });

  return sendSuccess(res, 'AI Risk Analysis calculated', riskResult);
});
