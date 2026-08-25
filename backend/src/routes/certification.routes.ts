import { Router } from 'express';
import {
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
  extractCertificateInfo
} from '../controllers/certification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getCertifications);
router.post('/', addCertification);
router.post('/extract', extractCertificateInfo);
router.put('/:id', updateCertification);
router.delete('/:id', deleteCertification);

export default router;
