import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { CompetitiveExam } from '../models/CompetitiveExam';
import { StudyPlannerService } from '../services/ai/StudyPlannerService';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getExams = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.query.studentId || req.user?._id;
  let exams = await CompetitiveExam.find({ student: studentId }).sort({ createdAt: -1 });

  if (exams.length === 0) {
    const gatePlan = StudyPlannerService.generatePlan('GATE');
    const exam = await CompetitiveExam.create({
      student: studentId,
      examType: 'GATE',
      examName: 'GATE Computer Science & IT',
      targetScore: '750+ Score (AIR < 200)',
      currentScore: '580 (Mock)',
      preparationProgress: 45,
      studyHoursPerWeek: 18,
      registered: true,
      registrationNumber: 'CS26S839120',
      examDate: new Date('2027-02-08'),
      mockScores: [
        { testName: 'MadeEasy Subject Mock: DBMS', date: new Date('2026-06-15'), score: 42, maxScore: 50, percentile: 94 },
        { testName: 'Ace Academy Mock: Algorithms', date: new Date('2026-07-20'), score: 38, maxScore: 50, percentile: 89 },
        { testName: 'Full Length Test 1', date: new Date('2026-08-10'), score: 62, maxScore: 100, percentile: 91 }
      ],
      studyPlan: gatePlan.weeklySchedule
    });
    exams = [exam];
  }

  return sendSuccess(res, 'Competitive exams retrieved', exams);
});

export const addExam = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const { examType, examName, targetScore, currentScore, examDate, studyHoursPerWeek } = req.body;

  const plan = StudyPlannerService.generatePlan(examType || 'GATE');

  const exam = await CompetitiveExam.create({
    student: studentId,
    examType: examType || 'GATE',
    examName: examName || `${examType} Exam`,
    targetScore,
    currentScore,
    examDate,
    studyHoursPerWeek: studyHoursPerWeek || 15,
    studyPlan: plan.weeklySchedule
  });

  return sendSuccess(res, 'Exam record created with AI Study Plan', exam, 201);
});

export const updateExam = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const exam = await CompetitiveExam.findOneAndUpdate(
    { _id: id, student: req.user?._id },
    { $set: req.body },
    { new: true }
  );
  if (!exam) return sendError(res, 'Exam record not found', 404);
  return sendSuccess(res, 'Exam record updated', exam);
});

export const deleteExam = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const exam = await CompetitiveExam.findOneAndDelete({ _id: id, student: req.user?._id });
  if (!exam) return sendError(res, 'Exam record not found', 404);
  return sendSuccess(res, 'Exam record deleted');
});

export const toggleStudyTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { weekIndex, isCompleted } = req.body;

  const exam = await CompetitiveExam.findOne({ _id: id, student: req.user?._id });
  if (!exam) return sendError(res, 'Exam record not found', 404);

  if (exam.studyPlan && exam.studyPlan[weekIndex]) {
    exam.studyPlan[weekIndex].isCompleted = isCompleted;
    
    // Recalculate preparation progress
    const completedCount = exam.studyPlan.filter((t) => t.isCompleted).length;
    exam.preparationProgress = Math.round((completedCount / exam.studyPlan.length) * 100);
    await exam.save();
  }

  return sendSuccess(res, 'Study task toggled', exam);
});
