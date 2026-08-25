export interface CareerRecommendation {
  role: string;
  matchScore: number;
  salaryRange: string;
  demandTrend: 'High' | 'Very High' | 'Moderate';
  description: string;
  whyMatches: string[];
  existingStrengths: string[];
  missingSkills: string[];
  recommendedCourses: string[];
  recommendedProjects: string[];
  recommendedCertifications: string[];
  suggestedRoadmap: string[];
}

export class AICareerService {
  private static roleDefinitions = [
    {
      role: 'Full Stack Developer',
      requiredSkills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'REST API', 'Git', 'Docker'],
      salaryRange: '₹8 - 18 LPA',
      demandTrend: 'Very High' as const,
      description: 'Architecting and developing end-to-end distributed web applications, database layers, and responsive user interfaces.',
      courses: ['Full Stack Open (University of Helsinki)', 'Namaste React by Akshay Saini', 'Node.js Architecture Patterns'],
      projects: ['Real-time collaborative document editor', 'Enterprise SaaS with RBAC and subscription payments'],
      certifications: ['AWS Certified Developer - Associate', 'Meta Front-End Professional Certificate']
    },
    {
      role: 'Backend & Systems Engineer',
      requiredSkills: ['Node.js', 'Go', 'Java', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'Microservices', 'System Design'],
      salaryRange: '₹10 - 24 LPA',
      demandTrend: 'Very High' as const,
      description: 'Designing fault-tolerant backend architectures, high-throughput microservices, caching layers, and database scaling.',
      courses: ['Designing Data-Intensive Applications (Kleppmann)', 'Distributed Systems by MIT 6.824', 'Pragmatic Microservices'],
      projects: ['Distributed token-bucket rate limiter', 'High-throughput payment reconciliation event engine'],
      certifications: ['AWS Certified Solutions Architect', 'CKA: Certified Kubernetes Administrator']
    },
    {
      role: 'Frontend Engineer',
      requiredSkills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux / Zustand', 'HTML5', 'CSS3', 'Jest Testing', 'UI/UX Design'],
      salaryRange: '₹7 - 16 LPA',
      demandTrend: 'High' as const,
      description: 'Crafting responsive, high-performance client experiences, design systems, and state management architectures.',
      courses: ['Epic React by Kent C. Dodds', 'Advanced CSS and Sass', 'Web Performance Optimization'],
      projects: ['Design system with interactive Storybook documentation', 'High-performance audio streaming web app'],
      certifications: ['Meta Front-End Developer', 'Google UX Design Certificate']
    },
    {
      role: 'AI / Machine Learning Engineer',
      requiredSkills: ['Python', 'PyTorch', 'TensorFlow', 'FastAPI', 'LangChain', 'Vector Databases', 'NLP', 'Computer Vision', 'Data Structures'],
      salaryRange: '₹12 - 28 LPA',
      demandTrend: 'Very High' as const,
      description: 'Building generative AI agents, fine-tuning LLMs, deploying machine learning models, and orchestrating RAG pipelines.',
      courses: ['DeepLearning.AI Machine Learning Specialization', 'CS224N: NLP with Deep Learning (Stanford)', 'Full Stack LLM Bootcamp'],
      projects: ['Multimodal RAG QA assistant for scientific PDFs', 'Real-time object tracking and segmentation vision pipeline'],
      certifications: ['TensorFlow Developer Certificate', 'AWS Certified Machine Learning - Specialty']
    },
    {
      role: 'Data Analyst & BI Engineer',
      requiredSkills: ['SQL', 'Python', 'PowerBI', 'Tableau', 'Excel', 'Data Visualization', 'Statistics', 'Pandas'],
      salaryRange: '₹6 - 14 LPA',
      demandTrend: 'High' as const,
      description: 'Transforming institutional and business telemetry into actionable intelligence, dashboards, and growth insights.',
      courses: ['Google Data Analytics Professional Certificate', 'Advanced SQL for Analytics (DataCamp)', 'Applied Statistics with Python'],
      projects: ['E-commerce customer churn analytics dashboard', 'Predictive marketing ROI regression model'],
      certifications: ['Google Data Analytics Certificate', 'Microsoft Certified: Power BI Data Analyst Associate']
    },
    {
      role: 'Cloud & DevOps Engineer',
      requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux', 'Bash', 'Prometheus', 'Grafana', 'Git'],
      salaryRange: '₹9 - 22 LPA',
      demandTrend: 'Very High' as const,
      description: 'Automating cloud infrastructure provisioning, CI/CD pipelines, container orchestration, and site reliability telemetry.',
      courses: ['DevOps Bootcamp by Nana Janashia', 'A Cloud Guru - AWS Solutions Architect', 'Terraform for Infrastructure as Code'],
      projects: ['Multi-region automated Kubernetes deployment with Helm and ArgoCD', 'Zero-downtime Blue/Green deployment pipeline'],
      certifications: ['AWS Certified Solutions Architect – Associate', 'HashiCorp Certified: Terraform Associate']
    },
    {
      role: 'Cybersecurity Analyst',
      requiredSkills: ['Networking', 'Linux', 'Python', 'Ethical Hacking', 'Cryptography', 'SIEM', 'OWASP Top 10', 'Wireshark'],
      salaryRange: '₹8 - 18 LPA',
      demandTrend: 'High' as const,
      description: 'Securing network infrastructure, performing vulnerability assessments, code auditing, and incident response.',
      courses: ['CompTIA Security+ Certification Prep', 'TryHackMe Complete Beginner & SOC Path', 'Web Application Penetration Testing'],
      projects: ['Automated vulnerability scanner for web applications', 'Intrusion detection log analysis pipeline'],
      certifications: ['CompTIA Security+', 'Certified Ethical Hacker (CEH)']
    }
  ];

  /**
   * Analyze student profile and compute matched career suitability
   */
  public static analyzeCareerSuitability(studentData: {
    skills?: { name: string; proficiency?: string }[];
    projects?: { title: string; technologies?: string[] }[];
    internships?: { role: string; company: string; technologies?: string[] }[];
    certifications?: { title: string }[];
    achievements?: { title: string; category: string }[];
    cgpa?: number;
    department?: string;
  }): CareerRecommendation[] {
    const studentSkillNames = new Set(
      (studentData.skills || []).map((s) => s.name.toLowerCase().trim())
    );

    // Also extract skills from projects, internships, certs
    (studentData.projects || []).forEach((p) => {
      (p.technologies || []).forEach((t) => studentSkillNames.add(t.toLowerCase().trim()));
    });
    (studentData.internships || []).forEach((i) => {
      (i.technologies || []).forEach((t) => studentSkillNames.add(t.toLowerCase().trim()));
    });

    const recommendations: CareerRecommendation[] = this.roleDefinitions.map((roleDef) => {
      let matchedCount = 0;
      const matchedSkills: string[] = [];
      const missingSkills: string[] = [];

      roleDef.requiredSkills.forEach((req) => {
        const reqLower = req.toLowerCase();
        let hasSkill = false;
        studentSkillNames.forEach((s) => {
          if (s.includes(reqLower) || reqLower.includes(s)) {
            hasSkill = true;
          }
        });

        if (hasSkill) {
          matchedCount++;
          matchedSkills.push(req);
        } else {
          missingSkills.push(req);
        }
      });

      // Calculate match score
      let score = Math.round((matchedCount / roleDef.requiredSkills.length) * 80 + 15);
      if (studentData.cgpa && studentData.cgpa >= 8.5) score = Math.min(98, score + 5);
      if ((studentData.internships || []).length > 0) score = Math.min(98, score + 4);

      const whyMatches = [
        `You have demonstrated ${matchedCount} core skills required for ${roleDef.role} (${matchedSkills.slice(0, 3).join(', ')}).`,
        `Your engineering portfolio and coursework align with the architectural competencies of this domain.`
      ];

      const suggestedRoadmap = [
        `Month 1-2: Master ${missingSkills.slice(0, 2).join(' and ') || 'advanced system concepts'}.`,
        `Month 3-4: Build a production-ready ${roleDef.projects[0] || 'project'}.`,
        `Month 5-6: Earn ${roleDef.certifications[0] || 'industry credential'} and prepare mock interviews.`
      ];

      return {
        role: roleDef.role,
        matchScore: Math.min(98, Math.max(50, score)),
        salaryRange: roleDef.salaryRange,
        demandTrend: roleDef.demandTrend,
        description: roleDef.description,
        whyMatches,
        existingStrengths: matchedSkills.length > 0 ? matchedSkills : ['Core Problem Solving', 'CS Fundamentals'],
        missingSkills: missingSkills.slice(0, 4),
        recommendedCourses: roleDef.courses,
        recommendedProjects: roleDef.projects,
        recommendedCertifications: roleDef.certifications,
        suggestedRoadmap
      };
    });

    // Sort by match score descending
    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }
}
