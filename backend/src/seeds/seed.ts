import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database';
import {
  User,
  StudentProfile,
  AcademicRecord,
  Attendance,
  MentoringRecord,
  Project,
  Internship,
  Certification,
  Achievement,
  Skill,
  CareerGoal,
  Job,
  JobApplication,
  PlacementRecord,
  HigherEducation,
  CompetitiveExam,
  AIInsight,
  Notification,
  AuditLog
} from '../models';
import { StudyPlannerService } from '../services/ai/StudyPlannerService';

export const runSeed = async () => {
  console.log('🌱 Starting Student360 AI Database Seeding Engine...');
  await connectDatabase();

  // Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    StudentProfile.deleteMany({}),
    AcademicRecord.deleteMany({}),
    Attendance.deleteMany({}),
    MentoringRecord.deleteMany({}),
    Project.deleteMany({}),
    Internship.deleteMany({}),
    Certification.deleteMany({}),
    Achievement.deleteMany({}),
    Skill.deleteMany({}),
    CareerGoal.deleteMany({}),
    Job.deleteMany({}),
    JobApplication.deleteMany({}),
    PlacementRecord.deleteMany({}),
    HigherEducation.deleteMany({}),
    CompetitiveExam.deleteMany({}),
    AIInsight.deleteMany({}),
    Notification.deleteMany({}),
    AuditLog.deleteMany({})
  ]);

  console.log('✓ Cleared existing collections');

  // 1. Create Core Institutional Accounts
  const admin = await User.create({
    name: 'Dr. Suresh Varma',
    email: 'admin@student360.ai',
    password: 'Admin@123456',
    role: 'admin',
    department: 'Administration',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  const facultyMentor = await User.create({
    name: 'Dr. Rajesh Sharma',
    email: 'faculty@student360.ai',
    password: 'Faculty@123456',
    role: 'faculty',
    department: 'Computer Science and Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  });

  const faculty2 = await User.create({
    name: 'Dr. Ananya Sen',
    email: 'ananya.sen@student360.ai',
    password: 'Faculty@123456',
    role: 'faculty',
    department: 'Artificial Intelligence & Data Science',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  });

  const placementOfficer = await User.create({
    name: 'Prof. Priya Nair',
    email: 'placement@student360.ai',
    password: 'Placement@123456',
    role: 'placement_officer',
    department: 'Training and Placement Cell',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  });

  // 2. Create Primary Demo Student (Aarav Sharma)
  const primaryStudent = await User.create({
    name: 'Aarav Sharma',
    email: 'student@student360.ai',
    password: 'Student@123456',
    role: 'student',
    department: 'Computer Science and Engineering',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  });

  const primaryProfile = await StudentProfile.create({
    user: primaryStudent._id,
    rollNumber: '23CS101',
    admissionNumber: 'ADM-2023-0101',
    college: 'Institute of Technology & Science',
    department: 'Computer Science and Engineering',
    degree: 'B.Tech',
    batch: '2023-2027',
    currentYear: 3,
    currentSemester: 6,
    section: 'A',
    gender: 'Male',
    phone: '+91 98765 43210',
    address: {
      street: '42 Tech Park Avenue, Koramangala',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560034',
      country: 'India'
    },
    careerObjective: 'Aspiring Full Stack Engineer passionate about building resilient distributed systems, modern web apps, and AI-enabled product interfaces.',
    targetRole: 'Full Stack Developer',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/aarav-sharma-demo',
      github: 'https://github.com/aarav-sharma-demo',
      portfolio: 'https://aaravsharma.dev',
      leetcode: 'https://leetcode.com/aarav_demo'
    },
    mentor: facultyMentor._id,
    cgpa: 8.84,
    totalBacklogs: 0,
    activeBacklogs: 0,
    placementStatus: 'Eligible',
    placementReadinessScore: 88,
    riskScore: 18,
    riskLevel: 'Low',
    isPublicPortfolio: true,
    publicSlug: 'aarav-sharma',
    publicSections: {
      about: true,
      academics: true,
      skills: true,
      projects: true,
      internships: true,
      certifications: true,
      achievements: true,
      contact: true
    }
  });

  // Primary Student - Academic Records (Semesters 1 to 5)
  const semesterData = [
    {
      sem: 1,
      sgpa: 8.5,
      cgpa: 8.5,
      subjects: [
        { subjectCode: 'CS101', subjectName: 'Programming in C & Problem Solving', credits: 4, internalMarks: 28, externalMarks: 62, totalMarks: 90, grade: 'A+', gradePoints: 9, status: 'Pass' },
        { subjectCode: 'MA101', subjectName: 'Engineering Mathematics I', credits: 4, internalMarks: 25, externalMarks: 58, totalMarks: 83, grade: 'A', gradePoints: 8, status: 'Pass' },
        { subjectCode: 'PH101', subjectName: 'Engineering Physics', credits: 3, internalMarks: 26, externalMarks: 60, totalMarks: 86, grade: 'A', gradePoints: 8, status: 'Pass' },
        { subjectCode: 'EE101', subjectName: 'Basic Electrical & Electronics', credits: 3, internalMarks: 27, externalMarks: 63, totalMarks: 90, grade: 'A+', gradePoints: 9, status: 'Pass' },
        { subjectCode: 'CS102', subjectName: 'Computing Lab', credits: 2, internalMarks: 29, externalMarks: 68, totalMarks: 97, grade: 'O', gradePoints: 10, status: 'Pass' }
      ]
    },
    {
      sem: 2,
      sgpa: 8.7,
      cgpa: 8.6,
      subjects: [
        { subjectCode: 'CS201', subjectName: 'Data Structures using C++', credits: 4, internalMarks: 29, externalMarks: 64, totalMarks: 93, grade: 'O', gradePoints: 10, status: 'Pass' },
        { subjectCode: 'MA201', subjectName: 'Discrete Mathematics', credits: 4, internalMarks: 27, externalMarks: 59, totalMarks: 86, grade: 'A', gradePoints: 8, status: 'Pass' },
        { subjectCode: 'CS202', subjectName: 'Digital Logic & Computer Design', credits: 3, internalMarks: 26, externalMarks: 61, totalMarks: 87, grade: 'A', gradePoints: 8, status: 'Pass' },
        { subjectCode: 'CH101', subjectName: 'Environmental Science', credits: 2, internalMarks: 28, externalMarks: 62, totalMarks: 90, grade: 'A+', gradePoints: 9, status: 'Pass' },
        { subjectCode: 'CS203', subjectName: 'Data Structures Lab', credits: 2, internalMarks: 30, externalMarks: 69, totalMarks: 99, grade: 'O', gradePoints: 10, status: 'Pass' }
      ]
    },
    {
      sem: 3,
      sgpa: 8.9,
      cgpa: 8.7,
      subjects: [
        { subjectCode: 'CS301', subjectName: 'Object Oriented Programming with Java', credits: 4, internalMarks: 29, externalMarks: 65, totalMarks: 94, grade: 'O', gradePoints: 10, status: 'Pass' },
        { subjectCode: 'CS302', subjectName: 'Computer Organization & Architecture', credits: 3, internalMarks: 26, externalMarks: 58, totalMarks: 84, grade: 'A', gradePoints: 8, status: 'Pass' },
        { subjectCode: 'CS303', subjectName: 'Database Management Systems', credits: 4, internalMarks: 29, externalMarks: 66, totalMarks: 95, grade: 'O', gradePoints: 10, status: 'Pass' },
        { subjectCode: 'MA301', subjectName: 'Probability & Statistics', credits: 3, internalMarks: 25, externalMarks: 57, totalMarks: 82, grade: 'A', gradePoints: 8, status: 'Pass' },
        { subjectCode: 'CS304', subjectName: 'DBMS & Java Lab', credits: 2, internalMarks: 29, externalMarks: 68, totalMarks: 97, grade: 'O', gradePoints: 10, status: 'Pass' }
      ]
    },
    {
      sem: 4,
      sgpa: 9.1,
      cgpa: 8.8,
      subjects: [
        { subjectCode: 'CS401', subjectName: 'Design & Analysis of Algorithms', credits: 4, internalMarks: 30, externalMarks: 67, totalMarks: 97, grade: 'O', gradePoints: 10, status: 'Pass' },
        { subjectCode: 'CS402', subjectName: 'Operating Systems', credits: 4, internalMarks: 28, externalMarks: 63, totalMarks: 91, grade: 'A+', gradePoints: 9, status: 'Pass' },
        { subjectCode: 'CS403', subjectName: 'Software Engineering & Agile Methodologies', credits: 3, internalMarks: 27, externalMarks: 62, totalMarks: 89, grade: 'A+', gradePoints: 9, status: 'Pass' },
        { subjectCode: 'CS404', subjectName: 'Theory of Computation', credits: 3, internalMarks: 26, externalMarks: 59, totalMarks: 85, grade: 'A', gradePoints: 8, status: 'Pass' },
        { subjectCode: 'CS405', subjectName: 'OS & Algorithms Lab', credits: 2, internalMarks: 30, externalMarks: 68, totalMarks: 98, grade: 'O', gradePoints: 10, status: 'Pass' }
      ]
    },
    {
      sem: 5,
      sgpa: 9.0,
      cgpa: 8.84,
      subjects: [
        { subjectCode: 'CS501', subjectName: 'Computer Networks', credits: 4, internalMarks: 28, externalMarks: 64, totalMarks: 92, grade: 'A+', gradePoints: 9, status: 'Pass' },
        { subjectCode: 'CS502', subjectName: 'Web Technologies & Cloud Computing', credits: 4, internalMarks: 30, externalMarks: 68, totalMarks: 98, grade: 'O', gradePoints: 10, status: 'Pass' },
        { subjectCode: 'CS503', subjectName: 'Artificial Intelligence & Machine Learning', credits: 4, internalMarks: 29, externalMarks: 65, totalMarks: 94, grade: 'O', gradePoints: 10, status: 'Pass' },
        { subjectCode: 'CS504', subjectName: 'Compiler Design', credits: 3, internalMarks: 25, externalMarks: 58, totalMarks: 83, grade: 'A', gradePoints: 8, status: 'Pass' },
        { subjectCode: 'CS505', subjectName: 'Cloud & AI Lab', credits: 2, internalMarks: 29, externalMarks: 69, totalMarks: 98, grade: 'O', gradePoints: 10, status: 'Pass' }
      ]
    }
  ];

  for (const s of semesterData) {
    await AcademicRecord.create({
      student: primaryStudent._id,
      semester: s.sem,
      academicYear: `202${2 + s.sem}-202${3 + s.sem}`,
      subjects: s.subjects as any,
      sgpa: s.sgpa,
      cgpaAfterSemester: s.cgpa,
      totalCredits: 16,
      earnedCredits: 16,
      backlogsInSemester: 0,
      isCleared: true
    });
  }

  // Primary Student - Attendance
  await Attendance.create({
    student: primaryStudent._id,
    semester: 6,
    academicYear: '2025-2026',
    subjects: [
      { subjectCode: 'CS601', subjectName: 'Distributed Systems', facultyName: 'Dr. Rajesh Sharma', classesHeld: 40, classesAttended: 36, attendancePercentage: 90.0, status: 'Normal' },
      { subjectCode: 'CS602', subjectName: 'Information Security & Cryptography', facultyName: 'Dr. Neha Gupta', classesHeld: 38, classesAttended: 33, attendancePercentage: 86.8, status: 'Normal' },
      { subjectCode: 'CS603', subjectName: 'Cloud Native Microservices', facultyName: 'Prof. Ankit Verma', classesHeld: 42, classesAttended: 39, attendancePercentage: 92.8, status: 'Normal' },
      { subjectCode: 'CS604', subjectName: 'Big Data Engineering', facultyName: 'Dr. Suresh Varma', classesHeld: 36, classesAttended: 29, attendancePercentage: 80.5, status: 'Normal' }
    ],
    totalClassesHeld: 156,
    totalClassesAttended: 137,
    overallPercentage: 87.8,
    riskLevel: 'Low',
    predictedFinalPercentage: 86.2,
    monthlyTrend: [
      { month: 'Jul', percentage: 92 },
      { month: 'Aug', percentage: 89 },
      { month: 'Sep', percentage: 86 },
      { month: 'Oct', percentage: 88 }
    ]
  });

  // Primary Student - Mentoring Session
  await MentoringRecord.create({
    student: primaryStudent._id,
    mentor: facultyMentor._id,
    meetingDate: new Date('2026-08-05'),
    discussions: 'Discussed campus placement preparation, system design concepts, and mock interview performances for upcoming Super-Dream campus drives.',
    feedback: 'Aarav is technically sharp and consistent. Suggested fine-tuning dynamic programming problem speed and practicing live coding mock interviews.',
    academicIssues: 'None. Strong academic consistency.',
    careerIssues: 'Targeting Tier-1 Super Dream offers (> 18 LPA).',
    actionItems: [
      { task: 'Complete Striver SDE Sheet Dynamic Programming module', targetDate: new Date('2026-09-01'), completed: true },
      { task: 'Deploy Capstone project with Docker containerization on cloud', targetDate: new Date('2026-09-15'), completed: true },
      { task: 'Attend 2 Mock Technical Interviews with Alumni Network', targetDate: new Date('2026-09-25'), completed: false }
    ],
    followUpDate: new Date('2026-09-30'),
    status: 'Completed',
    aiAlert: {
      riskLevel: 'Low',
      reasons: ['Consistent CGPA > 8.5', 'Active GitHub presence', 'Zero backlogs'],
      suggestedAction: 'Prioritize System Design practice for Tier-1 interviews.'
    }
  });

  // Primary Student - Projects
  const project1 = await Project.create({
    student: primaryStudent._id,
    title: 'Student360 AI - Lifecycle Management Platform',
    description: 'An AI-powered institutional digital portfolio and predictive lifecycle management system with real-time risk scoring, skill gap detection, ATS resume builder, and job matching.',
    domain: 'Full Stack & AI',
    technologies: ['React', 'Next.js', 'Node.js', 'Express', 'TypeScript', 'MongoDB', 'Tailwind CSS', 'Docker'],
    githubUrl: 'https://github.com/aarav-sharma-demo/student360-ai',
    liveUrl: 'https://student360-ai.vercel.app',
    teamMembers: ['Aarav Sharma', 'Rohan Gupta'],
    startDate: new Date('2026-01-10'),
    endDate: new Date('2026-05-20'),
    isOngoing: false,
    status: 'Completed',
    featured: true,
    aiAnalysis: {
      detectedSkills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'REST API', 'Docker'],
      domain: 'Full Stack Web Development & AI',
      complexityLevel: 'Advanced',
      resumeBullets: [
        'Architected an enterprise-grade Student Lifecycle platform using Next.js 15, TypeScript, Express, and MongoDB.',
        'Engineered an intelligent heuristic & LLM recommendation engine calculating real-time skill gaps, job matches, and risk scores.',
        'Implemented full RBAC authentication, Zod input validation pipelines, and interactive Recharts data visualizations.'
      ],
      suggestedImprovements: ['Integrate Redis for caching AI inference outputs.', 'Add WebSockets for real-time mentor alerts.']
    }
  });

  const project2 = await Project.create({
    student: primaryStudent._id,
    title: 'CloudScale - Distributed Microservices Rate Limiter',
    description: 'A high-throughput token-bucket distributed rate limiter and API gateway supporting 50,000+ concurrent requests with sub-5ms latency.',
    domain: 'Distributed Systems & Cloud',
    technologies: ['Node.js', 'Go', 'Redis', 'Docker', 'Kubernetes', 'Prometheus', 'Grafana'],
    githubUrl: 'https://github.com/aarav-sharma-demo/cloudscale-rate-limiter',
    liveUrl: 'https://cloudscale.dev',
    startDate: new Date('2025-08-15'),
    endDate: new Date('2025-11-30'),
    isOngoing: false,
    status: 'Completed',
    featured: true,
    aiAnalysis: {
      detectedSkills: ['Node.js', 'Go', 'Redis', 'Docker', 'Kubernetes', 'Distributed Systems'],
      domain: 'Distributed Systems & Cloud Infrastructure',
      complexityLevel: 'Advanced',
      resumeBullets: [
        'Built a distributed token-bucket rate limiter handling 50k req/sec with Redis cluster consensus and zero packet loss.',
        'Containerized multi-node services with Kubernetes manifests and monitored latency percentiles via Prometheus and Grafana dashboards.'
      ],
      suggestedImprovements: ['Add gRPC support for inter-service communication.']
    }
  });

  const project3 = await Project.create({
    student: primaryStudent._id,
    title: 'MediDoc RAG - Clinical Document Question-Answering',
    description: 'A Retrieval-Augmented Generation (RAG) assistant parsing complex medical research documents with semantic vector search and LLM citations.',
    domain: 'AI & Data Science',
    technologies: ['Python', 'FastAPI', 'LangChain', 'OpenAI API', 'ChromaDB', 'React'],
    githubUrl: 'https://github.com/aarav-sharma-demo/medidoc-rag',
    liveUrl: 'https://medidoc-rag.demo.app',
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-06-15'),
    isOngoing: false,
    status: 'Completed',
    featured: false,
    aiAnalysis: {
      detectedSkills: ['Python', 'FastAPI', 'LangChain', 'ChromaDB', 'Vector Databases', 'NLP'],
      domain: 'Artificial Intelligence & Machine Learning',
      complexityLevel: 'Advanced',
      resumeBullets: [
        'Developed a clinical QA assistant leveraging LangChain, ChromaDB embeddings, and FastAPI for sub-second document retrieval.',
        'Engineered chunking strategies that boosted retrieval precision by 28% across 1,000+ medical research PDFs.'
      ],
      suggestedImprovements: ['Implement hybrid sparse-dense search with BM25.']
    }
  });

  // Primary Student - Internships
  const intern1 = await Internship.create({
    student: primaryStudent._id,
    company: 'Razorpay Software',
    role: 'Backend Engineering Intern',
    location: 'Bengaluru, India',
    locationType: 'Hybrid',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-08-01'),
    isCurrent: false,
    stipend: '₹45,000 / month',
    technologies: ['Node.js', 'Go', 'MySQL', 'Kafka', 'Docker'],
    description: 'Worked on payment reconciliation microservices, optimizing batch settlement queries and reducing processing latency by 32%.',
    skillsAcquired: ['Node.js', 'Go', 'Distributed Transactions', 'Kafka', 'MySQL'],
    verified: true
  });

  const intern2 = await Internship.create({
    student: primaryStudent._id,
    company: 'Swiggy',
    role: 'Software Development Intern (Full Stack)',
    location: 'Remote',
    locationType: 'Remote',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2025-02-15'),
    isCurrent: false,
    stipend: '₹35,000 / month',
    technologies: ['React', 'TypeScript', 'Node.js', 'Redis'],
    description: 'Contributed to the restaurant partner onboarding dashboard, building reactive form wizards and reusable design system components.',
    skillsAcquired: ['React', 'TypeScript', 'State Management', 'UI/UX'],
    verified: true
  });

  // Primary Student - Certifications
  const cert1 = await Certification.create({
    student: primaryStudent._id,
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services (AWS)',
    issueDate: new Date('2025-04-10'),
    credentialId: 'AWS-CCP-9382109',
    credentialUrl: 'https://aws.amazon.com/verification',
    extractedSkills: ['AWS', 'Cloud Architecture', 'IAM', 'EC2', 'S3', 'VPC'],
    category: 'Cloud & DevOps',
    verified: true,
    aiExtracted: true
  });

  const cert2 = await Certification.create({
    student: primaryStudent._id,
    title: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Meta / Coursera',
    issueDate: new Date('2024-11-20'),
    credentialId: 'COURSERA-META-77291',
    credentialUrl: 'https://coursera.org/verify/meta',
    extractedSkills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Jest Testing', 'Git'],
    category: 'Web Development',
    verified: true,
    aiExtracted: true
  });

  const cert3 = await Certification.create({
    student: primaryStudent._id,
    title: 'NPTEL Elite Gold: Data Structures & Algorithms in Java',
    issuer: 'NPTEL (IIT Kharagpur)',
    issueDate: new Date('2024-09-15'),
    credentialId: 'NPTEL24CS88102',
    extractedSkills: ['Data Structures', 'Algorithms', 'Java', 'Complexity Analysis'],
    category: 'Core CS',
    verified: true,
    aiExtracted: false
  });

  // Primary Student - Achievements
  await Achievement.create({
    student: primaryStudent._id,
    title: 'Winner - Smart India Hackathon (SIH 2025)',
    category: 'Hackathon',
    issuerOrg: 'Ministry of Education, Govt of India',
    date: new Date('2025-10-18'),
    description: 'Secured 1st place nationwide in the Smart Education theme for developing an offline-first learning and assessment toolkit for rural schools.',
    position: 'Winner (1st Place - ₹1,00,000 Cash Prize)',
    skillsDemonstrated: ['Full Stack Development', 'System Architecture', 'Problem Solving', 'Leadership'],
    evidenceUrl: '/uploads/sih_2025_winner_certificate.pdf',
    evidence: {
      fileName: 'sih_2025_winner_certificate.pdf',
      fileType: 'application/pdf',
      fileSize: 524288,
      fileUrl: '/uploads/sih_2025_winner_certificate.pdf',
      storageProvider: 'local',
      uploadedAt: new Date('2025-10-20')
    },
    aiCategorized: true,
    aiAnalysis: {
      confidence: 0.96,
      confidenceCategory: 'High',
      category: 'Hackathon',
      impactLevel: 'National',
      careerRelevance: 'High',
      resumeValue: 'Strong',
      summary: 'Winner (1st Place) at Smart India Hackathon 2025, recognized for engineering an offline-first learning and assessment architecture for rural educational challenges.',
      resumeBullet: '• Won 1st place at Smart India Hackathon 2025 by developing an AI-powered offline learning platform utilizing React, Node.js, and MongoDB.',
      extractedSkills: ['Full Stack Development', 'System Architecture', 'Problem Solving', 'Leadership'],
      certificateId: 'CERT-SIH-883921',
      credentialUrl: 'https://verify.sih.gov.in/cert/883921',
      analyzedAt: new Date('2025-10-20')
    },
    featured: true
  });

  await Achievement.create({
    student: primaryStudent._id,
    title: 'IEEE Conference Paper Publication on Distributed Cache Synchronization',
    category: 'Publication',
    issuerOrg: 'IEEE International Conference on Cloud Computing (ICCC 2025)',
    date: new Date('2025-12-05'),
    description: 'Co-authored and presented peer-reviewed research paper titled "Adaptive Consensus Strategies for Distributed Key-Value Caching in Edge Networks".',
    position: 'Lead Author & Presenter',
    skillsDemonstrated: ['Research', 'Technical Writing', 'Distributed Systems', 'Go'],
    evidenceUrl: '/uploads/ieee_iccc_acceptance_cert.pdf',
    evidence: {
      fileName: 'ieee_iccc_acceptance_cert.pdf',
      fileType: 'application/pdf',
      fileSize: 394200,
      fileUrl: '/uploads/ieee_iccc_acceptance_cert.pdf',
      storageProvider: 'local',
      uploadedAt: new Date('2025-12-06')
    },
    aiCategorized: true,
    aiAnalysis: {
      confidence: 0.94,
      confidenceCategory: 'High',
      category: 'Publication',
      impactLevel: 'International',
      careerRelevance: 'High',
      resumeValue: 'Strong',
      summary: 'Lead Author at IEEE International Conference on Cloud Computing (ICCC 2025), published research on adaptive cache consensus in edge architectures.',
      resumeBullet: '• Authored and presented peer-reviewed research at IEEE ICCC 2025 on distributed consensus protocols in high-throughput cloud networks.',
      extractedSkills: ['Research', 'Technical Writing', 'Distributed Systems', 'Go'],
      certificateId: 'IEEE-ICCC-2025-0982',
      credentialUrl: 'https://ieeexplore.ieee.org/document/9981273',
      analyzedAt: new Date('2025-12-06')
    },
    featured: true
  });

  await Achievement.create({
    student: primaryStudent._id,
    title: 'ACM-ICPC Regional Finalist (Amritapuri Site)',
    category: 'Competition',
    issuerOrg: 'ACM ICPC Global Competitive Programming Initiative',
    date: new Date('2025-01-22'),
    description: 'Qualified for the competitive programming regional finals ranking in top 5% among 2,400+ collegiate teams.',
    position: 'Regional Finalist (Rank #14)',
    skillsDemonstrated: ['C++', 'Data Structures', 'Algorithms', 'Competitive Programming'],
    aiCategorized: true,
    aiAnalysis: {
      confidence: 0.92,
      confidenceCategory: 'High',
      category: 'Competition',
      impactLevel: 'National',
      careerRelevance: 'High',
      resumeValue: 'Strong',
      summary: 'Regional Finalist at ACM-ICPC Regional Amritapuri, solving complex dynamic programming and graph algorithms under strict time constraints.',
      resumeBullet: '• Achieved Rank #14 at ACM-ICPC Regional Finals among 2,400+ national collegiate teams solving algorithmic challenges in C++.',
      extractedSkills: ['C++', 'Data Structures', 'Algorithms', 'Competitive Programming'],
      certificateId: 'ACM-ICPC-2025-7741',
      analyzedAt: new Date('2025-01-23')
    },
    featured: true
  });

  await Achievement.create({
    student: primaryStudent._id,
    title: 'Google Developer Student Clubs (GDSC) Technical Lead',
    category: 'Leadership',
    issuerOrg: 'Google Developer Student Clubs',
    date: new Date('2025-08-10'),
    description: 'Led technical workshops on cloud architecture, open source, and full stack web development for 600+ university students.',
    position: 'Lead Organizer & Technical Mentor',
    skillsDemonstrated: ['Team Leadership', 'Public Speaking', 'Mentoring', 'Open Source'],
    aiCategorized: true,
    aiAnalysis: {
      confidence: 0.91,
      confidenceCategory: 'High',
      category: 'Leadership',
      impactLevel: 'University',
      careerRelevance: 'Medium',
      resumeValue: 'Moderate',
      summary: 'Lead Organizer for Google Developer Student Clubs, mentoring 600+ students and directing hackathons and developer summits.',
      resumeBullet: '• Spearheaded GDSC university chapter leading technical bootcamps for 600+ students across cloud architecture and full-stack development.',
      extractedSkills: ['Team Leadership', 'Public Speaking', 'Mentoring', 'Open Source'],
      analyzedAt: new Date('2025-08-11')
    },
    featured: false
  });

  // Primary Student - Skills Matrix
  const skillsToSeed = [
    { name: 'TypeScript', category: 'Programming', proficiency: 'Expert', experienceMonths: 24, isTopSkill: true, projects: [project1._id] },
    { name: 'React & Next.js', category: 'Web Development', proficiency: 'Expert', experienceMonths: 28, isTopSkill: true, projects: [project1._id], certs: [cert2._id] },
    { name: 'Node.js & Express', category: 'Web Development', proficiency: 'Expert', experienceMonths: 26, isTopSkill: true, projects: [project1._id], internships: [intern1._id] },
    { name: 'Data Structures & Algorithms', category: 'Core CS / Tools', proficiency: 'Advanced', experienceMonths: 30, isTopSkill: true, certs: [cert3._id] },
    { name: 'MongoDB', category: 'Database', proficiency: 'Advanced', experienceMonths: 22, isTopSkill: true, projects: [project1._id] },
    { name: 'Docker & Containers', category: 'Cloud & DevOps', proficiency: 'Advanced', experienceMonths: 18, isTopSkill: true, projects: [project1._id, project2._id], certs: [cert1._id] },
    { name: 'PostgreSQL & SQL', category: 'Database', proficiency: 'Advanced', experienceMonths: 20, isTopSkill: false, internships: [intern1._id] },
    { name: 'Python', category: 'Programming', proficiency: 'Intermediate', experienceMonths: 16, isTopSkill: false, projects: [project3._id] },
    { name: 'AWS Cloud Services', category: 'Cloud & DevOps', proficiency: 'Intermediate', experienceMonths: 14, isTopSkill: false, certs: [cert1._id] },
    { name: 'Redis Caching', category: 'Database', proficiency: 'Intermediate', experienceMonths: 12, isTopSkill: false, projects: [project2._id] },
    { name: 'Git & GitHub Actions', category: 'Core CS / Tools', proficiency: 'Expert', experienceMonths: 30, isTopSkill: true }
  ];

  for (const s of skillsToSeed) {
    await Skill.create({
      student: primaryStudent._id,
      name: s.name,
      category: s.category as any,
      proficiency: s.proficiency as any,
      experienceMonths: s.experienceMonths,
      isTopSkill: s.isTopSkill,
      evidence: {
        projects: s.projects || [],
        certifications: s.certs || [],
        internships: s.internships || []
      },
      verified: true
    });
  }

  // Primary Student - Career Goal
  await CareerGoal.create({
    student: primaryStudent._id,
    targetRole: 'Full Stack Software Engineer',
    targetIndustry: 'Technology & Product Software',
    desiredSalaryMin: 12,
    desiredSalaryMax: 24,
    preferredLocations: ['Bengaluru', 'Hyderabad', 'Remote'],
    timeline: 'Campus Placements 2026-2027',
    targetCompanies: ['Google', 'Microsoft', 'Amazon', 'Atlassian', 'Uber', 'Razorpay'],
    readinessPercentage: 88
  });

  // Primary Student - Competitive Exams & Study Plan
  const gatePlan = StudyPlannerService.generatePlan('GATE');
  await CompetitiveExam.create({
    student: primaryStudent._id,
    examType: 'GATE',
    examName: 'GATE Computer Science & IT (2027)',
    targetScore: '750+ (AIR < 200)',
    currentScore: '610 (Mock Test)',
    registered: true,
    registrationNumber: 'CS27S981245',
    preparationProgress: 55,
    studyHoursPerWeek: 16,
    examDate: new Date('2027-02-07'),
    mockScores: [
      { testName: 'Subject Test: Operating Systems', date: new Date('2026-06-10'), score: 45, maxScore: 50, percentile: 96 },
      { testName: 'Subject Test: Computer Networks', date: new Date('2026-07-15'), score: 41, maxScore: 50, percentile: 90 },
      { testName: 'All India Mock Test 1', date: new Date('2026-08-01'), score: 68, maxScore: 100, percentile: 93 }
    ],
    studyPlan: gatePlan.weeklySchedule
  });

  // Primary Student - AI Insights
  await AIInsight.create({
    student: primaryStudent._id,
    type: 'CareerRecommendation',
    title: 'High Career Match: Full Stack & Cloud Engineer (94% Match)',
    summary: 'Your proficiency in Next.js, Node.js, and Docker combined with your Razorpay backend internship positions you in the top 5% of candidate profiles for Super-Dream software engineering roles.',
    score: 94,
    recommendations: [
      'Practice advanced System Design concepts (Database Sharding, Consistency Models).',
      'Solve 25 more LeetCode Hard graph algorithms before November recruitment season.'
    ],
    severity: 'success'
  });

  await AIInsight.create({
    student: primaryStudent._id,
    type: 'PlacementReadiness',
    title: 'Placement Readiness Score Reached 88/100 (Tier-1 Eligible)',
    summary: 'You have met all eligibility criteria for Super-Dream (> 12 LPA) campus placement drives. Your verified internship and SIH hackathon win give you a strong interview advantage.',
    score: 88,
    recommendations: [
      'Ensure your resume in Resume Builder uses the Modern or ATS-Friendly template.',
      'Schedule a mentor mock interview session with Prof. Priya Nair.'
    ],
    severity: 'info'
  });

  // Primary Student - In-App Notifications
  await Notification.create({
    recipient: primaryStudent._id,
    type: 'job_deadline',
    title: 'New Campus Drive: Microsoft Software Engineer Intern/FTE',
    message: 'Microsoft has opened applications for 2027 batch B.Tech CSE students. Your profile match score is 92%. Application deadline: 15 Sep 2026.',
    link: '/placement/jobs',
    isRead: false
  });

  await Notification.create({
    recipient: primaryStudent._id,
    type: 'mentoring_followup',
    title: 'Mentoring Action Item Reminder',
    message: 'Follow-up with Dr. Rajesh Sharma scheduled for 30 Sep 2026. Please complete mock coding assessment submissions.',
    link: '/mentoring',
    isRead: false
  });

  // 3. Create 20+ Additional Diverse Students
  const sampleStudents = [
    { name: 'Ananya Deshmukh', email: 'ananya.d@student360.ai', dept: 'Computer Science and Engineering', year: 3, cgpa: 9.42, attendance: 94.0, targetRole: 'AI / Machine Learning Engineer', risk: 'Low', roll: '23CS102' },
    { name: 'Rohan Gupta', email: 'rohan.g@student360.ai', dept: 'Computer Science and Engineering', year: 3, cgpa: 8.65, attendance: 82.0, targetRole: 'Backend Developer', risk: 'Low', roll: '23CS103' },
    { name: 'Sneha Patel', email: 'sneha.p@student360.ai', dept: 'Information Technology', year: 3, cgpa: 8.90, attendance: 88.5, targetRole: 'Full Stack Developer', risk: 'Low', roll: '23IT101' },
    { name: 'Vikram Singh', email: 'vikram.s@student360.ai', dept: 'Computer Science and Engineering', year: 4, cgpa: 7.20, attendance: 68.0, targetRole: 'Software Developer', risk: 'Medium', roll: '22CS104' },
    { name: 'Pooja Reddy', email: 'pooja.r@student360.ai', dept: 'Artificial Intelligence & Data Science', year: 3, cgpa: 9.15, attendance: 91.0, targetRole: 'Data Scientist', risk: 'Low', roll: '23AI101' },
    { name: 'Karthik Raja', email: 'karthik.r@student360.ai', dept: 'Electronics & Communication Engineering', year: 3, cgpa: 6.40, attendance: 62.0, targetRole: 'Embedded Systems Engineer', risk: 'High', roll: '23EC101' },
    { name: 'Meera Nambiar', email: 'meera.n@student360.ai', dept: 'Computer Science and Engineering', year: 4, cgpa: 9.50, attendance: 96.0, targetRole: 'Cloud Solutions Architect', risk: 'Low', roll: '22CS105' },
    { name: 'Rahul Joshi', email: 'rahul.j@student360.ai', dept: 'Information Technology', year: 2, cgpa: 7.80, attendance: 79.0, targetRole: 'Frontend Developer', risk: 'Low', roll: '24IT102' },
    { name: 'Divya Iyer', email: 'divya.i@student360.ai', dept: 'Artificial Intelligence & Data Science', year: 3, cgpa: 8.40, attendance: 85.0, targetRole: 'NLP Engineer', risk: 'Low', roll: '23AI102' },
    { name: 'Aditya Kulkarni', email: 'aditya.k@student360.ai', dept: 'Computer Science and Engineering', year: 3, cgpa: 5.95, attendance: 58.0, targetRole: 'QA & Automation Engineer', risk: 'High', roll: '23CS106' },
    { name: 'Neha Choudhury', email: 'neha.c@student360.ai', dept: 'Information Technology', year: 4, cgpa: 8.75, attendance: 87.0, targetRole: 'Cybersecurity Analyst', risk: 'Low', roll: '22IT103' },
    { name: 'Siddharth Verma', email: 'siddharth.v@student360.ai', dept: 'Computer Science and Engineering', year: 3, cgpa: 7.60, attendance: 74.0, targetRole: 'DevOps Engineer', risk: 'Medium', roll: '23CS107' },
    { name: 'Ishita Bansal', email: 'ishita.b@student360.ai', dept: 'Electronics & Communication Engineering', year: 3, cgpa: 8.30, attendance: 83.0, targetRole: 'VLSI Design Engineer', risk: 'Low', roll: '23EC102' },
    { name: 'Varun Nair', email: 'varun.n@student360.ai', dept: 'Artificial Intelligence & Data Science', year: 2, cgpa: 8.05, attendance: 81.0, targetRole: 'Computer Vision Engineer', risk: 'Low', roll: '24AI103' },
    { name: 'Tanvi Shah', email: 'tanvi.s@student360.ai', dept: 'Computer Science and Engineering', year: 4, cgpa: 9.30, attendance: 93.0, targetRole: 'Product Manager / Tech', risk: 'Low', roll: '22CS108' },
    { name: 'Manish Pandey', email: 'manish.p@student360.ai', dept: 'Information Technology', year: 3, cgpa: 6.80, attendance: 66.0, targetRole: 'Full Stack Developer', risk: 'Medium', roll: '23IT104' },
    { name: 'Ritu Sen', email: 'ritu.s@student360.ai', dept: 'Computer Science and Engineering', year: 3, cgpa: 8.95, attendance: 90.0, targetRole: 'Software Engineer', risk: 'Low', roll: '23CS109' },
    { name: 'Abhishek Roy', email: 'abhishek.r@student360.ai', dept: 'Electronics & Communication Engineering', year: 4, cgpa: 7.45, attendance: 76.0, targetRole: 'IoT & Firmware Engineer', risk: 'Low', roll: '22EC103' },
    { name: 'Deepika Rao', email: 'deepika.r@student360.ai', dept: 'Artificial Intelligence & Data Science', year: 3, cgpa: 8.70, attendance: 89.0, targetRole: 'Data Analyst', risk: 'Low', roll: '23AI104' },
    { name: 'Gaurav Mishra', email: 'gaurav.m@student360.ai', dept: 'Computer Science and Engineering', year: 3, cgpa: 6.20, attendance: 60.0, targetRole: 'Software Developer', risk: 'High', roll: '23CS110' }
  ];

  for (const s of sampleStudents) {
    const user = await User.create({
      name: s.name,
      email: s.email,
      password: 'Student@123456',
      role: 'student',
      department: s.dept,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(s.name)}`
    });

    const isPlaced = s.year === 4 && s.cgpa >= 8.0;

    await StudentProfile.create({
      user: user._id,
      rollNumber: s.roll,
      college: 'Institute of Technology & Science',
      department: s.dept,
      degree: 'B.Tech',
      batch: s.year === 4 ? '2022-2026' : s.year === 3 ? '2023-2027' : '2024-2028',
      currentYear: s.year,
      currentSemester: s.year * 2,
      cgpa: s.cgpa,
      totalBacklogs: s.risk === 'High' ? 2 : 0,
      activeBacklogs: s.risk === 'High' ? 2 : 0,
      placementStatus: isPlaced ? 'Placed' : s.cgpa >= 6.5 ? 'Eligible' : 'Not Eligible',
      placementReadinessScore: s.risk === 'High' ? 38 : s.risk === 'Medium' ? 62 : Math.round(s.cgpa * 10),
      riskScore: s.risk === 'High' ? 75 : s.risk === 'Medium' ? 45 : 15,
      riskLevel: s.risk as any,
      targetRole: s.targetRole,
      publicSlug: s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    });

    // Seed Skills for student
    await Skill.create({
      student: user._id,
      name: 'Python',
      category: 'Programming',
      proficiency: s.cgpa > 8.5 ? 'Advanced' : 'Intermediate',
      experienceMonths: 18,
      verified: true
    });
    await Skill.create({
      student: user._id,
      name: 'SQL',
      category: 'Database',
      proficiency: 'Intermediate',
      experienceMonths: 12,
      verified: true
    });

    // Seed Attendance
    await Attendance.create({
      student: user._id,
      semester: s.year * 2,
      academicYear: '2025-2026',
      subjects: [
        { subjectCode: 'SUB1', subjectName: 'Core Theory Subject', classesHeld: 40, classesAttended: Math.round((s.attendance / 100) * 40), attendancePercentage: s.attendance, status: s.attendance < 65 ? 'Critical' : s.attendance < 75 ? 'Shortage' : 'Normal' },
        { subjectCode: 'SUB2', subjectName: 'Applied Lab Subject', classesHeld: 40, classesAttended: Math.round((s.attendance / 100) * 40), attendancePercentage: s.attendance, status: s.attendance < 65 ? 'Critical' : s.attendance < 75 ? 'Shortage' : 'Normal' }
      ],
      totalClassesHeld: 80,
      totalClassesAttended: Math.round((s.attendance / 100) * 80),
      overallPercentage: s.attendance,
      riskLevel: s.risk as any,
      predictedFinalPercentage: Math.max(s.attendance - 2, 40),
      monthlyTrend: [
        { month: 'Jul', percentage: Math.min(s.attendance + 4, 100) },
        { month: 'Aug', percentage: s.attendance },
        { month: 'Sep', percentage: Math.max(s.attendance - 2, 40) },
        { month: 'Oct', percentage: s.attendance }
      ]
    });
  }

  // 4. Create Placement Jobs
  const job1 = await Job.create({
    company: 'Microsoft',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    jobRole: 'Software Engineer - Campus 2027',
    jobType: 'Full-time',
    description: 'Join Microsoft engineering teams building next-generation Azure Cloud, AI copilots, and developer platforms. Looking for exceptional problem solvers with strong DSA and system architecture skills.',
    requiredSkills: ['Data Structures', 'Algorithms', 'C++', 'Java', 'Python', 'System Design'],
    preferredSkills: ['Azure', 'React', 'Distributed Systems'],
    minCgpa: 7.5,
    maxBacklogsAllowed: 0,
    eligibleBranches: ['Computer Science and Engineering', 'Information Technology', 'Artificial Intelligence & Data Science'],
    graduationYears: ['2026', '2027'],
    location: 'Bengaluru / Hyderabad',
    salaryRange: { min: 18, max: 28, currency: 'LPA' },
    applicationDeadline: new Date('2026-09-15'),
    driveDate: new Date('2026-09-22'),
    status: 'Open',
    createdBy: placementOfficer._id
  });

  const job2 = await Job.create({
    company: 'Google',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    jobRole: 'Associate Software Development Engineer (SDE I)',
    jobType: 'Full-time',
    description: 'Work at Google scale solving complex algorithmic problems across Search, Maps, Android, and Cloud platforms.',
    requiredSkills: ['Data Structures & Algorithms', 'Algorithms', 'C++', 'Java', 'Python', 'Linux'],
    preferredSkills: ['Kubernetes', 'Go', 'Machine Learning'],
    minCgpa: 8.0,
    maxBacklogsAllowed: 0,
    eligibleBranches: ['Computer Science and Engineering', 'Information Technology', 'Artificial Intelligence & Data Science'],
    graduationYears: ['2026', '2027'],
    location: 'Bengaluru',
    salaryRange: { min: 22, max: 32, currency: 'LPA' },
    applicationDeadline: new Date('2026-09-30'),
    driveDate: new Date('2026-10-10'),
    status: 'Open',
    createdBy: placementOfficer._id
  });

  const job3 = await Job.create({
    company: 'Amazon',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    jobRole: 'SDE Intern (6 Months + PPO)',
    jobType: 'Internship + PPO',
    description: '6-month intensive Software Development Internship with high pre-placement offer conversion rate for top performers.',
    requiredSkills: ['Java', 'Object Oriented Programming', 'Data Structures', 'SQL'],
    preferredSkills: ['AWS', 'Spring Boot', 'DynamoDB'],
    minCgpa: 7.0,
    maxBacklogsAllowed: 0,
    eligibleBranches: ['Computer Science and Engineering', 'Information Technology', 'Artificial Intelligence & Data Science', 'Electronics & Communication Engineering'],
    graduationYears: ['2027'],
    location: 'Hyderabad / Chennai',
    salaryRange: { min: 14, max: 20, currency: 'LPA' },
    applicationDeadline: new Date('2026-09-20'),
    status: 'Open',
    createdBy: placementOfficer._id
  });

  const job4 = await Job.create({
    company: 'Oracle',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
    jobRole: 'Cloud Applications Developer',
    jobType: 'Full-time',
    description: 'Build enterprise-scale cloud applications and database services for Global Fortune 500 customers.',
    requiredSkills: ['Java', 'SQL', 'Database Design', 'REST API', 'JavaScript'],
    preferredSkills: ['React', 'Docker', 'Oracle Cloud'],
    minCgpa: 6.8,
    maxBacklogsAllowed: 1,
    eligibleBranches: ['Computer Science and Engineering', 'Information Technology', 'Electronics & Communication Engineering'],
    graduationYears: ['2026', '2027'],
    location: 'Bengaluru / Pune',
    salaryRange: { min: 10, max: 16, currency: 'LPA' },
    applicationDeadline: new Date('2026-10-05'),
    status: 'Open',
    createdBy: placementOfficer._id
  });

  // 5. Create Job Applications for Primary Student
  await JobApplication.create({
    job: job1._id,
    student: primaryStudent._id,
    currentStage: 'Technical Interview',
    aiMatchScore: 92,
    aiMatchDetails: {
      strengths: ['Data Structures & Algorithms', 'C++', 'Python', 'Next.js', 'System Architecture', 'CGPA 8.84'],
      gaps: ['Azure specialized certifications'],
      isEligible: true
    },
    appliedDate: new Date('2026-08-10'),
    stageHistory: [
      { stage: 'Applied', updatedAt: new Date('2026-08-10'), notes: 'Profile submitted with verified Razorpay internship.' },
      { stage: 'Shortlisted', updatedAt: new Date('2026-08-14'), notes: 'Shortlisted based on CGPA and online coding test.' },
      { stage: 'Online Assessment', updatedAt: new Date('2026-08-18'), notes: 'Scored 100% on 3 algorithmic challenges.' },
      { stage: 'Technical Interview', updatedAt: new Date('2026-08-22'), notes: 'Round 1 technical discussion on distributed systems and concurrency completed.', scheduledTime: new Date('2026-08-28T10:00:00Z') }
    ]
  });

  await JobApplication.create({
    job: job3._id,
    student: primaryStudent._id,
    currentStage: 'Online Assessment',
    aiMatchScore: 89,
    aiMatchDetails: {
      strengths: ['Java', 'OOP', 'Data Structures', 'SQL', 'Zero Backlogs'],
      gaps: ['Spring Boot framework'],
      isEligible: true
    },
    appliedDate: new Date('2026-08-12'),
    stageHistory: [
      { stage: 'Applied', updatedAt: new Date('2026-08-12'), notes: 'Applied through campus placement portal.' },
      { stage: 'Shortlisted', updatedAt: new Date('2026-08-16'), notes: 'Eligible & Shortlisted.' },
      { stage: 'Online Assessment', updatedAt: new Date('2026-08-20'), notes: 'Assessment link received.' }
    ]
  });

  // 6. Placement Records (for alumni / 4th year demo)
  const placedStudents = await User.find({ email: { $in: ['meera.n@student360.ai', 'tanvi.s@student360.ai', 'neha.c@student360.ai'] } });
  if (placedStudents.length > 0) {
    await PlacementRecord.create({
      student: placedStudents[0]._id,
      company: 'Google',
      jobRole: 'Software Engineer',
      salaryCtcLpa: 28.5,
      offerType: 'On-Campus',
      offerDate: new Date('2025-11-20'),
      department: 'Computer Science and Engineering',
      batch: '2022-2026',
      isDreamCompany: true,
      status: 'Accepted'
    });
    if (placedStudents.length > 1) {
      await PlacementRecord.create({
        student: placedStudents[1]._id,
        company: 'Microsoft',
        jobRole: 'Product Software Engineer',
        salaryCtcLpa: 22.0,
        offerType: 'On-Campus',
        offerDate: new Date('2025-11-25'),
        department: 'Computer Science and Engineering',
        batch: '2022-2026',
        isDreamCompany: true,
        status: 'Accepted'
      });
    }
  }

  // 7. Audit Logs
  await AuditLog.create({
    user: admin._id,
    userEmail: admin.email,
    userRole: 'admin',
    action: 'SYSTEM_INITIALIZATION',
    entity: 'System',
    details: { message: 'Database populated with 20+ students, faculty mentors, jobs, and AI models.' }
  });

  console.log('✅ Seed completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Demo Accounts:');
  console.log('• Student:          student@student360.ai   / Student@123456');
  console.log('• Faculty / Mentor: faculty@student360.ai   / Faculty@123456');
  console.log('• Placement Officer: placement@student360.ai / Placement@123456');
  console.log('• Admin:            admin@student360.ai     / Admin@123456');
  console.log('----------------------------------------------------');
};

// Auto-run if executed directly via `ts-node src/seeds/seed.ts`
if (require.main === module) {
  runSeed()
    .then(async () => {
      await disconnectDatabase();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('Seed failed:', err);
      await disconnectDatabase();
      process.exit(1);
    });
}
