import { Router } from 'express';
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  analyzeProject,
  getFolders,
  addFolder,
  updateFolder,
  deleteFolder,
  uploadProjectFile,
  deleteProjectFile
} from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.use(authenticate);

// Projects
router.get('/', getProjects);
router.post('/', addProject);
router.post('/analyze', analyzeProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

// Folders
router.get('/folders/all', getFolders);
router.post('/folders', addFolder);
router.put('/folders/:id', updateFolder);
router.delete('/folders/:id', deleteFolder);

// Files
router.post('/files/upload', upload.single('file'), uploadProjectFile);
router.delete('/files/:id', deleteProjectFile);

export default router;
