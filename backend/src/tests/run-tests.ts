import { CareerRecommendationService } from '../services/ai/CareerRecommendationService';
import { SkillGapService } from '../services/ai/SkillGapService';
import { JobMatchingService } from '../services/ai/JobMatchingService';
import { RiskAnalysisService } from '../services/ai/RiskAnalysisService';
import { PlacementReadinessService } from '../services/ai/PlacementReadinessService';
import { ResumeGenerationService } from '../services/ai/ResumeGenerationService';
import { ProjectAnalysisService } from '../services/ai/ProjectAnalysisService';
import { CertificateExtractionService } from '../services/ai/CertificateExtractionService';
import { StudyPlannerService } from '../services/ai/StudyPlannerService';
import { AchievementAIService } from '../services/ai/AchievementAIService';

async function runUnitTests() {
  console.log('🧪 Running Student360 AI Backend Intelligence Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // Test 1: Career Recommendation
  const careers = CareerRecommendationService.analyze({
    studentName: 'Test Student',
    cgpa: 8.8,
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Docker'],
    projects: [{ title: 'Full Stack App', technologies: ['React', 'Node.js'] }],
    internships: [{ role: 'SDE Intern', company: 'Tech Corp', technologies: ['Node.js'] }],
    certifications: [{ title: 'AWS Cloud' }]
  });
  assert(careers.length > 0, 'Career recommendations returns non-empty list');
  assert(careers[0].matchScore >= 70, 'Top career recommendation match score is realistic (>70%)');

  // Test 2: Skill Gap Analysis
  const gap = SkillGapService.analyzeRoleGap({
    targetRole: 'Full Stack Developer',
    studentSkills: [
      { name: 'React', proficiency: 'Advanced' },
      { name: 'Node.js', proficiency: 'Advanced' }
    ]
  });
  assert(gap.matchedSkills.length > 0, 'Skill gap detects matched skills');
  assert(gap.missingSkills.length > 0, 'Skill gap detects missing skills');
  assert(gap.learningRoadmap.length > 0, 'Skill gap generates step-by-step roadmap');

  // Test 3: Job Matching
  const jobMatch = JobMatchingService.calculateMatch({
    studentProfile: {
      cgpa: 8.5,
      department: 'Computer Science and Engineering',
      batch: '2023-2027',
      activeBacklogs: 0,
      skills: ['C++', 'Data Structures', 'Python'],
      projects: [{ title: 'Algo Visualizer', technologies: ['C++'] }],
      internships: []
    },
    job: {
      _id: 'job123',
      requiredSkills: ['Data Structures', 'C++'],
      preferredSkills: ['Python'],
      minCgpa: 7.5,
      maxBacklogsAllowed: 0,
      eligibleBranches: ['Computer Science and Engineering'],
      graduationYears: ['2027']
    }
  });
  assert(jobMatch.isEligible === true, 'Student is correctly identified as eligible');
  assert(jobMatch.matchScore > 80, 'Job match score computes high affinity');

  // Test 4: Risk Analysis
  const lowRisk = RiskAnalysisService.evaluateRisk({
    cgpa: 8.9,
    activeBacklogs: 0,
    attendancePercentage: 92,
    academicHistory: [{ semester: 1, sgpa: 8.8 }, { semester: 2, sgpa: 9.0 }],
    projectsCount: 3,
    internshipsCount: 1,
    skillsCount: 8,
    mentoringIssuesCount: 0
  });
  assert(lowRisk.riskLevel === 'Low', 'High-performing student categorized as Low Risk');

  const highRisk = RiskAnalysisService.evaluateRisk({
    cgpa: 5.4,
    activeBacklogs: 3,
    attendancePercentage: 58,
    academicHistory: [{ semester: 1, sgpa: 6.5 }, { semester: 2, sgpa: 5.2 }],
    projectsCount: 0,
    internshipsCount: 0,
    skillsCount: 1,
    mentoringIssuesCount: 2
  });
  assert(highRisk.riskLevel === 'High', 'Struggling student categorized as High Risk');
  assert(highRisk.contributingFactors.length >= 2, 'Contributing factors accurately itemized');

  // Test 5: Placement Readiness Calculation
  const readiness = PlacementReadinessService.calculate({
    cgpa: 8.8,
    activeBacklogs: 0,
    skillsCount: 10,
    advancedSkillsCount: 5,
    projectsCount: 3,
    internshipsCount: 2,
    certificationsCount: 2,
    achievementsCount: 2,
    hasGithubOrPortfolio: true
  });
  assert(readiness.overallScore >= 80, 'Strong profile yields Tier-1 Readiness score');

  // Test 6: Resume Generator
  const resume = ResumeGenerationService.generateFromProfile({
    user: { name: 'Aarav Sharma', email: 'aarav@demo.com' },
    profile: { college: 'Tech University', degree: 'B.Tech', department: 'CSE', cgpa: 8.8 },
    academicRecords: [],
    skills: [{ name: 'React', category: 'Web Development' }, { name: 'Node.js', category: 'Web Development' }],
    projects: [{ title: 'LifeCycle Platform', technologies: ['React', 'Node.js'] }],
    internships: [{ company: 'Razorpay', role: 'SDE Intern' }],
    certifications: [{ title: 'AWS Cloud Practitioner', issuer: 'AWS' }],
    achievements: [{ title: 'SIH Winner', issuerOrg: 'Govt of India' }],
    targetRole: 'Full Stack Engineer'
  });
  assert(resume.atsScore >= 80, 'Generated resume meets ATS standard');
  assert(resume.education.length > 0, 'Education section populated');
  assert(resume.skills.length > 0, 'Skills grouped and populated');

  // Test 7: Project & Certificate Analysis
  const projAnalysis = ProjectAnalysisService.analyze({
    title: 'Distributed Chat System',
    description: 'Built with React, WebSockets, Redis, and Docker on Node.js microservices.'
  });
  assert(projAnalysis.detectedSkills.includes('React'), 'Project analyzer detects React');
  assert(projAnalysis.detectedSkills.includes('Redis'), 'Project analyzer detects Redis');

  const certExtraction = CertificateExtractionService.extractFromFilenameOrText({
    filename: 'AWS_Certified_Cloud_Practitioner.pdf'
  });
  assert(certExtraction.issuer.includes('AWS'), 'Certificate extractor identifies AWS');

  // Test 9: Achievement AI Service
  const achAnalysis = await AchievementAIService.analyzeCertificate('Winner Smart India Hackathon 2025 Ministry of Education', 'sih_cert.pdf');
  assert(achAnalysis.category === 'Hackathon', 'Achievement AI correctly classifies Hackathon');
  assert(achAnalysis.confidence >= 0.9, 'Achievement AI calculates high confidence score for clear certificates');
  assert(achAnalysis.resumeBullet.length > 0, 'Achievement AI generates ATS-friendly resume bullet');
  assert(achAnalysis.impactLevel === 'National', 'Achievement AI assigns National impact to SIH');

  const pubClass = AchievementAIService.classifyAchievement('IEEE Conference Research Paper on Distributed AI');
  assert(pubClass.category === 'Publication', 'Classifies IEEE publication accurately');

  const impactAnalysis = AchievementAIService.analyzeImpact('ACM ICPC World Finals', 'ACM', 'Global programming championship');
  assert(impactAnalysis.impactLevel === 'International', 'Assigns International level to World Finals');

  const skillsExt = AchievementAIService.extractSkills('Implemented using React, Python, MongoDB, and AWS cloud');
  assert(skillsExt.includes('React') && skillsExt.includes('Python') && skillsExt.includes('AWS'), 'Extracts all tech skills');

  const summaryGen = AchievementAIService.generateAchievementSummary('Smart India Hackathon', 'Ministry of Education', '1st Place', 'developing AI student portal');
  assert(summaryGen.includes('Smart India Hackathon'), 'Generates professional summary');

  const dupCheck = AchievementAIService.detectDuplicate('Winner - Smart India Hackathon 2025', 'Ministry of Education', '2025-03-15', [
    { title: 'Winner - Smart India Hackathon 2025', issuerOrg: 'Ministry of Education' }
  ]);
  assert(dupCheck.isDuplicate === true, 'Duplicate detection identifies matching achievement title & org');

  const credDupCheck = AchievementAIService.detectDuplicate('New Title', 'Other Org', '2025-03-15', [
    { title: 'Old Title', issuerOrg: 'Old Org', aiAnalysis: { credentialId: 'CRED-998877' } }
  ], 'CRED-998877');
  assert(credDupCheck.isDuplicate === true, 'Duplicate detection identifies matching credential ID');

  console.log(`\n====================================================`);
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log(`====================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runUnitTests().catch(console.error);

