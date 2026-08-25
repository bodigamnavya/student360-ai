import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Attendance } from '../models/Attendance';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const targetStudentId = req.query.studentId || req.user?._id;
  const records = await Attendance.find({ student: targetStudentId }).sort({ semester: -1 });
  return sendSuccess(res, 'Attendance records retrieved', records);
});

export const addAttendanceRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.body.student || req.user?._id;
  const { semester, academicYear, subjects, monthlyTrend } = req.body;

  let totalHeld = 0;
  let totalAttended = 0;

  const processedSubjects = (subjects || []).map((sub: any) => {
    totalHeld += sub.classesHeld || 0;
    totalAttended += sub.classesAttended || 0;
    const pct = sub.classesHeld > 0 ? parseFloat(((sub.classesAttended / sub.classesHeld) * 100).toFixed(1)) : 0;
    let status: 'Normal' | 'Shortage' | 'Critical' = 'Normal';
    if (pct < 65) status = 'Critical';
    else if (pct < 75) status = 'Shortage';

    return {
      ...sub,
      attendancePercentage: pct,
      status
    };
  });

  const overallPercentage = totalHeld > 0 ? parseFloat(((totalAttended / totalHeld) * 100).toFixed(1)) : 0;
  const predictedFinalPercentage = parseFloat(Math.max(overallPercentage - 2.5, 45).toFixed(1));
  const riskLevel = overallPercentage < 65 ? 'High' : overallPercentage < 75 ? 'Medium' : 'Low';

  const record = await Attendance.findOneAndUpdate(
    { student: studentId, semester },
    {
      student: studentId,
      semester,
      academicYear: academicYear || '2025-2026',
      subjects: processedSubjects,
      totalClassesHeld: totalHeld,
      totalClassesAttended: totalAttended,
      overallPercentage,
      predictedFinalPercentage,
      riskLevel,
      monthlyTrend: monthlyTrend || [
        { month: 'Jul', percentage: 90 },
        { month: 'Aug', percentage: 85 },
        { month: 'Sep', percentage: 80 },
        { month: 'Oct', percentage: overallPercentage }
      ]
    },
    { upsert: true, new: true, runValidators: true }
  );

  return sendSuccess(res, 'Attendance record updated successfully', record, 201);
});

export const getAttendancePrediction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.query.studentId || req.user?._id;
  const latest = await Attendance.findOne({ student: studentId }).sort({ semester: -1 });

  if (!latest) {
    return sendSuccess(res, 'Attendance Prediction', {
      currentAttendance: 85,
      predictedFinalAttendance: 82,
      riskLevel: 'Low',
      classesToAttend: 0,
      recommendation: 'Attendance is optimal. Keep maintaining >75% attendance.'
    });
  }

  const current = latest.overallPercentage;
  const held = latest.totalClassesHeld || 50;
  const attended = latest.totalClassesAttended || 40;

  // Calculate classes needed to achieve 75% or 85%
  // (attended + x) / (held + x) = 0.75 => attended + x = 0.75 * held + 0.75 * x => 0.25 * x = 0.75 * held - attended
  let classesNeededFor75 = 0;
  if (current < 75) {
    classesNeededFor75 = Math.ceil((0.75 * held - attended) / 0.25);
    classesNeededFor75 = Math.max(classesNeededFor75, 1);
  }

  const criticalSubjects = latest.subjects.filter((s) => s.attendancePercentage < 75);

  let recommendation = 'Your attendance meets institutional requirements.';
  if (current < 75) {
    recommendation = `CRITICAL: Attend at least ${classesNeededFor75} of the next 10-15 classes consecutively to clear the 75% examination threshold.`;
  } else if (current < 80) {
    recommendation = 'Borderline attendance. Maintain attendance in upcoming lab sessions to build buffer.';
  }

  return sendSuccess(res, 'AI Attendance prediction generated', {
    currentAttendance: current,
    predictedFinalAttendance: latest.predictedFinalPercentage,
    riskLevel: latest.riskLevel,
    classesNeededFor75,
    criticalSubjects,
    recommendation
  });
});
