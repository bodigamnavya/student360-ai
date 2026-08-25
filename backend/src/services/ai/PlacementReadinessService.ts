export interface PlacementReadinessResult {
  overallScore: number; // 0 to 100
  categoryScores: {
    academics: number;
    technicalSkills: number;
    projects: number;
    internships: number;
    certifications: number;
    codingAndAptitude: number;
    softSkills: number;
  };
  tierEligibility: 'Tier-1 (Super Dream > 12 LPA)' | 'Tier-2 (Dream 6-12 LPA)' | 'Tier-3 (Mass/Core 3-6 LPA)' | 'Needs Upskilling';
  strengths: string[];
  keyGaps: string[];
  actionPlan: string[];
}

export class PlacementReadinessService {
  public static calculate(params: {
    cgpa: number;
    activeBacklogs: number;
    skillsCount: number;
    advancedSkillsCount: number;
    projectsCount: number;
    internshipsCount: number;
    certificationsCount: number;
    achievementsCount: number;
    hasGithubOrPortfolio: boolean;
  }): PlacementReadinessResult {
    // 1. Academics (Weight: 25)
    let academicScore = Math.min((params.cgpa / 10) * 100, 100);
    if (params.activeBacklogs > 0) {
      academicScore = Math.max(academicScore - params.activeBacklogs * 20, 20);
    }

    // 2. Technical Skills (Weight: 20)
    let techScore = Math.min(params.skillsCount * 12 + params.advancedSkillsCount * 10, 100);

    // 3. Projects (Weight: 20)
    let projScore = Math.min(params.projectsCount * 30 + (params.hasGithubOrPortfolio ? 20 : 0), 100);

    // 4. Internships (Weight: 15)
    let internScore = Math.min(params.internshipsCount * 50, 100);

    // 5. Certifications (Weight: 10)
    let certScore = Math.min(params.certificationsCount * 35, 100);

    // 6. Coding / Achievements (Weight: 10)
    let achieveScore = Math.min(params.achievementsCount * 35 + 40, 100);

    let softSkillScore = 80;

    // Weighted Total
    const weightedTotal = Math.round(
      academicScore * 0.25 +
      techScore * 0.20 +
      projScore * 0.20 +
      internScore * 0.15 +
      certScore * 0.10 +
      achieveScore * 0.10
    );

    const overallScore = Math.min(Math.max(weightedTotal, 20), 100);

    let tierEligibility: PlacementReadinessResult['tierEligibility'] = 'Needs Upskilling';
    if (overallScore >= 80 && params.cgpa >= 7.5 && params.activeBacklogs === 0) {
      tierEligibility = 'Tier-1 (Super Dream > 12 LPA)';
    } else if (overallScore >= 65 && params.cgpa >= 6.5 && params.activeBacklogs <= 1) {
      tierEligibility = 'Tier-2 (Dream 6-12 LPA)';
    } else if (overallScore >= 45) {
      tierEligibility = 'Tier-3 (Mass/Core 3-6 LPA)';
    }

    const strengths: string[] = [];
    const keyGaps: string[] = [];
    const actionPlan: string[] = [];

    if (academicScore >= 80) strengths.push(`Strong academic standing (CGPA ${params.cgpa.toFixed(2)})`);
    else if (academicScore < 65) keyGaps.push('Academic CGPA below competitive cutoffs');

    if (projScore >= 75) strengths.push(`Substantial project portfolio (${params.projectsCount} built projects)`);
    else {
      keyGaps.push('Limited deployment-ready projects in portfolio');
      actionPlan.push('Build and deploy at least 1 end-to-end full-stack or domain project with GitHub documentation.');
    }

    if (internScore >= 50) strengths.push(`Verified industry internship experience (${params.internshipsCount} completed)`);
    else {
      keyGaps.push('No industry internship recorded');
      actionPlan.push('Apply for summer/winter internships or open-source fellowships.');
    }

    if (certScore < 50) {
      actionPlan.push('Earn 1 recognized cloud or domain certification (e.g. AWS, Meta, Google).');
    }

    actionPlan.push('Practice at least 5 DSA mock coding assessments and 2 behavioral mock interviews.');

    return {
      overallScore,
      categoryScores: {
        academics: Math.round(academicScore),
        technicalSkills: Math.round(techScore),
        projects: Math.round(projScore),
        internships: Math.round(internScore),
        certifications: Math.round(certScore),
        codingAndAptitude: Math.round(achieveScore),
        softSkills: softSkillScore
      },
      tierEligibility,
      strengths,
      keyGaps,
      actionPlan
    };
  }
}
