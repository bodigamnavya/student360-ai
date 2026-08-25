export interface SkillGapResult {
  targetRole: string;
  readinessPercentage: number;
  matchedSkills: { name: string; proficiency: string }[];
  missingSkills: { name: string; importance: 'High' | 'Medium' | 'Foundational'; recommendedTime: string }[];
  learningRoadmap: {
    month: number;
    title: string;
    skill: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    estimatedDuration: string;
    learningObjective: string;
    practiceTasks: string[];
    projectTask: string;
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Skipped';
  }[];
  weeklyActionPlan: {
    id: string;
    title: string;
    category: 'DSA' | 'Development' | 'Resume' | 'Application' | 'Interview' | 'Core CS' | 'General';
    completed: boolean;
    dueDate?: string;
    notes?: string;
  }[];
}

export class AISkillGapService {
  private static roleBenchmarks: Record<string, { skill: string; importance: 'High' | 'Medium' | 'Foundational'; time: string }[]> = {
    'Full Stack Developer': [
      { skill: 'React', importance: 'High', time: '3 weeks' },
      { skill: 'Node.js', importance: 'High', time: '3 weeks' },
      { skill: 'TypeScript', importance: 'High', time: '2 weeks' },
      { skill: 'MongoDB', importance: 'Medium', time: '2 weeks' },
      { skill: 'PostgreSQL', importance: 'Medium', time: '2 weeks' },
      { skill: 'Docker', importance: 'Medium', time: '2 weeks' },
      { skill: 'System Design', importance: 'High', time: '4 weeks' },
      { skill: 'Automated Testing (Jest/Cypress)', importance: 'Medium', time: '2 weeks' }
    ],
    'Backend Developer': [
      { skill: 'Node.js', importance: 'High', time: '3 weeks' },
      { skill: 'Go', importance: 'Medium', time: '4 weeks' },
      { skill: 'PostgreSQL', importance: 'High', time: '3 weeks' },
      { skill: 'Redis', importance: 'High', time: '2 weeks' },
      { skill: 'Docker', importance: 'High', time: '2 weeks' },
      { skill: 'Kubernetes', importance: 'Medium', time: '3 weeks' },
      { skill: 'Microservices Architecture', importance: 'High', time: '4 weeks' },
      { skill: 'System Design', importance: 'High', time: '4 weeks' }
    ],
    'Frontend Developer': [
      { skill: 'React', importance: 'High', time: '3 weeks' },
      { skill: 'Next.js', importance: 'High', time: '3 weeks' },
      { skill: 'TypeScript', importance: 'High', time: '2 weeks' },
      { skill: 'Tailwind CSS', importance: 'Medium', time: '1 week' },
      { skill: 'State Management (Redux/Zustand)', importance: 'High', time: '2 weeks' },
      { skill: 'Web Performance Optimization', importance: 'Medium', time: '2 weeks' },
      { skill: 'Jest Testing', importance: 'Medium', time: '2 weeks' }
    ],
    'AI/ML Engineer': [
      { skill: 'Python', importance: 'High', time: '2 weeks' },
      { skill: 'PyTorch / TensorFlow', importance: 'High', time: '4 weeks' },
      { skill: 'FastAPI', importance: 'Medium', time: '2 weeks' },
      { skill: 'LangChain / LlamaIndex', importance: 'High', time: '3 weeks' },
      { skill: 'Vector Databases (Chroma/Pinecone)', importance: 'High', time: '2 weeks' },
      { skill: 'Fine-Tuning LLMs', importance: 'High', time: '3 weeks' },
      { skill: 'Math & Linear Algebra for ML', importance: 'Foundational', time: '4 weeks' }
    ],
    'Data Analyst': [
      { skill: 'SQL', importance: 'High', time: '3 weeks' },
      { skill: 'Python (Pandas, NumPy)', importance: 'High', time: '3 weeks' },
      { skill: 'PowerBI / Tableau', importance: 'High', time: '3 weeks' },
      { skill: 'Data Visualization', importance: 'Medium', time: '2 weeks' },
      { skill: 'Applied Statistics', importance: 'Foundational', time: '3 weeks' },
      { skill: 'Excel Advanced Modeling', importance: 'Medium', time: '1 week' }
    ],
    'Cloud & DevOps Engineer': [
      { skill: 'AWS / Cloud Architecture', importance: 'High', time: '4 weeks' },
      { skill: 'Docker & Containerization', importance: 'High', time: '2 weeks' },
      { skill: 'Kubernetes Orchestration', importance: 'High', time: '4 weeks' },
      { skill: 'CI/CD Pipelines (GitHub Actions)', importance: 'High', time: '2 weeks' },
      { skill: 'Terraform (IaC)', importance: 'High', time: '3 weeks' },
      { skill: 'Linux & Bash Scripting', importance: 'Foundational', time: '2 weeks' },
      { skill: 'Prometheus & Grafana Telemetry', importance: 'Medium', time: '2 weeks' }
    ]
  };

  /**
   * Analyze skill gap for target role
   */
  public static analyzeRoleGap(params: {
    targetRole: string;
    studentSkills?: { name: string; proficiency?: string }[];
  }): SkillGapResult {
    const role = params.targetRole || 'Full Stack Developer';
    const benchmark = this.roleBenchmarks[role] || this.roleBenchmarks['Full Stack Developer'];

    const studentSkillMap = new Map<string, string>();
    (params.studentSkills || []).forEach((s) => {
      studentSkillMap.set(s.name.toLowerCase().trim(), s.proficiency || 'Intermediate');
    });

    const matchedSkills: { name: string; proficiency: string }[] = [];
    const missingSkills: { name: string; importance: 'High' | 'Medium' | 'Foundational'; recommendedTime: string }[] = [];

    benchmark.forEach((item) => {
      const itemLower = item.skill.toLowerCase();
      let matched = false;
      let prof = 'Intermediate';

      for (const [sName, sProf] of studentSkillMap.entries()) {
        if (sName.includes(itemLower) || itemLower.includes(sName)) {
          matched = true;
          prof = sProf;
          break;
        }
      }

      if (matched) {
        matchedSkills.push({ name: item.skill, proficiency: prof });
      } else {
        missingSkills.push({
          name: item.skill,
          importance: item.importance,
          recommendedTime: item.time
        });
      }
    });

    const readinessPercentage = Math.round((matchedSkills.length / benchmark.length) * 100);

    // Build month-by-month learning roadmap from missing skills
    const learningRoadmap = (missingSkills.length > 0 ? missingSkills : [
      { name: 'System Design & High Availability', importance: 'High' as const, recommendedTime: '4 weeks' },
      { name: 'Advanced Microservices Performance', importance: 'High' as const, recommendedTime: '4 weeks' }
    ]).slice(0, 6).map((missing, idx) => ({
      month: idx + 1,
      title: `Month ${idx + 1}: ${missing.name} Mastery`,
      skill: missing.name,
      difficulty: idx <= 1 ? ('Intermediate' as const) : ('Advanced' as const),
      estimatedDuration: missing.recommendedTime,
      learningObjective: `Acquire production-level competence in ${missing.name} and integrate it into real-world applications.`,
      practiceTasks: [
        `Complete hands-on tutorials and lab exercises for ${missing.name}.`,
        `Solve 5 real-world case studies demonstrating ${missing.name}.`,
        `Implement unit and integration tests covering core modules.`
      ],
      projectTask: `Build a functional milestone project demonstrating ${missing.name}.`,
      status: idx === 0 ? ('In Progress' as const) : ('Not Started' as const)
    }));

    // Build weekly action plan
    const weeklyActionPlan = [
      { id: 'task-1', title: 'Solve 5 Medium LeetCode / DSA problems (Trees & DP)', category: 'DSA' as const, completed: false },
      { id: 'task-2', title: `Complete module: ${missingSkills[0]?.name || 'System Architecture Patterns'}`, category: 'Development' as const, completed: false },
      { id: 'task-3', title: 'Update GitHub repository README with architecture diagram', category: 'General' as const, completed: false },
      { id: 'task-4', title: `Apply to 3 ${role} campus drives / internships`, category: 'Application' as const, completed: false },
      { id: 'task-5', title: 'Conduct 1 AI Mock Interview session on Technical competencies', category: 'Interview' as const, completed: false }
    ];

    return {
      targetRole: role,
      readinessPercentage: Math.max(35, Math.min(95, readinessPercentage)),
      matchedSkills,
      missingSkills,
      learningRoadmap,
      weeklyActionPlan
    };
  }
}
