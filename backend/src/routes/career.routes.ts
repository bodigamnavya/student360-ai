import { Router } from 'express';
import {
  getCareerRecommendations,
  getSkillGapAnalysis,
  chatWithCareerAssistant,
  getCareerGoal,
  saveCareerGoal
} from '../controllers/career.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/recommendations', getCareerRecommendations);
router.get('/skill-gap', getSkillGapAnalysis);
router.post('/chat', chatWithCareerAssistant);
router.get('/goal', getCareerGoal);
router.post('/goal', saveCareerGoal);

export default router;
