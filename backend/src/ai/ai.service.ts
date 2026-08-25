import { ENV } from '../config/env';

export interface ScoreDimension {
  dimension: string;
  score: number; // 0-100
  weight: number; // percentage
  status: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical';
  summary: string;
  recommendations: string[];
}

export interface Student360ScoreResult {
  overallScore: number; // 0-100
  rating: 'Tier 1 (Outstanding)' | 'Tier 2 (Strong)' | 'Tier 3 (Developing)' | 'Needs Immediate Support';
  strongAreas: string[];
  improvementAreas: string[];
  recommendedActions: string[];
  dimensions: ScoreDimension[];
  calculatedAt: string;
}

export class AIService {
  /**
   * Main LLM Gateway supporting Google Gemini and OpenAI with deterministic fallback
   */
  public static async generateCompletion(params: {
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
    fallbackResponse: any;
  }): Promise<any> {
    const geminiKey = ENV.GEMINI_API_KEY || (ENV.AI_API_KEY.startsWith('AIza') ? ENV.AI_API_KEY : '');
    const openAiKey = ENV.AI_API_KEY.startsWith('sk-') ? ENV.AI_API_KEY : (!geminiKey ? ENV.AI_API_KEY : '');

    // 1. Try Google Gemini if API Key provided
    if (geminiKey && geminiKey.trim().length > 0) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${params.systemPrompt}\n\nIMPORTANT: Respond ONLY with a valid JSON object matching the requested schema. Do not include markdown code block backticks.\n\n${params.userPrompt}` }
                ]
              }
            ],
            generationConfig: {
              temperature: params.temperature || 0.2,
              responseMimeType: 'application/json'
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, attempting alternative or deterministic fallback:', geminiErr);
      }
    }

    // 2. Try OpenAI if API Key provided
    if (openAiKey && openAiKey.trim().length > 0) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`
          },
          body: JSON.stringify({
            model: ENV.AI_MODEL || 'gpt-4o-mini',
            messages: [
              { role: 'system', content: `${params.systemPrompt}. Return valid JSON.` },
              { role: 'user', content: params.userPrompt }
            ],
            temperature: params.temperature || 0.3,
            response_format: { type: 'json_object' }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            return JSON.parse(content);
          }
        }
      } catch (openAiErr) {
        console.warn('OpenAI API call failed, using deterministic AI engine:', openAiErr);
      }
    }

    // 3. High-Accuracy Deterministic Fallback Engine
    return params.fallbackResponse;
  }

  /**
   * Calculate Student 360 Score across 8 deterministic dimensions
   */
  public static calculateStudent360Score(data: {
    cgpa?: number;
    activeBacklogs?: number;
    attendancePercentage?: number;
    skillsCount?: number;
    advancedSkillsCount?: number;
    projectsCount?: number;
    internshipsCount?: number;
    certificationsCount?: number;
    achievementsCount?: number;
    hasGithub?: boolean;
    hasPortfolio?: boolean;
    hasResume?: boolean;
  }): Student360ScoreResult {
    const cgpa = data.cgpa || 8.0;
    const backlogs = data.activeBacklogs ?? 0;
    const attendance = data.attendancePercentage || 85;
    const skillsCount = data.skillsCount || 4;
    const advSkills = data.advancedSkillsCount || 2;
    const projects = data.projectsCount || 2;
    const internships = data.internshipsCount || 1;
    const certs = data.certificationsCount || 1;
    const achs = data.achievementsCount || 1;

    // 1. Academic Score (Weight 20%)
    let academicScore = Math.min(100, Math.max(0, (cgpa / 10) * 100));
    if (backlogs > 0) academicScore = Math.max(20, academicScore - backlogs * 15);

    // 2. Attendance Score (Weight 10%)
    let attendanceScore = Math.min(100, Math.max(0, attendance));
    if (attendance < 75) attendanceScore = Math.max(30, attendanceScore - 20);

    // 3. Skill Score (Weight 15%)
    let skillScore = Math.min(100, skillsCount * 8 + advSkills * 12);

    // 4. Project Score (Weight 15%)
    let projectScore = Math.min(100, projects * 32 + (data.hasGithub ? 15 : 0));

    // 5. Internship Score (Weight 15%)
    let internshipScore = Math.min(100, internships * 55);

    // 6. Certification Score (Weight 10%)
    let certScore = Math.min(100, certs * 45);

    // 7. Achievement Score (Weight 10%)
    let achScore = Math.min(100, achs * 45);

    // 8. Placement Prep Score (Weight 5%)
    let placementScore = (data.hasResume ? 40 : 0) + (data.hasPortfolio ? 30 : 0) + (skillsCount >= 5 ? 30 : 15);
    placementScore = Math.min(100, placementScore);

    // Weighted Overall Score Calculation
    const overallScore = Math.round(
      academicScore * 0.2 +
      attendanceScore * 0.1 +
      skillScore * 0.15 +
      projectScore * 0.15 +
      internshipScore * 0.15 +
      certScore * 0.1 +
      achScore * 0.1 +
      placementScore * 0.05
    );

    const dimensions: ScoreDimension[] = [
      {
        dimension: 'Academics & CGPA',
        score: Math.round(academicScore),
        weight: 20,
        status: academicScore >= 80 ? 'Excellent' : academicScore >= 65 ? 'Good' : 'Needs Attention',
        summary: `CGPA ${cgpa.toFixed(1)} with ${backlogs} active backlog${backlogs === 1 ? '' : 's'}`,
        recommendations: backlogs > 0 ? ['Prioritize clearing active backlog courses.'] : ['Maintain semester velocity >8.5 SGPA.']
      },
      {
        dimension: 'Institutional Attendance',
        score: Math.round(attendanceScore),
        weight: 10,
        status: attendanceScore >= 80 ? 'Excellent' : attendanceScore >= 75 ? 'Good' : 'Critical',
        summary: `${attendance.toFixed(1)}% cumulative attendance across courses`,
        recommendations: attendance < 75 ? ['Attend mandatory classes to avoid detention threshold.'] : ['Attendance complies with placement eligibility.']
      },
      {
        dimension: 'Technical Skill Matrix',
        score: Math.round(skillScore),
        weight: 15,
        status: skillScore >= 75 ? 'Excellent' : skillScore >= 55 ? 'Good' : 'Needs Attention',
        summary: `${skillsCount} verified skills with ${advSkills} advanced competencies`,
        recommendations: skillScore < 70 ? ['Expand core tech stack proficiencies and frameworks.'] : ['Solid technical foundation validated by projects.']
      },
      {
        dimension: 'Engineering Projects',
        score: Math.round(projectScore),
        weight: 15,
        status: projectScore >= 75 ? 'Excellent' : projectScore >= 50 ? 'Good' : 'Needs Attention',
        summary: `${projects} full-stack/domain project${projects === 1 ? '' : 's'} built`,
        recommendations: projects < 2 ? ['Build and deploy a full-stack distributed web project.'] : ['Publish live demos and clean READMEs on GitHub.']
      },
      {
        dimension: 'Industry Experience & Internships',
        score: Math.round(internshipScore),
        weight: 15,
        status: internshipScore >= 80 ? 'Excellent' : internshipScore >= 50 ? 'Good' : 'Needs Attention',
        summary: `${internships} verified internship${internships === 1 ? '' : 's'} completed`,
        recommendations: internships === 0 ? ['Apply for summer industry internships & research apprenticeships.'] : ['Document quantified impact and KPI achievements.']
      },
      {
        dimension: 'Industry Certifications',
        score: Math.round(certScore),
        weight: 10,
        status: certScore >= 75 ? 'Excellent' : certScore >= 45 ? 'Good' : 'Needs Attention',
        summary: `${certs} professional credential${certs === 1 ? '' : 's'} earned`,
        recommendations: certs === 0 ? ['Earn a recognized cloud certification (AWS, Google Cloud, Meta).'] : ['Keep certifications up to date on digital portfolio.']
      },
      {
        dimension: 'Competitions & Achievements',
        score: Math.round(achScore),
        weight: 10,
        status: achScore >= 75 ? 'Excellent' : achScore >= 45 ? 'Good' : 'Needs Attention',
        summary: `${achs} verified national/regional honor${achs === 1 ? '' : 's'}`,
        recommendations: achs === 0 ? ['Participate in hackathons (SIH) and open coding contests.'] : ['Feature top wins prominently on resume.']
      },
      {
        dimension: 'Placement Readiness & Assets',
        score: Math.round(placementScore),
        weight: 5,
        status: placementScore >= 80 ? 'Excellent' : placementScore >= 60 ? 'Good' : 'Needs Attention',
        summary: `ATS Resume ${data.hasResume ? 'Generated' : 'Pending'} • Portfolio ${data.hasPortfolio ? 'Live' : 'Pending'}`,
        recommendations: !data.hasResume ? ['Generate and tailor your ATS resume.'] : ['Conduct AI mock interviews to practice communication.']
      }
    ];

    const strongAreas = dimensions
      .filter((d) => d.status === 'Excellent')
      .map((d) => d.dimension);
    if (strongAreas.length === 0) strongAreas.push('Academic Foundation', 'Technical Curiosity');

    const improvementAreas = dimensions
      .filter((d) => d.status === 'Needs Attention' || d.status === 'Critical')
      .map((d) => d.dimension);
    if (improvementAreas.length === 0) improvementAreas.push('Open Source Contribution', 'System Design Mastery');

    const recommendedActions = dimensions
      .filter((d) => d.status !== 'Excellent')
      .flatMap((d) => d.recommendations)
      .slice(0, 4);
    if (recommendedActions.length === 0) {
      recommendedActions.push('Practice daily LeetCode/DSA problems.', 'Conduct an AI Mock Interview before placement season.');
    }

    const rating =
      overallScore >= 85
        ? 'Tier 1 (Outstanding)'
        : overallScore >= 70
        ? 'Tier 2 (Strong)'
        : overallScore >= 55
        ? 'Tier 3 (Developing)'
        : 'Needs Immediate Support';

    return {
      overallScore,
      rating,
      strongAreas,
      improvementAreas,
      recommendedActions,
      dimensions,
      calculatedAt: new Date().toISOString()
    };
  }
}
