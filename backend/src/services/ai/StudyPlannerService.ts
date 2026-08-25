export interface StudyPlannerResult {
  examType: string;
  totalWeeks: number;
  weeklySchedule: {
    week: number;
    title: string;
    topics: string[];
    isCompleted: boolean;
  }[];
  keyTips: string[];
}

const EXAM_PLANS: Record<string, { title: string; topics: string[] }[]> = {
  GATE: [
    { title: 'Discrete Mathematics & Graph Theory', topics: ['Propositional Logic', 'Combinatorics', 'Recurrence Relations', 'Graph Connectivity & Trees'] },
    { title: 'Data Structures & Programming in C', topics: ['Arrays & Linked Lists', 'Stacks, Queues & Trees', 'Binary Search Trees & Heaps', 'Recursion & Pointers'] },
    { title: 'Algorithms & Complexity Analysis', topics: ['Asymptotic Notations', 'Divide and Conquer', 'Greedy & Dynamic Programming', 'Graph Traversals (BFS, DFS, Dijkstra)'] },
    { title: 'Theory of Computation & Compiler Design', topics: ['Regular Expressions & DFA/NFA', 'Context-Free Grammars', 'Turing Machines & Decidability', 'Lexical Analysis & Parsing'] },
    { title: 'Operating Systems & Concurrency', topics: ['Process Synchronization & Semaphores', 'Deadlocks & Handling', 'CPU Scheduling Algorithms', 'Virtual Memory & Paging'] },
    { title: 'Database Management Systems', topics: ['ER Modeling & Relational Algebra', 'SQL Queries & Subqueries', 'Normalization (1NF to BCNF)', 'Transactions & Concurrency Control'] },
    { title: 'Computer Networks', topics: ['OSI & TCP/IP Layering', 'IP Addressing & Subnetting', 'Routing Protocols', 'TCP Congestion & Flow Control'] },
    { title: 'Full-Length Mock Tests & Revision', topics: ['Previous Years 5-Year Questions', 'Time Management Mock 1', 'Weak Area Remediation', 'Mock Test 2 & Formula Cheat-sheet'] }
  ],
  GRE: [
    { title: 'Quantitative Reasoning: Arithmetic & Algebra', topics: ['Integers, Fractions & Exponents', 'Linear & Quadratic Equations', 'Inequalities & Absolute Values', 'Word Problems'] },
    { title: 'Verbal Reasoning: Text Completion & Vocab', topics: ['High-Frequency 333 Vocab Words', 'Context Clues & Sentence Equivalence', 'Reading Comprehension Strategies', 'Passage Mapping'] },
    { title: 'Quantitative Reasoning: Geometry & Data Analysis', topics: ['Lines, Angles & Triangles', 'Circles, Polygons & 3D Figures', 'Probability, Permutations & Combinations', 'Data Interpretation Tables & Graphs'] },
    { title: 'Analytical Writing (AWA) & Full Mock', topics: ['Issue Essay Structure & Brainstorming', 'ETS Scoring Criteria Analysis', 'PowerPrep Official Practice Test 1', 'Timed Section Drills'] }
  ],
  CAT: [
    { title: 'Quantitative Aptitude: Number Systems & Arithmetic', topics: ['Percentages, Profit & Loss', 'Ratios, Mixtures & Alligations', 'Time, Speed & Distance', 'Time & Work'] },
    { title: 'Data Interpretation & Logical Reasoning (DILR)', topics: ['Arrangements (Linear & Circular)', 'Matrix Grids & Team Selection', 'Charts, Graphs & Caselets', 'Games & Tournaments'] },
    { title: 'Verbal Ability & Reading Comprehension (VARC)', topics: ['RC Tone & Main Idea Identification', 'Para Jumbles & Summary Questions', 'Odd One Out', 'Critical Reasoning Arguments'] },
    { title: 'Sectional Tests & Advanced Geometry / Algebra', topics: ['Algebraic Functions & Logarithms', 'Coordinate Geometry & Mensuration', 'Sectional Time Tests', 'Comprehensive Mock Exam'] }
  ]
};

export class StudyPlannerService {
  public static generatePlan(examType: string): StudyPlannerResult {
    const key = Object.keys(EXAM_PLANS).find((k) => k.toLowerCase() === examType.toLowerCase()) || 'GATE';
    const rawPlan = EXAM_PLANS[key] || EXAM_PLANS['GATE'];

    const weeklySchedule = rawPlan.map((item, idx) => ({
      week: idx + 1,
      title: `Week ${idx + 1}: ${item.title}`,
      topics: item.topics,
      isCompleted: idx === 0 // 1st week active
    }));

    const keyTips = [
      'Allocate at least 12-15 disciplined study hours per week.',
      'Maintain an error logbook for every wrong question in mock assessments.',
      'Review fundamental conceptual theorems every Sunday morning.'
    ];

    return {
      examType: key,
      totalWeeks: weeklySchedule.length,
      weeklySchedule,
      keyTips
    };
  }
}
