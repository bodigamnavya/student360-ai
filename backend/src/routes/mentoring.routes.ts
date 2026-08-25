import { Router } from 'express';
import {
  getMentoringRecords,
  addMentoringRecord,
  updateMentoringRecord
} from '../controllers/mentoring.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getMentoringRecords);
router.post('/', addMentoringRecord);
router.put('/:id', updateMentoringRecord);

export default router;
