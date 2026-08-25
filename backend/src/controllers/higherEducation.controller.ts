import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { HigherEducation } from '../models/HigherEducation';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getHigherEducation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.query.studentId || req.user?._id;
  let higherEd = await HigherEducation.findOne({ student: studentId });

  if (!higherEd) {
    higherEd = await HigherEducation.create({
      student: studentId,
      targetDegree: 'MS',
      targetField: 'Computer Science & Artificial Intelligence',
      targetCountries: ['USA', 'Germany', 'Canada'],
      intakeYear: '2027',
      intakeSeason: 'Fall',
      sopStatus: 'Drafting',
      lorCount: 2,
      universities: [
        {
          universityName: 'Carnegie Mellon University',
          country: 'USA',
          program: 'MS in Computer Science',
          applicationDeadline: new Date('2026-12-15'),
          status: 'Shortlisted',
          ranking: 'Top 5 CS'
        },
        {
          universityName: 'Technical University of Munich (TUM)',
          country: 'Germany',
          program: 'M.Sc. Informatics',
          applicationDeadline: new Date('2027-01-31'),
          status: 'Shortlisted',
          ranking: 'Top 10 Europe'
        },
        {
          universityName: 'University of Toronto',
          country: 'Canada',
          program: 'MScAC Applied Computing',
          applicationDeadline: new Date('2026-12-01'),
          status: 'Shortlisted',
          ranking: 'Top 15 Global'
        }
      ],
      aiGuidance: {
        recommendedFields: ['Computer Science', 'Artificial Intelligence', 'Data Science & Analytics'],
        requiredExams: ['GRE (Quantitative target: 165+)', 'TOEFL (100+) / IELTS (7.5+)'],
        requiredSkills: ['Research publications', 'Strong algorithmic background', 'Demonstrated open-source contributions'],
        applicationChecklist: [
          'Order official college transcripts with degree conversion table',
          'Finalize 3 Academic Recommendation Letters (LORs)',
          'Complete Statement of Purpose (SOP) with tailored faculty research interests',
          'Evaluate credential evaluation via WES if applicable'
        ],
        roadmap: [
          'Month 1-2: Complete GRE & IELTS/TOEFL examinations with target score benchmark',
          'Month 3-4: Finalize university tiers (Ambitious, Target, Safe) and draft SOP',
          'Month 5: Collect LOR endorsements and submit applications prior to priority deadlines'
        ]
      }
    });
  }

  return sendSuccess(res, 'Higher education record retrieved', higherEd);
});

export const saveHigherEducation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const higherEd = await HigherEducation.findOneAndUpdate(
    { student: studentId },
    { $set: { student: studentId, ...req.body } },
    { upsert: true, new: true, runValidators: true }
  );
  return sendSuccess(res, 'Higher education profile updated', higherEd);
});
