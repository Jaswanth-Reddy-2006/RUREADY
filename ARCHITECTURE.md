# Microservices Architecture: R U Ready? AI Interview Platform

## 1. Architectural Overview

The **R U Ready?** AI Interview Platform is built on a clean, production-oriented **Microservices Architecture**. All client requests enter through a centralized **API Gateway** which handles CORS, rate limiting, and request correlation before proxying requests to downstream domain-focused microservices.

### Microservices Breakdown

1. **API Gateway (`gateway/`) — Port 4000**: Single ingress point for external clients. Handles CORS policies, request correlation IDs (`X-Request-Id`), rate limiting, and path routing.
2. **Auth Microservice (`services/auth-service/`) — Port 4001**: Manages user registration, password hashing, JWT access and refresh token lifecycle, and authentication verification.
3. **Oral Interview Microservice (`services/oral-interview-service/`) — Port 4002**: Handles oral/voice interview flow, question sequencing, audio answer transcript processing, and session state.
4. **AI Analysis Microservice (`services/ai-analysis-service/`) — Port 4003**: Evaluates answer quality, formats Socratic feedback, computes STAR methodology scores, and adapts persona prompts.
5. **Result & Analytics Microservice (`services/analytics-service/`) — Port 4004**: Manages performance dashboards, aggregate statistics, session analysis reports, and real-time telemetry logs.
6. **User Microservice (`services/user-service/`) — Port 4005**: Manages candidate user profiles, experience settings, target roles, and resume file upload parsing.
7. **Coding Interview Microservice (`services/coding-interview-service/`) — Port 4006**: Manages algorithmic problem bank, test case evaluation, code editor state, and multi-language sandbox execution (JavaScript, Python, Java).
8. **Payment Microservice (`services/payment-service/`) — Port 4007**: Manages subscription plans/packages, payment checkout creation, payment verification, order history, provider integrations, and webhooks.
9. **Admin Microservice (`services/admin-service/`) — Port 4008**: Manages system metrics oversight, platform analytics, candidate management, plan upgrades, and audit logs.

---

## 2. Target Architecture Diagram

```
                                  ┌───────────────────────────┐
                                  │   React 18 Frontend Client│
                                  └─────────────┬─────────────┘
                                                │ HTTP REST / SSE (http://localhost:4000/api)
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

---

## 3. Microservices Inventory

| Service | Port | Bounded Context / Responsibility | Owned Database Models |
|---|---|---|---|
| **API Gateway** | `4000` | Ingress reverse proxy, CORS, rate limiting, request correlation tracking | None |
| **Auth Service** | `4001` | Registration, login, password hashing, JWT access/refresh token rotation | `users`, `refresh_tokens` |
| **Oral Interview Service** | `4002` | Voice/oral session lifecycle, question flow, audio transcript answers | `oral_sessions`, `oral_questions`, `oral_chat_history` |
| **AI Analysis Service** | `4003` | Socratic LLM evaluation, STAR score math, radar metrics, prompt engine | `analyses` (AI provider layer) |
| **Result / Analytics Service** | `4004` | Session analysis reports, performance dashboard, eye-contact/speech telemetry | `analyses`, `telemetry_logs` |
| **User Service** | `4005` | User profiles, target roles, experience years, resume parsing & uploads | `user_profiles`, `resumes` |
| **Coding Interview Service** | `4006` | Problem bank, test case evaluation, multi-language sandbox run (JS, Python, Java) | `coding_sessions`, `pre_defined_problems`, `code_execution_deltas` |
| **Payment Service** | `4007` | Pricing plans/packages, checkout sessions, order history, provider verification | `payment_plans`, `orders`, `subscriptions` |
| **Admin Service** | `4008` | System overview metrics, user administration, plan management, audit logs | `audit_logs`, `system_metrics` |

---

## 4. Bounded Context & Database Isolation

Each microservice maintains strict database isolation through dedicated schema definitions. No microservice directly queries or mutates another service's database tables.

- `services/auth-service/src/prisma/schema.prisma`: `users`, `refresh_tokens`
- `services/user-service/src/prisma/schema.prisma`: `user_profiles`, `resumes`
- `services/oral-interview-service/src/prisma/schema.prisma`: `oral_sessions`, `oral_questions`, `oral_chat_history`
- `services/coding-interview-service/src/prisma/schema.prisma`: `coding_sessions`, `pre_defined_problems`, `code_execution_deltas`
- `services/payment-service/src/prisma/schema.prisma`: `payment_plans`, `orders`, `subscriptions`
- `services/analytics-service/src/prisma/schema.prisma`: `analyses`, `telemetry_logs`
- `services/ai-analysis-service/src/prisma/schema.prisma`: `analyses`
- `services/admin-service/src/prisma/schema.prisma`: `audit_logs`, `system_metrics`

---

## 5. Local Development & Deployment

### Start All Services
```bash
pnpm dev
```

### Build All Workspaces
```bash
pnpm build
```

### Run Tests
```bash
pnpm test:e2e
```

### Docker Operations
```bash
docker-compose up --build
```
