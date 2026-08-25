import { Router } from 'express';
import {
  getStudent360Score,
  getCareerRecommendations,
  getSkillGapAnalysis,
  getLearningRoadmap,
  getWeeklyActionPlan,
  analyzeProject,
  analyzeAchievement,
  analyzeCertificate,
  matchJob,
  getPlacementReadiness,
  generateResume,
  optimizeResume,
  startInterview,
  submitInterviewAnswer,
  getInterviewReport,
  chatWithAssistant,
  getAcademicInsights,
  getAttendanceInsights,
  getMentorInsights,
  getRiskAnalysis
} from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Require authentication for all AI endpoints
router.use(authenticate);

// 1. AI Student 360 Score
router.post('/student-score', getStudent360Score);

// 2. AI Career Recommendation
router.post('/career-recommendation', getCareerRecommendations);

// 3. AI Skill Gap Analysis
router.post('/skill-gap', getSkillGapAnalysis);

// 4. AI Personalized Learning Roadmap
router.post('/learning-roadmap', getLearningRoadmap);

// 5. AI Weekly Action Plan
router.post('/weekly-plan', getWeeklyActionPlan);

// 6. AI Project Analyzer
router.post('/project-analysis', analyzeProject);

// 7. AI Achievement Analysis
router.post('/achievement-analysis', analyzeAchievement);

// 8. AI Certificate Analysis
router.post('/certificate-analysis', analyzeCertificate);

// 9. AI Job Matching
router.post('/job-match', matchJob);

// 10. AI Placement Readiness
router.post('/placement-readiness', getPlacementReadiness);

// 11. AI Resume Generator
router.post('/resume-generation', generateResume);

// 12. AI Resume Optimizer
router.post('/resume-optimize', optimizeResume);

// 13. AI Mock Interview - Start
router.post('/interview/start', startInterview);

// 14. AI Mock Interview - Answer
router.post('/interview/answer', submitInterviewAnswer);

// 15. AI Mock Interview - Final Report
router.post('/interview/report', getInterviewReport);

// 16. AI Career Chatbot
router.post('/chat', chatWithAssistant);

// 17. AI Academic Insights
router.post('/academic-insights', getAcademicInsights);

// 18. AI Attendance Insights
router.post('/attendance-insights', getAttendanceInsights);

// 19. AI Mentor Assistant
router.post('/mentor-insights', getMentorInsights);

// 20. AI Risk Analysis
router.post('/risk-analysis', getRiskAnalysis);

export default router;
