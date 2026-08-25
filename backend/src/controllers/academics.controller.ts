import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AcademicRecord } from '../models/AcademicRecord';
import { StudentProfile } from '../models/StudentProfile';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getAcademicRecords = asyncHandler(async (req: AuthRequest, res: Response) => {
  const targetStudentId = req.query.studentId || req.user?._id;
  const records = await AcademicRecord.find({ student: targetStudentId }).sort({ semester: 1 });
  return sendSuccess(res, 'Academic records retrieved', records);
});

export const addAcademicRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.body.student || req.user?._id;
  const { semester, academicYear, subjects, remarks } = req.body;

  // Calculate SGPA and Earned Credits
  let totalPoints = 0;
  let totalCredits = 0;
  let backlogs = 0;

  subjects.forEach((sub: any) => {
    totalCredits += sub.credits || 3;
    totalPoints += (sub.credits || 3) * (sub.gradePoints || 0);
    if (sub.status === 'Fail' || (sub.totalMarks && sub.totalMarks < 40)) {
      backlogs++;
    }
  });

  const sgpa = totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;

  // Compute CGPA by averaging across semesters
  const pastRecords = await AcademicRecord.find({ student: studentId, semester: { $ne: semester } });
  const allSgpas = pastRecords.map((r) => r.sgpa).concat(sgpa);
  const cgpaAfterSemester = parseFloat((allSgpas.reduce((a, b) => a + b, 0) / allSgpas.length).toFixed(2));

  const record = await AcademicRecord.findOneAndUpdate(
    { student: studentId, semester },
    {
      student: studentId,
      semester,
      academicYear: academicYear || '2025-2026',
      subjects,
      sgpa,
      cgpaAfterSemester,
      totalCredits,
      earnedCredits: totalCredits - backlogs * 3,
      backlogsInSemester: backlogs,
      isCleared: backlogs === 0,
      remarks
    },
    { upsert: true, new: true, runValidators: true }
  );

  // Update profile
  await StudentProfile.findOneAndUpdate(
    { user: studentId },
    { cgpa: cgpaAfterSemester }
  );

  return sendSuccess(res, 'Academic record saved successfully', record, 201);
});

export const updateAcademicRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const record = await AcademicRecord.findByIdAndUpdate(id, req.body, { new: true });
  if (!record) return sendError(res, 'Academic record not found', 404);
  return sendSuccess(res, 'Academic record updated', record);
});

export const deleteAcademicRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const record = await AcademicRecord.findByIdAndDelete(id);
  if (!record) return sendError(res, 'Academic record not found', 404);
  return sendSuccess(res, 'Academic record deleted');
});

export const getAcademicInsights = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.query.studentId || req.user?._id;
  const records = await AcademicRecord.find({ student: studentId }).sort({ semester: 1 });

  if (records.length === 0) {
    return sendSuccess(res, 'Academic insights', {
      strongSubjects: [],
      weakSubjects: [],
      trends: 'No academic records available yet.',
      recommendations: ['Add semester mark records to unlock personalized AI academic analytics.']
    });
  }

  const strongSubjects: string[] = [];
  const weakSubjects: string[] = [];

  records.forEach((rec) => {
    rec.subjects.forEach((sub) => {
      if (sub.gradePoints >= 9) strongSubjects.push(`${sub.subjectName} (${sub.grade})`);
      else if (sub.gradePoints <= 6 || sub.status === 'Fail') weakSubjects.push(`${sub.subjectName} (${sub.grade})`);
    });
  });

  const latest = records[records.length - 1];
  const previous = records.length > 1 ? records[records.length - 2] : null;

  let trendMessage = 'Steady academic progression.';
  if (previous) {
    const diff = latest.sgpa - previous.sgpa;
    if (diff > 0.4) trendMessage = `Strong upward momentum! SGPA improved by ${diff.toFixed(2)} points in Semester ${latest.semester}.`;
    else if (diff < -0.4) trendMessage = `Academic performance declined by ${Math.abs(diff).toFixed(2)} points in Semester ${latest.semester}. Immediate focus needed.`;
  }

  const recommendations = [
    weakSubjects.length > 0
      ? `Dedicate extra practice to: ${weakSubjects.slice(0, 2).join(', ')}.`
      : 'Maintain consistent preparation schedule to preserve your high CGPA.',
    'Form peer study circles for core theoretical subjects with higher credit weightings.'
  ];

  return sendSuccess(res, 'Academic insights generated', {
    strongSubjects: Array.from(new Set(strongSubjects)),
    weakSubjects: Array.from(new Set(weakSubjects)),
    trendMessage,
    latestSgpa: latest.sgpa,
    cgpa: latest.cgpaAfterSemester,
    recommendations
  });
});
