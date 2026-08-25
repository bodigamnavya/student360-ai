import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Project } from '../models/Project';
import { ProjectFolder } from '../models/ProjectFolder';
import { ProjectFile } from '../models/ProjectFile';
import { ProjectAnalysisService } from '../services/ai/ProjectAnalysisService';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getProjects = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.query.studentId || req.user?._id;
  const folderId = req.query.folderId as string;

  const query: any = { student: studentId };
  if (folderId) {
    query.folder = folderId;
  }

  const projects = await Project.find(query).populate('folder', 'name color').sort({ createdAt: -1 });
  return sendSuccess(res, 'Projects retrieved', projects);
});

export const addProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const { title, description, domain, technologies, githubUrl, liveUrl, teamMembers, startDate, endDate, isOngoing, status, featured, folder, folderName, files } = req.body;

  // Run AI Project Analyzer
  const aiAnalysis = ProjectAnalysisService.analyze({
    title,
    description,
    technologies: technologies || []
  });

  const project = await Project.create({
    student: studentId,
    title,
    description,
    domain: domain || aiAnalysis.domain,
    technologies: Array.from(new Set([...(technologies || []), ...aiAnalysis.detectedSkills])),
    githubUrl,
    liveUrl,
    teamMembers,
    startDate,
    endDate,
    isOngoing,
    status: status || 'Completed',
    folder: folder || undefined,
    folderName: folderName || 'General',
    files: files || [],
    aiAnalysis,
    featured: featured || false
  });

  // Update folder project count
  if (folder) {
    await ProjectFolder.findByIdAndUpdate(folder, { $inc: { projectCount: 1 } });
  }

  return sendSuccess(res, 'Project added and AI analyzed successfully', project, 201);
});

export const updateProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, technologies, folder } = req.body;

  let aiAnalysis = undefined;
  if (title || description) {
    const existing = await Project.findById(id);
    if (existing) {
      aiAnalysis = ProjectAnalysisService.analyze({
        title: title || existing.title,
        description: description || existing.description,
        technologies: technologies || existing.technologies
      });
    }
  }

  const project = await Project.findOneAndUpdate(
    { _id: id, student: req.user?._id },
    { $set: { ...req.body, ...(aiAnalysis && { aiAnalysis }) } },
    { new: true }
  );

  if (!project) return sendError(res, 'Project not found or unauthorized', 404);
  return sendSuccess(res, 'Project updated successfully', project);
});

export const deleteProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const project = await Project.findOneAndDelete({ _id: id, student: req.user?._id });
  if (!project) return sendError(res, 'Project not found or unauthorized', 404);

  if (project.folder) {
    await ProjectFolder.findByIdAndUpdate(project.folder, { $inc: { projectCount: -1 } });
  }

  return sendSuccess(res, 'Project deleted successfully');
});

export const analyzeProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description, technologies } = req.body;
  if (!title || !description) {
    return sendError(res, 'Title and description are required for AI analysis', 400);
  }

  const analysis = ProjectAnalysisService.analyze({
    title,
    description,
    technologies: technologies || []
  });

  return sendSuccess(res, 'Project analyzed by AI', analysis);
});

// ==================== PROJECT FOLDERS ====================

export const getFolders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const folders = await ProjectFolder.find({ student: studentId }).sort({ name: 1 });
  return sendSuccess(res, 'Project folders retrieved', folders);
});

export const addFolder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const { name, color, parentFolder } = req.body;

  if (!name || name.trim() === '') {
    return sendError(res, 'Folder name is required', 400);
  }

  const folder = await ProjectFolder.create({
    student: studentId,
    name: name.trim(),
    color: color || '#6366f1',
    parentFolder: parentFolder || undefined
  });

  return sendSuccess(res, 'Folder created successfully', folder, 201);
});

export const updateFolder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, color } = req.body;

  const folder = await ProjectFolder.findOneAndUpdate(
    { _id: id, student: req.user?._id },
    { $set: { ...(name && { name: name.trim() }), ...(color && { color }) } },
    { new: true }
  );

  if (!folder) return sendError(res, 'Folder not found', 404);
  return sendSuccess(res, 'Folder updated', folder);
});

export const deleteFolder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const folder = await ProjectFolder.findOneAndDelete({ _id: id, student: req.user?._id });
  if (!folder) return sendError(res, 'Folder not found', 404);

  // Unassign projects from this folder
  await Project.updateMany({ folder: id, student: req.user?._id }, { $unset: { folder: 1, folderName: 1 } });

  return sendSuccess(res, 'Folder deleted successfully');
});

// ==================== PROJECT FILES ====================

export const uploadProjectFile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return sendError(res, 'No file uploaded', 400);
  }

  const studentId = req.user?._id;
  const { projectId, folderId } = req.body;

  const fileData = {
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    storageUrl: `/uploads/${req.file.filename || req.file.originalname}`,
    uploadedAt: new Date()
  };

  const projectFile = await ProjectFile.create({
    student: studentId,
    project: projectId || undefined,
    folder: folderId || undefined,
    ...fileData
  });

  if (projectId) {
    await Project.findByIdAndUpdate(projectId, {
      $push: { files: fileData }
    });
  }

  return sendSuccess(res, 'File uploaded and attached to project', projectFile, 201);
});

export const deleteProjectFile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const file = await ProjectFile.findOneAndDelete({ _id: id, student: req.user?._id });
  if (!file) return sendError(res, 'File not found', 404);

  if (file.project) {
    await Project.findByIdAndUpdate(file.project, {
      $pull: { files: { storageUrl: file.storageUrl } }
    });
  }

  return sendSuccess(res, 'Project file removed');
});
