import { Router } from 'express';
import {
  getExams,
  addExam,
  updateExam,
  deleteExam,
  toggleStudyTask
} from '../controllers/exam.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getExams);
router.post('/', addExam);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);
router.put('/:id/toggle-task', toggleStudyTask);

export default router;
