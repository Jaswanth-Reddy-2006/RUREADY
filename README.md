# R U Ready? — AI-Powered Mock Interview Platform

**R U Ready?** is a production-grade, microservice-architected AI mock interview platform featuring Oral/Voice Interviews, Sandboxed Multi-Language Coding Assessments, AI STAR-method Evaluations, Telemetry Tracking, Payment Subscriptions, and Admin Management.

---

## 🚀 Architecture Overview

The system is decomposed into **8 independent, domain-focused microservices** behind a central **API Gateway**:

```text
                                  ┌───────────────────────────┐
                                  │   React 18 Frontend Client│
                                  └─────────────┬─────────────┘
                                                │ http://localhost:4000/api
                                                ▼
                                  ┌───────────────────────────┐
                                  │    API Gateway (4000)     │
                                  └─────────────┬─────────────┘
                                                │
 ┌─────────────┬──────────────┬─────────────────┼─────────────────┬──────────────┬─────────────┐
 ▼             ▼              ▼                 ▼                 ▼              ▼             ▼
┌────────────┐┌────────────┐┌──────────────┐┌──────────────┐┌────────────┐┌────────────┐┌────────────┐
│ Auth       ││ User       ││ Oral         ││ Coding       ││ AI         ││ Payment    ││ Admin      │
│ Service    ││ Service    ││ Interview    ││ Interview    ││ Analysis   ││ Service    ││ Service    │
│ (4001)     ││ (4005)     ││ Service(4002)││ Service(4006)││ Svc (4003) ││ (4007)     ││ (4008)     │
└────────────┘└────────────┘└──────────────┘└──────────────┘└────────────┘└────────────┘└────────────┘
                                                                 │
                                                                 ▼
                                                          ┌────────────┐
                                                          │ Analytics  │
                                                          │ Svc (4004) │
                                                          └────────────┘
```

| Service | Port | Bounded Context / Responsibility |
| :--- | :---: | :--- |
| **API Gateway** | `4000` | Ingress reverse proxying, CORS policies, rate limiting, request correlation IDs |
| **Auth Service** | `4001` | Candidate registration, login, JWT access/refresh token rotation, auth verification |
| **Oral Interview Service** | `4002` | Oral/voice interview session state, question sequencing, audio answer processing |
| **AI Analysis Service** | `4003` | Socratic LLM evaluations, persona prompts, STAR score math, radar metrics |
| **Result / Analytics Service** | `4004` | Session analysis reports, performance dashboard, eye-contact/speech telemetry |
| **User Service** | `4005` | Candidate user profiles, experience settings, resume file upload & parsing |
| **Coding Interview Service** | `4006` | Problem bank, test case evaluation, multi-language sandbox execution (JS, Python, Java) |
| **Payment Service** | `4007` | Subscription plans, checkout creation, payment verification, order history, webhooks |
| **Admin Service** | `4008` | Platform metrics oversight, candidate management, subscription upgrades, audit logging |

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: `>= 18.0.0`
- **pnpm**: `>= 8.0.0`
- **PostgreSQL**: `v14+` with `pgvector` extension

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Generate Database Clients
```bash
pnpm -r db:generate
```

### 4. Run Development Servers
```bash
pnpm dev
```
The API Gateway will start at `http://localhost:4000`, with frontend running at `http://localhost:5173` or `http://localhost:3000`.

---

## 🧪 Testing & Build Verification

### Typecheck All Workspaces
```bash
pnpm -r typecheck
```

### Build Production Assets
```bash
pnpm build
```

### Run End-to-End Test Suite
```bash
pnpm test:e2e
```

---

## 🐳 Docker Deployment

```bash
docker-compose up --build -d
```

For complete architectural details, see [ARCHITECTURE.md](ARCHITECTURE.md).
