# Student360 AI — API Documentation

## Base URL
- **Local**: `http://localhost:5000/api`
- **Health Check**: `GET http://localhost:5000/api/health`

## Key API Endpoints

### 1. Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a student/user
- `POST /api/auth/login` — Login with credentials (returns access & refresh tokens)
- `POST /api/auth/logout` — Logout user
- `POST /api/auth/forgot-password` — Password reset request
- `GET /api/auth/me` — Retrieve current authenticated user session

### 2. Student & Portfolio (`/api/students`, `/api/portfolio`)
- `GET /api/students/dashboard` — Aggregated dashboard telemetry & AI scores
- `GET /api/students/profile` — Full student profile with mentoring info
- `PUT /api/students/profile` — Update student profile
- `GET /api/students/portfolio/:slug` — Public digital portfolio

### 3. AI Endpoints (`/api/ai`)
- `POST /api/ai/student-score` — 8-dimension Student360 score calculation
- `POST /api/ai/career-recommendation` — 7-role career pathway suitability
- `POST /api/ai/skill-gap` — Target role gap analysis
- `POST /api/ai/learning-roadmap` — Personalized learning milestones
- `POST /api/ai/weekly-plan` — Sprint action plan
- `POST /api/ai/project-analysis` — Complexity and bullet generation
- `POST /api/ai/certificate-analysis` — Certificate credential parsing
- `POST /api/ai/achievement-analysis` — Achievement extraction & deduplication
- `POST /api/ai/job-match` — Job description match score
- `POST /api/ai/placement-readiness` — Placement readiness calculation
- `POST /api/ai/resume-generation` — ATS resume draft
- `POST /api/ai/resume-optimize` — Job description keyword alignment
- `POST /api/ai/interview/start` — Start mock interview session
- `POST /api/ai/interview/answer` — Evaluate answer
- `POST /api/ai/interview/report` — Final interview performance report
- `POST /api/ai/chat` — Context-aware career chatbot
- `POST /api/ai/academic-insights` — Academic trends and guidance
- `POST /api/ai/attendance-insights` — Attendance compliance calculation
- `POST /api/ai/mentor-insights` — Faculty mentoring evaluation
- `POST /api/ai/risk-analysis` — Multi-factor student risk analysis
