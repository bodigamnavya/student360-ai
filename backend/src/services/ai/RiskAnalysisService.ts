export interface RiskAnalysisResult {
  riskScore: number; // 0 to 100
  riskLevel: 'Low' | 'Medium' | 'High';
  contributingFactors: {
    category: string;
    description: string;
    impact: 'High' | 'Medium' | 'Low';
  }[];
  recommendedInterventions: string[];
  explanation: string;
}

export class RiskAnalysisService {
  public static evaluateRisk(params: {
    cgpa: number;
    activeBacklogs: number;
    attendancePercentage: number;
    academicHistory: { semester: number; sgpa: number }[];
    projectsCount: number;
    internshipsCount: number;
    skillsCount: number;
    mentoringIssuesCount: number;
  }): RiskAnalysisResult {
    const factors: RiskAnalysisResult['contributingFactors'] = [];
    let riskPoints = 0;

    // 1. Backlogs (Weight: 35)
    if (params.activeBacklogs >= 3) {
      riskPoints += 35;
      factors.push({
        category: 'Academics',
        description: `High number of active backlogs (${params.activeBacklogs} backlogs pending clearance)`,
        impact: 'High'
      });
    } else if (params.activeBacklogs > 0) {
      riskPoints += 20;
      factors.push({
        category: 'Academics',
        description: `Has ${params.activeBacklogs} active backlog(s) requiring remediation`,
        impact: 'Medium'
      });
    }

    // 2. Attendance (Weight: 25)
    if (params.attendancePercentage < 65) {
      riskPoints += 25;
      factors.push({
        category: 'Attendance',
        description: `Critical attendance shortage (${params.attendancePercentage.toFixed(1)}%, well below 75% statutory requirement)`,
        impact: 'High'
      });
    } else if (params.attendancePercentage < 75) {
      riskPoints += 15;
      factors.push({
        category: 'Attendance',
        description: `Borderline attendance (${params.attendancePercentage.toFixed(1)}%) risking exam detention`,
        impact: 'Medium'
      });
    }

    // 3. CGPA & Academic Velocity (Weight: 20)
    if (params.cgpa < 6.0) {
      riskPoints += 20;
      factors.push({
        category: 'Academics',
        description: `Low cumulative GPA (${params.cgpa.toFixed(2)}) impairs placement eligibility`,
        impact: 'High'
      });
    } else if (params.cgpa < 7.0) {
      riskPoints += 10;
      factors.push({
        category: 'Academics',
        description: `Moderate cumulative GPA (${params.cgpa.toFixed(2)}) limits Tier-1 company criteria`,
        impact: 'Low'
      });
    }

    // Check declining trend
    if (params.academicHistory.length >= 2) {
      const sorted = [...params.academicHistory].sort((a, b) => b.semester - a.semester);
      if (sorted[0].sgpa < sorted[1].sgpa - 0.75) {
        riskPoints += 10;
        factors.push({
          category: 'Trend',
          description: `Recent sharp SGPA decline (${sorted[1].sgpa} → ${sorted[0].sgpa})`,
          impact: 'Medium'
        });
      }
    }

    // 4. Portfolio & Skill Readiness (Weight: 10)
    if (params.projectsCount === 0) {
      riskPoints += 8;
      factors.push({
        category: 'Portfolio',
        description: 'Zero verifiable technical projects in portfolio',
        impact: 'Medium'
      });
    }
    if (params.skillsCount < 3) {
      riskPoints += 5;
      factors.push({
        category: 'Skills',
        description: 'Insufficient technical skill verified profiles',
        impact: 'Low'
      });
    }

    // 5. Mentoring Flags
    if (params.mentoringIssuesCount > 0) {
      riskPoints += 5;
      factors.push({
        category: 'Mentoring',
        description: 'Active unresolved action items flagged by faculty mentor',
        impact: 'Medium'
      });
    }

    const finalScore = Math.min(Math.max(riskPoints, 5), 100);
    const riskLevel: 'Low' | 'Medium' | 'High' =
      finalScore >= 60 ? 'High' : finalScore >= 35 ? 'Medium' : 'Low';

    const interventions: string[] = [];
    if (params.activeBacklogs > 0) {
      interventions.push('Enroll in remedial tutoring sessions for pending backlog subjects.');
    }
    if (params.attendancePercentage < 75) {
      interventions.push('Mandatory 100% attendance in upcoming 15 instructional days to restore threshold.');
    }
    if (params.projectsCount === 0) {
      interventions.push('Assign mentor-guided Capstone or mini-project milestone.');
    }
    if (interventions.length === 0) {
      interventions.push('Maintain current academic consistency and commence competitive interview practice.');
    }

    const explanation =
      riskLevel === 'High'
        ? 'Urgent intervention required. Significant academic and attendance vulnerabilities threaten graduation timeline.'
        : riskLevel === 'Medium'
        ? 'Moderate risk profile. Targeted corrective measures needed in attendance or backlog clearance.'
        : 'Healthy academic trajectory. Student is progressing smoothly with low risk metrics.';

    return {
      riskScore: finalScore,
      riskLevel,
      contributingFactors: factors,
      recommendedInterventions: interventions,
      explanation
    };
  }
}
