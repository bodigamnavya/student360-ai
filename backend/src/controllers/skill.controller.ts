import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Skill, SkillCategory, SkillProficiency } from '../models/Skill';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const getSkills = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.query.studentId || req.user?._id;
  const skills = await Skill.find({ student: studentId })
    .populate('evidence.projects', 'title domain technologies')
    .populate('evidence.certifications', 'title issuer')
    .populate('evidence.internships', 'company role')
    .sort({ category: 1, proficiency: -1 });

  return sendSuccess(res, 'Skills retrieved', skills);
});

export const addSkill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const studentId = req.user?._id;
  const { name, category, proficiency, experienceMonths, evidence, isTopSkill } = req.body;

  // Auto assign category if not specified
  let cat: SkillCategory = category || 'Programming';
  const n = (name || '').toLowerCase();
  if (['react', 'next.js', 'vue', 'angular', 'html', 'css', 'tailwind css', 'javascript', 'typescript'].some((k) => n.includes(k))) cat = 'Web Development';
  else if (['mongodb', 'sql', 'postgresql', 'mysql', 'redis', 'prisma'].some((k) => n.includes(k))) cat = 'Database';
  else if (['docker', 'kubernetes', 'aws', 'gcp', 'ci/cd', 'linux'].some((k) => n.includes(k))) cat = 'Cloud & DevOps';
  else if (['python', 'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'nlp'].some((k) => n.includes(k))) cat = 'AI / Machine Learning';
  else if (['communication', 'leadership', 'teamwork', 'problem solving'].some((k) => n.includes(k))) cat = 'Soft Skills';

  const skill = await Skill.findOneAndUpdate(
    { student: studentId, name: name.trim() },
    {
      student: studentId,
      name: name.trim(),
      category: cat,
      proficiency: proficiency || 'Intermediate',
      experienceMonths: experienceMonths || 6,
      evidence: evidence || {},
      isTopSkill: isTopSkill || false
    },
    { upsert: true, new: true, runValidators: true }
  );

  return sendSuccess(res, 'Skill saved successfully', skill, 201);
});

export const updateSkill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const skill = await Skill.findOneAndUpdate(
    { _id: id, student: req.user?._id },
    { $set: req.body },
    { new: true }
  );
  if (!skill) return sendError(res, 'Skill not found', 404);
  return sendSuccess(res, 'Skill updated', skill);
});

export const deleteSkill = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const skill = await Skill.findOneAndDelete({ _id: id, student: req.user?._id });
  if (!skill) return sendError(res, 'Skill not found', 404);
  return sendSuccess(res, 'Skill deleted');
});
