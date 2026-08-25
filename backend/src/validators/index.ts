import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'faculty', 'placement_officer', 'admin']).default('student'),
  department: z.string().optional().default('Computer Science and Engineering'),
  rollNumber: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  degree: z.string().optional(),
  batch: z.string().optional(),
  currentYear: z.number().min(1).max(5).optional(),
  currentSemester: z.number().min(1).max(10).optional(),
  section: z.string().optional(),
  careerObjective: z.string().optional(),
  targetRole: z.string().optional(),
  socialLinks: z.object({
    linkedin: z.string().optional(),
    github: z.string().optional(),
    portfolio: z.string().optional(),
    leetcode: z.string().optional(),
    codechef: z.string().optional(),
    hackerRank: z.string().optional()
  }).optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    country: z.string().optional()
  }).optional(),
  isPublicPortfolio: z.boolean().optional(),
  publicSections: z.object({
    about: z.boolean().optional(),
    academics: z.boolean().optional(),
    skills: z.boolean().optional(),
    projects: z.boolean().optional(),
    internships: z.boolean().optional(),
    certifications: z.boolean().optional(),
    achievements: z.boolean().optional(),
    contact: z.boolean().optional()
  }).optional()
});

export const createJobSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  jobRole: z.string().min(1, 'Job role is required'),
  jobType: z.enum(['Full-time', 'Internship', 'Internship + PPO']).default('Full-time'),
  description: z.string().min(10, 'Description is required'),
  requiredSkills: z.array(z.string()).default([]),
  preferredSkills: z.array(z.string()).default([]),
  minCgpa: z.number().min(0).max(10).default(6.0),
  maxBacklogsAllowed: z.number().min(0).default(0),
  eligibleBranches: z.array(z.string()).default([]),
  graduationYears: z.array(z.string()).default([]),
  location: z.string().default('Bengaluru'),
  salaryRange: z.object({
    min: z.number().default(6),
    max: z.number().default(12),
    currency: z.string().default('LPA')
  }),
  applicationDeadline: z.string()
});
