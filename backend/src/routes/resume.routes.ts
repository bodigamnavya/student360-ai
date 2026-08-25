import { Router } from 'express';
import {
  getResumes,
  generateResumeData,
  saveResume,
  updateResume,
  deleteResume
} from '../controllers/resume.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getResumes);
router.post('/generate', generateResumeData);
router.post('/', saveResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

export default router;
