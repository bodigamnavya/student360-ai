export interface SkillGapAnalysisResult {
  targetRole: string;
  readinessScore: number;
  matchedSkills: {
    name: string;
    proficiency: string;
    importance: 'High' | 'Medium' | 'Critical';
  }[];
  missingSkills: {
    name: string;
    importance: 'Critical' | 'High' | 'Medium';
    category: string;
    estimatedTimeToLearn: string;
    recommendedResources: string[];
  }[];
  learningRoadmap: {
    step: number;
    phaseName: string;
    duration: string;
    skillsToAcquire: string[];
    actionItems: string[];
  }[];
  projectSuggestions: string[];
  certificationsToPursue: string[];
}

const ROLE_SKILL_REQUIREMENTS: Record<
  string,
  {
    required: { name: string; importance: 'Critical' | 'High' | 'Medium'; category: string; time: string; resources: string[] }[];
    phases: { phaseName: string; duration: string; skills: string[]; actions: string[] }[];
    projects: string[];
    certs: string[];
  }
> = {
  'Software Engineer': {
    required: [
      { name: 'Data Structures & Algorithms', importance: 'Critical', category: 'Core CS', time: '6-8 weeks', resources: ['LeetCode 75', 'NeetCode 150', 'GeeksforGeeks DSA Guide'] },
      { name: 'TypeScript', importance: 'High', category: 'Programming', time: '2-3 weeks', resources: ['TypeScript Official Handbook', 'Total TypeScript by Matt Pocock'] },
      { name: 'React', importance: 'High', category: 'Web Development', time: '3-4 weeks', resources: ['react.dev Docs', 'Full Stack Open'] },
      { name: 'Node.js & Express', importance: 'High', category: 'Backend', time: '3-4 weeks', resources: ['Node.js Design Patterns', 'RESTful API Design Best Practices'] },
      { name: 'SQL & Database Design', importance: 'High', category: 'Database', time: '2-3 weeks', resources: ['PostgreSQL Tutorial', 'Use The Index, Luke!'] },
      { name: 'Docker & Containerization', importance: 'Medium', category: 'DevOps', time: '1-2 weeks', resources: ['Docker for Beginners (freeCodeCamp)', 'Play with Docker'] },
      { name: 'Git & Version Control', importance: 'Critical', category: 'Tools', time: '1 week', resources: ['Pro Git Book', 'GitHub Skills Interactive'] },
      { name: 'System Design Basics', importance: 'High', category: 'Architecture', time: '4 weeks', resources: ['System Design Primer (GitHub)', 'Grokking the System Design Interview'] }
    ],
    phases: [
      { phaseName: 'Phase 1: Algorithmic Foundations & Core Languages', duration: 'Weeks 1-4', skills: ['Data Structures & Algorithms', 'TypeScript', 'Git'], actions: ['Solve 50+ LeetCode Mediums', 'Build a strongly-typed TypeScript CLI or utility tool'] },
      { phaseName: 'Phase 2: Full-Stack Architecture & Persistence', duration: 'Weeks 5-8', skills: ['React', 'Node.js & Express', 'SQL & Database Design'], actions: ['Build a production-grade full stack CRUD app with auth and schema migrations', 'Implement unit & integration tests with Vitest/Jest'] },
      { phaseName: 'Phase 3: Production Readiness & System Design', duration: 'Weeks 9-12', skills: ['Docker & Containerization', 'System Design Basics'], actions: ['Containerize your application and deploy to cloud (Render/AWS)', 'Study caching (Redis), rate-limiting, and database indexing'] }
    ],
    projects: ['Real-Time Collaborative Code Editor with WebSockets', 'Scalable URL Shortener with Caching & Analytics', 'Distributed E-Commerce Microservices Platform'],
    certs: ['AWS Certified Cloud Practitioner', 'Meta Frontend Developer Professional Certificate']
  },
  'Full Stack Developer': {
    required: [
      { name: 'JavaScript & ES6+', importance: 'Critical', category: 'Programming', time: '2 weeks', resources: ['JavaScript.info', 'You Don\'t Know JS'] },
      { name: 'React & Next.js', importance: 'Critical', category: 'Frontend', time: '4 weeks', resources: ['Next.js Official Documentation', 'Frontend Masters Next.js Path'] },
      { name: 'Node.js & Express', importance: 'Critical', category: 'Backend', time: '3 weeks', resources: ['Node.js Docs', 'The Odin Project Node Path'] },
      { name: 'MongoDB / PostgreSQL', importance: 'High', category: 'Database', time: '2-3 weeks', resources: ['MongoDB University M001', 'Postgres Guide'] },
      { name: 'Tailwind CSS', importance: 'Medium', category: 'Frontend', time: '1 week', resources: ['Tailwind CSS Official Docs'] },
      { name: 'Docker', importance: 'Medium', category: 'DevOps', time: '2 weeks', resources: ['Docker Getting Started Guide'] },
      { name: 'REST & GraphQL APIs', importance: 'High', category: 'Backend', time: '2 weeks', resources: ['How to GraphQL', 'REST API Guidelines'] }
    ],
    phases: [
      { phaseName: 'Phase 1: Modern Frontend Mastery', duration: 'Weeks 1-3', skills: ['React & Next.js', 'Tailwind CSS'], actions: ['Create pixel-perfect responsive layouts with server-side rendering', 'Master client/server component boundaries in Next.js App Router'] },
      { phaseName: 'Phase 2: Scalable API & Database Engineering', duration: 'Weeks 4-7', skills: ['Node.js & Express', 'MongoDB / PostgreSQL', 'REST & GraphQL APIs'], actions: ['Implement JWT RBAC authentication, input validation with Zod, and rate limiting', 'Design normalized relational & document database schemas with indexing'] },
      { phaseName: 'Phase 3: Deployment & Cloud CI/CD', duration: 'Weeks 8-10', skills: ['Docker', 'CI/CD'], actions: ['Containerize full stack app and setup automated GitHub Actions workflow', 'Deploy to Vercel + AWS / Render'] }
    ],
    projects: ['Multi-Tenant SaaS Project Management Suite', 'Real-Time Auction & Bidding Platform', 'Full Stack Social Developer Portfolio Platform'],
    certs: ['Meta Full-Stack Engineer Certificate', 'MongoDB Certified Developer Associate']
  },
  'AI / Machine Learning Engineer': {
    required: [
      { name: 'Python & Scientific Computing', importance: 'Critical', category: 'Programming', time: '3 weeks', resources: ['Python for Data Analysis (O\'Reilly)', 'NumPy & Pandas Tutorials'] },
      { name: 'Machine Learning Algorithms', importance: 'Critical', category: 'AI/ML', time: '6 weeks', resources: ['Coursera Machine Learning by Andrew Ng', 'Hands-On Machine Learning (Scikit-Learn)'] },
      { name: 'Deep Learning & PyTorch', importance: 'Critical', category: 'AI/ML', time: '6 weeks', resources: ['Deep Learning with PyTorch', 'Fast.ai Practical Deep Learning'] },
      { name: 'Natural Language Processing & LLMs', importance: 'High', category: 'AI/ML', time: '4 weeks', resources: ['Hugging Face NLP Course', 'DeepLearning.AI LangChain Course'] },
      { name: 'SQL & Data Engineering', importance: 'High', category: 'Database', time: '2 weeks', resources: ['Mode Analytics SQL Tutorial'] },
      { name: 'MLOps & Model Deployment', importance: 'High', category: 'DevOps', time: '3 weeks', resources: ['Made With ML (Goku Mohandas)', 'Docker + FastAPI for ML'] }
    ],
    phases: [
      { phaseName: 'Phase 1: Data Manipulation & Classical ML', duration: 'Weeks 1-4', skills: ['Python & Scientific Computing', 'Machine Learning Algorithms'], actions: ['Implement regression, decision trees, random forests, and SVMs from scratch', 'Perform end-to-end exploratory data analysis on Kaggle datasets'] },
      { phaseName: 'Phase 2: Deep Learning, CNNs & Transformers', duration: 'Weeks 5-8', skills: ['Deep Learning & PyTorch', 'Natural Language Processing & LLMs'], actions: ['Build and fine-tune Vision and Transformer models on PyTorch', 'Build a RAG pipeline using vector embeddings and LangChain'] },
      { phaseName: 'Phase 3: Production MLOps & Serving', duration: 'Weeks 9-12', skills: ['MLOps & Model Deployment', 'SQL & Data Engineering'], actions: ['Wrap model in FastAPI, containerize with Docker, and deploy with latency monitoring'] }
    ],
    projects: ['Document Question-Answering System with RAG & Vector DB', 'Real-time Object Detection with YOLOv8 & OpenCV', 'Automated Customer Sentiment & Topic Modeling Pipeline'],
    certs: ['TensorFlow Developer Certificate', 'DeepLearning.AI Deep Learning Specialization']
  },
  'Data Analyst': {
    required: [
      { name: 'Advanced SQL & Data Modeling', importance: 'Critical', category: 'Database', time: '4 weeks', resources: ['SQLZoo', 'Advanced SQL on Stratascratch'] },
      { name: 'Python (Pandas, Matplotlib, Seaborn)', importance: 'Critical', category: 'Programming', time: '3 weeks', resources: ['Kaggle Python & Pandas Courses'] },
      { name: 'Power BI / Tableau', importance: 'Critical', category: 'BI & Visualization', time: '3 weeks', resources: ['Maven Analytics Power BI Bootcamp', 'Tableau Desktop Specialist'] },
      { name: 'Statistics & Probability', importance: 'High', category: 'Mathematics', time: '3 weeks', resources: ['Khan Academy Statistics', 'Practical Statistics for Data Scientists'] },
      { name: 'Excel & Financial Modeling', importance: 'High', category: 'Spreadsheets', time: '2 weeks', resources: ['Chandoo.org Excel Mastery', 'Excel Power Query Guide'] }
    ],
    phases: [
      { phaseName: 'Phase 1: SQL Mastery & Data Querying', duration: 'Weeks 1-3', skills: ['Advanced SQL & Data Modeling'], actions: ['Master window functions, CTEs, self-joins, and query performance tuning'] },
      { phaseName: 'Phase 2: Statistical Analysis & Python', duration: 'Weeks 4-7', skills: ['Python (Pandas, Matplotlib, Seaborn)', 'Statistics & Probability'], actions: ['Clean messy real-world datasets and conduct hypothesis testing (A/B tests)'] },
      { phaseName: 'Phase 3: Executive Dashboards & Storytelling', duration: 'Weeks 8-10', skills: ['Power BI / Tableau', 'Excel'], actions: ['Design interactive multi-page business dashboards with DAX measures and KPIs'] }
    ],
    projects: ['Executive Sales & Customer Churn Dashboard in Power BI', 'Healthcare Utilization & Trend Analysis in Python/SQL', 'E-Commerce Product Pricing & Elasticity Analysis'],
    certs: ['Google Data Analytics Professional Certificate', 'Microsoft Certified: Power BI Data Analyst Associate']
  }
};

export class SkillGapService {
  public static analyzeRoleGap(params: {
    targetRole: string;
    studentSkills: { name: string; proficiency: string }[];
  }): SkillGapAnalysisResult {
    const roleKey = Object.keys(ROLE_SKILL_REQUIREMENTS).find(
      (k) => k.toLowerCase() === params.targetRole.toLowerCase()
    ) || 'Software Engineer';

    const roleDef = ROLE_SKILL_REQUIREMENTS[roleKey] || ROLE_SKILL_REQUIREMENTS['Software Engineer'];

    const studentSkillMap = new Map<string, string>();
    params.studentSkills.forEach((s) => {
      studentSkillMap.set(s.name.toLowerCase().trim(), s.proficiency);
    });

    const matchedSkills: SkillGapAnalysisResult['matchedSkills'] = [];
    const missingSkills: SkillGapAnalysisResult['missingSkills'] = [];

    roleDef.required.forEach((req) => {
      let isMatched = false;
      let matchedProficiency = 'Intermediate';

      for (const [sName, prof] of Array.from(studentSkillMap.entries())) {
        if (
          sName.includes(req.name.toLowerCase()) ||
          req.name.toLowerCase().includes(sName) ||
          (req.name.includes('Algorithms') && (sName.includes('dsa') || sName.includes('c++') || sName.includes('java'))) ||
          (req.name.includes('Database') && (sName.includes('sql') || sName.includes('mongo') || sName.includes('db')))
        ) {
          isMatched = true;
          matchedProficiency = prof;
          break;
        }
      }

      if (isMatched) {
        matchedSkills.push({
          name: req.name,
          proficiency: matchedProficiency,
          importance: req.importance
        });
      } else {
        missingSkills.push({
          name: req.name,
          importance: req.importance,
          category: req.category,
          estimatedTimeToLearn: req.time,
          recommendedResources: req.resources
        });
      }
    });

    const totalWeight = roleDef.required.reduce((acc, r) => {
      return acc + (r.importance === 'Critical' ? 3 : r.importance === 'High' ? 2 : 1);
    }, 0);

    const matchedWeight = matchedSkills.reduce((acc, m) => {
      const mult = m.proficiency === 'Expert' ? 1.0 : m.proficiency === 'Advanced' ? 0.9 : m.proficiency === 'Intermediate' ? 0.75 : 0.5;
      const weight = m.importance === 'Critical' ? 3 : m.importance === 'High' ? 2 : 1;
      return acc + weight * mult;
    }, 0);

    const readinessScore = Math.round((matchedWeight / totalWeight) * 100);

    return {
      targetRole: roleKey,
      readinessScore: Math.min(Math.max(readinessScore, 20), 100),
      matchedSkills,
      missingSkills,
      learningRoadmap: roleDef.phases.map((p, idx) => ({
        step: idx + 1,
        phaseName: p.phaseName,
        duration: p.duration,
        skillsToAcquire: p.skills,
        actionItems: p.actions
      })),
      projectSuggestions: roleDef.projects,
      certificationsToPursue: roleDef.certs
    };
  }
}
