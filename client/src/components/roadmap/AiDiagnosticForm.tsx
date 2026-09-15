import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Compass, Target, Clock, GraduationCap, Building2, 
  CheckCircle2, ArrowRight, ArrowLeft, Cpu, ShieldCheck, Flame, BookOpen
} from 'lucide-react';
import { Roadmap, RoadmapNode, useRoadmapStore } from '../../store/useRoadmapStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface AiDiagnosticFormProps {
  onGenerate: (roadmap: Roadmap) => void;
  onCancel?: () => void;
}

const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'Python', 'Go', 'Java', 'C++',
  'React', 'Node.js', 'Express', 'Next.js', 'SQL', 'PostgreSQL',
  'MongoDB', 'Redis', 'Docker', 'Git', 'Linux'
];

const BLINDSPOTS = [
  'System Design & Distributed Scaling',
  'Database Indexing & Query Optimization',
  'Concurrency, Race Conditions & Thread Pools',
  'Oral Socratic Defense & Explaining Trade-offs',
  'Low-Level Memory Allocation & Garbage Collection',
  'Production CI/CD, Observability & Dockerizing'
];

export default function AiDiagnosticForm({ onGenerate, onCancel }: AiDiagnosticFormProps) {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisProgress, setSynthesisProgress] = useState(0);

  // Form Responses
  const [studentPersona, setStudentPersona] = useState('3rd / 4th Year Placement Crunch');
  const [timelineWeeks, setTimelineWeeks] = useState(12);
  const [weeklyHours, setWeeklyHours] = useState(15);
  const [targetRole, setTargetRole] = useState('FULLSTACK');
  const [targetCompanyTier, setTargetCompanyTier] = useState<Roadmap['targetCompanyTier']>('FAANG');
  const [knownSkills, setKnownSkills] = useState<string[]>(['JavaScript', 'React', 'Git']);
  const [selectedBlindspots, setSelectedBlindspots] = useState<string[]>([
    'System Design & Distributed Scaling',
    'Database Indexing & Query Optimization'
  ]);
  const [pedagogicalPriority, setPedagogicalPriority] = useState<'PLACEMENT' | 'PROJECTS' | 'PRINCIPLES'>('PLACEMENT');

  const toggleSkill = (skill: string) => {
    setKnownSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleBlindspot = (spot: string) => {
    setSelectedBlindspots((prev) =>
      prev.includes(spot) ? prev.filter((s) => s !== spot) : [...prev, spot]
    );
  };

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    setSynthesisProgress(10);

    const progressInterval = setInterval(() => {
      setSynthesisProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 18;
      });
    }, 400);

    setTimeout(() => {
      clearInterval(progressInterval);
      setSynthesisProgress(100);

      // Generate bespoke calibrated roadmap
      const generatedNodes: RoadmapNode[] = [
        {
          id: `ai-node-1-${Date.now()}`,
          title: `Foundations of High-Throughput ${targetRole === 'BACKEND' ? 'Distributed Backend Systems' : 'Full Stack Architecture'}`,
          subHeader: 'Phase 1 • Core Runtime Mechanics & Architectural Invariants',
          category: 'Architecture',
          orderIndex: 1,
          status: 'IN_PROGRESS',
          score: 0,
          estimatedHours: Math.round(weeklyHours * 1.5),
          whatShouldIDo: {
            summary: `Establish rock-solid mastery of asynchronous task queuing, runtime memory lifecycle, and clean interface contracts targeting ${targetCompanyTier} engineering bars.`,
            actionSteps: [
              'Audit memory leaks, detached heap objects, and event listener lifecycle under high concurrency.',
              'Implement a custom asynchronous task scheduler handling request batching without starvation.',
              'Construct strict domain invariants using TypeScript and runtime schema validation.'
            ],
            mentalModels: [
              'Fail-Fast Invariant: Reject invalid data at the external API boundary before it contaminates database state.',
              'Non-Blocking Event Loops: Never execute CPU-heavy synchronous computation on the primary request loop.'
            ]
          },
          whatIsTheSource: [
            {
              id: `ai-src-1-${Date.now()}`,
              title: 'Official Architectural Specification & Concurrency Mechanics',
              url: 'https://developer.mozilla.org',
              type: 'DOCS',
              description: 'Exhaustive reference for event loop phases, memory layout, and microtask scheduling.'
            }
          ],
          whatIsTheExactThing: {
            title: 'Asynchronous Concurrency Limiter & Batching Engine Drill',
            description: `Construct an executable TypeScript concurrency queue that caps active connections at N and verifies deterministic order under 1,000 simulated async tasks.`,
            deliverable: 'Tested TypeScript module passing automated load and timeout tests.',
            starterCode: `// Calibrated Phase 1 Drill\nexport class TaskScheduler {\n  private activeCount = 0;\n  constructor(private readonly maxConcurrent: number) {}\n  async submit<T>(task: () => Promise<T>): Promise<T> {\n    // TODO: Implement concurrency control\n    throw new Error("Implement scheduler");\n  }\n}`,
            verificationChecklist: [
              'Never exceeds active concurrency limits under heavy burst load',
              'Handles promise rejections cleanly without dropping remaining queue tasks'
            ]
          },
          microQuestions: [
            {
              id: `ai-mq-1-${Date.now()}`,
              questionText: 'How would you prevent task queue starvation when a flood of high-priority microtasks arrives simultaneously?',
              focus: 'Event Loop Prioritization',
              suggestedAnswer: 'By interleaving microtask execution with yields to setImmediate or setTimeout(0) to allow macrotasks, I/O polling, and timer callbacks to execute before the thread starves.'
            }
          ]
        },
        {
          id: `ai-node-2-${Date.now()}`,
          title: 'Relational Schema Design, Compound B-Trees & Transaction Isolation',
          subHeader: 'Phase 2 • Production Data Persistence for High Scale',
          category: 'Database',
          orderIndex: 2,
          status: 'LOCKED',
          score: 0,
          estimatedHours: Math.round(weeklyHours * 2),
          whatShouldIDo: {
            summary: 'Move beyond basic ORMs to master database indexing, EXPLAIN query plans, optimistic locking, and row-level synchronization under multi-client writes.',
            actionSteps: [
              'Design a multi-tenant PostgreSQL schema with composite indexing on high-cardinality filters.',
              'Benchmark query execution plans using EXPLAIN ANALYZE on datasets over 500,000 rows.',
              'Implement transactional balance updates using SELECT FOR UPDATE avoiding race conditions.'
            ],
            mentalModels: [
              'Leftmost Index Prefix Rule: Compound indexes must be queried using the leading column to enable binary B-Tree traversal.',
              'Isolation Level Overhead: Serializable isolation guarantees strict consistency but dramatically increases transaction abort rates under high write contention.'
            ]
          },
          whatIsTheSource: [
            {
              id: `ai-src-2-${Date.now()}`,
              title: 'Use The Index, Luke! Database Performance Guide',
              url: 'https://use-the-index-luke.com',
              type: 'DOCS',
              description: 'World-renowned guide to indexing mechanics, range queries, and indexing pitfalls.'
            }
          ],
          whatIsTheExactThing: {
            title: 'High-Concurrency Atomic Ledger & Index Optimizer Drill',
            description: 'Construct a PostgreSQL schema and transactional transfer service that handles 50 concurrent balance debits with 0 negative balance violations.',
            deliverable: 'Complete migration script, seed data, and passing concurrency unit test.',
            starterCode: `// Phase 2 Drill: Atomic Database Ledger\nexport async function atomicDebit(dbPool: any, accountId: string, amount: number) {\n  // TODO: Run transactional balance check and deduction with SELECT FOR UPDATE\n}`,
            verificationChecklist: [
              'Prevents double-spending race conditions with row-level locks',
              'Query plans verify Index Scan rather than full table sequential scan'
            ]
          },
          microQuestions: [
            {
              id: `ai-mq-2-${Date.now()}`,
              questionText: 'Explain the difference between Read Committed and Repeatable Read isolation levels. When does a non-repeatable read occur?',
              focus: 'ACID Transaction Isolation',
              suggestedAnswer: 'Read Committed guarantees a transaction will only see committed data, but re-reading the same row can yield different values if another transaction committed changes in between. Repeatable Read ensures snapshot isolation where subsequent reads always return identical data.'
            }
          ]
        },
        {
          id: `ai-node-3-${Date.now()}`,
          title: 'Distributed Caching, Invalidation Daemons & Resilient System Design',
          subHeader: 'Phase 3 • Safeguarding the Persistence Layer & Passing System Design Rounds',
          category: 'Distributed Systems',
          orderIndex: 3,
          status: 'LOCKED',
          score: 0,
          estimatedHours: Math.round(weeklyHours * 2.2),
          whatShouldIDo: {
            summary: `Design high-throughput caching topologies using Redis, eliminate Cache Stampedes with distributed mutexes, and defend architectural trade-offs in ${targetCompanyTier} loops.`,
            actionSteps: [
              'Build a Cache-Aside wrapper in TypeScript with probabilistic early expiration (XFetch).',
              'Construct a sliding-window rate limiter using Redis sorted sets (ZSET).',
              'Defend SQL vs NoSQL, Polling vs WebSockets, and Monolith vs Microservices trade-offs.'
            ],
            mentalModels: [
              'Cache Invalidation as Hard Invariant: Stale data must either be strictly bounded by short TTLs or invalidated synchronously on writes.',
              'CAP Theorem Trade-offs: In partitioned networks, you must choose between availability (returning possibly stale data) or consistency (returning error until synced).'
            ]
          },
          whatIsTheSource: [
            {
              id: `ai-src-3-${Date.now()}`,
              title: 'System Design Primer & Distributed Caching Topologies',
              url: 'https://github.com/donnemartin/system-design-primer',
              type: 'REPO',
              description: 'Curated industry standard for scaling web apps to millions of concurrent users.'
            }
          ],
          whatIsTheExactThing: {
            title: 'Distributed Sliding-Window Rate Limiter & Mutex Drill',
            description: 'Construct a resilient Redis sliding-window middleware handling 10,000 requests without boundary burst leaks.',
            deliverable: 'Express/Fastify middleware with passing automated concurrency test harness.',
            starterCode: `// Phase 3 Drill: Redis Sliding Window Rate Limiter\nexport function createRateLimiter(redisClient: any, limit: number, windowSecs: number) {\n  return async (clientIp: string) => {\n    // TODO: ZREMRANGEBYSCORE, ZADD, ZCARD in MULTI\n  };\n}`,
            verificationChecklist: [
              'Smooth traffic shaping across 60-second window boundaries',
              'Sub-3ms execution overhead per request using pipelined Redis commands'
            ]
          },
          microQuestions: [
            {
              id: `ai-mq-3-${Date.now()}`,
              questionText: 'How do you prevent a Cache Stampede when a million users query a hot resource whose cache entry just expired?',
              focus: 'Cache Stampede Mitigation',
              suggestedAnswer: 'By implementing distributed locks (mutex) where only the first request is permitted to recompute the expensive database query while other concurrent requests wait or receive slightly stale cached data via probabilistic early refresh.'
            }
          ]
        }
      ];

      const newRoadmap: Roadmap = {
        id: `rm-ai-${Date.now()}`,
        title: `${targetRole.charAt(0) + targetRole.slice(1).toLowerCase()} Engineer Blueprint (${targetCompanyTier} Track)`,
        rolePath: targetRole,
        category: (targetRole === 'FRONTEND' ? 'FRONTEND' : targetRole === 'BACKEND' ? 'SYSTEM_DESIGN' : 'FULLSTACK') as any,
        targetCompanyTier,
        difficulty: 'Intermediate',
        estimatedWeeks: timelineWeeks,
        description: `Bespoke, ${timelineWeeks}-week curriculum tailored for ${studentPersona}. Designed for ${weeklyHours} hours/week to eliminate tutorial hell and conquer ${targetCompanyTier} technical interviews by building verified production drills.`,
        isOfficial: false,
        isPublic: true,
        isAiGenerated: true,
        overallReadiness: 0,
        tags: [targetRole, targetCompanyTier, `${weeklyHours}h/wk`, 'AI-Calibrated', ...knownSkills.slice(0, 3)],
        creatorId: user?.id || 'current-user',
        creatorName: user?.name || 'You (AI Co-Architected)',
        creatorUsername: 'you_ai',
        enrolledCount: 1,
        upvotes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nodesData: generatedNodes
      };

      setIsSynthesizing(false);
      toast.success('Bespoke student roadmap synthesized!');
      onGenerate(newRoadmap);
    }, 2200);
  };

  return (
    <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 sm:p-10 shadow-sm max-w-3xl mx-auto space-y-8 text-[#11183D]">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8EAF4] border border-[#A0006D]/30 text-[#A0006D] text-xs font-bold font-display uppercase tracking-wider">
          <Sparkles size={14} /> AI Student Diagnostic Engine
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-[#11183D]">
          Calibrate Your Personalized Learning Flight Plan
        </h2>
        <p className="text-xs text-[#526078] max-w-xl mx-auto leading-relaxed">
          Generic roadmaps list buzzwords. Our diagnostic evaluates your academic timeline, current blindspots, and target company tier to architect a step-by-step roadmap with real project drills.
        </p>
      </div>

      {/* Progress Steps Indicator */}
      <div className="flex items-center justify-between max-w-md mx-auto relative pt-2">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#EFFAFD] -translate-y-1/2 -z-0" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-[#2459A8] -translate-y-1/2 -z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        />

        {[
          { num: 1, label: 'Timeline' },
          { num: 2, label: 'Target' },
          { num: 3, label: 'Blindspots' },
          { num: 4, label: 'Priority' },
        ].map((s) => (
          <div key={s.num} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all ${
                currentStep >= s.num
                  ? 'bg-[#2459A8] text-white shadow-sm'
                  : 'bg-[#EFFAFD] text-[#526078] border border-[#DCE7F2]'
              }`}
            >
              {s.num}
            </div>
            <span className="text-[10px] font-bold text-[#526078] mt-1 font-display">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Synthesizing Loading State */}
      {isSynthesizing ? (
        <div className="py-12 text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-[#EFFAFD] border-t-[#2459A8] animate-spin" />
            <Cpu size={32} className="text-[#A0006D] animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold font-display text-[#11183D]">
              Synthesizing Pedagogical Milestones & Invariants...
            </h3>
            <p className="text-xs text-[#526078] font-mono">
              Calibrating {timelineWeeks} weeks @ {weeklyHours}h/wk for {targetCompanyTier} benchmarks ({synthesisProgress}%)
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* STEP 1: Academic Persona & Time Commitment */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display flex items-center gap-2">
                  <GraduationCap size={16} className="text-[#2459A8]" />
                  <span>Where Are You in Your Academic / Career Journey?</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: '1st / 2nd Year Explorer', desc: 'Building core CS fundamentals, data structures, and first web projects.' },
                    { title: '3rd / 4th Year Placement Crunch', desc: 'Need high-yield, interview-ready systems before campus recruitment.' },
                    { title: 'Recent Graduate / Job Seeker', desc: 'Filling portfolio gaps and mastering live coding & system design.' },
                    { title: 'Working Professional Switcher', desc: 'Transitioning from legacy IT to product engineering and microservices.' },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setStudentPersona(p.title)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        studentPersona === p.title
                          ? 'bg-[#EFFAFD] border-[#2459A8] shadow-xs'
                          : 'bg-white border-[#DCE7F2] hover:border-[#4A8BDF]'
                      }`}
                    >
                      <strong className="text-xs font-bold text-[#11183D] block">{p.title}</strong>
                      <p className="text-[11px] text-[#526078] mt-1">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#DCE7F2]">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display block mb-1">
                    Weeks Until Target Readiness ({timelineWeeks} Weeks)
                  </label>
                  <input
                    type="range"
                    min={4}
                    max={32}
                    step={2}
                    value={timelineWeeks}
                    onChange={(e) => setTimelineWeeks(parseInt(e.target.value, 10))}
                    className="w-full accent-[#2459A8] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#526078] font-mono mt-1">
                    <span>4 wks (Sprint)</span>
                    <span>12 wks (Semester)</span>
                    <span>32 wks (Marathon)</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display block mb-1">
                    Weekly Hours Available ({weeklyHours} Hours/Week)
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={40}
                    step={5}
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(parseInt(e.target.value, 10))}
                    className="w-full accent-[#A0006D] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#526078] font-mono mt-1">
                    <span>5h (Relaxed)</span>
                    <span>15h (Dedicated)</span>
                    <span>40h (Bootcamp)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Target Role & Company Tier */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display flex items-center gap-2">
                  <Target size={16} className="text-[#2459A8]" />
                  <span>Target Engineering Role</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { role: 'FULLSTACK', title: 'Full Stack Engineer', desc: 'React, TypeScript, Node.js, PostgreSQL & API Architecture' },
                    { role: 'BACKEND', title: 'Backend Distributed Systems', desc: 'Go, Concurrency, Caching, Kafka & Database Internals' },
                    { role: 'FRONTEND', title: 'Frontend Platform Architect', desc: 'Core Web Vitals, Design Systems, State Engines & Performance' },
                  ].map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setTargetRole(r.role)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        targetRole === r.role
                          ? 'bg-[#EFFAFD] border-[#2459A8] shadow-xs'
                          : 'bg-white border-[#DCE7F2] hover:border-[#4A8BDF]'
                      }`}
                    >
                      <strong className="text-xs font-bold text-[#11183D] block">{r.title}</strong>
                      <p className="text-[11px] text-[#526078] mt-1">{r.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#DCE7F2]">
                <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display flex items-center gap-2">
                  <Building2 size={16} className="text-[#A0006D]" />
                  <span>Target Benchmark Company Tier</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { tier: 'FAANG', title: 'FAANG / Big Tech', desc: 'Google, Meta, Amazon' },
                    { tier: 'Unicorn', title: 'Product Unicorns', desc: 'Stripe, Uber, Airbnb' },
                    { tier: 'Enterprise', title: 'FinTech / Enterprise', desc: 'JPMorgan, Salesforce' },
                    { tier: 'Startup', title: 'Seed / Series A', desc: 'High-Velocity Startups' },
                  ].map((t) => (
                    <button
                      key={t.tier}
                      type="button"
                      onClick={() => setTargetCompanyTier(t.tier as any)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        targetCompanyTier === t.tier
                          ? 'bg-[#F8EAF4] border-[#A0006D] text-[#A0006D] shadow-xs'
                          : 'bg-white border-[#DCE7F2] hover:border-[#A0006D]/40 text-[#11183D]'
                      }`}
                    >
                      <strong className="text-xs font-bold block">{t.title}</strong>
                      <span className="text-[10px] text-[#526078] mt-0.5 block">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Current Baseline & Blindspots */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display block mb-1">
                  Languages & Technologies You Already Know
                </label>
                <p className="text-[11px] text-[#526078] mb-2">
                  We will fast-track or omit introductory milestones for concepts you already know.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SKILLS.map((skill) => {
                    const isSelected = knownSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2459A8] text-white shadow-xs'
                            : 'bg-[#EFFAFD] text-[#526078] border border-[#DCE7F2] hover:text-[#11183D]'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-[#DCE7F2]">
                <label className="text-xs font-bold uppercase tracking-wider text-[#A0006D] font-display block mb-1">
                  What Are Your Biggest Anxieties / Blindspots? (Select all that apply)
                </label>
                <p className="text-[11px] text-[#526078] mb-2">
                  Our curriculum will construct targeted drills, mental models, and Socratic checkpoints for these areas.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BLINDSPOTS.map((spot) => {
                    const isSelected = selectedBlindspots.includes(spot);
                    return (
                      <button
                        key={spot}
                        type="button"
                        onClick={() => toggleBlindspot(spot)}
                        className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#F8EAF4] border-[#A0006D] text-[#A0006D] font-bold'
                            : 'bg-white border-[#DCE7F2] text-[#526078] hover:border-[#A0006D]/30'
                        }`}
                      >
                        <span>{spot}</span>
                        {isSelected && <CheckCircle2 size={15} className="shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Pedagogical Priority */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display block mb-1">
                How Do You Learn Best & What Is Your Immediate Goal?
              </label>

              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    id: 'PLACEMENT',
                    title: 'Campus Placement & Technical Interview Crunch',
                    desc: 'Prioritizes high-probability interview questions, time-complexity optimizations, and oral defense drills to clear technical rounds with confidence.'
                  },
                  {
                    id: 'PROJECTS',
                    title: 'Standout Engineering Portfolio Capstones',
                    desc: 'Focuses on building production systems (e.g. distributed cache, real-time audio analytics) that recruiters at top tech companies actually stop to look at.'
                  },
                  {
                    id: 'PRINCIPLES',
                    title: 'Deep Engineering First Principles & Internals',
                    desc: 'Focuses on operating systems, memory lifecycles, network protocols (TCP/UDP, HTTP/3), and database storage engines for long-term mastery.'
                  },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPedagogicalPriority(p.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      pedagogicalPriority === p.id
                        ? 'bg-[#EFFAFD] border-[#2459A8] shadow-xs'
                        : 'bg-white border-[#DCE7F2] hover:border-[#4A8BDF]'
                    }`}
                  >
                    <strong className="text-xs font-bold text-[#11183D] block">{p.title}</strong>
                    <p className="text-[11px] text-[#526078] mt-1 leading-relaxed">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-[#DCE7F2] flex items-center justify-between">
            {currentStep > 1 ? (
              <Button
                variant="secondary"
                size="md"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                icon={<ArrowLeft size={15} />}
              >
                Back
              </Button>
            ) : (
              <div>
                {onCancel && (
                  <Button variant="secondary" size="md" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            )}

            {currentStep < 4 ? (
              <Button
                variant="royal"
                size="md"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                iconRight={<ArrowRight size={15} />}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="eggplant"
                size="md"
                onClick={handleSynthesize}
                icon={<Sparkles size={16} />}
                className="shadow-md"
              >
                Generate Calibrated Roadmap
              </Button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
