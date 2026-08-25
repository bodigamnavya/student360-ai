import { Router } from 'express';
import {
  getHigherEducation,
  saveHigherEducation
} from '../controllers/higherEducation.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getHigherEducation);
router.post('/', saveHigherEducation);

export default router;
