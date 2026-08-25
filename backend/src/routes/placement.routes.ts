import { Router } from 'express';
import {
  getPlacementAnalytics,
  getPlacementReadiness,
  getPlacementRecords,
  addPlacementRecord
} from '../controllers/placement.controller';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/analytics', getPlacementAnalytics);
router.get('/readiness', getPlacementReadiness);
router.get('/records', getPlacementRecords);
router.post('/records', authorizeRoles('admin', 'placement_officer'), addPlacementRecord);

export default router;
