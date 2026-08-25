export interface RiskAnalysisResult {
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  riskScore: number; // 0-100 (0: lowest risk, 100: severe risk)
  contributingFactors: string[];
  recommendations: string[];
  academicTrajectory: 'Improving' | 'Stable' | 'Declining';
  attendanceRisk: 'Safe' | 'Borderline' | 'Critical';
}

export interface MentorInsightResult {
  studentName: string;
  department: string;
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  academicTrend: string;
  attendanceStatus: string;
  skillProgress: string;
  projectStatus: string;
  placementReadiness: string;
  strengths: string[];
  concerns: string[];
  recommendedMentorActions: string[];
  suggestedFollowUpDate: string;
}

export class AIRiskAnalysisService {
  /**
   * Calculate multi-factor student academic & placement risk
   */
  public static analyzeStudentRisk(params: {
    cgpa?: number;
    activeBacklogs?: number;
    attendancePercentage?: number;
    semesters?: { sgpa: number }[];
    internshipsCount?: number;
    skillsCount?: number;
  }): RiskAnalysisResult {
    const cgpa = params.cgpa || 8.0;
    const backlogs = params.activeBacklogs || 0;
    const attendance = params.attendancePercentage || 85;
    const sems = params.semesters || [];

    let riskScore = 15;
    const contributingFactors: string[] = [];
    const recommendations: string[] = [];

    // CGPA velocity & backlogs
    if (cgpa < 6.5) {
      riskScore += 35;
      contributingFactors.push(`CGPA (${cgpa.toFixed(2)}) is below standard placement eligibility threshold (6.5).`);
      recommendations.push('Schedule remedial tutoring and academic mentoring sessions.');
    } else if (cgpa < 7.5) {
      riskScore += 15;
      contributingFactors.push(`CGPA (${cgpa.toFixed(2)}) leaves room for academic improvement.`);
    }

    if (backlogs > 0) {
      riskScore += backlogs * 20;
      contributingFactors.push(`${backlogs} active backlog course${backlogs === 1 ? '' : 's'} registered.`);
      recommendations.push('Prioritize cleared backlog exams in upcoming supplementary semester.');
    }

    // Attendance
    let attendanceRisk: RiskAnalysisResult['attendanceRisk'] = 'Safe';
    if (attendance < 75) {
      riskScore += 30;
      attendanceRisk = 'Critical';
      contributingFactors.push(`Institutional attendance (${attendance.toFixed(1)}%) is below mandatory 75% threshold.`);
      recommendations.push('Attend all remaining lectures to prevent exam detention.');
    } else if (attendance < 80) {
      riskScore += 10;
      attendanceRisk = 'Borderline';
      contributingFactors.push(`Attendance is borderline (${attendance.toFixed(1)}%).`);
    }

    // Trajectory
    let academicTrajectory: RiskAnalysisResult['academicTrajectory'] = 'Stable';
    if (sems.length >= 2) {
      const last = sems[sems.length - 1].sgpa;
      const prev = sems[sems.length - 2].sgpa;
      if (last > prev + 0.3) academicTrajectory = 'Improving';
      else if (last < prev - 0.3) {
        academicTrajectory = 'Declining';
        riskScore += 15;
        contributingFactors.push(`SGPA declined from ${prev.toFixed(2)} to ${last.toFixed(2)} in the last semester.`);
        recommendations.push('Review difficult subjects with faculty mentors.');
      }
    }

    // Internship & Skill deficit
    if ((params.internshipsCount || 0) === 0 && cgpa >= 7.0) {
      recommendations.push('Apply for industry summer internships to strengthen placement portfolio.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Maintain current high academic consistency and complete target skill roadmap.');
    }

    riskScore = Math.min(100, Math.max(5, riskScore));

    const riskLevel: RiskAnalysisResult['riskLevel'] =
      riskScore >= 60 ? 'High Risk' : riskScore >= 35 ? 'Medium Risk' : 'Low Risk';

    return {
      riskLevel,
      riskScore,
      contributingFactors: contributingFactors.length > 0 ? contributingFactors : ['Strong consistent performance across all metrics.'],
      recommendations,
      academicTrajectory,
      attendanceRisk
    };
  }

  /**
   * Generate AI Mentor Insights for faculty mentors advising students
   */
  public static generateMentorInsights(params: {
    studentName: string;
    department: string;
    cgpa: number;
    attendancePercentage: number;
    activeBacklogs?: number;
    targetRole?: string;
    skillsCount?: number;
    projectsCount?: number;
  }): MentorInsightResult {
    const risk = this.analyzeStudentRisk({
      cgpa: params.cgpa,
      attendancePercentage: params.attendancePercentage,
      activeBacklogs: params.activeBacklogs,
      skillsCount: params.skillsCount
    });

    const strengths = [
      params.cgpa >= 8.0 ? 'Strong academic consistency and GPA velocity.' : 'Actively completing coursework modules.',
      (params.projectsCount || 0) >= 2 ? 'Active practical project builder with portfolio artifacts.' : 'Participating in core CS labs.'
    ];

    const concerns = risk.contributingFactors.filter((f) => !f.includes('Strong consistent'));

    const recommendedMentorActions = [
      'Conduct bi-weekly check-in to review academic progress and skill gap closure.',
      'Provide guidance on target placement roles and mock interview preparation.',
      'Encourage participation in upcoming hackathons and departmental coding competitions.'
    ];

    const followUpDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
      studentName: params.studentName,
      department: params.department,
      riskLevel: risk.riskLevel,
      academicTrend: `CGPA: ${params.cgpa.toFixed(2)} (${risk.academicTrajectory})`,
      attendanceStatus: `${params.attendancePercentage.toFixed(1)}% (${risk.attendanceRisk})`,
      skillProgress: `${params.skillsCount || 4} verified skills mapped to target role ${params.targetRole || 'Software Engineer'}`,
      projectStatus: `${params.projectsCount || 2} engineering projects completed`,
      placementReadiness: risk.riskLevel === 'Low Risk' ? 'High Placement Readiness' : 'Moderate - Skill Gap Action Needed',
      strengths,
      concerns: concerns.length > 0 ? concerns : ['No immediate critical concerns.'],
      recommendedMentorActions,
      suggestedFollowUpDate: followUpDate
    };
  }
}
