import { Router } from 'express';
import {
  getInternships,
  addInternship,
  updateInternship,
  deleteInternship,
  getInternshipRecommendations
} from '../controllers/internship.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getInternships);
router.post('/', addInternship);
router.get('/recommendations', getInternshipRecommendations);
router.put('/:id', updateInternship);
router.delete('/:id', deleteInternship);

export default router;
