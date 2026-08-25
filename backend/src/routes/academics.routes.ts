import { Router } from 'express';
import {
  getAcademicRecords,
  addAcademicRecord,
  updateAcademicRecord,
  deleteAcademicRecord,
  getAcademicInsights
} from '../controllers/academics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getAcademicRecords);
router.post('/', addAcademicRecord);
router.put('/:id', updateAcademicRecord);
router.delete('/:id', deleteAcademicRecord);
router.get('/insights', getAcademicInsights);

export default router;
