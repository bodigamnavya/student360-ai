import { Router } from 'express';
import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill
} from '../controllers/skill.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getSkills);
router.post('/', addSkill);
router.put('/:id', updateSkill);
router.delete('/:id', deleteSkill);

export default router;
