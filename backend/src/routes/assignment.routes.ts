import { Router } from 'express';
import { getAssignments, createAssignment, updateAssignment, deleteAssignment } from '../controllers/assignment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.route('/')
  .get(getAssignments)
  .post(createAssignment);

router.route('/:id')
  .put(updateAssignment)
  .delete(deleteAssignment);

export default router;
