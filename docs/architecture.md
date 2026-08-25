# Student360 AI — Architecture & Engineering Specification

## 1. System Architecture Overview

Student360 AI is an enterprise-grade Student Lifecycle Management and AI Career Intelligence Platform built on a distributed microservices-ready client-server model:

```
[ Next.js 15 App Router Frontend ]
             │  (HTTPS / REST / JSON)
             ▼
[ Express.js + TypeScript Backend ]
             ├── Auth Middleware (JWT + RBAC)
             ├── Zod Input Validation
             ├── Storage Abstraction (Local / S3 / Cloudinary)
             ├── AI Provider Abstraction (Gemini / OpenAI / Deterministic)
             └── Mongoose ODM Layer
                      │
                      ▼
        [ MongoDB Atlas / Replica Cluster ]
```

## 2. Multi-Role Authorization & Security

The platform enforces strict Role-Based Access Control (RBAC):
- `student`: Access only to own profile, academics, attendance, projects, skills, AI interview coach, resume generator.
- `faculty`: Academic entry, attendance logging, student monitoring.
- `mentor`: Assigned student mentoring logs, AI mentor action plans.
- `placement_officer`: Drive management, job postings, candidate shortlisting, placement analytics.
- `recruiter`: Job posting, candidate discovery, viewing authorized public portfolios.
- `admin`: User provisioning, institutional analytics, audit logging.

## 3. File & Document AI Pipeline

1. **Upload**: Client sends multipart `FormData` via `POST /api/upload`.
2. **Multer Inspection**: Validates MIME types (PDF, PNG, JPG, WEBP, DOCX) and enforces a 10MB limit.
3. **Storage**: Saves to `/uploads` with collision-resistant UUIDs or cloud storage provider.
4. **Document AI**: Passes text hint/OCR buffer through `AchievementAIService` / `AICertificateService`.
5. **Human Confirmation**: Returns structured extracted metadata to the user for explicit verification before persisting to MongoDB.
