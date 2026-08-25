export interface JobMatchCalculationResult {
  jobId: string;
  isEligible: boolean;
  matchScore: number;
  skillsMatchScore: number;
  academicMatchScore: number;
  projectMatchScore: number;
  experienceMatchScore: number;
  eligibilityReasons: string[];
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
}

export interface OpportunityFeedItem {
  id: string;
  title: string;
  type: 'Job' | 'Internship' | 'Hackathon' | 'Workshop' | 'Certification' | 'Competition' | 'Research';
  provider: string;
  location: string;
  deadline: string;
  matchScore: number;
  matchReasons: string[];
  requiredSkills: string[];
  stipendOrPackage?: string;
  url?: string;
}

export class AIJobMatchingService {
  /**
   * Calculate multi-dimensional affinity between student profile and job posting
   */
  public static calculateJobMatch(params: {
    studentProfile: {
      cgpa: number;
      department: string;
      batch?: string;
      activeBacklogs?: number;
      skills: string[];
      projects: { title: string; technologies?: string[] }[];
      internships: { role: string; company: string; technologies?: string[] }[];
    };
    job: {
      _id: string;
      title?: string;
      requiredSkills: string[];
      preferredSkills?: string[];
      minCgpa: number;
      maxBacklogsAllowed: number;
      eligibleBranches: string[];
      graduationYears?: string[];
    };
  }): JobMatchCalculationResult {
    const student = params.studentProfile;
    const job = params.job;

    // 1. Eligibility Check
    const isCgpaEligible = student.cgpa >= job.minCgpa;
    const isBacklogEligible = (student.activeBacklogs || 0) <= job.maxBacklogsAllowed;
    const isBranchEligible =
      job.eligibleBranches.length === 0 ||
      job.eligibleBranches.some((b) => b.toLowerCase().includes(student.department.toLowerCase()) || student.department.toLowerCase().includes(b.toLowerCase()));

    const isEligible = isCgpaEligible && isBacklogEligible && isBranchEligible;

    const eligibilityReasons: string[] = [];
    if (!isCgpaEligible) eligibilityReasons.push(`CGPA ${student.cgpa.toFixed(2)} is below minimum requirement (${job.minCgpa})`);
    if (!isBacklogEligible) eligibilityReasons.push(`Active backlogs exceed maximum allowed (${job.maxBacklogsAllowed})`);
    if (!isBranchEligible) eligibilityReasons.push(`Department ${student.department} not listed in eligible branches`);
    if (isEligible) eligibilityReasons.push('Meets all academic, branch, and eligibility criteria.');

    // 2. Skill Match
    const studentSkillsLower = new Set(student.skills.map((s) => s.toLowerCase().trim()));
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    (job.requiredSkills || []).forEach((req) => {
      if (studentSkillsLower.has(req.toLowerCase().trim())) {
        matchedSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    });

    const skillsMatchScore = job.requiredSkills.length > 0
      ? Math.round((matchedSkills.length / job.requiredSkills.length) * 100)
      : 85;

    // 3. Academic Match
    const academicMatchScore = Math.min(100, Math.round((student.cgpa / Math.max(1, job.minCgpa)) * 80));

    // 4. Project Match
    const projectMatchScore = student.projects.length >= 2 ? 90 : student.projects.length === 1 ? 75 : 50;

    // 5. Experience Match
    const experienceMatchScore = student.internships.length >= 1 ? 90 : 60;

    // Overall Weighted Match
    let matchScore = Math.round(
      skillsMatchScore * 0.45 +
      academicMatchScore * 0.25 +
      projectMatchScore * 0.15 +
      experienceMatchScore * 0.15
    );

    if (!isEligible) {
      matchScore = Math.min(50, matchScore);
    }

    const recommendation = isEligible
      ? `Strong applicant profile. Highlights ${matchedSkills.slice(0, 3).join(', ')} competencies with ${student.projects.length} relevant projects.`
      : `Complete recommended prerequisites and meet academic benchmarks before applying.`;

    return {
      jobId: job._id,
      isEligible,
      matchScore: Math.min(98, Math.max(30, matchScore)),
      skillsMatchScore,
      academicMatchScore,
      projectMatchScore,
      experienceMatchScore,
      eligibilityReasons,
      matchedSkills,
      missingSkills,
      recommendation
    };
  }

  /**
   * Generate curated opportunity feed (Jobs, Internships, Hackathons, Certifications)
   */
  public static generateOpportunityFeed(studentData: {
    skills: string[];
    department?: string;
    cgpa?: number;
  }): OpportunityFeedItem[] {
    const skillsLower = new Set((studentData.skills || []).map((s) => s.toLowerCase().trim()));

    const feed: OpportunityFeedItem[] = [
      {
        id: 'opp-1',
        title: 'Software Development Engineer - Campus Drive',
        type: 'Job',
        provider: 'Microsoft India',
        location: 'Bengaluru / Hyderabad',
        deadline: '15 Sep 2026',
        matchScore: skillsLower.has('react') || skillsLower.has('node.js') ? 94 : 85,
        matchReasons: ['Skills align with core SDE tech stack', 'CGPA satisfies tier-1 placement criteria'],
        requiredSkills: ['Data Structures', 'Algorithms', 'C++', 'System Design', 'React'],
        stipendOrPackage: '₹22 - 28 LPA',
        url: 'https://careers.microsoft.com'
      },
      {
        id: 'opp-2',
        title: 'Full Stack Engineering Summer Internship',
        type: 'Internship',
        provider: 'Razorpay Software',
        location: 'Bengaluru (Hybrid)',
        deadline: '30 Sep 2026',
        matchScore: skillsLower.has('typescript') || skillsLower.has('node.js') ? 92 : 82,
        matchReasons: ['Proven microservices and REST API skills', 'High match with payment platform architecture'],
        requiredSkills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
        stipendOrPackage: '₹50,000 / month',
        url: 'https://razorpay.com/careers'
      },
      {
        id: 'opp-3',
        title: 'Smart India Hackathon 2026 - National Edition',
        type: 'Hackathon',
        provider: 'Ministry of Education & AICTE',
        location: 'Pan-India',
        deadline: '20 Oct 2026',
        matchScore: 95,
        matchReasons: ['Theme aligns with student digital lifecycle solutions', 'Strong competitive coding profile'],
        requiredSkills: ['Rapid Prototyping', 'Full Stack Development', 'AI/ML', 'Problem Solving'],
        stipendOrPackage: '₹1,00,000 Winner Prize',
        url: 'https://sih.gov.in'
      },
      {
        id: 'opp-4',
        title: 'AWS Certified Solutions Architect Scholarship',
        type: 'Certification',
        provider: 'Amazon Web Services (AWS Educate)',
        location: 'Online',
        deadline: '10 Oct 2026',
        matchScore: 88,
        matchReasons: ['Cloud certification will strengthen backend developer readiness', 'Recommended for target SDE roles'],
        requiredSkills: ['Cloud Architecture', 'VPC', 'EC2', 'S3', 'IAM'],
        stipendOrPackage: '100% Exam Voucher Subsidy',
        url: 'https://aws.amazon.com/education/awseducate'
      },
      {
        id: 'opp-5',
        title: 'Generative AI & LLM Systems Research Fellowship',
        type: 'Research',
        provider: 'IISc / IIT Madras AI Research Lab',
        location: 'Bengaluru / Remote',
        deadline: '05 Nov 2026',
        matchScore: skillsLower.has('python') ? 90 : 78,
        matchReasons: ['Academic standing qualifies for funded fellowship', 'Interest in distributed AI research'],
        requiredSkills: ['Python', 'PyTorch', 'Vector Databases', 'NLP'],
        stipendOrPackage: '₹35,000 / month Fellowship',
        url: 'https://iisc.ac.in/research'
      }
    ];

    return feed.sort((a, b) => b.matchScore - a.matchScore);
  }
}
