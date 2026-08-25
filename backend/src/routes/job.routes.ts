import { Router } from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStage
} from '../controllers/job.controller';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/applications/my', getMyApplications);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/:id/apply', applyForJob);

// Admin & Placement Officer Routes
router.post('/', authorizeRoles('admin', 'placement_officer'), createJob);
router.put('/:id', authorizeRoles('admin', 'placement_officer'), updateJob);
router.delete('/:id', authorizeRoles('admin', 'placement_officer'), deleteJob);
router.get('/:id/applicants', authorizeRoles('admin', 'placement_officer'), getJobApplicants);
router.put('/applications/:appId/stage', authorizeRoles('admin', 'placement_officer'), updateApplicationStage);

export default router;
