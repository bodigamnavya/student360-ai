export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export class CareerChatService {
  public static async generateResponse(params: {
    studentContext: {
      name: string;
      cgpa: number;
      department: string;
      targetRole: string;
      placementReadiness: number;
      riskScore: number;
      riskLevel: string;
      skills: string[];
      projects: string[];
      internships: string[];
      activeBacklogs: number;
      attendancePercentage: number;
    };
    messages: ChatMessage[];
    userPrompt: string;
  }): Promise<{ reply: string; suggestedQuestions: string[] }> {
    const ctx = params.studentContext;
    const q = params.userPrompt.toLowerCase();

    // Context-infused intelligent conversational responses
    let reply = '';
    let suggestedQuestions = [
      'What skills should I learn for my target role?',
      'How can I improve my placement readiness score?',
      'Can you review my projects and suggest improvements?',
      'What are my current academic and attendance risk factors?'
    ];

    if (q.includes('placement') || q.includes('ready') || q.includes('readiness') || q.includes('score')) {
      reply = `Hello ${ctx.name}! Based on your current profile, your **Placement Readiness Score is ${ctx.placementReadiness}%**.

Here is a breakdown of your strengths & growth areas:
• **Academic Foundation**: CGPA of ${ctx.cgpa.toFixed(2)} (${ctx.activeBacklogs === 0 ? 'Zero active backlogs' : `${ctx.activeBacklogs} active backlogs to clear`}).
• **Technical Portfolio**: ${ctx.projects.length} recorded projects (${ctx.projects.slice(0, 2).join(', ') || 'consider adding more projects'}).
• **Industry Experience**: ${ctx.internships.length} internships recorded.
• **Core Skills**: ${ctx.skills.slice(0, 5).join(', ')}.

**Actionable Next Steps to Reach 90%+:**
1. Complete at least 1 deployment-ready capstone project highlighting microservices or cloud deployment.
2. Target 50+ medium-level algorithmic questions on LeetCode focusing on Dynamic Programming and Graphs.
3. Earn an industry cloud certification (such as AWS Cloud Practitioner).`;
      
      suggestedQuestions = [
        'How do I prepare for technical interviews?',
        'Which companies match my skill profile best?',
        'How can I optimize my resume for ATS scanners?'
      ];
    } else if (q.includes('skill') || q.includes('learn') || q.includes('gap') || q.includes('course')) {
      reply = `For your target role of **${ctx.targetRole}**, here is your personalized skill roadmap:

**Your Strongest Skills:**
✓ ${ctx.skills.slice(0, 4).join(', ') || 'Foundational Programming'}

**High-Priority Skills to Acquire:**
1. **System Design & Distributed Systems**: Scalability, Redis Caching, Load Balancing, Message Queues (Kafka/RabbitMQ).
2. **Containerization & CI/CD**: Docker container setup and automated GitHub Actions workflows.
3. **Advanced Testing**: Unit & Integration tests using Jest / Vitest and Supertest.

Would you like me to generate a tailored 4-week study syllabus for any of these specific skills?`;

      suggestedQuestions = [
        'Give me a 4-week roadmap for Docker and System Design',
        'Which projects can showcase my React and Node.js skills?',
        'How can I get an internship in backend engineering?'
      ];
    } else if (q.includes('project') || q.includes('build') || q.includes('idea')) {
      reply = `Here are 3 high-impact project ideas specifically customized for your **${ctx.department}** background and **${ctx.targetRole}** aspiration:

1. **Distributed Rate-Limited Task Queue**:
   • *Tech*: Node.js, TypeScript, Redis, BullMQ, Docker
   • *Key Highlights*: Concurrency control, exponential backoff, worker pooling, metrics dashboard.

2. **Real-time Collaborative Document Suite**:
   • *Tech*: Next.js, WebSockets (Socket.io), MongoDB, Tailwind CSS
   • *Key Highlights*: Operational transformation/CRDTs, live cursor tracking, permission tiers.

3. **AI-Powered Code Reviewer & Security Auditing Bot**:
   • *Tech*: Python / Node.js, OpenAI API, GitHub Webhooks, PostgreSQL
   • *Key Highlights*: AST parsing, automated PR commenting, vulnerability detection.

Each of these projects will strongly validate your readiness for top-tier software engineering roles!`;

      suggestedQuestions = [
        'How should I describe these projects on my resume?',
        'What architecture should I use for the task queue project?',
        'How do I add automated tests to my project?'
      ];
    } else if (q.includes('risk') || q.includes('attendance') || q.includes('academic') || q.includes('backlog')) {
      reply = `Here is your current Academic & Risk Status summary:

• **Overall Risk Level**: **${ctx.riskLevel.toUpperCase()}** (Risk Index: ${ctx.riskScore}/100)
• **Current CGPA**: ${ctx.cgpa.toFixed(2)}
• **Attendance**: ${ctx.attendancePercentage.toFixed(1)}% ${ctx.attendancePercentage < 75 ? '(⚠️ Below 75% statutory requirement)' : '(✓ Good standing)'}
• **Active Backlogs**: ${ctx.activeBacklogs}

${ctx.attendancePercentage < 75 ? '⚠️ **Priority Action**: You must attend the upcoming instructional classes consistently to restore your attendance to 75% and avoid detention.' : '✓ Academic attendance is healthy. Maintain this momentum through semester end.'}`;

      suggestedQuestions = [
        'How many classes do I need to attend to reach 80%?',
        'What mentoring assistance is available for exam prep?',
        'How does CGPA affect campus recruitment eligibility?'
      ];
    } else if (q.includes('resume') || q.includes('ats') || q.includes('cv')) {
      reply = `I have analyzed your profile against modern **ATS (Applicant Tracking System)** standards.

**Key Strengths of your Profile for Resume Building:**
• Clearly defined education in ${ctx.department}.
• Strong list of verified technical skills (${ctx.skills.slice(0, 4).join(', ')}).
• Active portfolio containing ${ctx.projects.length} projects.

**AI Recommendations to maximize ATS pass rate:**
1. Head over to the **Resume Builder** page in Student360 AI to generate a clean ATS-Friendly or Modern template.
2. Use quantifiable bullet points (e.g., *"Optimized query performance by 35% using MongoDB compound indexes"*).
3. Ensure your LinkedIn and GitHub repository URLs are updated in your Profile settings.`;

      suggestedQuestions = [
        'Show me bullet point examples for my projects',
        'Which resume template is best for campus placements?',
        'What should I write in my career summary?'
      ];
    } else {
      reply = `Hello ${ctx.name}! I am your **Student360 AI Career Assistant**.

I am connected to your live student profile:
• **Department**: ${ctx.department} | **CGPA**: ${ctx.cgpa.toFixed(2)}
• **Target Role**: ${ctx.targetRole}
• **Placement Readiness**: ${ctx.placementReadiness}% | **Risk Level**: ${ctx.riskLevel}

How can I help you today? You can ask me about skill gap analysis, job matching, interview preparation, resume optimization, or project ideas!`;
    }

    return {
      reply,
      suggestedQuestions
    };
  }
}
