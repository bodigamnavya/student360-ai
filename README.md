# Student360 AI — AI-Powered Student Lifecycle Management & Digital Portfolio Platform

> **One Student. One Digital Journey. One AI-Powered Career Roadmap.**

Student360 AI is a production-level, full-stack web application that unifies the entire student lifecycle — from admission through graduation — into a single, intelligent, AI-powered platform. It replaces fragmented institutional systems with a centralized ecosystem featuring predictive analytics, skill-gap detection, job matching, ATS resume generation, and a conversational AI career assistant.

---

## 🏗️ Architecture

```
student-lifecycle-management/
├── backend/                    # Express + TypeScript + Mongoose REST API
│   ├── src/
│   │   ├── config/             # Database (MongoDB Memory Server) & env config
│   │   ├── controllers/        # 18 route controllers
│   │   ├── middleware/         # Auth (JWT), error handler, file upload (Multer)
│   │   ├── models/            # 20 Mongoose models with indexes
│   │   ├── routes/            # 19 RESTful route modules
│   │   ├── seeds/             # Realistic seed data (20+ students, 4 departments)
│   │   ├── services/ai/      # 10 deterministic AI intelligence engines
│   │   ├── tests/             # Automated integration test suite
│   │   ├── utils/             # Response helpers, async handler
│   │   └── validators/        # Zod request validation schemas
│   └── package.json
│
├── frontend/                   # Next.js 15 + React 19 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── app/               # 22 Next.js App Router pages
│   │   ├── components/        # Reusable UI & Layout components
│   │   ├── context/           # Auth context with demo account switcher
│   │   ├── lib/               # API client & utility functions
│   │   └── styles/            # Global CSS with design tokens & dark mode
│   └── package.json
│
└── README.md
```

---

## 🎯 Core Features

### 📊 Complete Student Lifecycle (12 Stages)
| Stage | Features |
|---|---|
| **Admission** | Centralized digital identity, roll number, department assignment |
| **Academics** | Semester SGPA/CGPA progression, subject marks, backlog tracking |
| **Attendance** | Subject-wise breakdown, AI shortage prediction, detention risk engine |
| **Mentoring** | Faculty mentor assignment, meeting logs, action items, AI mentor alerts |
| **Projects** | CRUD with AI skill extraction, resume bullet generation, domain tagging |
| **Internships** | Verified industry experience, AI internship recommendations |
| **Certifications** | Upload with AI OCR metadata extraction, credential verification |
| **Achievements** | Hackathons, research papers, competitions, leadership badges |
| **Skills Matrix** | Categorized proficiency benchmarking with project evidence mapping |
| **Placement Prep** | ATS resume builder (4 templates), job matching engine, readiness score |
| **Higher Education** | University shortlisting, application tracker, AI university matching |
| **Graduation** | Final career outcomes, alumni portfolio, verified digital credentials |

### 🧠 AI Intelligence Core (10 Engines)
1. **Career Recommendation Engine** — Multidimensional role suitability ranking
2. **Skill Gap Analyzer** — Industry benchmark comparison with 3-phase learning roadmap
3. **Job Matching Engine** — Real-time eligibility + skill affinity scoring
4. **Student Risk Predictor** — Multi-factor risk (CGPA velocity, attendance, backlogs)
5. **Placement Readiness Index** — Composite score across 6 competency dimensions
6. **ATS Resume Generator** — 4 templates with AI-crafted action-verb impact bullets
7. **Project Analyzer** — Auto skill extraction, domain tagging, resume bullet generation
8. **Certificate Extractor** — OCR/metadata parsing for credential verification
9. **Study Planner** — Personalized GATE/GRE/CAT weekly study schedules
10. **Career Chat Assistant** — Contextual conversational AI with student profile injection

### 👥 Role-Based Access Control (4 Roles)
| Role | Capabilities |
|---|---|
| **Student** | Full lifecycle dashboard, AI career tools, resume builder, portfolio |
| **Faculty / Mentor** | Mentee management, meeting logs, AI risk alerts, academic monitoring |
| **Placement Officer** | Job drive posting, application tracking, cohort analytics, readiness reports |
| **Admin** | Platform-wide analytics, student registry, faculty management, risk monitor |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- No external MongoDB required (embedded in-memory MongoDB auto-starts)

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed      # Seeds 20+ realistic students with full academic data
npm run dev       # Starts Express API on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev       # Starts Next.js on http://localhost:3000
```

### 3. Open in Browser
Navigate to **http://localhost:3000** to access the platform.

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Student** | `student@student360.ai` | `Student@123456` |
| **Faculty** | `faculty@student360.ai` | `Faculty@123456` |
| **Placement Officer** | `placement@student360.ai` | `Placement@123456` |
| **Admin** | `admin@student360.ai` | `Admin@123456` |

> 💡 **1-Click Demo Access**: The login page and landing page include instant role-switching buttons that bypass manual credential entry.

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Express.js** | REST API framework |
| **TypeScript** | Type-safe server code |
| **Mongoose** | MongoDB ODM with schema validation & indexes |
| **mongodb-memory-server** | Zero-config embedded MongoDB (auto-fallback) |
| **JWT + bcryptjs** | Authentication & password hashing |
| **Zod** | Runtime request validation |
| **Helmet** | Security headers |
| **express-rate-limit** | API rate limiting |
| **Multer** | File upload handling |

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI component library |
| **TypeScript** | Type-safe frontend |
| **Tailwind CSS** | Utility-first styling with custom design tokens |
| **Recharts** | Interactive data visualizations |
| **Lucide React** | Modern icon system |
| **React Hook Form + Zod** | Form management & validation |

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new student account |
| POST | `/api/auth/login` | Login with email & password |
| GET | `/api/auth/me` | Get current authenticated user |

### Student Lifecycle
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students/dashboard` | Full student dashboard with KPIs |
| GET/PUT | `/api/students/profile` | Student profile CRUD |
| GET | `/api/students/public/:slug` | Public shareable portfolio |
| GET/POST | `/api/academics` | Academic records & marks |
| GET | `/api/academics/insights` | AI academic analysis |
| GET/POST | `/api/attendance` | Attendance records |
| GET | `/api/attendance/prediction` | AI attendance forecast |
| GET/POST | `/api/mentoring` | Mentoring sessions |
| GET/POST | `/api/projects` | Technical projects |
| POST | `/api/projects/analyze` | AI project skill extraction |
| GET/POST | `/api/internships` | Internship records |
| GET | `/api/internships/recommendations` | AI internship recommendations |
| GET/POST | `/api/certifications` | Certification records |
| POST | `/api/certifications/extract` | AI certificate OCR extraction |
| GET/POST | `/api/achievements` | Achievements CRUD with duplicate detection & analytics |
| POST | `/api/achievements/analyze` | AI multi-step certificate extraction & verification |
| POST | `/api/achievements/upload` | Secure evidence document upload (PDF, JPG, PNG ≤ 10MB) |
| GET/PUT/DEL | `/api/achievements/:id` | Single achievement management |
| POST | `/api/achievements/:id/generate-summary` | AI professional achievement summary generator |
| POST | `/api/achievements/:id/generate-resume-bullet` | ATS resume bullet point generator |
| POST | `/api/achievements/:id/extract-skills` | Demonstrated skill extractor |
| GET/POST | `/api/skills` | Verified skill matrix |

### AI Career Intelligence
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/careers/recommendations` | AI career trajectory analysis |
| GET | `/api/careers/skill-gap?role=X` | Skill gap analysis for target role |
| POST | `/api/careers/chat` | AI career assistant chatbot |
| GET | `/api/jobs` | Active campus job drives |
| POST | `/api/jobs/:id/apply` | Apply with AI profile |

### Placement & Higher Ed
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/placements/analytics` | Cohort placement analytics |
| GET | `/api/placements/readiness` | Individual readiness index |
| POST | `/api/resume/generate` | Generate ATS resume |
| GET/POST | `/api/higher-education` | University application tracker |
| GET | `/api/exams/study-plan?exam=X` | AI competitive exam study plan |

### Administration
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Platform-wide KPIs |
| GET | `/api/admin/students` | Student registry with filters |
| GET | `/api/admin/faculty` | Faculty & mentor list |
| GET | `/api/admin/analytics` | Institutional analytics |

---

## 🎨 Design System

- **Color Palette**: HSL-based tokens with dark/light theme support
- **Typography**: Inter (body) + Outfit (headings) from Google Fonts
- **Components**: Glassmorphism cards, gradient buttons, animated badges
- **Animations**: Fade-in, slide-up, scale transitions, pulse indicators
- **Print Styles**: ATS-optimized resume print layout (`@media print`)

---

## 📦 Database Schema (20 Models)

`User`, `StudentProfile`, `AcademicRecord`, `Attendance`, `MentoringRecord`, `Project`, `Internship`, `Certification`, `Achievement`, `Skill`, `CareerGoal`, `Job`, `JobApplication`, `PlacementRecord`, `HigherEducation`, `CompetitiveExam`, `Resume`, `AIInsight`, `Notification`, `AuditLog`

---

## 🧪 Testing

```bash
cd backend
npm test          # Runs automated test suite (27 tests)
npm run build     # TypeScript compilation check (0 errors)
```

---

## 📄 License

MIT License — Built for educational and institutional use.

---

<p align="center">
  <strong>Student360 AI</strong> — Transforming fragmented student data into intelligent, actionable career intelligence.
</p>
