import { Router } from 'express';
import {
  getAdminAnalytics,
  getStudentsList,
  getStudentDetail,
  getFacultyList,
  assignMentor,
  getAuditLogs
} from '../controllers/admin.controller';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('admin', 'faculty', 'placement_officer'));

router.get('/analytics', getAdminAnalytics);
router.get('/dashboard', getAdminAnalytics);
router.get('/students', getStudentsList);
router.get('/students/:id', getStudentDetail);
router.get('/faculty', getFacultyList);
router.post('/faculty/assign-mentor', authorizeRoles('admin'), assignMentor);
router.get('/audit-logs', authorizeRoles('admin'), getAuditLogs);

export default router;
