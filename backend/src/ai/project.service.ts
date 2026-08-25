export interface ProjectAnalysisResult {
  summary: string;
  detectedTechnologies: string[];
  detectedSkills: string[];
  domain: string;
  complexityLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Enterprise';
  resumeValue: 'High' | 'Moderate' | 'Fair';
  strengths: string[];
  improvementSuggestions: string[];
  resumeBullets: string[];
}

export class AIProjectService {
  /**
   * Analyze engineering project metadata and generate structured insights & ATS bullets
   */
  public static analyzeProject(data: {
    title: string;
    description: string;
    technologies?: string[];
    githubUrl?: string;
    liveUrl?: string;
  }): ProjectAnalysisResult {
    const combined = `${data.title} ${data.description} ${(data.technologies || []).join(' ')}`.toLowerCase();

    // Skill & Technology Extractor
    const techPool = [
      'React', 'Next.js', 'Node.js', 'Express', 'TypeScript', 'JavaScript',
      'Python', 'FastAPI', 'Django', 'Go', 'Java', 'Spring Boot', 'C++',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
      'AWS', 'Firebase', 'GraphQL', 'Tailwind CSS', 'WebSockets', 'LangChain',
      'ChromaDB', 'TensorFlow', 'PyTorch', 'REST API', 'Microservices'
    ];

    const detectedSet = new Set<string>(data.technologies || []);
    techPool.forEach((tech) => {
      if (combined.includes(tech.toLowerCase())) {
        detectedSet.add(tech);
      }
    });

    const detectedTechnologies = Array.from(detectedSet);
    const detectedSkills = detectedTechnologies.length > 0
      ? detectedTechnologies
      : ['Software Architecture', 'Full Stack Development', 'Problem Solving'];

    // Determine domain
    let domain = 'Full Stack Web Development';
    if (combined.includes('langchain') || combined.includes('rag') || combined.includes('ai') || combined.includes('model') || combined.includes('neural')) {
      domain = 'Generative AI & Machine Learning';
    } else if (combined.includes('microservices') || combined.includes('kubernetes') || combined.includes('distributed') || combined.includes('rate limiter')) {
      domain = 'Distributed Systems & Cloud Architecture';
    } else if (combined.includes('data') || combined.includes('analytics') || combined.includes('dashboard')) {
      domain = 'Data Engineering & Analytics';
    }

    // Determine complexity
    const complexityLevel: ProjectAnalysisResult['complexityLevel'] =
      detectedTechnologies.length >= 6 || combined.includes('distributed') || combined.includes('rag')
        ? 'Enterprise'
        : detectedTechnologies.length >= 4
        ? 'Advanced'
        : detectedTechnologies.length >= 2
        ? 'Intermediate'
        : 'Beginner';

    const resumeValue: ProjectAnalysisResult['resumeValue'] =
      complexityLevel === 'Enterprise' || complexityLevel === 'Advanced' ? 'High' : 'Moderate';

    const strengths = [
      `Leverages modern component and service architecture with ${detectedTechnologies.slice(0, 3).join(', ')}.`,
      `Demonstrates practical application of ${domain} concepts.`
    ];

    const improvementSuggestions = [
      'Add comprehensive unit and integration tests (e.g. Jest / Supertest / Cypress).',
      'Document architecture with clean C4/Mermaid diagrams in the GitHub README.',
      'Deploy live preview with automated CI/CD pipeline on Vercel or AWS.'
    ];

    // Generate 2-4 ATS-friendly resume bullets
    const techStr = detectedTechnologies.slice(0, 4).join(', ') || 'modern software engineering';
    const resumeBullets = [
      `• Engineered ${data.title} using ${techStr}, delivering responsive and reliable microservices.`,
      `• Architected end-to-end data workflows and optimized API query latency across high-throughput endpoints.`,
      `• Integrated structured error boundaries, schema validation, and secure authentication pipelines.`
    ];

    const summary = `${data.title} is a ${complexityLevel.toLowerCase()}-level ${domain} solution engineered with ${techStr}.`;

    return {
      summary,
      detectedTechnologies,
      detectedSkills,
      domain,
      complexityLevel,
      resumeValue,
      strengths,
      improvementSuggestions,
      resumeBullets
    };
  }
}
