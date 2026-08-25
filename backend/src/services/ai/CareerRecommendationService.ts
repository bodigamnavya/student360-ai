export interface CareerRecommendationResult {
  role: string;
  matchScore: number;
  domain: string;
  strengths: string[];
  missingSkills: string[];
  recommendedCourses: string[];
  suggestedProjects: string[];
  marketDemand: 'High' | 'Very High' | 'Moderate';
  averageSalaryRange: string;
  reasoning: string;
}

const ROLE_KNOWLEDGE_BASE = [
  {
    role: 'Full Stack Web Developer',
    domain: 'Software Engineering',
    coreSkills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'JavaScript', 'REST API', 'Express', 'Git', 'CSS', 'HTML'],
    optionalSkills: ['Docker', 'Next.js', 'PostgreSQL', 'Redux', 'Tailwind CSS', 'AWS'],
    marketDemand: 'Very High' as const,
    salaryRange: '7 - 18 LPA',
    courses: ['Modern Full Stack with Next.js & Node.js', 'Advanced TypeScript & Clean Architecture', 'Database Design & Microservices'],
    projectIdeas: ['Real-time Collaborative Whiteboard with WebSockets', 'Multi-tenant SaaS E-Commerce Engine with Stripe', 'AI-Assisted Task & Sprint Management System']
  },
  {
    role: 'Backend & Cloud Engineer',
    domain: 'Distributed Systems & Cloud',
    coreSkills: ['Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'REST API', 'Docker', 'Git', 'Data Structures', 'Linux'],
    optionalSkills: ['Kubernetes', 'AWS', 'Redis', 'Kafka', 'System Design', 'Microservices', 'GraphQL'],
    marketDemand: 'Very High' as const,
    salaryRange: '8 - 22 LPA',
    courses: ['Distributed Systems and Concurrency', 'Production Docker & Kubernetes Mastery', 'AWS Certified Solutions Architect Path'],
    projectIdeas: ['High-Throughput Rate-Limited API Gateway', 'Distributed Event-Driven Notification Engine with Kafka', 'Scalable In-Memory Key-Value Store with Raft Consensus']
  },
  {
    role: 'AI / Machine Learning Engineer',
    domain: 'Artificial Intelligence & Data Science',
    coreSkills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Pandas', 'NumPy', 'Data Structures', 'SQL'],
    optionalSkills: ['LangChain', 'OpenAI API', 'Hugging Face', 'Computer Vision', 'NLP', 'MLOps', 'Vector Databases'],
    marketDemand: 'Very High' as const,
    salaryRange: '9 - 25 LPA',
    courses: ['Deep Learning Specialization', 'Building LLM Applications with LangChain & RAG', 'Production MLOps on AWS/GCP'],
    projectIdeas: ['Retrieval-Augmented Generation (RAG) Document QA Bot', 'Medical Image Segmentation for Pathology Detection', 'Real-time Autonomous Voice-to-Voice AI Assistant']
  },
  {
    role: 'Data Analyst & BI Specialist',
    domain: 'Business Intelligence & Analytics',
    coreSkills: ['Python', 'SQL', 'Excel', 'Tableau', 'Power BI', 'Pandas', 'Statistics', 'Data Visualization'],
    optionalSkills: ['R', 'PostgreSQL', 'Snowflake', 'dbt', 'A/B Testing', 'BigQuery'],
    marketDemand: 'High' as const,
    salaryRange: '6 - 15 LPA',
    courses: ['Google Data Analytics Certificate', 'Advanced SQL for Data Warehousing & Analytics', 'Executive Dashboarding with Power BI'],
    projectIdeas: ['E-Commerce Cohort Retention & Churn Prediction Dashboard', 'Financial Market Sentiment Analysis & Visualizer', 'Healthcare Resource Allocation Optimization System']
  },
  {
    role: 'Cybersecurity Analyst',
    domain: 'Information Security & Infrastructure',
    coreSkills: ['Computer Networks', 'Linux', 'Python', 'Cryptography', 'Ethical Hacking', 'Wireshark', 'Security Information (SIEM)'],
    optionalSkills: ['Metasploit', 'SOC Analysis', 'Cloud Security', 'OWASP Top 10', 'Penetration Testing'],
    marketDemand: 'Very High' as const,
    salaryRange: '7 - 20 LPA',
    courses: ['CompTIA Security+ Exam Prep', 'Practical Ethical Hacking & Pentesting', 'Cloud Security Infrastructure on AWS'],
    projectIdeas: ['Automated Vulnerability Scanner & Report Generator', 'Intrusion Detection System using Packet Sniffing & ML', 'Zero-Trust Secure File Storage System']
  },
  {
    role: 'DevOps & Site Reliability Engineer',
    domain: 'Cloud & Infrastructure',
    coreSkills: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Bash', 'AWS', 'Networking'],
    optionalSkills: ['Terraform', 'Ansible', 'Prometheus', 'Grafana', 'Helm', 'GCP'],
    marketDemand: 'Very High' as const,
    salaryRange: '8 - 24 LPA',
    courses: ['Certified Kubernetes Administrator (CKA)', 'Infrastructure as Code with Terraform', 'CI/CD Pipelines with GitHub Actions & ArgoCD'],
    projectIdeas: ['Automated Multi-Cluster Kubernetes Deployment Pipeline', 'Self-Healing Cloud Infrastructure with Prometheus Alerts', 'GitOps Infrastructure Automation Repository']
  }
];

export class CareerRecommendationService {
  public static analyze(params: {
    studentName: string;
    cgpa: number;
    skills: string[];
    projects: { title: string; technologies: string[] }[];
    internships: { role: string; company: string; technologies: string[] }[];
    certifications: { title: string }[];
    targetRole?: string;
  }): CareerRecommendationResult[] {
    const studentSkillsLower = new Set(
      params.skills.map((s) => s.trim().toLowerCase())
    );

    // Add tech extracted from projects & internships
    params.projects.forEach((p) => {
      p.technologies?.forEach((t) => studentSkillsLower.add(t.trim().toLowerCase()));
    });
    params.internships.forEach((i) => {
      i.technologies?.forEach((t) => studentSkillsLower.add(t.trim().toLowerCase()));
    });

    const recommendations: CareerRecommendationResult[] = ROLE_KNOWLEDGE_BASE.map((roleDef) => {
      const coreMatched: string[] = [];
      const coreMissing: string[] = [];

      roleDef.coreSkills.forEach((skill) => {
        const found = Array.from(studentSkillsLower).some((s) =>
          s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s)
        );
        if (found) {
          coreMatched.push(skill);
        } else {
          coreMissing.push(skill);
        }
      });

      const optionalMatched: string[] = [];
      roleDef.optionalSkills.forEach((skill) => {
        const found = Array.from(studentSkillsLower).some((s) =>
          s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s)
        );
        if (found) {
          optionalMatched.push(skill);
        }
      });

      // Calculate score with realistic weighting
      const coreRatio = roleDef.coreSkills.length > 0 ? coreMatched.length / Math.min(roleDef.coreSkills.length, 5) : 0;
      const optionalRatio = roleDef.optionalSkills.length > 0 ? optionalMatched.length / Math.min(roleDef.optionalSkills.length, 4) : 0;
      
      let baseScore = Math.round(Math.min(coreRatio, 1) * 72 + Math.min(optionalRatio, 1) * 18);

      // Academic bonus
      if (params.cgpa >= 8.5) baseScore += 8;
      else if (params.cgpa >= 7.5) baseScore += 5;
      else if (params.cgpa >= 6.5) baseScore += 2;

      // Project bonus
      if (params.projects.length >= 2) baseScore += 5;
      if (params.internships.length >= 1) baseScore += 5;

      const finalScore = Math.min(Math.max(baseScore, 35), 98);

      const reasoning = coreMatched.length > 0
        ? `Strong foundation in ${coreMatched.slice(0, 3).join(', ')} with ${params.projects.length} relevant projects and CGPA of ${params.cgpa}.`
        : `Developing match. Focusing on ${coreMissing.slice(0, 3).join(', ')} will rapidly elevate your match score.`;

      return {
        role: roleDef.role,
        matchScore: finalScore,
        domain: roleDef.domain,
        strengths: coreMatched.concat(optionalMatched).slice(0, 6),
        missingSkills: coreMissing.slice(0, 5),
        recommendedCourses: roleDef.courses,
        suggestedProjects: roleDef.projectIdeas,
        marketDemand: roleDef.marketDemand,
        averageSalaryRange: roleDef.salaryRange,
        reasoning
      };
    });

    // Sort by match score descending
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    return recommendations;
  }
}
