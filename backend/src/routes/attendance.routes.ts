import { Router } from 'express';
import {
  getAttendance,
  addAttendanceRecord,
  getAttendancePrediction
} from '../controllers/attendance.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getAttendance);
router.post('/', addAttendanceRecord);
router.get('/prediction', getAttendancePrediction);

export default router;
