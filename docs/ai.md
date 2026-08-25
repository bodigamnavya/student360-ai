# Student360 AI — AI Architecture & Engineering Specification

## 1. Provider Abstraction Architecture
The platform is designed with an interchangeable provider abstraction ([`AIProviderService`](file:///c:/Users/navya/OneDrive/Documents/Desktop/student%20lifecycle%20management/backend/src/ai/provider.service.ts)) that supports:
- **Google Gemini** (`gemini-1.5-flash`)
- **OpenAI** (`gpt-4o-mini`)
- **Deterministic High-Precision Computational Engine** (runs offline / without API keys)

```
[ AI Controller / Route ]
           │
           ▼
[ AI Provider Abstraction ] ─── (AI_PROVIDER=gemini) ───► Google Gemini API
           │
           ├── (AI_PROVIDER=openai) ───► OpenAI API
           │
           └── (Fallback / Offline) ──► Deterministic Rule & Formula Engine
```

## 2. Deterministic vs Generative AI Boundaries

| Dimension | Method | Responsibility |
|---|---|---|
| **Student 360 Score** | Deterministic Formula | 8-dimension weighted calculation (0–100) |
| **Attendance Forecasting** | Mathematical Formula | Exact class counts needed for 75% threshold |
| **Academic Risk Level** | Multi-Factor Analysis | CGPA velocity, backlogs, attendance heuristics |
| **Interview Coaching** | LLM + Benchmark Matrix | Answer evaluation across 5 criteria & sample answers |
| **Career Chatbot** | Profile Injected LLM | Contextual advice using student's own verified metrics |
| **Document Extraction** | OCR Pattern Parser | Metadata, credential IDs, demonstrated skill tags |

## 3. Security & Privacy Safeguards
- **Zero Cross-Student Exposure**: Prompts only receive the authenticated user's private data.
- **Human-in-the-Loop**: All AI-extracted certifications/achievements must be verified and confirmed by the student before saving to MongoDB.
- **No Hallucinated Credentials**: The system does not invent skills or certificates the student does not have.
