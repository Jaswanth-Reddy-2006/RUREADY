# R U Ready? — Complete Platform Build Prompt
**AI-Powered Mock Interview Platform | Full-Stack Specification**

---

## 0. Project Identity

**Brand name:** R U Ready?  
**Tagline:** "Your interview. Perfected."  
**Logo concept:** Bold blocky wordmark — "R U" stacked on "READY?" with a question mark styled as a microphone stand. Primary color: `#F5A623` (warm amber-orange). The "?" doubles as a readiness indicator that pulses when AI is thinking.  
**Primary palette:** Amber `#F5A623`, Deep Orange `#E85D24`, near-black `#1A1A1A`, off-white `#FAF8F4`  
**Accent:** Warm red `#D93025` for urgency/errors, Teal `#00897B` for success/pass states  
**Typography:** Display — `Bricolage Grotesque` (bold, editorial feel); Body — `DM Sans`; Code/labels — `JetBrains Mono`  
**Feel:** Confident, direct, high-contrast. Like a prep coach, not a chatbot.

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS 3 (custom config with brand tokens) |
| State | Zustand (global) + React Query (server state) |
| Routing | React Router v6 |
| Backend | Node.js + Express + TypeScript |
| ORM | Prisma |
| Database | PostgreSQL 15 |
| Auth | JWT (access + refresh token pattern) with bcrypt |
| File Storage | AWS S3 (or MinIO for local dev) |
| Cache | Redis (sessions, rate limiting, partial AI state) |
| AI Integration | Your custom AI tool via REST API |
| Vector Store | pgvector extension on Postgres (for resume embeddings) |
| Queue | Bull (Redis-backed) for async AI jobs |
| Emails | Nodemailer (optional, for reports) |

---

## 2. Project Directory Structure

```
ru-ready/
├── apps/
│   ├── web/                        # React frontend
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── Landing.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   ├── interview/
│   │   │   │   │   ├── SetupForm.tsx      # Interview configuration
│   │   │   │   │   ├── InterviewRoom.tsx  # Live Q&A interface
│   │   │   │   │   └── Complete.tsx       # Post-interview summary
│   │   │   │   └── analysis/
│   │   │   │       ├── Dashboard.tsx      # Analysis home
│   │   │   │       └── SessionDetail.tsx  # Single session deep-dive
│   │   │   ├── components/
│   │   │   │   ├── ui/               # Button, Input, Card, Badge, etc.
│   │   │   │   ├── interview/        # QuestionCard, AnswerInput, Progress
│   │   │   │   └── analysis/         # ScoreRing, TipCard, Timeline
│   │   │   ├── hooks/                # useInterview, useAuth, useAnalysis
│   │   │   ├── store/                # Zustand slices
│   │   │   ├── api/                  # Axios instances + typed API calls
│   │   │   └── types/                # Shared TS types
│   └── api/                        # Express backend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── auth.routes.ts
│       │   │   ├── interview.routes.ts
│       │   │   ├── analysis.routes.ts
│       │   │   └── upload.routes.ts
│       │   ├── controllers/
│       │   ├── services/
│       │   │   ├── ai.service.ts       # Bridge to your AI tool
│       │   │   ├── resume.service.ts   # Parse + embed resume
│       │   │   ├── interview.service.ts
│       │   │   └── analysis.service.ts
│       │   ├── middleware/
│       │   │   ├── auth.middleware.ts
│       │   │   ├── rateLimit.middleware.ts
│       │   │   └── upload.middleware.ts
│       │   ├── jobs/                   # Bull queue workers
│       │   │   ├── generateQuestions.job.ts
│       │   │   └── analyzeSession.job.ts
│       │   └── prisma/
│       │       └── schema.prisma
├── packages/
│   └── shared/                     # Shared types between web + api
└── docker-compose.yml
```

---

## 3. Database Schema (Prisma)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgvector(map: "vector")]
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  sessions      InterviewSession[]
  resumes       Resume[]
}

model Resume {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  fileName      String
  s3Key         String
  parsedText    String?   // Raw extracted text
  embedding     Unsupported("vector(1536)")?  // pgvector
  skills        String[]  // Extracted skills array
  experience    Json?     // Structured work experience
  uploadedAt    DateTime  @default(now())

  sessions      InterviewSession[]
}

model InterviewSession {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  resumeId        String?
  resume          Resume?   @relation(fields: [resumeId], references: [id])

  // Setup form fields
  interviewType   InterviewType     // INTERNSHIP | JOB | PROMOTION | PRACTICE
  targetRole      String
  targetCompany   String?
  industry        String
  experienceLevel ExperienceLevel   // FRESHER | MID | SENIOR
  focusAreas      String[]          // e.g. ["DSA", "System Design", "Behavioural"]
  interviewGoal   String?           // What user wants to improve
  durationMins    Int               @default(20)

  // State management
  status          SessionStatus     // SETUP | IN_PROGRESS | COMPLETED | ANALYSED
  startedAt       DateTime?
  completedAt     DateTime?
  createdAt       DateTime          @default(now())

  questions       Question[]
  analysis        Analysis?
}

model Question {
  id              String    @id @default(cuid())
  sessionId       String
  session         InterviewSession @relation(fields: [sessionId], references: [id])
  
  orderIndex      Int               // Question number in sequence
  questionText    String
  questionType    QuestionType      // TECHNICAL | BEHAVIOURAL | SITUATIONAL | RESUME_BASED
  difficulty      Difficulty        // EASY | MEDIUM | HARD
  
  // User's answer
  answerText      String?
  answeredAt      DateTime?
  timeTakenSecs   Int?

  // AI evaluation of this answer (set after interview)
  evalScore       Int?              // 0-100
  evalFeedback    String?
  evalStrengths   String[]
  evalWeaknesses  String[]
  betterAnswer    String?           // AI's ideal answer example
}

model Analysis {
  id                String    @id @default(cuid())
  sessionId         String    @unique
  session           InterviewSession @relation(fields: [sessionId], references: [id])

  // Overall scores (0-100, no inflation)
  overallScore      Int
  communicationScore Int
  technicalScore    Int
  confidenceScore   Int
  structureScore    Int           // STAR method / coherence

  // Qualitative
  summary           String        // 2-3 sentence honest summary
  strengths         String[]      // Top 3 things done well
  improvements      String[]      // Top 3 honest areas to improve
  actionableTips    Json          // Array of { tip, reason, resource? }
  readinessVerdict  ReadinessVerdict  // NOT_READY | ALMOST_READY | READY | STRONG

  createdAt         DateTime @default(now())
}

// Enums
enum InterviewType {
  INTERNSHIP
  JOB
  PROMOTION
  PRACTICE
}

enum ExperienceLevel {
  FRESHER
  MID
  SENIOR
}

enum SessionStatus {
  SETUP
  IN_PROGRESS
  COMPLETED
  ANALYSED
}

enum QuestionType {
  TECHNICAL
  BEHAVIOURAL
  SITUATIONAL
  RESUME_BASED
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
}

enum ReadinessVerdict {
  NOT_READY
  ALMOST_READY
  READY
  STRONG
}
```

---

## 4. API Endpoints

### Auth (`/api/auth`)
```
POST /register          → { name, email, password } → JWT pair
POST /login             → { email, password } → JWT pair
POST /refresh           → { refreshToken } → new access token
POST /logout            → invalidate refresh token
```

### Interview (`/api/interview`)
```
POST /session           → Create session with setup form data
GET  /session/:id       → Get session + questions
POST /session/:id/start → Mark as IN_PROGRESS, trigger Q generation
POST /session/:id/answer → Submit answer to current question { questionId, answerText, timeTaken }
GET  /session/:id/next  → Get next question (AI may adapt based on prior answer)
POST /session/:id/complete → Mark done, trigger analysis job
GET  /sessions          → List user's past sessions
```

### Upload (`/api/upload`)
```
POST /resume            → Multipart form, returns resumeId
GET  /resume/:id        → Get parsed resume data
```

### Analysis (`/api/analysis`)
```
GET /session/:id        → Full analysis for a session
GET /history            → Aggregated scores over time
GET /compare            → Compare two sessions
```

---

## 5. UI/UX Specification

### Global Design Language
- **Background:** `#FAF8F4` (warm off-white, not pure white)
- **Cards:** White `#FFFFFF` with `1px solid #E8E4DC`, `border-radius: 16px`, subtle `box-shadow: 0 2px 12px rgba(0,0,0,0.06)`
- **Primary button:** `background: #F5A623`, `color: #1A1A1A`, `font-weight: 700`, hover darken 8%
- **Danger/alert:** `#D93025`
- **Success:** `#00897B`
- **Typography:** Bricolage Grotesque for all headings (H1–H3), DM Sans for body
- **Motion:** Framer Motion for page transitions (slide-up, 300ms ease-out). Skeleton loaders for AI wait states. No spinner — always show skeleton content.
- **Micro-interactions:** Question cards slide in from right. Score ring animates from 0 on mount. Correct answers flash teal. Low scores flash amber (never shame red for minor issues).

### Page-by-Page Spec

#### `Landing.tsx`
- Full-screen hero: Bold headline "Stop Guessing. Start Interviewing." on amber-to-orange gradient band
- Sub-headline: "AI-powered mock interviews with brutally honest feedback."
- Two CTAs: "Start Free Interview" (primary amber) + "See How It Works" (ghost)
- Features section: 3 cards — Mock Interview, Smart Analysis, Personalized Improvement
- How it works: 3-step visual flow (Setup → Interview → Analyse)
- Social proof placeholder: "Trusted by 1000+ candidates" (add real data later)
- Footer: minimal, dark background

#### `Login.tsx` / `Register.tsx`
- Split layout: left = brand panel (amber bg, logo, tagline, one motivational quote from famous interviewer)
- Right = clean form, center-aligned
- Register fields: Name, Email, Password, Confirm Password
- Login fields: Email, Password + "Forgot password?" link
- Both: social-proof micro-copy under submit button: "Join 10,000+ candidates already preparing"

#### `SetupForm.tsx` — Interview Configuration
This is a multi-step form (4 steps, progress indicator at top):

**Step 1 — What kind of interview?**
- Large icon-card selectors (not dropdowns): Internship / Full-time Job / Promotion / Just Practicing
- Each card has icon, label, sub-label ("Your first role", "Level up", etc.)

**Step 2 — About the role**
- Target Role (text input with autocomplete suggestions)
- Target Company (optional text input)
- Industry (select: Tech / Finance / Marketing / Healthcare / Other)
- Experience Level (radio: Fresher / Mid-level / Senior)

**Step 3 — Focus areas**
- Multi-select pill tags: DSA, System Design, Behavioural, Communication, Leadership, Domain Knowledge, HR Questions, Case Studies
- Interview duration slider: 10 / 20 / 30 / 45 minutes
- What do you want to improve? (optional free text, 200 chars)

**Step 4 — Resume (Optional)**
- Drag-and-drop upload zone (PDF/DOCX, max 5MB)
- "Skip for now" clearly visible
- If uploaded: show parsed skills as tags, confirm accuracy
- CTA: "Generate My Interview →"

#### `InterviewRoom.tsx` — Live Interview
- Dark-ish mode recommended here (charcoal `#1E1E1E` background, warm text)
- Top bar: session title, question counter ("Question 3 of 8"), timer (counts up per question)
- Center: Question card — large, prominent. Soft amber left-border accent. Question type badge (Technical / Behavioural).
- Answer area: Large textarea, placeholder "Take your time. Write your full answer here."
- Buttons: "Submit Answer" (primary) + "Skip" (ghost, subtle)
- Right sidebar (collapsible on mobile): Interview context recap — role, company, focus areas
- AI "thinking" state: After submit, show skeleton + "Reviewing your answer..." before next question loads
- Progress bar at bottom

**Key UX principle:** Questions are delivered one at a time. User cannot go back. This mimics real interviews.

#### `Complete.tsx`
- Celebrate completion: Brief animation ("Interview Complete!")
- Summary stats: X questions answered, total time taken
- CTA: "View Your Analysis →" (primary) + "Dashboard" (secondary)

#### `Analysis/Dashboard.tsx`
- Top: "Your Interview Score" — large circular score ring (e.g. 68/100) with color-coded band (0-40 red, 41-65 amber, 66-80 teal, 81-100 green)
- **Readiness verdict badge** — bold, honest: "ALMOST READY", "NOT READY", "READY", "STRONG" — no sugarcoating
- 4 sub-scores in horizontal cards: Communication / Technical / Confidence / Structure
- Strengths (3 bullet points, teal icons)
- Areas to improve (3 bullet points, amber icons — NOT red, not shame)
- Actionable tips: expandable tip cards with specific advice ("Use the STAR framework for behavioural answers — your responses lack a clear Result/Outcome.")
- Question-by-question breakdown: Accordion list showing each Q, your answer snippet, score, and better answer toggle
- Bottom: "Practice Again" CTA + "Share Report" (PDF export)

---

## 6. AI Integration Architecture

Your AI tool sits behind a service abstraction layer. The backend never talks to it directly from routes — always through `ai.service.ts`.

### Prompt Chains

**Chain 1 — Question Generation**
```
Input: {
  interviewType, targetRole, targetCompany, industry,
  experienceLevel, focusAreas, durationMins,
  resumeText (if uploaded), previousQA (array of prior Q+A in session)
}

System prompt:
"You are an expert technical interviewer at a top-tier company. 
Generate the next interview question for this candidate.
- Match difficulty to experience level
- If resume is provided, ask at least 2 resume-specific questions
- Vary between TECHNICAL, BEHAVIOURAL, SITUATIONAL types
- If the candidate's last answer was weak, probe deeper on that topic
- Return JSON: { questionText, questionType, difficulty, rationale }"
```

**Chain 2 — Answer Evaluation** (runs after interview completion, in Bull job)
```
Input per question: {
  questionText, questionType, answerText, role, level, resumeContext
}

System prompt:
"You are a strict but fair interview coach. Evaluate this answer honestly.
Do NOT inflate scores. A mediocre answer is 40-60. A strong answer is 75-85.
Only truly exceptional answers get 90+.
Return JSON: {
  score (0-100),
  feedback (2-3 sentences, direct),
  strengths: string[],
  weaknesses: string[],
  betterAnswer (what a 90+ answer would look like)
}"
```

**Chain 3 — Session Analysis** (runs after all question evals)
```
Input: { allQA with scores, interviewType, role, overallGoal }

System prompt:
"Synthesise this complete interview performance into an honest report.
No flattery. No empty encouragement. Be a coach, not a cheerleader.
Return JSON: {
  overallScore,
  communicationScore,
  technicalScore,
  confidenceScore,
  structureScore,
  summary,
  strengths: string[3],
  improvements: string[3],
  actionableTips: Array<{tip, reason}>,
  readinessVerdict: NOT_READY|ALMOST_READY|READY|STRONG
}"
```

### Fine-tuning Feedback Loop
After each completed session, store Q+A pairs with scores in a structured format:
```json
{
  "role": "SDE-2",
  "level": "MID",
  "question": "...",
  "answer": "...",
  "humanScore": null,
  "aiScore": 72,
  "flaggedForReview": false
}
```
These become training examples for your model. Over time, domain-specific scoring becomes more accurate per industry/role/level.

---

## 7. Security & Non-functionals

- **Auth:** JWT access token (15min TTL) + refresh token (7d, stored httpOnly cookie). Rotate refresh on use.
- **Rate limiting:** Redis-backed, per-user: 5 interview starts/day, 100 API calls/minute
- **File validation:** Mime-type check + virus scan stub on upload. Max 5MB. Only PDF/DOCX.
- **Input sanitization:** All user text sanitized before being passed to AI prompts (strip prompt injection attempts)
- **CORS:** Strict origin allowlist
- **Env secrets:** Never in code. Use dotenv locally, secret manager in prod.
- **Error handling:** Never expose stack traces to client. Structured error responses: `{ code, message, requestId }`

---

## 8. Implementation Phases

### Phase 1 — Foundation (Week 1-2)
- [ ] Monorepo setup (pnpm workspaces or Turborepo)
- [ ] PostgreSQL + Prisma schema + migrations
- [ ] Express server skeleton with auth routes
- [ ] React app scaffold with routing
- [ ] Landing, Login, Register pages (full UI)
- [ ] JWT auth flow end-to-end

### Phase 2 — Core Interview Flow (Week 3-4)
- [ ] SetupForm multi-step (no AI yet, save to DB)
- [ ] Resume upload → S3 + parsing
- [ ] AI service abstraction + question generation chain
- [ ] InterviewRoom UI + answer submission
- [ ] Session state management

### Phase 3 — Analysis (Week 5)
- [ ] Bull queue for post-interview analysis jobs
- [ ] Answer evaluation chain (per question)
- [ ] Session analysis chain (aggregate)
- [ ] Analysis dashboard UI
- [ ] Score rings, breakdowns, tip cards

### Phase 4 — Polish & Loop (Week 6)
- [ ] Fine-tune data pipeline setup
- [ ] PDF report export
- [ ] Session history + comparison
- [ ] Performance optimization (React Query caching, lazy loading)
- [ ] Mobile responsiveness audit

---

## 9. Environment Variables

```env
# Backend
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379
JWT_SECRET=...
JWT_REFRESH_SECRET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=ru-ready-resumes
YOUR_AI_API_KEY=...
YOUR_AI_API_BASE_URL=https://your-ai-tool.com/api

# Frontend
VITE_API_BASE_URL=http://localhost:4000/api
```

---

## 10. Key Design Decisions & Rationale

| Decision | Rationale |
|---|---|
| Questions delivered one at a time | Mimics real interview pressure, prevents cherry-picking |
| No back-navigation in interview | Forces commitment like a real interview |
| Scores without inflation (40-60 = mediocre) | Builds real self-awareness, not false confidence |
| Resume parsing is optional | Reduces friction; many users want to practice without uploading |
| Bull queue for analysis | AI evaluation is slow (5-15s/question); async prevents timeout |
| pgvector for embeddings | Keeps everything in Postgres; avoids separate vector DB infra early on |
| Redis for session state | Interview room needs low-latency reads; DB queries would feel laggy |
| Readiness verdict over percentage | "ALMOST READY" is more actionable than "67/100" for most users |

---

*Build this one phase at a time. Phase 1 should be deployable and usable without AI. The AI layer plugs in cleanly at Phase 2.*
