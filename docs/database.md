# Student360 AI — Database Schema & Data Models

## MongoDB Collections

| Collection | Model Name | Primary Indexes | Key Responsibilities |
|---|---|---|---|
| `users` | `User` | `email` (unique), `role` | Authentication, credentials, role permissions |
| `studentprofiles` | `StudentProfile` | `user`, `rollNumber`, `publicSlug` | Core academic metrics, CGPA, placement readiness, risk |
| `academicrecords` | `AcademicRecord` | `student`, `semester` | SGPA, CGPA velocity, backlogs, subject grades |
| `attendances` | `Attendance` | `student`, `semester` | Subject hours, percentage, monthly trends, warnings |
| `mentoringrecords` | `MentoringRecord` | `student`, `mentor` | Mentorship sessions, student concerns, action items |
| `projects` | `Project` | `student`, `createdAt` | Engineering repositories, tech stacks, AI bullets |
| `internships` | `Internship` | `student`, `startDate` | Industry experience, roles, verification |
| `certifications` | `Certification` | `student`, `issueDate` | Professional credentials, verification links |
| `achievements` | `Achievement` | `student`, `documentHash` | Hackathons, awards, AI OCR data, deduplication |
| `skills` | `Skill` | `student`, `name` | Technical & soft skills matrix, proficiencies |
| `careergoals` | `CareerGoal` | `student` | Target roles, timeline, dream companies |
| `jobs` | `Job` | `company`, `deadline` | Opportunities, required qualifications, packages |
| `jobapplications` | `JobApplication` | `student`, `job` | Applications, match scores, review workflow |
| `placementrecords` | `PlacementRecord` | `student`, `package` | Verified campus placement offers |
| `highereducations` | `HigherEducation` | `student`, `degree` | Masters/PhD university targets and SOP tracker |
| `competitiveexams` | `CompetitiveExam` | `student`, `examType` | GATE, GRE, CAT, IELTS study schedules |
| `resumes` | `Resume` | `student`, `targetRole` | ATS-formatted resume versions |
| `weeklyactionplans` | `WeeklyActionPlan` | `student`, `year`, `weekNumber` | Weekly sprint tasks and completion rates |
| `learningroadmaps` | `LearningRoadmapRecord`| `student`, `targetRole` | Month-by-month technical milestones |
| `interviewsessions` | `InterviewSession` | `student`, `createdAt` | AI Mock interview Q&A logs and scores |
| `chatsessions` | `ChatSession` | `student`, `updatedAt` | AI Career Chatbot message history |
| `auditlogs` | `AuditLog` | `user`, `action`, `createdAt` | Security and administrative audit trail |
