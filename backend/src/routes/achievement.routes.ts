import { Router } from 'express';
import {
  getAchievements,
  getAchievementById,
  analyzeAchievement,
  uploadEvidence,
  addAchievement,
  updateAchievement,
  deleteAchievement,
  generateSummary,
  generateResumeBullet,
  extractSkills
} from '../controllers/achievement.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getAchievements);
router.post('/analyze', analyzeAchievement);
router.post('/upload', upload.single('document'), uploadEvidence);
router.post('/', addAchievement);
router.get('/:id', getAchievementById);
router.put('/:id', updateAchievement);
router.delete('/:id', deleteAchievement);
router.post('/:id/generate-summary', generateSummary);
router.post('/:id/generate-resume-bullet', generateResumeBullet);
router.post('/:id/extract-skills', extractSkills);

export default router;
