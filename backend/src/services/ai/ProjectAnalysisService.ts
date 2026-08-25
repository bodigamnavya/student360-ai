export interface ProjectAnalysisResult {
  detectedSkills: string[];
  domain: string;
  complexityLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  resumeBullets: string[];
  suggestedImprovements: string[];
}

const COMMON_SKILL_KEYWORDS = [
  'React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'TypeScript', 'JavaScript',
  'Python', 'Django', 'FastAPI', 'PyTorch', 'TensorFlow', 'Docker', 'Kubernetes', 'AWS', 'GCP',
  'Redis', 'Kafka', 'GraphQL', 'Tailwind CSS', 'Redux', 'Prisma', 'Socket.io', 'Git', 'Linux',
  'REST API', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Microservices'
];

export class ProjectAnalysisService {
  public static analyze(params: {
    title: string;
    description: string;
    technologies?: string[];
  }): ProjectAnalysisResult {
    const text = `${params.title} ${params.description} ${(params.technologies || []).join(' ')}`.toLowerCase();

    // Detect skills
    const detectedSkillsSet = new Set<string>(params.technologies || []);
    COMMON_SKILL_KEYWORDS.forEach((skill) => {
      if (text.includes(skill.toLowerCase())) {
        detectedSkillsSet.add(skill);
      }
    });
    const detectedSkills = Array.from(detectedSkillsSet);

    // Determine domain
    let domain = 'Full Stack Web Development';
    if (text.includes('machine learning') || text.includes('ai') || text.includes('pytorch') || text.includes('nlp') || text.includes('model')) {
      domain = 'Artificial Intelligence & Machine Learning';
    } else if (text.includes('cloud') || text.includes('docker') || text.includes('kubernetes') || text.includes('devops')) {
      domain = 'Cloud & DevOps Infrastructure';
    } else if (text.includes('blockchain') || text.includes('smart contract') || text.includes('solidity')) {
      domain = 'Web3 & Blockchain';
    } else if (text.includes('mobile') || text.includes('flutter') || text.includes('react native') || text.includes('android')) {
      domain = 'Mobile App Development';
    } else if (text.includes('security') || text.includes('vulnerability') || text.includes('cryptography')) {
      domain = 'Cybersecurity';
    }

    // Determine complexity
    let complexityLevel: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';
    if (
      detectedSkills.length >= 6 ||
      text.includes('distributed') ||
      text.includes('microservices') ||
      text.includes('kubernetes') ||
      text.includes('rag') ||
      text.includes('concurrency')
    ) {
      complexityLevel = 'Advanced';
    } else if (detectedSkills.length <= 2 && !text.includes('api')) {
      complexityLevel = 'Beginner';
    }

    // Generate ATS-Friendly Impact Bullets
    const topTech = detectedSkills.slice(0, 4).join(', ') || 'modern web technologies';
    const resumeBullets = [
      `Architected and deployed ${params.title} utilizing ${topTech}, delivering a resilient and user-centric solution.`,
      `Engineered secure, scalable RESTful backend services and intuitive user interfaces with optimized database schema queries.`,
      `Implemented automated state management, robust error-handling pipelines, and responsive layouts to maximize end-user performance.`
    ];

    const suggestedImprovements = [
      'Add comprehensive automated unit and integration tests (e.g. Jest / Vitest) with >80% code coverage.',
      'Implement Docker containerization and setup automated CI/CD deployment pipeline on GitHub Actions.',
      'Incorporate performance profiling and caching (e.g. Redis) for high-frequency database operations.'
    ];

    return {
      detectedSkills,
      domain,
      complexityLevel,
      resumeBullets,
      suggestedImprovements
    };
  }
}
