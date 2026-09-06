# Test Infrastructure & Methodology — RU Ready AI Interview Platform

## 1. Test Architecture & Philosophy

The RU Ready testing system operates on a **Dual-Track Architecture**:
- **Implementation Track**: Progresses across milestones M1–M5 to implement design tokens, UI primitives, setup workflows, real-time telemetry, and Socratic evaluation.
- **E2E Testing Track**: Operates as an independent, requirement-driven, opaque-box testing harness designed to validate all functional, visual, and behavioral contracts specified in `ORIGINAL_REQUEST.md` and `PROJECT.md`.

### Core Testing Tenets
1. **Opaque-Box Verification**: Tests are derived strictly from specifications and interface contracts, not implementation details or internal variable names.
2. **Authoritative Expected Output**: All expected states, telemetry formulas (WPM, FFT bins, latency), scoring rubrics, and token specifications are derived directly from `PROJECT.md § Interface Contracts` and `ORIGINAL_REQUEST.md § Requirements`.
3. **No Facade Tests**: Every test exercises real state transitions, DOM layouts, mathematical models, boundary conditions, or error recovery boundaries.
4. **Progressive Testability & Isolation**: Every test is self-contained, initializes its own state, handles mocked browser media APIs via `tests/e2e/setup.ts`, and does not rely on execution order.

---

## 2. Feature Inventory Coverage Matrix (21 Features)

| Feature # | Feature Name | Source | Milestone | Primary Scope & Interface Contract | Tier 1 Tests | Tier 2 Tests | Tier 3 & 4 Tests |
|---|---|---|---|---|---|---|---|
| **1** | Montserrat & Outfit Typography | ORIGINAL_REQUEST §R1 | M1 | Google Fonts loading, `font-display: Montserrat`, `font-body: Outfit`, `font-mono: JetBrains Mono` | 5+ | 5+ | Combinations & Scenarios |
| **2** | Obsidian-Dark & Solar-Orange Tokens | ORIGINAL_REQUEST §R1 | M1 | `bg-obsidian-950` (#0A0B0E), `bg-obsidian-900` (#111318), `solar-orange-500` (#FF7A00), glows | 5+ | 5+ | Combinations & Scenarios |
| **3** | Glassmorphic Card Elevations | ORIGINAL_REQUEST §R1 | M1 | Translucent obsidian backgrounds (`rgba(17, 19, 24, 0.7)`), `backdrop-blur-md`, frosted borders | 5+ | 5+ | Combinations & Scenarios |
| **4** | UI Primitives Dark & Accessible | ORIGINAL_REQUEST §R1 | M1 | Button, Card, Input, Badge, Skeleton with `:focus-visible` rings, WCAG 2.2 AA contrast ratios | 5+ | 5+ | Combinations & Scenarios |
| **5** | Responsive Layout Shell & Landmark Fix | ORIGINAL_REQUEST §R1 | M1 | Single `<main>` tag, AppLayout, SidebarNav obsidian dark styling, responsive collapse | 5+ | 5+ | Combinations & Scenarios |
| **6** | Native SVG Radar Chart Component | ORIGINAL_REQUEST §R3 | M1 | Pure SVG polygon generation, normalized 0–100 scale, 5 competency axes, zero external bloat | 5+ | 5+ | Combinations & Scenarios |
| **7** | Landing Page Modernization | ORIGINAL_REQUEST §R1 | M2 | Obsidian dark aesthetic, responsive bento grid, solar-orange hero CTA, feature highlights | 5+ | 5+ | Combinations & Scenarios |
| **8** | Auth Pages Modernization | ORIGINAL_REQUEST §R1 | M2 | Glassmorphic Login & Register cards, solar-orange focus rings, WCAG AA compliance, auth preserve | 5+ | 5+ | Combinations & Scenarios |
| **9** | Analytics Dashboard & Bento Grid | ORIGINAL_REQUEST §R1 | M2 | Metrics bento grid, empty state fallback, historical review, session breakdown cards | 5+ | 5+ | Combinations & Scenarios |
| **10** | Multi-Agent Persona Selection UI | ORIGINAL_REQUEST §R3 | M3 | `HIRING_MANAGER`, `TECHNICAL_ARCHITECT`, `BAR_RAISER` selection, badge accents, rubric cues | 5+ | 5+ | Combinations & Scenarios |
| **11** | Interview Setup Workflow Streamline | ORIGINAL_REQUEST §R2 | M3 | SetupForm & CodingSetupForm role/experience validation, unified routing to `/interview/device-check` | 5+ | 5+ | Combinations & Scenarios |
| **12** | Hardware Device Check Overhaul | ORIGINAL_REQUEST §R2 | M3 | Audio visualizer, camera stream preview, 4K/ultrawide monitor resolution fix | 5+ | 5+ | Combinations & Scenarios |
| **13** | Live Oral Interview Room Modernization | ORIGINAL_REQUEST §R1, R2 | M4 | Obsidian-dark aesthetic, avatar display, speech state transitions, error recovery boundary | 5+ | 5+ | Combinations & Scenarios |
| **14** | Real-Time Sub-300ms Audio Waveform | ORIGINAL_REQUEST §R2 | M4 | Web Audio AnalyserNode (fftSize: 64, smoothing: 0.8), 32-bin frequency array, sub-300ms loop | 5+ | 5+ | Combinations & Scenarios |
| **15** | Live Vocal Pacing & Latency Gauges | ORIGINAL_REQUEST §R2 | M4 | Words Per Minute (Slow <110, Optimal 110–160, Fast >160 WPM), AI response latency gauge (ms) | 5+ | 5+ | Combinations & Scenarios |
| **16** | Coding Room Consolidation & Runner | ORIGINAL_REQUEST §R2, R3 | M4 | Monaco dark theme, code runner integration via `/api/interview/session/:id/run`, console output | 5+ | 5+ | Combinations & Scenarios |
| **17** | Progressive Hint Unlocks | ORIGINAL_REQUEST §R3 | M4 | 3 tiers of hints with -15pts penalty deduction per unlock, rubric guidance tracking | 5+ | 5+ | Combinations & Scenarios |
| **18** | Backend Persona Prompt Adaptations | ORIGINAL_REQUEST §R3 | M5 | Prompt adaptations parsing `[Persona: ...]` tags, Socratic interrogation styles | 5+ | 5+ | Combinations & Scenarios |
| **19** | Uninflated STAR Scoring Breakdown UI | ORIGINAL_REQUEST §R3 | M5 | Situation, Task, Action specificity, Measurable Impact metric cards with actionable advice | 5+ | 5+ | Combinations & Scenarios |
| **20** | Analysis Report Competency Radar & Visuals | ORIGINAL_REQUEST §R1, R3 | M5 | SVG Radar Chart rendering, corporate benchmark badges (Google L4, Meta SDE2, Amazon SDE1) | 5+ | 5+ | Combinations & Scenarios |
| **21** | Full End-to-End Test Suite Verification | ORIGINAL_REQUEST §Acceptance | M6 | 100% test pass verification across all tiers, test execution stability, zero failures | 5+ | 5+ | Combinations & Scenarios |

---

## 3. Test Methodology Across Tiers

### Tier 1: Feature Coverage (≥5 Tests Per Feature = ≥105 Test Cases)
Validates primary happy path functionality, DOM elements, contracts, and core operations for each of the 21 features in isolation.

### Tier 2: Boundary & Corner Cases (≥5 Tests Per Feature = ≥105 Test Cases)
Probes edge cases, empty states, boundary values, extreme inputs, audio dropouts, ultrawide viewports, malformed payloads, rate limits, and network errors.

### Tier 3: Cross-Feature Combinations (Pairwise Subsystem Integrations)
Validates interactions across dependent feature pairs:
1. **Design Tokens & UI Primitives**: Typography + obsidian/solar tokens + glassmorphic UI primitives.
2. **Setup, Persona & Pre-flight**: SetupForm selection + Persona tag passing + DeviceCheck pre-flight validation.
3. **Live Telemetry & Room State**: Sub-300ms Audio Waveform + Vocal Pacing meter + Latency gauge in Interview Room.
4. **Coding Environment & Progressive Hints**: Monaco Dark Editor + Code Runner execution + Hint unlocks with -15pts penalty.
5. **Backend Persona Prompting & STAR Scoring Visuals**: Socratic persona directives + uninflated STAR evaluation + SVG Radar Chart rendering.

### Tier 4: Real-World Application Scenarios (Complete End-to-End Flows)
Simulates end-to-end user journeys from arrival to completion:
1. **Scenario 1 (New User Oral Onboarding & Evaluation)**: Register -> Setup Oral Behavioral (Hiring Manager) -> Device Check -> Live Room with Telemetry -> Socratic Evaluation & STAR Report.
2. **Scenario 2 (Experienced Candidate Coding Challenge)**: Technical Architect session -> Ultrawide 4K Device Check -> Monaco Dark coding -> Run execution -> Hint unlock penalty (-15pts) -> Corporate benchmark comparison (Meta SDE2).
3. **Scenario 3 (Bar Raiser Stress & Pacing Session)**: Bar Raiser persona -> Rapid/hesitant response pacing -> High latency handling -> Uninflated strict grading.
4. **Scenario 4 (Hardware Failure & Error Recovery)**: Microphone permission denied -> Error boundary trigger -> Stream re-acquisition -> Session continuity.
5. **Scenario 5 (Cross-Platform Viewport & Analytics Review)**: Ultrawide / mobile viewport switching -> Bento grid metrics inspection -> Past session history review.

---

## 4. Test Runner & Execution Guide

### Runner Command
```bash
# Run the complete E2E test suite
pnpm test:e2e

# Run with verbose reporting
pnpm test:e2e --reporter=verbose

# Run a specific tier
npx vitest run tests/e2e/tier1-features/ --config vitest.e2e.config.ts
npx vitest run tests/e2e/tier2-boundaries/ --config vitest.e2e.config.ts
npx vitest run tests/e2e/tier3-combinations/ --config vitest.e2e.config.ts
npx vitest run tests/e2e/tier4-scenarios/ --config vitest.e2e.config.ts
```

### Configuration Details
- **Runner**: Vitest 2.1.x
- **Config File**: `vitest.e2e.config.ts`
- **DOM Environment**: `happy-dom` with browser API mocks (`tests/e2e/setup.ts`)
- **Module Resolution**: `@/` maps to `client/src/`, `@ru-ready/shared` maps to `packages/shared/src/types/index.ts`
