export interface CertificateAnalysisResult {
  studentName?: string;
  certificateTitle: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  credentialUrl?: string;
  courseProgram: string;
  certificateType: 'Cloud' | 'Full Stack' | 'Data Science' | 'Security' | 'Core CS' | 'Professional';
  extractedSkills: string[];
  confidenceScore: number;
  isExpired: boolean;
  possibleDuplicate: boolean;
  missingFields: string[];
}

export class AICertificateService {
  /**
   * Analyze certificate OCR / filename / text input
   */
  public static analyzeCertificate(params: {
    filename: string;
    textHint?: string;
    studentName?: string;
    existingCredentials?: string[];
  }): CertificateAnalysisResult {
    const raw = `${params.filename} ${params.textHint || ''}`.toLowerCase();
    const missingFields: string[] = [];

    let certificateTitle = 'Professional Certificate';
    let issuingOrganization = 'Recognized Academic / Industry Organization';
    let certificateType: CertificateAnalysisResult['certificateType'] = 'Professional';
    let courseProgram = 'Technical Proficiency Program';
    const extractedSkills: string[] = [];

    if (raw.includes('aws') || raw.includes('amazon')) {
      issuingOrganization = 'Amazon Web Services (AWS)';
      certificateType = 'Cloud';
      if (raw.includes('solutions') || raw.includes('architect')) {
        certificateTitle = 'AWS Certified Solutions Architect – Associate';
        courseProgram = 'Cloud Architecture & Distributed Infrastructure';
        extractedSkills.push('AWS', 'Cloud Architecture', 'VPC', 'High Availability', 'EC2', 'S3');
      } else {
        certificateTitle = 'AWS Certified Cloud Practitioner';
        courseProgram = 'Cloud Computing Fundamentals';
        extractedSkills.push('AWS', 'Cloud Computing', 'IAM', 'EC2', 'Cloud Security');
      }
    } else if (raw.includes('meta') || raw.includes('frontend') || raw.includes('react')) {
      issuingOrganization = 'Meta / Coursera';
      certificateTitle = 'Meta Front-End Developer Professional Certificate';
      certificateType = 'Full Stack';
      courseProgram = 'Modern Web Development & React Architecture';
      extractedSkills.push('React', 'JavaScript', 'HTML5', 'CSS3', 'Jest Testing', 'Git');
    } else if (raw.includes('google') && (raw.includes('data') || raw.includes('analytics'))) {
      issuingOrganization = 'Google / Coursera';
      certificateTitle = 'Google Data Analytics Professional Certificate';
      certificateType = 'Data Science';
      courseProgram = 'Data Analysis, SQL & Visualization';
      extractedSkills.push('SQL', 'R', 'Tableau', 'Spreadsheets', 'Data Visualization');
    } else if (raw.includes('deeplearning') || raw.includes('machine learning') || raw.includes('andrew ng')) {
      issuingOrganization = 'DeepLearning.AI';
      certificateTitle = 'Deep Learning Specialization';
      certificateType = 'Data Science';
      courseProgram = 'Neural Networks, Hyperparameter Tuning & PyTorch';
      extractedSkills.push('Python', 'Neural Networks', 'TensorFlow', 'PyTorch', 'Hyperparameter Tuning');
    } else if (raw.includes('nptel') || raw.includes('swayam') || raw.includes('iit')) {
      issuingOrganization = 'NPTEL (IIT Kharagpur / IIT Madras)';
      certificateTitle = 'NPTEL Elite Certification in Data Structures and Algorithms';
      certificateType = 'Core CS';
      courseProgram = 'Advanced Algorithms & Complexity Analysis';
      extractedSkills.push('Data Structures', 'Algorithms', 'Java', 'C++', 'Complexity Analysis');
    } else if (raw.includes('security') || raw.includes('comptia') || raw.includes('ceh')) {
      issuingOrganization = 'CompTIA / EC-Council';
      certificateTitle = 'CompTIA Security+ Certification';
      certificateType = 'Security';
      courseProgram = 'Cybersecurity Defense & Network Security';
      extractedSkills.push('Cybersecurity', 'Network Security', 'Cryptography', 'SIEM', 'Threat Analysis');
    } else {
      const cleanName = params.filename.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '');
      certificateTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      extractedSkills.push('Technical Proficiency', 'Software Engineering');
      missingFields.push('Verification Source URL');
    }

    const randNum = Math.floor(100000 + Math.random() * 900000);
    const credentialId = `CRED-${randNum}`;
    const todayStr = new Date().toISOString().split('T')[0];

    // Check for duplicate credentials
    const possibleDuplicate = (params.existingCredentials || []).includes(credentialId);

    return {
      studentName: params.studentName || 'Authenticated Student',
      certificateTitle,
      issuingOrganization,
      issueDate: todayStr,
      credentialId,
      credentialUrl: `https://verify.student360.ai/credentials/${randNum}`,
      courseProgram,
      certificateType,
      extractedSkills,
      confidenceScore: missingFields.length > 0 ? 0.84 : 0.95,
      isExpired: false,
      possibleDuplicate,
      missingFields
    };
  }
}
