import { ResumeData, ResumeGenerationService } from '../services/ai/ResumeGenerationService';

export interface ResumeOptimizationResult {
  atsMatchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  missingSkills: string[];
  strongMatches: string[];
  weakAreas: string[];
  suggestedBulletImprovements: {
    original?: string;
    optimized: string;
    reason: string;
  }[];
  verdict: 'Excellent Match' | 'Good Match' | 'Moderate Match' | 'Low Match - Action Required';
}

export class AIResumeService {
  /**
   * Generate ATS Resume from full student profile
   */
  public static generateResume(params: {
    user: { name: string; email: string };
    profile: any;
    academicRecords: any[];
    skills: any[];
    projects: any[];
    internships: any[];
    certifications: any[];
    achievements: any[];
    targetRole?: string;
    template?: 'Modern' | 'Professional' | 'Minimal' | 'ATS-Friendly';
  }): ResumeData {
    return ResumeGenerationService.generateFromProfile(params);
  }

  /**
   * Compare student resume vs target job description and optimize ATS score
   */
  public static optimizeResumeForJob(params: {
    jobDescription: string;
    targetRole: string;
    studentSkills: string[];
    studentProjects?: { title: string; description: string; technologies?: string[] }[];
    studentInternships?: { company: string; role: string; description: string }[];
  }): ResumeOptimizationResult {
    const jdLower = params.jobDescription.toLowerCase();

    // Industry keyword dictionary
    const keywordDict = [
      'react', 'next.js', 'node.js', 'typescript', 'javascript', 'python',
      'fastapi', 'docker', 'kubernetes', 'aws', 'cloud', 'mongodb', 'postgresql',
      'redis', 'graphql', 'rest api', 'microservices', 'ci/cd', 'agile',
      'system design', 'distributed systems', 'unit testing', 'jest', 'kafka',
      'tailwind css', 'git', 'linux', 'data structures', 'algorithms'
    ];

    const studentSkillsLower = new Set(params.studentSkills.map((s) => s.toLowerCase().trim()));

    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];
    const missingSkills: string[] = [];

    keywordDict.forEach((kw) => {
      if (jdLower.includes(kw)) {
        if (studentSkillsLower.has(kw)) {
          matchedKeywords.push(kw.toUpperCase());
        } else {
          missingKeywords.push(kw.toUpperCase());
          missingSkills.push(kw.charAt(0).toUpperCase() + kw.slice(1));
        }
      }
    });

    const totalKeywordsInJd = matchedKeywords.length + missingKeywords.length;
    const matchRatio = totalKeywordsInJd > 0 ? matchedKeywords.length / totalKeywordsInJd : 0.75;
    const atsMatchScore = Math.round(matchRatio * 60 + 35);

    const strongMatches = matchedKeywords.slice(0, 5);
    const weakAreas = missingSkills.slice(0, 4);

    const suggestedBulletImprovements = [
      {
        original: 'Built full stack features and updated database collections.',
        optimized: `• Engineered scalable full-stack services with ${params.studentSkills.slice(0, 2).join(' and ') || 'React and Node.js'}, improving query latency and throughput.`,
        reason: 'Adds action verbs, quantified performance impact, and verified keyword alignment.'
      },
      {
        original: 'Worked on project team to deploy backend endpoints.',
        optimized: `• Architected resilient RESTful API endpoints and integrated robust error handling with zero regression.`,
        reason: 'Emphasizes software design maturity and production readiness.'
      }
    ];

    const verdict =
      atsMatchScore >= 85
        ? 'Excellent Match'
        : atsMatchScore >= 70
        ? 'Good Match'
        : atsMatchScore >= 55
        ? 'Moderate Match'
        : 'Low Match - Action Required';

    return {
      atsMatchScore: Math.min(96, Math.max(45, atsMatchScore)),
      matchedKeywords,
      missingKeywords: missingKeywords.slice(0, 6),
      missingSkills: missingSkills.slice(0, 5),
      strongMatches,
      weakAreas,
      suggestedBulletImprovements,
      verdict
    };
  }
}
