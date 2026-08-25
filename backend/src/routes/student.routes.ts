import { Router } from 'express';
import { getProfile, updateProfile, getPublicPortfolio, getStudentDashboard } from '../controllers/student.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/dashboard', authenticate, getStudentDashboard);
router.get('/profile', authenticate, getProfile);
router.get('/profile/:id', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/public/:slug', getPublicPortfolio);

export default router;
