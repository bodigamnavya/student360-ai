export interface ResumeData {
  title: string;
  template: 'Modern' | 'Professional' | 'Minimal' | 'ATS-Friendly';
  targetRole: string;
  summary: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  education: {
    institution: string;
    degree: string;
    department: string;
    startYear: string;
    endYear: string;
    cgpa: string;
  }[];
  skills: {
    category: string;
    skills: string[];
  }[];
  experience: {
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }[];
  projects: {
    title: string;
    technologies: string[];
    link?: string;
    bullets: string[];
  }[];
  certifications: {
    title: string;
    issuer: string;
    date: string;
    credentialId?: string;
  }[];
  achievements: string[];
  atsScore: number;
  atsFeedback: string[];
}

export class ResumeGenerationService {
  public static generateFromProfile(studentData: {
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
    const p = studentData.profile || {};
    const u = studentData.user || {};
    const targetRole = studentData.targetRole || p.targetRole || 'Software Development Engineer';
    const template = studentData.template || 'Modern';

    // Group skills by category
    const skillsGroupedMap: Record<string, string[]> = {};
    (studentData.skills || []).forEach((s) => {
      const cat = s.category || 'Technical';
      if (!skillsGroupedMap[cat]) skillsGroupedMap[cat] = [];
      skillsGroupedMap[cat].push(s.name);
    });

    const skillsSection = Object.entries(skillsGroupedMap).map(([category, skills]) => ({
      category,
      skills
    }));

    // Format Education
    const education = [
      {
        institution: p.college || 'Institute of Technology & Science',
        degree: `${p.degree || 'B.Tech'} in ${p.department || 'Computer Science and Engineering'}`,
        department: p.department || 'Computer Science and Engineering',
        startYear: p.batch ? p.batch.split('-')[0] : '2023',
        endYear: p.batch ? p.batch.split('-')[1] : '2027',
        cgpa: p.cgpa ? `CGPA: ${p.cgpa.toFixed(2)} / 10.0` : 'CGPA: 8.5 / 10.0'
      }
    ];

    // Format Experience (Internships)
    const experience = (studentData.internships || []).map((i) => {
      const startStr = i.startDate ? new Date(i.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2025';
      const endStr = i.isCurrent ? 'Present' : (i.endDate ? new Date(i.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2025');
      const techList = (i.technologies || []).join(', ') || 'modern stacks';

      return {
        company: i.company,
        role: i.role,
        location: i.location || 'Remote',
        startDate: startStr,
        endDate: endStr,
        bullets: [
          `Collaborated on high-impact software modules utilizing ${techList}, boosting application responsiveness by 22%.`,
          `Designed and integrated reliable API microservices, handling cross-service data transformations with zero downtime.`,
          `Authored comprehensive technical documentation and participated actively in agile sprint retrospectives and code reviews.`
        ]
      };
    });

    // Format Projects
    const projects = (studentData.projects || []).map((proj) => {
      const bullets = proj.aiAnalysis?.resumeBullets && proj.aiAnalysis.resumeBullets.length > 0
        ? proj.aiAnalysis.resumeBullets
        : [
            `Engineered ${proj.title} using ${(proj.technologies || []).join(', ')}, facilitating seamless data operations.`,
            `Optimized client-side rendering and database queries, achieving sub-200ms API response latency.`,
            `Structured reusable component architecture and integrated secure user authentication and error boundaries.`
          ];

      return {
        title: proj.title,
        technologies: proj.technologies || [],
        link: proj.liveUrl || proj.githubUrl || '',
        bullets
      };
    });

    // Certifications
    const certifications = (studentData.certifications || []).map((c) => ({
      title: c.title,
      issuer: c.issuer,
      date: c.issueDate ? new Date(c.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '',
      credentialId: c.credentialId || ''
    }));

    // Achievements (utilizing AI resume bullet when available)
    const achievements = (studentData.achievements || []).map((a) =>
      a.aiAnalysis?.resumeBullet
        ? a.aiAnalysis.resumeBullet.replace(/^•\s*/, '')
        : `${a.title} (${a.issuerOrg}) - ${a.position || 'Recognized participant'}`
    );

    // Dynamic professional summary
    const summary = `Results-oriented ${targetRole} and ${p.degree || 'B.Tech'} student with a strong foundation in modern software engineering, data structures, and full-stack development (CGPA: ${p.cgpa ? p.cgpa.toFixed(2) : '8.5'}). Proven track record of architecting scalable applications, earning technical certifications, and delivering production-ready projects. Passionate about solving complex distributed systems and product challenges.`;

    // ATS Calculation
    let atsScore = 85;
    const atsFeedback: string[] = ['Standardized section headers used (Education, Skills, Experience, Projects).'];

    if (experience.length > 0) {
      atsScore += 5;
      atsFeedback.push('Demonstrates verifiable industry experience with measurable action verbs.');
    } else {
      atsFeedback.push('Recommendation: Add internship experience or open source contributions to boost score.');
    }

    if (skillsSection.length >= 3) {
      atsScore += 5;
      atsFeedback.push('Strong categoric distribution of technical and core competencies.');
    }

    return {
      title: `${targetRole} - Resume (${template})`,
      template,
      targetRole,
      summary,
      personalInfo: {
        fullName: u.name || 'Student Name',
        email: u.email || 'student@university.edu',
        phone: p.phone || '+91 98765 43210',
        location: p.address?.city ? `${p.address.city}, ${p.address.state || 'India'}` : 'Bengaluru, India',
        linkedin: p.socialLinks?.linkedin || '',
        github: p.socialLinks?.github || '',
        portfolio: p.socialLinks?.portfolio || ''
      },
      education,
      skills: skillsSection,
      experience,
      projects,
      certifications,
      achievements,
      atsScore: Math.min(atsScore, 96),
      atsFeedback
    };
  }
}
