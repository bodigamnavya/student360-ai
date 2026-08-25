export interface JobMatchResult {
  jobId: string;
  matchScore: number;
  isEligible: boolean;
  ineligibilityReasons: string[];
  strengths: string[];
  gaps: string[];
  recommendation: string;
}

export class JobMatchingService {
  public static calculateMatch(params: {
    studentProfile: {
      cgpa: number;
      department: string;
      batch: string;
      activeBacklogs: number;
      skills: string[];
      projects: { title: string; technologies: string[] }[];
      internships: { role: string; technologies: string[] }[];
    };
    job: {
      _id: any;
      requiredSkills: string[];
      preferredSkills: string[];
      minCgpa: number;
      maxBacklogsAllowed: number;
      eligibleBranches: string[];
      graduationYears: string[];
    };
  }): JobMatchResult {
    const student = params.studentProfile;
    const job = params.job;
    const ineligibilityReasons: string[] = [];

    // 1. Check CGPA eligibility
    if (student.cgpa < job.minCgpa) {
      ineligibilityReasons.push(`CGPA (${student.cgpa.toFixed(2)}) is below minimum required (${job.minCgpa.toFixed(2)})`);
    }

    // 2. Check Backlogs
    if (student.activeBacklogs > job.maxBacklogsAllowed) {
      ineligibilityReasons.push(`Active backlogs (${student.activeBacklogs}) exceed maximum allowed (${job.maxBacklogsAllowed})`);
    }

    // 3. Check Branch / Department
    if (
      job.eligibleBranches &&
      job.eligibleBranches.length > 0 &&
      !job.eligibleBranches.some(
        (b) =>
          b.toLowerCase().includes('all') ||
          b.toLowerCase().includes(student.department.toLowerCase()) ||
          student.department.toLowerCase().includes(b.toLowerCase())
      )
    ) {
      ineligibilityReasons.push(`Department (${student.department}) is not in eligible branches list`);
    }

    const isEligible = ineligibilityReasons.length === 0;

    // 4. Match Skills
    const studentSkillsLower = new Set(
      student.skills.map((s) => s.toLowerCase().trim())
    );
    student.projects.forEach((p) =>
      p.technologies?.forEach((t) => studentSkillsLower.add(t.toLowerCase().trim()))
    );
    student.internships.forEach((i) =>
      i.technologies?.forEach((t) => studentSkillsLower.add(t.toLowerCase().trim()))
    );

    const strengths: string[] = [];
    const gaps: string[] = [];

    const reqSkills = job.requiredSkills || [];
    let reqMatchedCount = 0;

    reqSkills.forEach((req) => {
      const matched = Array.from(studentSkillsLower).some(
        (s) => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s)
      );
      if (matched) {
        strengths.push(req);
        reqMatchedCount++;
      } else {
        gaps.push(req);
      }
    });

    const prefSkills = job.preferredSkills || [];
    let prefMatchedCount = 0;
    prefSkills.forEach((pref) => {
      const matched = Array.from(studentSkillsLower).some(
        (s) => s.includes(pref.toLowerCase()) || pref.toLowerCase().includes(s)
      );
      if (matched) {
        if (!strengths.includes(pref)) strengths.push(pref);
        prefMatchedCount++;
      }
    });

    // Score Calculation
    const reqRatio = reqSkills.length > 0 ? reqMatchedCount / reqSkills.length : 1;
    const prefRatio = prefSkills.length > 0 ? prefMatchedCount / prefSkills.length : 0.5;

    let matchScore = Math.round(reqRatio * 65 + prefRatio * 20);

    // Academic weighting
    if (student.cgpa >= 8.5) matchScore += 10;
    else if (student.cgpa >= 7.5) matchScore += 6;
    else if (student.cgpa >= 6.5) matchScore += 3;

    if (student.projects.length >= 2) matchScore += 5;

    if (!isEligible) {
      matchScore = Math.min(matchScore, 45); // Penalty if in-eligible
    }

    matchScore = Math.min(Math.max(matchScore, 25), 98);

    let recommendation = 'High match profile. Recommended to apply immediately.';
    if (!isEligible) {
      recommendation = `Currently ineligible: ${ineligibilityReasons.join('. ')}`;
    } else if (matchScore < 70) {
      recommendation = `Moderate match. Consider upskilling in ${gaps.slice(0, 2).join(', ')} before applying.`;
    }

    return {
      jobId: job._id ? job._id.toString() : '',
      matchScore,
      isEligible,
      ineligibilityReasons,
      strengths,
      gaps,
      recommendation
    };
  }
}
