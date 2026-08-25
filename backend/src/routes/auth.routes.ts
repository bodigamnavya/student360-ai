import { Router } from 'express';
import { register, login, getMe, logout, forgotPassword, changePassword } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/change-password', authenticate, changePassword);

export default router;
