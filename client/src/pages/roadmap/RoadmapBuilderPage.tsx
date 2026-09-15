import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Sparkles, Plus, Save, Eye, ArrowLeft, ArrowRight,
  BookOpen, Code2, ShieldCheck, CheckCircle2, AlertTriangle,
  Lightbulb, Layers, GraduationCap, Flame, Clock, HelpCircle, Check, Target, X
} from 'lucide-react';
import { Roadmap, RoadmapNode, useRoadmapStore } from '../../store/useRoadmapStore';
import { useAuthStore } from '../../store/authStore';
import MilestoneStepEditor from '../../components/roadmap/MilestoneStepEditor';
import AiDiagnosticForm from '../../components/roadmap/AiDiagnosticForm';
import StudentBlueprintCard, { STUDENT_BLUEPRINTS, StudentBlueprint } from '../../components/roadmap/StudentBlueprintCard';
import RoadmapPreviewModal from '../../components/roadmap/RoadmapPreviewModal';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

type BuilderMode = 'manual' | 'ai' | 'blueprints';

const INITIAL_DEFAULT_STEPS: RoadmapNode[] = [
  {
    id: `step-1-${Date.now()}`,
    title: 'Foundational System Architecture & Runtime Internals',
    subHeader: 'Phase 1 • Moving Past Syntax Memorization to Runtime Mechanics',
    category: 'Architecture',
    orderIndex: 1,
    status: 'IN_PROGRESS',
    score: 0,
    estimatedHours: 15,
    whatShouldIDo: {
      summary: 'Understand the execution model, task queues, and memory lifecycle so you can diagnose memory leaks and race conditions.',
      actionSteps: [
        'Analyze task queue execution priority between Promises and macrotasks.',
        'Implement an asynchronous concurrency limiter handling burst traffic without memory spikes.'
      ],
      mentalModels: [
        'Single Source of Truth: State must have exactly one deterministic owner.',
        'Fail-Fast Validation: Catch invalid schema inputs at the API gateway before database contamination.'
      ]
    },
    whatIsTheSource: [
      {
        id: 'src-init-1',
        title: 'Node.js Event Loop & Concurrency Specification',
        url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/',
        type: 'DOCS',
        description: 'Official runtime mechanics and task scheduler documentation.'
      }
    ],
    whatIsTheExactThing: {
      title: 'Concurrency Limiter & Task Queue Drill',
      description: 'Construct a reusable asynchronous task limiter in TypeScript with automated unit tests.',
      deliverable: 'TypeScript module passing concurrency assertion suite with 100% test coverage.',
      starterCode: `// Step 1 Practical Drill Starter Code\nexport class ConcurrencyLimiter {\n  private queue: Array<() => Promise<any>> = [];\n  private activeCount = 0;\n\n  constructor(private readonly limit: number) {}\n\n  async run<T>(fn: () => Promise<T>): Promise<T> {\n    // TODO: Implement queue buffering and activeCount tracking\n    throw new Error("Not implemented");\n  }\n}`,
      verificationChecklist: [
        'Never exceeds active concurrency limit under burst traffic',
        'Propagates promise rejections cleanly without stalling remaining tasks'
      ]
    },
    microQuestions: [
      {
        id: 'mq-init-1',
        questionText: 'Explain the core architectural trade-off of your chosen state management model.',
        focus: 'Design Trade-offs',
        suggestedAnswer: 'Explicit unidirectional data flows provide deterministic debugging and predictable testing at the expense of slight boilerplate.'
      }
    ]
  }
];

const MILESTONE_ARCHETYPES = [
  {
    label: 'Runtime & Event Loop',
    icon: '⚡',
    description: 'Task queues, memory allocation, microtask vs macrotask invariants',
    createNode: (order: number): RoadmapNode => ({
      id: `step-runtime-${Date.now()}`,
      title: `Phase ${order}: Runtime Internals, Event Loop & Memory Profiling`,
      subHeader: `Phase ${order} • Core Mechanics & Low-Level Invariants`,
      category: 'Runtime Architecture',
      orderIndex: order,
      status: order === 1 ? 'IN_PROGRESS' : 'LOCKED',
      score: 0,
      estimatedHours: 16,
      whatShouldIDo: {
        summary: 'Deconstruct runtime memory allocation, asynchronous task queues, and garbage collection pauses to prevent latency spikes under high load.',
        actionSteps: [
          'Profile memory heaps using Chrome/Node.js DevTools to catch memory retainers and leaks.',
          'Implement an asynchronous backpressure pipeline with concurrency controls.',
          'Benchmark CPU utilization across single-threaded execution vs worker threads.'
        ],
        mentalModels: [
          'Fail-Fast Validation: Validate payload shapes at boundary layers before allocating memory.',
          'Event Loop Invariant: Never perform blocking disk or crypto operations in the main tick.'
        ]
      },
      whatIsTheSource: [
        {
          id: `src-rt-${Date.now()}`,
          title: 'Official Node.js libuv Event Loop Documentation',
          url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick',
          type: 'DOCS',
          description: 'Timers, pending callbacks, poll, check, and close phases explained.'
        }
      ],
      whatIsTheExactThing: {
        title: 'Zero-Memory-Spike Concurrency Limiter Drill',
        description: 'Build an async queue handler with strict maximum concurrency and memory leak protection under 10,000 rapid calls.',
        deliverable: 'Tested TypeScript module passing endurance unit tests.',
        starterCode: `export class ConcurrencyLimiter {\n  constructor(private maxConcurrent: number) {}\n  async execute<T>(task: () => Promise<T>): Promise<T> {\n    // Implement queue with semaphore semantics\n    return task();\n  }\n}`,
        verificationChecklist: [
          'Queue limits concurrent active tasks to maxConcurrent without thread exhaustion',
          'Zero unhandled promise rejections on task failure'
        ]
      },
      microQuestions: [
        {
          id: `mq-rt-${Date.now()}`,
          questionText: 'What happens when microtask promises recursively enqueue new microtasks?',
          focus: 'Event Loop Starvation',
          suggestedAnswer: 'The event loop starves the macrotask and I/O queues completely because microtasks are drained exhaustively before advancing to the next phase.'
        }
      ]
    })
  },
  {
    label: 'Database Indexing & B-Trees',
    icon: '🗄️',
    description: 'Postgres pages, composite indexes, left-prefix rule, EXPLAIN ANALYZE',
    createNode: (order: number): RoadmapNode => ({
      id: `step-db-${Date.now()}`,
      title: `Phase ${order}: Relational Query Optimization & B-Tree Indexing`,
      subHeader: `Phase ${order} • Data Persistence & Query Performance`,
      category: 'Database Engineering',
      orderIndex: order,
      status: order === 1 ? 'IN_PROGRESS' : 'LOCKED',
      score: 0,
      estimatedHours: 18,
      whatShouldIDo: {
        summary: 'Deep-dive into database storage pages, B-Tree index traversal, composite index column ordering, and transaction isolation levels.',
        actionSteps: [
          'Run EXPLAIN (ANALYZE, BUFFERS) on 5 million row datasets to eliminate Sequential Scans.',
          'Construct composite indexes adhering strictly to the left-prefix rule.',
          'Prevent phantom reads and serialization anomalies using SERIALIZABLE isolation.'
        ],
        mentalModels: [
          'Index Selectivity: Place highest cardinality filter columns first in composite B-Trees.',
          'Write Amplification: Every additional index adds write latency; index only queries that justify the overhead.'
        ]
      },
      whatIsTheSource: [
        {
          id: `src-db-${Date.now()}`,
          title: 'Use The Index, Luke! (Markus Winand)',
          url: 'https://use-the-index-luke.com/',
          type: 'BOOK',
          description: 'The definitive guide to SQL indexing and database query execution plans.'
        }
      ],
      whatIsTheExactThing: {
        title: 'High-Throughput Sub-10ms Ledger Query Drill',
        description: 'Optimize a financial transaction history query joining 3 tables across 10M rows to execute in under 10ms consistently.',
        deliverable: 'SQL schema, indexes, and benchmark proof with zero Seq Scans.',
        starterCode: `-- SQL Optimization Drill\nCREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ledger_account_created \nON ledger_entries (account_id, created_at DESC);`,
        verificationChecklist: [
          'EXPLAIN ANALYZE confirms Index Only Scan without heap fetch overhead',
          'Execution time strictly below 10ms for 99th percentile'
        ]
      },
      microQuestions: [
        {
          id: `mq-db-${Date.now()}`,
          questionText: 'Why can a B-Tree index on (created_at, user_id) NOT satisfy a query filtering only on user_id?',
          focus: 'Left-Prefix Index Invariant',
          suggestedAnswer: 'Because B-Tree nodes are sorted hierarchically starting with created_at. Without knowing created_at, the engine must perform a full scan of the index leaf pages.'
        }
      ]
    })
  },
  {
    label: 'Distributed Systems & Caching',
    icon: '🌐',
    description: 'Redis clusters, Lua atomicity, sliding rate limiters, cache stampede defense',
    createNode: (order: number): RoadmapNode => ({
      id: `step-dist-${Date.now()}`,
      title: `Phase ${order}: Distributed Caching, Sharding & Rate Limiting`,
      subHeader: `Phase ${order} • High-Concurrency Distributed Scale`,
      category: 'Distributed Scale',
      orderIndex: order,
      status: order === 1 ? 'IN_PROGRESS' : 'LOCKED',
      score: 0,
      estimatedHours: 20,
      whatShouldIDo: {
        summary: 'Design multi-node Redis clusters, token-bucket distributed rate limiters, and idempotency guarantees for non-blocking HTTP endpoints.',
        actionSteps: [
          'Implement sliding-window rate limiters with Lua scripts in Redis to ensure atomicity.',
          'Mitigate cache stampedes and thundering herds via single-flight mutexes and TTL jitter.',
          'Implement idempotent payment API handlers using distributed locks.'
        ],
        mentalModels: [
          'Two Generals Problem: Network partitions are inevitable; design for idempotency and at-least-once delivery.',
          'Cache As An Optimization: Systems must stay functional when cache clusters restart.'
        ]
      },
      whatIsTheSource: [
        {
          id: `src-dist-${Date.now()}`,
          title: 'Designing Data-Intensive Applications (Martin Kleppmann)',
          url: 'https://dataintensive.net/',
          type: 'BOOK',
          description: 'Industry benchmark on replication, partitioning, and distributed transactions.'
        }
      ],
      whatIsTheExactThing: {
        title: 'Distributed Token-Bucket Rate Limiter with Lua Scripting',
        description: 'Construct a rate limiting middleware handling 25,000 QPS with atomic Redis Lua script evaluation and zero race conditions.',
        deliverable: 'Express/Fastify middleware with integration tests simulating concurrent burst requests.',
        starterCode: `export async function checkRateLimit(redis: any, key: string, limit: number, windowSec: number) {\n  // Atomic Redis evaluation\n  return { allowed: true, remaining: limit - 1 };\n}`,
        verificationChecklist: [
          'Zero race conditions across 100 concurrent requests',
          'Accurately resets quota after window expiration'
        ]
      },
      microQuestions: [
        {
          id: `mq-dist-${Date.now()}`,
          questionText: 'How do you prevent cache penetration when attackers query non-existent keys repeatedly?',
          focus: 'Cache Penetration Defense',
          suggestedAnswer: 'By using Bloom filters at the API layer to reject definitely non-existent keys before touching cache or DB, and caching short-lived null entries for queried misses.'
        }
      ]
    })
  }
];

export default function RoadmapBuilderPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { createManualRoadmap, roadmaps } = useRoadmapStore();

  const queryMode = searchParams.get('mode') as BuilderMode | null;
  const cloneId = searchParams.get('clone');
  const [activeMode, setActiveMode] = useState<BuilderMode>(queryMode || 'manual');

  // Blueprint / Form Metadata State
  const [title, setTitle] = useState('Full Stack & Systems Engineering Blueprint');
  const [rolePath, setRolePath] = useState('FULLSTACK');
  const [targetCompanyTier, setTargetCompanyTier] = useState<Roadmap['targetCompanyTier']>('FAANG');
  const [difficulty, setDifficulty] = useState<Roadmap['difficulty']>('Intermediate');
  const [estimatedWeeks, setEstimatedWeeks] = useState(12);
  const [prerequisites, setPrerequisites] = useState<string[]>([
    'TypeScript / JavaScript',
    'Data Structures & Algorithms',
    'HTTP & REST Fundamentals'
  ]);
  const [newPrereqInput, setNewPrereqInput] = useState('');
  const [description, setDescription] = useState(
    'A structured, sequential engineering curriculum designed to master core concepts, build concrete production drills, and defend architectural trade-offs in technical interview loops.'
  );
  const [isPublic, setIsPublic] = useState(true);

  // Sequential Steps List
  const [steps, setSteps] = useState<RoadmapNode[]>(INITIAL_DEFAULT_STEPS);

  // Live Preview Modal
  const [previewRoadmap, setPreviewRoadmap] = useState<Roadmap | null>(null);

  useEffect(() => {
    if (queryMode && ['manual', 'ai', 'blueprints'].includes(queryMode)) {
      setActiveMode(queryMode);
    }
  }, [queryMode]);

  // If a clone ID is passed in query params, pre-populate the studio
  useEffect(() => {
    if (cloneId && roadmaps.length > 0) {
      const target = roadmaps.find((r) => r.id === cloneId);
      if (target) {
        setTitle(`${target.title} (My Customized Copy)`);
        setRolePath(target.rolePath);
        setTargetCompanyTier(target.targetCompanyTier);
        setDifficulty(target.difficulty);
        setEstimatedWeeks(target.estimatedWeeks);
        setDescription(target.description);
        setSteps(
          target.nodesData.map((node, i) => ({
            ...node,
            id: `clone-step-${i + 1}-${Date.now()}`,
            status: i === 0 ? 'IN_PROGRESS' : 'LOCKED',
            score: 0,
          }))
        );
        setActiveMode('manual');
        toast.success(`Loaded "${target.title}" for customization!`);
      }
    }
  }, [cloneId, roadmaps]);

  const handleModeChange = (mode: BuilderMode) => {
    setActiveMode(mode);
    setSearchParams({ mode });
  };

  const handleAddStep = () => {
    const nextOrder = steps.length + 1;
    const newStep: RoadmapNode = {
      id: `step-${nextOrder}-${Date.now()}`,
      title: `Milestone ${nextOrder}: Advanced System Component`,
      subHeader: `Phase ${nextOrder} • Production Implementation`,
      category: 'Architecture',
      orderIndex: nextOrder,
      status: nextOrder === 1 ? 'IN_PROGRESS' : 'LOCKED',
      score: 0,
      estimatedHours: 15,
      whatShouldIDo: {
        summary: 'Define clear architectural invariants, modular components, and edge cases to handle.',
        actionSteps: [
          'Design clean data flow and schema constraints.',
          'Implement automated test coverage across edge failure modes.'
        ],
        mentalModels: [
          'Graceful Degradation: When a downstream service fails, return cached fallbacks rather than crashing.'
        ]
      },
      whatIsTheSource: [
        {
          id: `src-${Date.now()}`,
          title: 'Official Specification & Reference Architecture',
          url: 'https://developer.mozilla.org',
          type: 'DOCS',
          description: 'Standard documentation.'
        }
      ],
      whatIsTheExactThing: {
        title: `Phase ${nextOrder} Sandbox Drill`,
        description: 'Construct a verified module in Monaco sandbox with passing automated assertions.',
        deliverable: 'Executable module with test harness.',
        starterCode: `// Phase ${nextOrder} Starter Code\nexport function execute() {\n  return true;\n}`,
        verificationChecklist: [
          'Handles network drops and concurrent requests cleanly',
          'Passes all automated verification checks'
        ]
      },
      microQuestions: [
        {
          id: `mq-${Date.now()}`,
          questionText: 'What was the primary performance trade-off in your design?',
          focus: 'Performance & Scale',
          suggestedAnswer: 'Traded memory footprint for sub-millisecond read access using in-memory hash indexing.'
        }
      ]
    };
    setSteps([...steps, newStep]);
    toast.success(`Added Step ${nextOrder}`);
  };

  const handleUpdateStep = (index: number, updated: RoadmapNode) => {
    const next = [...steps];
    next[index] = updated;
    setSteps(next);
  };

  const handleMoveStep = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= steps.length) return;
    const next = [...steps];
    const item = next.splice(fromIndex, 1)[0];
    next.splice(toIndex, 0, item);
    // Reassign orderIndex
    const reordered = next.map((s, idx) => ({
      ...s,
      orderIndex: idx + 1,
      subHeader: s.subHeader.replace(/Phase \d+/, `Phase ${idx + 1}`)
    }));
    setSteps(reordered);
  };

  const handleDuplicateStep = (index: number) => {
    const item = steps[index];
    const duplicated: RoadmapNode = {
      ...item,
      id: `step-dup-${Date.now()}`,
      title: `${item.title} (Copy)`,
      orderIndex: steps.length + 1
    };
    setSteps([...steps, duplicated]);
    toast.success('Duplicated step');
  };

  const handleDeleteStep = (index: number) => {
    if (steps.length <= 1) {
      toast.error('Roadmaps must contain at least 1 milestone step.');
      return;
    }
    const next = steps.filter((_, i) => i !== index);
    const reordered = next.map((s, idx) => ({
      ...s,
      orderIndex: idx + 1
    }));
    setSteps(reordered);
    toast.success('Deleted step');
  };

  const handleAddArchetype = (archetype: typeof MILESTONE_ARCHETYPES[0]) => {
    const nextOrder = steps.length + 1;
    const node = archetype.createNode(nextOrder);
    setSteps([...steps, node]);
    toast.success(`Appended "${archetype.label}" milestone!`);
  };

  const handleAddPrereq = () => {
    if (!newPrereqInput.trim()) return;
    if (prerequisites.includes(newPrereqInput.trim())) {
      toast.error('Prerequisite already added.');
      return;
    }
    setPrerequisites([...prerequisites, newPrereqInput.trim()]);
    setNewPrereqInput('');
  };

  const handleRemovePrereq = (item: string) => {
    setPrerequisites(prerequisites.filter((p) => p !== item));
  };

  const handleForkBlueprint = (blueprint: StudentBlueprint) => {
    setTitle(`${blueprint.title}`);
    setRolePath(blueprint.rolePath);
    setTargetCompanyTier(blueprint.targetCompanyTier);
    setDifficulty(blueprint.difficulty);
    setEstimatedWeeks(blueprint.estimatedWeeks);
    setDescription(blueprint.description);
    setSteps(blueprint.nodesData);
    handleModeChange('manual');
    toast.success(`Loaded "${blueprint.title}" into Studio!`);
  };

  const handleAiGeneratedRoadmap = (aiRoadmap: Roadmap) => {
    setTitle(aiRoadmap.title);
    setRolePath(aiRoadmap.rolePath);
    setTargetCompanyTier(aiRoadmap.targetCompanyTier);
    setDifficulty(aiRoadmap.difficulty);
    setEstimatedWeeks(aiRoadmap.estimatedWeeks);
    setDescription(aiRoadmap.description);
    setSteps(aiRoadmap.nodesData);
    handleModeChange('manual');
    toast.success('AI Blueprint loaded into Studio. You can now customize or publish!');
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error('Please specify a title for your Career Roadmap.');
      return;
    }
    if (steps.length === 0) {
      toast.error('A roadmap requires at least one milestone step.');
      return;
    }

    try {
      const created = createManualRoadmap({
        title: title.trim(),
        rolePath,
        category: (rolePath === 'FRONTEND' ? 'FRONTEND' : rolePath === 'BACKEND' ? 'SYSTEM_DESIGN' : 'FULLSTACK') as any,
        targetCompanyTier,
        difficulty,
        estimatedWeeks,
        description: description.trim(),
        isOfficial: false,
        isPublic,
        isAiGenerated: false,
        creatorId: user?.id || 'current-user',
        creatorName: user?.name || 'You',
        creatorUsername: 'you',
        tags: [rolePath, targetCompanyTier, `${estimatedWeeks}wks`, ...prerequisites.slice(0, 4)],
        nodesData: steps.map((s, idx) => ({
          ...s,
          orderIndex: idx + 1,
          status: idx === 0 ? 'IN_PROGRESS' : 'LOCKED',
          score: 0
        }))
      });

      toast.success('Career Roadmap published successfully!');
      navigate(`/roadmap/${created.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to publish roadmap.');
    }
  };

  const handleTriggerPreview = () => {
    const dummyRoadmap: Roadmap = {
      id: 'preview-temp',
      title: title || 'Untitled Roadmap',
      rolePath,
      category: (rolePath === 'FRONTEND' ? 'FRONTEND' : rolePath === 'BACKEND' ? 'SYSTEM_DESIGN' : 'FULLSTACK') as any,
      targetCompanyTier,
      difficulty,
      estimatedWeeks,
      description,
      isOfficial: false,
      isPublic,
      isAiGenerated: false,
      overallReadiness: 0,
      tags: [rolePath, targetCompanyTier, `${estimatedWeeks}wks`, ...prerequisites.slice(0, 4)],
      creatorId: user?.id || 'current-user',
      creatorName: user?.name || 'You',
      creatorUsername: 'you',
      enrolledCount: 1,
      upvotes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodesData: steps
    };
    setPreviewRoadmap(dummyRoadmap);
  };

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-8 px-4 sm:px-6 lg:px-8 font-body text-[#11183D]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Studio Header & Actions */}
        <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
          
          {/* Breadcrumb & Title */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#526078] mb-1">
                <Link to="/roadmap" className="hover:text-[#2459A8] transition-colors flex items-center gap-1">
                  <ArrowLeft size={13} /> Back to Catalog
                </Link>
                <span>/</span>
                <span className="text-[#2459A8] font-bold">Roadmap Architect Studio</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#11183D] tracking-tight">
                Career Roadmap Creation Studio
              </h1>
              <p className="text-xs text-[#526078] max-w-3xl mt-1">
                Construct calibrated, sequential engineering tracks with clear deliverables. Choose AI diagnostic synthesis, manual step architecture, or fork proven student placement blueprints.
              </p>
            </div>

            {/* Top Action CTAs */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button
                variant="secondary"
                size="md"
                onClick={handleTriggerPreview}
                icon={<Eye size={15} />}
                className="bg-white"
              >
                Preview Tech-Tree
              </Button>

              <Button
                variant="royal"
                size="md"
                onClick={handlePublish}
                icon={<Save size={15} />}
                className="shadow-md"
              >
                Publish Career Roadmap
              </Button>
            </div>
          </div>

          {/* Mode Switcher Bar */}
          <div className="border-t border-[#DCE7F2] pt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#526078] font-display">
                Creation Mode:
              </span>

              {[
                { id: 'manual', label: '🛠️ Visual Milestone Studio', desc: 'Custom sequential step editor' },
                { id: 'ai', label: '🤖 AI Student Diagnostic', desc: 'Intelligent semester-aligned synthesis' },
                { id: 'blueprints', label: '⚡ Fork Proven Blueprints', desc: 'Placement & FAANG tracks' },
              ].map((m) => {
                const active = activeMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleModeChange(m.id as BuilderMode)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-2 ${
                      active
                        ? 'bg-[#2459A8] text-white shadow-xs'
                        : 'bg-[#EFFAFD] text-[#526078] hover:bg-[#F8EAF4] hover:text-[#11183D] border border-[#DCE7F2]'
                    }`}
                  >
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#526078] font-mono">
              <Layers size={14} className="text-[#2459A8]" />
              <span>{steps.length} Milestones Configured</span>
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* MODE 1: AI STUDENT DIAGNOSTIC SYNTHESIS                        */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {activeMode === 'ai' && (
          <AiDiagnosticForm
            onGenerate={handleAiGeneratedRoadmap}
            onCancel={() => handleModeChange('manual')}
          />
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* MODE 2: FORK STUDENT BLUEPRINTS                               */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {activeMode === 'blueprints' && (
          <div className="space-y-6">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold font-display text-[#11183D]">
                Pre-Engineered Student & Placement Blueprints
              </h2>
              <p className="text-xs text-[#526078]">
                Start from vetted blueprints with verified sources, concrete deliverables, and Socratic interview questions. Fork any track directly into the Studio to customize for your semester!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STUDENT_BLUEPRINTS.map((bp) => (
                <StudentBlueprintCard
                  key={bp.id}
                  blueprint={bp}
                  onSelect={handleForkBlueprint}
                />
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* MODE 3: VISUAL MILESTONE STUDIO (MANUAL STEP BUILDER)           */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {activeMode === 'manual' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT / CENTER: Sequential Milestones & General Info (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* General Roadmap Metadata Card */}
              <Card className="p-6 bg-white border-[#DCE7F2] rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                  <h3 className="text-sm font-bold font-display text-[#11183D] flex items-center gap-2">
                    <Compass size={16} className="text-[#2459A8]" />
                    <span>Curriculum Header & Parameters</span>
                  </h3>
                  <span className="text-[11px] font-mono text-[#526078]">Step 1 of 2</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-[#526078] uppercase font-display block mb-1">
                      Roadmap Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Distributed Backend Systems & Concurrency Blueprint"
                      className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs font-bold text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#526078] uppercase font-display block mb-1">
                      Role Specialization
                    </label>
                    <select
                      value={rolePath}
                      onChange={(e) => setRolePath(e.target.value)}
                      className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    >
                      <option value="FULLSTACK">Full Stack Engineer</option>
                      <option value="BACKEND">Backend Infrastructure</option>
                      <option value="FRONTEND">Frontend Platform</option>
                      <option value="DEVOPS">DevOps & Cloud SRE</option>
                      <option value="MOBILE">Mobile Systems (React Native/iOS)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#526078] uppercase font-display block mb-1">
                      Target Company Tier
                    </label>
                    <select
                      value={targetCompanyTier}
                      onChange={(e) => setTargetCompanyTier(e.target.value as any)}
                      className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    >
                      <option value="FAANG">FAANG / Tier-1 Big Tech</option>
                      <option value="Unicorn">High-Growth Unicorn (Stripe, Uber)</option>
                      <option value="Enterprise">Enterprise FinTech / SaaS</option>
                      <option value="Startup">Early-Stage High Velocity</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#526078] uppercase font-display block mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    >
                      <option value="Beginner">Beginner (Foundations)</option>
                      <option value="Intermediate">Intermediate (Production Ready)</option>
                      <option value="Advanced">Advanced (Senior / Staff)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#526078] uppercase font-display block mb-1">
                      Estimated Duration (Weeks)
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={48}
                      value={estimatedWeeks}
                      onChange={(e) => setEstimatedWeeks(parseInt(e.target.value, 10) || 8)}
                      className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] font-mono focus:outline-none focus:border-[#4A8BDF]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-[#526078] uppercase font-display block mb-1">
                      Executive Overview & Mission
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl p-3 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF] font-body"
                    />
                  </div>

                  {/* Prerequisite Competencies */}
                  <div className="sm:col-span-2 space-y-2 pt-2 border-t border-[#DCE7F2]">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-[#526078] uppercase font-display block">
                        Prerequisite Competencies (What students should know first)
                      </label>
                      <span className="text-[10px] text-[#7B8799]">Recommended: 2–4 baseline skills</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {prerequisites.map((prereq, pIdx) => (
                        <span
                          key={pIdx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#EFFAFD] border border-[#4A8BDF]/30 text-xs font-bold font-display text-[#2459A8]"
                        >
                          <span>{prereq}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePrereq(prereq)}
                            className="text-[#7B8799] hover:text-[#A0006D] cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}

                      <div className="inline-flex items-center gap-1">
                        <input
                          type="text"
                          value={newPrereqInput}
                          onChange={(e) => setNewPrereqInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddPrereq();
                            }
                          }}
                          placeholder="+ Add prerequisite skill..."
                          className="bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-2.5 py-1 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                        />
                        {newPrereqInput && (
                          <button
                            type="button"
                            onClick={handleAddPrereq}
                            className="px-2 py-1 bg-[#2459A8] text-white text-[11px] font-bold rounded-lg cursor-pointer"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#11183D] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="rounded text-[#2459A8]"
                    />
                    <span>Publish to Community Marketplace (Others can learn and clone)</span>
                  </label>
                </div>
              </Card>

              {/* Sequential Steps Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-display text-[#11183D]">
                      Sequential Milestone Hierarchy ("One After Another")
                    </h3>
                    <p className="text-xs text-[#526078]">
                      Each milestone defines concrete objectives, verified reading, executable drills, and interview defense checkpoints.
                    </p>
                  </div>

                  <Button
                    variant="royal"
                    size="sm"
                    onClick={handleAddStep}
                    icon={<Plus size={14} />}
                  >
                    Add Custom Step
                  </Button>
                </div>

                {/* Quick Archetype Preset Bar */}
                <div className="p-4 bg-white border border-[#DCE7F2] rounded-3xl shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-display text-[#11183D] flex items-center gap-1.5">
                      <Sparkles size={14} className="text-[#A0006D]" />
                      <span>Quick-Add Milestone Archetype (3 Pillars & Oral Defense Pre-Configured)</span>
                    </span>
                    <span className="text-[10px] text-[#526078]">Click to append full milestone</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {MILESTONE_ARCHETYPES.map((arch, aIdx) => (
                      <button
                        key={aIdx}
                        type="button"
                        onClick={() => handleAddArchetype(arch)}
                        className="p-3 text-left rounded-2xl bg-[#EFFAFD]/60 border border-[#DCE7F2] hover:border-[#4A8BDF] hover:bg-white transition-all cursor-pointer group space-y-1"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{arch.icon}</span>
                          <span className="text-xs font-bold font-display text-[#11183D] group-hover:text-[#2459A8]">
                            {arch.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#526078] line-clamp-2 leading-relaxed">
                          {arch.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Milestone Step Editors */}
                <div className="space-y-4">
                  {steps.map((step, idx) => (
                    <MilestoneStepEditor
                      key={step.id}
                      step={step}
                      index={idx}
                      totalSteps={steps.length}
                      onChange={(updated) => handleUpdateStep(idx, updated)}
                      onMoveUp={() => handleMoveStep(idx, idx - 1)}
                      onMoveDown={() => handleMoveStep(idx, idx + 1)}
                      onDuplicate={() => handleDuplicateStep(idx)}
                      onDelete={() => handleDeleteStep(idx)}
                    />
                  ))}
                </div>

                {/* Add Step Button */}
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="w-full py-4 rounded-3xl border-2 border-dashed border-[#DCE7F2] hover:border-[#2459A8] bg-[#EFFAFD]/40 text-[#2459A8] font-bold font-display text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <Plus size={16} />
                  <span>Append Next Milestone Step</span>
                </button>
              </div>

            </div>

            {/* RIGHT SIDEBAR: Pedagogical Guide & Student Support (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Educational Card: What Does a Roadmap Mean? */}
              <Card className="p-6 bg-gradient-to-br from-[#11183D] to-[#2459A8] text-white rounded-3xl shadow-md space-y-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-white/15 backdrop-blur-sm text-white">
                    <Lightbulb size={16} />
                  </span>
                  <h3 className="text-sm font-bold font-display text-white">
                    What Actually Makes a Great Roadmap?
                  </h3>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-white/90 font-light">
                  <p>
                    A roadmap is not a static syllabus or a video playlist. It is a <strong>calibrated engineering flight plan</strong> that turns an overwhelmed student into an interview-ready engineer.
                  </p>

                  <div className="space-y-2 pt-2 border-t border-white/20">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#EFFAFD]">1. Concrete Order of Dependencies:</span>
                    </div>
                    <p className="text-[11px] text-white/80 pl-4">
                      Students must know <em>why</em> concept A precedes concept B. (e.g. Master single-threaded event loops before distributed microservices).
                    </p>

                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#EFFAFD]">2. Verifiable Definition of Done:</span>
                    </div>
                    <p className="text-[11px] text-white/80 pl-4">
                      Never stop at "Read chapter 3". Require an executable sandbox drill with automated test verification.
                    </p>

                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#EFFAFD]">3. Socratic Defense Under Pressure:</span>
                    </div>
                    <p className="text-[11px] text-white/80 pl-4">
                      Top companies test if you understand <em>why</em> you made architectural choices. Each milestone should have an interview defense checkpoint.
                    </p>
                  </div>
                </div>
              </Card>

              {/* The 3 Pillars Checklist Card */}
              <Card className="p-6 bg-white border-[#DCE7F2] rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-[#168A62]" />
                    <span>The 3-Pillar Standard</span>
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-[#168A62] bg-[#E8F5F0] px-2 py-0.5 rounded-full">
                    RU Ready Certified
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-[#EFFAFD]/60 border border-[#DCE7F2] space-y-1">
                    <strong className="text-[#2459A8] text-[11px] font-bold flex items-center gap-1">
                      <Target size={13} /> Pillar 1: What should I do?
                    </strong>
                    <p className="text-[11px] text-[#526078]">
                      Break objectives into clear checklists and architectural mental models. Mention common student pitfalls to avoid.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#EFFAFD]/60 border border-[#DCE7F2] space-y-1">
                    <strong className="text-[#A0006D] text-[11px] font-bold flex items-center gap-1">
                      <BookOpen size={13} /> Pillar 2: What is the source?
                    </strong>
                    <p className="text-[11px] text-[#526078]">
                      Link high-yield official documentation, RFCs, and engineering papers with realistic reading times.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#EFFAFD]/60 border border-[#DCE7F2] space-y-1">
                    <strong className="text-[#168A62] text-[11px] font-bold flex items-center gap-1">
                      <Code2 size={13} /> Pillar 3: What is the exact thing?
                    </strong>
                    <p className="text-[11px] text-[#526078]">
                      Provide Monaco sandbox starter code and automated pass/fail verification criteria.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Quick Publish Card */}
              <Card className="p-6 bg-white border-[#DCE7F2] rounded-3xl shadow-sm space-y-3 text-center">
                <h4 className="text-xs font-bold text-[#11183D] font-display">
                  Ready to Launch this Blueprint?
                </h4>
                <p className="text-[11px] text-[#526078]">
                  Publishing saves this roadmap to your profile, makes it visible in the marketplace, and activates interactive tracking.
                </p>

                <Button
                  variant="royal"
                  size="md"
                  onClick={handlePublish}
                  icon={<Save size={15} />}
                  className="w-full shadow-md justify-center text-xs"
                >
                  Publish & Start Learning
                </Button>
              </Card>

            </div>

          </div>
        )}

        {/* Live Preview Modal */}
        <RoadmapPreviewModal
          roadmap={previewRoadmap}
          isOpen={!!previewRoadmap}
          onClose={() => setPreviewRoadmap(null)}
          onEnrollAndStart={(r) => {
            setPreviewRoadmap(null);
            handlePublish();
          }}
        />

      </div>
    </div>
  );
}
