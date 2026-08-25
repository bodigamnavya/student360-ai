import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

router.post('/', authenticate, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return sendError(res, 'No file was uploaded.', 400);
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return sendSuccess(res, 'File uploaded successfully', {
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype
  }, 201);
});

export default router;
