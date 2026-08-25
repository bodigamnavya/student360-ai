import { Response } from 'express';
import crypto from 'crypto';
import { AuthRequest } from '../middleware/auth.middleware';
import { Achievement, AchievementCategory } from '../models/Achievement';
import { Skill } from '../models/Skill';
import { AchievementAIService } from '../services/ai/AchievementAIService';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Get student achievements with analytics and AI portfolio insight
 */
export const getAchievements = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.query.studentId || req.user?._id;
  const achievements = await Achievement.find({ student: studentId }).sort({ date: -1 });

  // Compute analytics
  const total = achievements.length;
  const national = achievements.filter((a) => a.aiAnalysis?.impactLevel === 'National' || (a.position && a.position.toLowerCase().includes('national'))).length;
  const international = achievements.filter((a) => a.aiAnalysis?.impactLevel === 'International').length;
  const hackathons = achievements.filter((a) => a.category === 'Hackathon').length;
  const research = achievements.filter((a) => a.category === 'Research' || a.category === 'Publication').length;
  const leadership = achievements.filter((a) => a.category === 'Leadership').length;

  // Category counts
  const categoryCounts: Record<string, number> = {};
  // Year counts
  const yearCounts: Record<string, number> = {};
  // Level counts
  const levelCounts: Record<string, number> = {
    National: 0,
    International: 0,
    State: 0,
    University: 0,
    College: 0,
    Department: 0,
    'Needs Review': 0
  };

  achievements.forEach((a) => {
    categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
    if (a.date) {
      const yr = new Date(a.date).getFullYear().toString();
      yearCounts[yr] = (yearCounts[yr] || 0) + 1;
    }
    const lvl = a.aiAnalysis?.impactLevel || 'National';
    levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;
  });

  // Generate dynamic AI Portfolio Insight based on stored data
  const strongAreas: string[] = [];
  if (hackathons > 0) strongAreas.push('Hackathons & Rapid Prototyping');
  if (research > 0) strongAreas.push('Research & IEEE Publications');
  if (leadership > 0) strongAreas.push('Institutional Leadership');
  if (achievements.some((a) => a.category === 'Certification')) strongAreas.push('Industry Cloud Certifications');
  if (strongAreas.length === 0) strongAreas.push('Technical Competitions & Coding');

  const strengthenAreas: string[] = [];
  if (research === 0) strengthenAreas.push('Research publications in peer-reviewed journals');
  if (hackathons === 0) strengthenAreas.push('National hackathon victories');
  if (international === 0) strengthenAreas.push('Global / International competition participation');
  if (!achievements.some((a) => a.category === 'Certification')) strengthenAreas.push('Industry cloud certifications (AWS / Meta / Google)');
  if (strengthenAreas.length === 0) strengthenAreas.push('Mentoring and open source leadership');

  const aiInsight = {
    totalVerified: total,
    strongAreas,
    strengthenAreas: strengthenAreas.slice(0, 3),
    summary: `You have ${total} verified achievement${total === 1 ? '' : 's'} in your portfolio. Your strongest areas feature ${strongAreas.join(', ')}.`
  };

  return sendSuccess(res, 'Achievements retrieved', {
    achievements,
    analytics: {
      total,
      national,
      international,
      hackathons,
      research,
      leadership,
      categoryCounts,
      yearCounts,
      levelCounts
    },
    aiInsight
  });
});

/**
 * Get achievement by ID
 */
export const getAchievementById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const achievement = await Achievement.findOne({ _id: id, student: req.user?._id });
  if (!achievement) return sendError(res, 'Achievement not found', 404);
  return sendSuccess(res, 'Achievement detail', achievement);
});

/**
 * Analyze achievement document or text via AI
 */
export const analyzeAchievement = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { textHint = '', filename = '' } = req.body;
  const extracted = await AchievementAIService.analyzeCertificate(textHint, filename);
  return sendSuccess(res, 'AI Certificate Extraction complete', extracted);
});

/**
 * Upload certificate evidence file
 */
export const uploadEvidence = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return sendError(res, 'No file provided', 400);
  }

  // Generate file hash for duplicate detection
  const hash = crypto.createHash('sha256').update(req.file.buffer || req.file.originalname).digest('hex');

  const fileMetadata = {
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    fileUrl: `/uploads/${req.file.filename || req.file.originalname}`,
    storageProvider: 'local',
    uploadedAt: new Date(),
    documentHash: hash
  };

  return sendSuccess(res, 'Evidence document uploaded', fileMetadata);
});

/**
 * Create new achievement with duplicate detection & optional skill profile sync
 */
export const addAchievement = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const {
    title,
    category,
    issuerOrg,
    date,
    description,
    position,
    evidenceUrl,
    evidence,
    skillsDemonstrated,
    aiAnalysis,
    ignoreDuplicate,
    syncSkillsToProfile,
    featured
  } = req.body;

  // Duplicate Check
  const existingAchs = await Achievement.find({ student: studentId });
  const credentialId = req.body.credentialId || req.body.certificateId || aiAnalysis?.credentialId || aiAnalysis?.certificateId;
  const dupCheck = AchievementAIService.detectDuplicate(title, issuerOrg, date || new Date().toISOString(), existingAchs, credentialId);

  if (dupCheck.isDuplicate && !ignoreDuplicate) {
    return res.status(409).json({
      success: false,
      message: 'Possible duplicate achievement detected',
      isDuplicate: true,
      duplicateRecord: dupCheck.duplicateRecord
    });
  }

  // Calculate confidence score
  const conf = AchievementAIService.calculateConfidence(!!evidence || !!evidenceUrl, title.length, issuerOrg.length);

  const achievement = await Achievement.create({
    student: studentId,
    title,
    category: category || 'Other',
    issuerOrg,
    date: date || new Date(),
    description,
    position: position || 'Participant / Winner',
    evidenceUrl: evidenceUrl || evidence?.fileUrl,
    evidence,
    skillsDemonstrated: skillsDemonstrated || [],
    aiCategorized: true,
    aiAnalysis: {
      confidence: conf.confidence,
      confidenceCategory: conf.category,
      category: category || 'Other',
      impactLevel: aiAnalysis?.impactLevel || 'National',
      careerRelevance: 'High',
      resumeValue: 'Strong',
      summary: aiAnalysis?.summary || AchievementAIService.generateAchievementSummary(title, issuerOrg, position, description),
      resumeBullet: aiAnalysis?.resumeBullet || AchievementAIService.generateResumeBullet(title, issuerOrg, position, skillsDemonstrated),
      extractedSkills: skillsDemonstrated || [],
      analyzedAt: new Date(),
      ...aiAnalysis
    },
    documentHash: evidence?.documentHash,
    featured: featured || false
  });

  // Sync skills to main Skill Profile if requested
  if (syncSkillsToProfile && skillsDemonstrated && skillsDemonstrated.length > 0) {
    for (const skillName of skillsDemonstrated) {
      await Skill.findOneAndUpdate(
        { student: studentId, name: skillName },
        {
          $setOnInsert: {
            student: studentId,
            name: skillName,
            category: 'Core CS / Tools',
            proficiency: 'Intermediate',
            verified: true
          }
        },
        { upsert: true, new: true }
      );
    }
  }

  return sendSuccess(res, 'Achievement saved to digital portfolio', achievement, 201);
});

/**
 * Update existing achievement
 */
export const updateAchievement = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const achievement = await Achievement.findOneAndUpdate(
    { _id: id, student: req.user?._id },
    { $set: req.body },
    { new: true }
  );
  if (!achievement) return sendError(res, 'Achievement not found', 404);
  return sendSuccess(res, 'Achievement updated', achievement);
});

/**
 * Delete achievement
 */
export const deleteAchievement = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const achievement = await Achievement.findOneAndDelete({ _id: id, student: req.user?._id });
  if (!achievement) return sendError(res, 'Achievement not found', 404);
  return sendSuccess(res, 'Achievement deleted');
});

/**
 * Generate AI Summary for existing achievement
 */
export const generateSummary = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const ach = await Achievement.findById(id);
  const title = ach?.title || req.body.title || 'Achievement';
  const org = ach?.issuerOrg || req.body.issuerOrg || 'Organization';
  const pos = ach?.position || req.body.position || 'Winner';
  const desc = ach?.description || req.body.description || '';

  const summary = AchievementAIService.generateAchievementSummary(title, org, pos, desc);
  return sendSuccess(res, 'AI Summary generated', { summary });
});

/**
 * Generate ATS Resume Bullet for achievement
 */
export const generateResumeBullet = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const ach = await Achievement.findById(id);
  const title = ach?.title || req.body.title || 'Achievement';
  const org = ach?.issuerOrg || req.body.issuerOrg || 'Organization';
  const pos = ach?.position || req.body.position || 'Winner';
  const skills = ach?.skillsDemonstrated || req.body.skills || ['AI/ML', 'Problem Solving'];

  const resumeBullet = AchievementAIService.generateResumeBullet(title, org, pos, skills);
  return sendSuccess(res, 'ATS Resume Bullet generated', { resumeBullet });
});

/**
 * Extract skills from achievement text
 */
export const extractSkills = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { text = '' } = req.body;
  const skills = AchievementAIService.extractSkills(text);
  return sendSuccess(res, 'Skills extracted', { skills });
});
