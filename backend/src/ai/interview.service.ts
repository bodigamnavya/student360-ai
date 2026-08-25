export interface QuestionEvaluation {
  technicalAccuracy: number; // 0-100
  communication: number; // 0-100
  clarity: number; // 0-100
  structure: number; // 0-100
  relevance: number; // 0-100
  overallScore: number; // 0-100
  feedback: string;
  strengths: string[];
  improvements: string[];
  sampleIdealAnswer: string;
}

export interface MockInterviewReport {
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  problemSolvingScore: number;
  overallScore: number;
  strongAreas: string[];
  weakAreas: string[];
  recommendedTopics: string[];
  summary: string;
}

export class AIInterviewService {
  private static questionsByRole: Record<string, Record<string, string[]>> = {
    'Full Stack Developer': {
      Technical: [
        'How does the React Virtual DOM diffing algorithm work, and when should you use useMemo or React.memo?',
        'Explain how the Node.js event loop handles asynchronous I/O and microtasks vs macrotasks.',
        'Compare MongoDB (document store) vs PostgreSQL (relational) indexing strategies for high-frequency queries.',
        'How would you architect an authentication system with JWT access tokens and HTTP-only refresh tokens?'
      ],
      HR: [
        'Tell me about a challenging technical hurdle you faced during a project and how you resolved it.',
        'How do you prioritize competing deadlines across academic commitments and engineering projects?',
        'Why are you specifically interested in this full-stack engineering role at our company?'
      ],
      Behavioral: [
        'Describe a situation where you had a technical disagreement with a teammate. How did you handle it?',
        'Give an example of when a project scope changed significantly mid-way. How did you adapt?'
      ],
      'Project-based': [
        'Walk me through the system architecture of your flagship project. Why did you choose your specific tech stack?',
        'What was the single biggest bottleneck in your application and how did you measure and optimize it?'
      ]
    },
    'Backend Developer': {
      Technical: [
        'How do you design a distributed rate limiter that works consistently across multiple load-balanced nodes?',
        'Explain database isolation levels (Read Committed vs Serializable) and dirty reads vs phantom reads.',
        'How does Redis achieve single-threaded high throughput and what are its memory eviction policies?'
      ],
      HR: [
        'Describe what engineering culture you thrive in best.',
        'Where do you see your technical trajectory evolving over the next 3 years?'
      ],
      Behavioral: [
        'Tell me about a production bug or unexpected outage in a project and how you conducted post-mortem analysis.'
      ],
      'Project-based': [
        'How did you structure database schema normalization and indexes in your backend project?'
      ]
    }
  };

  /**
   * Generate questions for interview session
   */
  public static generateInterviewQuestions(params: {
    role: string;
    interviewType: 'Technical' | 'HR' | 'Behavioral' | 'Project-based' | 'Comprehensive Mock';
    count?: number;
  }): { questionNumber: number; question: string; category: 'Technical' | 'HR' | 'Behavioral' | 'Project-based' }[] {
    const roleKey = this.questionsByRole[params.role] ? params.role : 'Full Stack Developer';
    const roleQuestions = this.questionsByRole[roleKey];
    const totalCount = params.count || 4;

    const list: { questionNumber: number; question: string; category: 'Technical' | 'HR' | 'Behavioral' | 'Project-based' }[] = [];

    if (params.interviewType === 'Comprehensive Mock') {
      const tech = roleQuestions.Technical || [];
      const hr = roleQuestions.HR || [];
      const beh = roleQuestions.Behavioral || [];
      const proj = roleQuestions['Project-based'] || [];

      if (tech[0]) list.push({ questionNumber: 1, question: tech[0], category: 'Technical' });
      if (proj[0]) list.push({ questionNumber: 2, question: proj[0], category: 'Project-based' });
      if (beh[0]) list.push({ questionNumber: 3, question: beh[0], category: 'Behavioral' });
      if (hr[0]) list.push({ questionNumber: 4, question: hr[0], category: 'HR' });
    } else {
      const pool = roleQuestions[params.interviewType] || roleQuestions.Technical || [];
      pool.slice(0, totalCount).forEach((q, idx) => {
        list.push({
          questionNumber: idx + 1,
          question: q,
          category: params.interviewType as any
        });
      });
    }

    return list;
  }

  /**
   * Evaluate student answer for a specific question
   */
  public static evaluateAnswer(params: {
    question: string;
    category: string;
    studentAnswer: string;
    role: string;
  }): QuestionEvaluation {
    const answer = params.studentAnswer.trim();
    const length = answer.length;

    let technicalAccuracy = 75;
    let communication = 78;
    let clarity = 80;
    let structure = 75;
    let relevance = 82;

    if (length > 150) {
      technicalAccuracy += 12;
      communication += 8;
      structure += 10;
    } else if (length < 40) {
      technicalAccuracy -= 20;
      communication -= 15;
      clarity -= 10;
    }

    // Key technical word bonuses
    const techWords = ['architecture', 'performance', 'complexity', 'latency', 'asynchronous', 'scalability', 'index', 'state'];
    techWords.forEach((w) => {
      if (answer.toLowerCase().includes(w)) {
        technicalAccuracy += 2;
        relevance += 2;
      }
    });

    technicalAccuracy = Math.min(96, Math.max(40, technicalAccuracy));
    communication = Math.min(95, Math.max(45, communication));
    clarity = Math.min(95, Math.max(45, clarity));
    structure = Math.min(95, Math.max(40, structure));
    relevance = Math.min(96, Math.max(45, relevance));

    const overallScore = Math.round(
      technicalAccuracy * 0.35 +
      communication * 0.2 +
      clarity * 0.15 +
      structure * 0.15 +
      relevance * 0.15
    );

    const strengths = [
      'Clear conceptual understanding of core architectural trade-offs.',
      'Demonstrated structured problem breakdown and practical rationale.'
    ];

    const improvements = [
      'Incorporate quantified metrics or benchmark numbers to substantiate claims.',
      'Use the STAR method (Situation, Task, Action, Result) for behavioral questions.'
    ];

    const sampleIdealAnswer = `A strong response directly addresses the fundamental mechanism, highlights performance implications (e.g. time/space complexity, memory footprint), and illustrates with a production example from personal project experience.`;

    return {
      technicalAccuracy,
      communication,
      clarity,
      structure,
      relevance,
      overallScore,
      feedback: `Solid response (${overallScore}%). Your explanation captures key concepts clearly. Substantiating with specific production metrics will elevate your interview standing.`,
      strengths,
      improvements,
      sampleIdealAnswer
    };
  }

  /**
   * Start new interview session in MongoDB
   */
  public static async startSession(params: {
    studentId: string;
    role: string;
    interviewType?: 'Technical' | 'HR' | 'Behavioral' | 'Project-based' | 'Comprehensive Mock';
    experienceLevel?: 'Entry' | 'Mid' | 'Senior';
  }): Promise<any> {
    const { InterviewSession } = await import('../models/ai.models');
    const questions = this.generateInterviewQuestions({
      role: params.role,
      interviewType: params.interviewType || 'Comprehensive Mock'
    });

    const session = await InterviewSession.create({
      student: params.studentId,
      role: params.role,
      interviewType: params.interviewType || 'Comprehensive Mock',
      experienceLevel: params.experienceLevel || 'Entry',
      currentQuestionIndex: 0,
      questions: questions.map((q) => ({
        questionNumber: q.questionNumber,
        question: q.question,
        category: q.category
      }))
    });

    return session;
  }

  /**
   * Submit and evaluate question answer in session
   */
  public static async submitAnswer(params: {
    sessionId: string;
    questionNumber: number;
    studentAnswer: string;
  }): Promise<any> {
    const { InterviewSession } = await import('../models/ai.models');
    const session = await InterviewSession.findById(params.sessionId);
    if (!session) throw new Error('Interview session not found');

    const qIndex = session.questions.findIndex((q) => q.questionNumber === params.questionNumber);
    if (qIndex === -1) throw new Error(`Question ${params.questionNumber} not found in session`);

    const q = session.questions[qIndex];
    const evaluation = this.evaluateAnswer({
      question: q.question,
      category: q.category,
      studentAnswer: params.studentAnswer,
      role: session.role
    });

    q.studentAnswer = params.studentAnswer;
    q.evaluation = evaluation as any;
    q.answeredAt = new Date();
    session.currentQuestionIndex = Math.min(session.questions.length - 1, session.currentQuestionIndex + 1);

    await session.save();
    return { questionNumber: params.questionNumber, evaluation, nextQuestionIndex: session.currentQuestionIndex };
  }

  /**
   * Generate final comprehensive report for session
   */
  public static async generateFinalReportForSession(sessionId: string): Promise<any> {
    const { InterviewSession } = await import('../models/ai.models');
    const session = await InterviewSession.findById(sessionId);
    if (!session) throw new Error('Interview session not found');

    const report = this.generateFinalReport(
      session.questions.map((q) => ({
        question: q.question,
        evaluation: q.evaluation as any
      }))
    );

    session.finalReport = report as any;
    session.status = 'Completed';
    await session.save();

    return { session, report };
  }
}

