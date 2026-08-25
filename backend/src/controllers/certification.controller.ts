import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Certification } from '../models/Certification';
import { CertificateExtractionService } from '../services/ai/CertificateExtractionService';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getCertifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.query.studentId || req.user?._id;
  const certs = await Certification.find({ student: studentId }).sort({ issueDate: -1 });
  return sendSuccess(res, 'Certifications retrieved', certs);
});

export const addCertification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const cert = await Certification.create({
    student: studentId,
    ...req.body
  });
  return sendSuccess(res, 'Certification saved successfully', cert, 201);
});

export const updateCertification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const cert = await Certification.findOneAndUpdate(
    { _id: id, student: req.user?._id },
    { $set: req.body },
    { new: true }
  );
  if (!cert) return sendError(res, 'Certification not found', 404);
  return sendSuccess(res, 'Certification updated', cert);
});

export const deleteCertification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const cert = await Certification.findOneAndDelete({ _id: id, student: req.user?._id });
  if (!cert) return sendError(res, 'Certification not found', 404);
  return sendSuccess(res, 'Certification deleted');
});

export const extractCertificateInfo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { filename, textHint } = req.body;
  const extracted = CertificateExtractionService.extractFromFilenameOrText({
    filename: filename || 'certificate.pdf',
    textHint
  });

  return sendSuccess(res, 'Certificate metadata extracted successfully by AI', extracted);
});
