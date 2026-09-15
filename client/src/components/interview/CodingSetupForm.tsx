import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Clock, Code2, AlertTriangle, 
  ArrowLeft, Shield, Terminal, Check, ArrowRight,
  Cpu, Layers, CheckCircle2, ShieldCheck, Zap,
  Filter, CheckSquare, XSquare, Info, BookOpen
} from 'lucide-react';
import { z } from 'zod';
import { useCodingInterviewStore } from '../../store/useCodingInterviewStore';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const PATTERN_CATEGORIES: Record<string, { desc: string; topics: string[] }> = {
  'Data Structures': {
    desc: 'Core contiguous and node-based memory structures & lookup tables',
    topics: [
      'Arrays & Hashing',
      'Two Pointers',
      'Stack & Queues',
      'Linked Lists',
      'Trees & Binary Search Trees',
      'Tries & Prefix Trees',
      'Heaps & Priority Queues'
    ]
  },
  'Algorithms & Search': {
    desc: 'Traversal, optimization, greedy choices, and recursive search strategies',
    topics: [
      'Sliding Window',
      'Binary Search',
      'Breadth-First Search (BFS)',
      'Depth-First Search (DFS)',
      'Backtracking',
      'Greedy Algorithms'
    ]
  },
  'Advanced Paradigms': {
    desc: 'Multi-state transformations, graphs, and combinatorial complexity',
    topics: [
      'Dynamic Programming (1D & 2D)',
      'Graph Algorithms & Topological Sort',
      'Union Find (Disjoint Set)',
      'Bit Manipulation',
      'Interval Scheduling'
    ]
  }
};

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', runtime: 'Node.js 20', ext: 'js', badge: 'V8 Engine' },
  { id: 'typescript', label: 'TypeScript', runtime: 'TS 5.4 / Node', ext: 'ts', badge: 'Strict Types' },
  { id: 'python', label: 'Python 3', runtime: 'CPython 3.12', ext: 'py', badge: 'Fast NumPy' },
  { id: 'java', label: 'Java 17', runtime: 'OpenJDK 17', ext: 'java', badge: 'JVM HotSpot' },
  { id: 'cpp', label: 'C++', runtime: 'GCC 13 (C++20)', ext: 'cpp', badge: 'Native GCC' },
  { id: 'go', label: 'Go', runtime: 'Golang 1.22', ext: 'go', badge: 'Goroutines' }
];

const DIFFICULTY_METADATA = {
  EASY: {
    title: 'Easy Track',
    tagline: 'Foundations & Linear Structures',
    desc: 'Focuses on clean loops, array manipulation, hash map lookups, two-pointer bounds, and basic string parsing.',
    icon: Code2,
    badgeVariant: 'teal' as const,
    complexityTarget: 'O(N) time • O(1) space',
    typicalPatterns: ['Arrays & HashMaps', 'Two Pointers', 'Linear Traversal']
  },
  MEDIUM: {
    title: 'Medium Track',
    tagline: 'Standard Industry Interview Tier',
    desc: 'Dynamic programming, sliding windows, graph BFS/DFS traversals, binary search trees, and heap intervals.',
    icon: Sparkles,
    badgeVariant: 'orange' as const,
    complexityTarget: 'O(N log N) / O(N) time',
    typicalPatterns: ['Sliding Window', 'Binary Search', 'Trees & Graphs', '1D/2D DP']
  },
  HARD: {
    title: 'Hard Track',
    tagline: 'Adversarial & High-Complexity Tier',
    desc: 'Complex graph topologies, composite DP state compression, prefix tries, advanced segment trees, and adversarial edge-cases.',
    icon: Terminal,
    badgeVariant: 'red' as const,
    complexityTarget: 'Optimal bounds & state compression',
    typicalPatterns: ['Topological Sort', 'State-Space DP', 'Adversarial Edge Cases']
  },
};

const codingSetupSchema = z.object({
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  problemCount: z.number().min(1).max(3),
  durationMins: z.number().min(30).max(90),
  selectedTopics: z.array(z.string()).min(1, 'Select at least one algorithmic pattern.'),
});

export default function CodingSetupForm() {
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('Data Structures');

  const {
    difficulty,
    problemCount,
    durationMins,
    selectedTopics,
    isSubmitting,
    setDifficulty,
    setProblemCount,
    setDurationMins,
    toggleTopic,
    setSubmitting,
    resetStore,
  } = useCodingInterviewStore();

  const handleTopicToggle = (topic: string) => {
    toggleTopic(topic);
    setValidationError(null);
  };

  const handleSelectAllCategory = (category: string) => {
    const topics = PATTERN_CATEGORIES[category]?.topics || [];
    topics.forEach(t => {
      if (!selectedTopics.includes(t)) {
        toggleTopic(t);
      }
    });
    setValidationError(null);
  };

  const handleClearCategory = (category: string) => {
    const topics = PATTERN_CATEGORIES[category]?.topics || [];
    topics.forEach(t => {
      if (selectedTopics.includes(t)) {
        toggleTopic(t);
      }
    });
  };

  const handleStartCodingInterview = async () => {
    setValidationError(null);

    const validationResult = codingSetupSchema.safeParse({
      difficulty,
      problemCount,
      durationMins,
      selectedTopics,
    });

    if (!validationResult.success) {
      const errorMsg = validationResult.error.errors[0].message;
      setValidationError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setSubmitting(true);
    const setupToast = toast.loading('Initializing Socratic coding sandbox...');

    try {
      const experienceLevel = 
        difficulty === 'EASY' ? 'FRESHER' : 
        difficulty === 'MEDIUM' ? 'MID' : 'SENIOR';

      const goalMeta = `[Mode: CODING][Problems: ${problemCount}][Difficulty: ${difficulty}][Language: ${selectedLanguage}][Topics: ${selectedTopics.join(',')}]`;

      const response = await apiClient.post('/interview/session', {
        interviewType: 'CODING',
        targetRole: 'Software Engineer (Coding Track)',
        targetCompany: 'Technical Hiring Board',
        industry: 'Technology',
        experienceLevel,
        focusAreas: selectedTopics,
        interviewGoal: goalMeta,
        durationMins,
        mode: 'CODING',
      });

      const sessionId = response.data.id;
      await apiClient.post(`/interview/session/${sessionId}/start`);

      toast.success('Coding environment calibrated!', { id: setupToast });
      resetStore();
      navigate(`/interview/${sessionId}/device-check`);
    } catch (err: any) {
      console.error('Failed to initialize coding interview session:', err);
      const errMessage = err.response?.data?.message || 'Failed to initialize coding environment.';
      setValidationError(errMessage);
      toast.error(errMessage, { id: setupToast });
      setSubmitting(false);
    }
  };

  const minutesPerProblem = Math.round(durationMins / problemCount);
  const activeTopicsInCurrentCategory = (PATTERN_CATEGORIES[activeCategoryTab]?.topics || []).filter(t => selectedTopics.includes(t)).length;
  const totalTopicsInCurrentCategory = PATTERN_CATEGORIES[activeCategoryTab]?.topics.length || 0;

  return (
    <div className="relative mx-auto max-w-5xl xl:max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#11183D]/80 backdrop-blur-md">
          <div className="mx-4 max-w-md w-full rounded-3xl border border-[#DCE7F2] bg-[#11183D] p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-[#4A8BDF] border-t-transparent" />
            <h3 className="text-lg font-bold font-display text-white mb-2">
              Preparing Monaco IDE & VM Sandbox
            </h3>
            <p className="text-xs text-[#DCE7F2] font-body">
              Calibrating runtime compilers, test suites, and Socratic hints...
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link 
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#526078] hover:text-[#11183D] transition-colors font-display"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <span className="text-xs font-mono text-[#526078]">Step 1 of 2: Session Configuration</span>
      </div>

      {/* Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFFAFD] border border-[#DCE7F2] text-[#4A8BDF] text-xs font-bold mb-1">
          <Code2 size={14} />
          <span>Interactive Coding Studio Setup</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#11183D] font-display tracking-tight">
          Configure Coding Track
        </h1>
        <p className="text-sm text-[#334155] font-body leading-relaxed">
          Customize your algorithmic syllabus, preferred programming runtime, difficulty rigor, and live pacing constraints before entering the sandbox studio.
        </p>
      </div>

      {/* Main Card */}
      <Card padding="lg" className="shadow-sm border-[#DCE7F2] bg-white space-y-8 sm:space-y-10 p-6 sm:p-8 lg:p-10 rounded-3xl">
        
        {/* Validation Alert */}
        {validationError && (
          <div className="flex items-start gap-3 rounded-2xl bg-[#FDF0F0] border border-[#D64545]/25 p-4 text-xs text-[#D64545] shadow-sm font-body animate-in fade-in">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-bold font-display block mb-0.5">Configuration Alert:</span>
              <span>{validationError}</span>
            </div>
          </div>
        )}

        {/* 1. Difficulty Tiers */}
        <div className="space-y-4">
          <div className="border-b border-[#DCE7F2] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <span className="text-xs font-bold text-[#4A8BDF] uppercase tracking-wider font-mono block mb-0.5">
                Section 1 of 4
              </span>
              <h3 className="text-base font-bold font-display text-[#11183D]">
                Difficulty & Algorithmic Rigor
              </h3>
            </div>
            <span className="text-xs text-[#526078] font-body">
              Determines test case complexity, time constraints, and Socratic hints
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {(Object.keys(DIFFICULTY_METADATA) as Array<'EASY' | 'MEDIUM' | 'HARD'>).map((tier) => {
              const meta = DIFFICULTY_METADATA[tier];
              const isSelected = difficulty === tier;
              const IconComponent = meta.icon;

              return (
                <button
                  key={tier}
                  type="button"
                  onClick={() => {
                    setDifficulty(tier);
                    setValidationError(null);
                  }}
                  className={`text-left p-5 sm:p-6 rounded-2xl border transition-all flex flex-col justify-between min-h-[180px] cursor-pointer group relative overflow-hidden ${
                    isSelected
                      ? 'border-[#4A8BDF] bg-[#EFF7FD] ring-2 ring-[#4A8BDF]/30 shadow-md'
                      : 'border-[#DCE7F2] bg-white hover:border-[#4A8BDF]/40 hover:bg-[#EFFAFD]/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between w-full mb-3">
                      <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${isSelected ? 'bg-[#4A8BDF] text-white shadow-sm' : 'bg-[#EFFAFD] text-[#11183D] group-hover:bg-[#4A8BDF]/10'}`}>
                        <IconComponent size={20} />
                      </div>
                      <Badge variant={meta.badgeVariant} size="xs">
                        {tier}
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold font-display text-[#11183D]">{meta.title}</h4>
                      <p className="text-[11px] font-semibold text-[#4A8BDF] font-mono">{meta.tagline}</p>
                      <p className="text-xs leading-relaxed text-[#334155] font-body pt-1">
                        {meta.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#DCE7F2]/60 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#526078]">
                      <span>Target:</span>
                      <span className="font-bold text-[#11183D]">{meta.complexityTarget}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {meta.typicalPatterns.map((pat, idx) => (
                        <span key={idx} className="text-[9px] font-mono bg-white/80 border border-[#DCE7F2] px-1.5 py-0.5 rounded text-[#526078]">
                          {pat}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Language Selection */}
        <div className="space-y-4 pt-4 border-t border-[#DCE7F2]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <span className="text-xs font-bold text-[#4A8BDF] uppercase tracking-wider font-mono block mb-0.5">
                Section 2 of 4
              </span>
              <h3 className="text-base font-bold font-display text-[#11183D]">
                Primary Programming Runtime
              </h3>
            </div>
            <span className="text-xs text-[#526078] font-body">
              Monaco editor syntax & sandboxed backend compiler
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5 sm:gap-4">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'border-[#4A8BDF] bg-[#EFF7FD] text-[#4A8BDF] font-bold shadow-sm ring-2 ring-[#4A8BDF]/30'
                      : 'border-[#DCE7F2] bg-white text-[#334155] hover:border-[#4A8BDF]/40 hover:bg-[#EFFAFD]/50'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 text-[#4A8BDF]">
                      <Check size={14} />
                    </div>
                  )}
                  <span className="text-sm font-mono font-extrabold uppercase tracking-wide text-[#11183D]">{lang.ext}</span>
                  <span className="text-xs font-display text-center font-bold text-[#11183D] mt-1">{lang.label}</span>
                  <span className="text-[10px] font-mono text-[#526078] mt-0.5">{lang.runtime}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Algorithmic Patterns with Categorized Tabs */}
        <div className="space-y-4 pt-4 border-t border-[#DCE7F2]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-[#4A8BDF] uppercase tracking-wider font-mono block mb-0.5">
                Section 3 of 4
              </span>
              <h3 className="text-base font-bold font-display text-[#11183D] flex items-center gap-2">
                <span>Algorithmic Syllabus & Patterns</span>
                <span className="text-[#D64545]">*</span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-[#EFF7FD] text-[#4A8BDF] border border-[#4A8BDF]/20">
                {selectedTopics.length} Patterns Active
              </span>
            </div>
          </div>

          {/* Category Tabs & Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE7F2] pb-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {Object.keys(PATTERN_CATEGORIES).map((cat) => {
                const count = (PATTERN_CATEGORIES[cat]?.topics || []).filter(t => selectedTopics.includes(t)).length;
                const isTabActive = activeCategoryTab === cat;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategoryTab(cat)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                      isTabActive
                        ? 'bg-[#4A8BDF] text-white shadow-sm'
                        : 'bg-[#EFFAFD] text-[#526078] hover:text-[#11183D] hover:bg-[#DCE7F2]'
                    }`}
                  >
                    <span>{cat}</span>
                    {count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        isTabActive ? 'bg-white text-[#4A8BDF]' : 'bg-[#4A8BDF]/20 text-[#4A8BDF]'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleSelectAllCategory(activeCategoryTab)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4A8BDF] hover:text-[#2459A8] transition-colors px-2 py-1 rounded-lg hover:bg-[#EFFAFD]"
              >
                <CheckSquare size={12} />
                <span>Select All in Tab</span>
              </button>
              <button
                type="button"
                onClick={() => handleClearCategory(activeCategoryTab)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#526078] hover:text-[#D64545] transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
              >
                <XSquare size={12} />
                <span>Clear Tab</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-[#526078] font-body italic">
            {PATTERN_CATEGORIES[activeCategoryTab]?.desc}
          </p>

          {/* Spacious Pattern Pill Matrix */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3 p-5 sm:p-6 rounded-2xl border border-[#DCE7F2] bg-[#EFFAFD]/40 min-h-[120px]">
            {(PATTERN_CATEGORIES[activeCategoryTab]?.topics || []).map((topic) => {
              const isSelected = selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleTopicToggle(topic)}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#4A8BDF] text-white border-[#4A8BDF] shadow-sm scale-[1.02]'
                      : 'bg-white text-[#334155] border-[#DCE7F2] hover:border-[#4A8BDF]/40 hover:text-[#4A8BDF] hover:bg-white'
                  }`}
                >
                  <div className={`h-4 w-4 rounded-md flex items-center justify-center text-[10px] ${isSelected ? 'bg-white text-[#4A8BDF]' : 'border border-[#DCE7F2]'}`}>
                    {isSelected ? <Check size={10} strokeWidth={3} /> : null}
                  </div>
                  <span>{topic}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Bounds & Session Timers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4 border-t border-[#DCE7F2]">
          
          <div className="space-y-3 p-5 rounded-2xl bg-[#EFFAFD]/30 border border-[#DCE7F2]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                Problem Count
              </label>
              <span className="text-xs font-bold bg-[#EFF7FD] text-[#4A8BDF] border border-[#4A8BDF]/20 px-3 py-0.5 rounded-full font-mono">
                {problemCount} Problem{problemCount > 1 ? 's' : ''}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={problemCount}
              onChange={(e) => setProblemCount(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-[#DCE7F2] rounded-lg appearance-none cursor-pointer accent-[#4A8BDF] focus:outline-none"
            />
            <div className="flex justify-between text-[11px] text-[#526078] font-mono">
              <span>1 Problem (Deep Dive)</span>
              <span>2 Problems (Standard)</span>
              <span>3 Problems (Speed Matrix)</span>
            </div>
            <p className="text-[11px] text-[#526078] font-body pt-1">
              {problemCount === 1 && "In-depth algorithmic architecture, optimal edge-case handling, and rigorous complexity defense."}
              {problemCount === 2 && "Balanced industry standard format covering one core structure and one optimization problem."}
              {problemCount === 3 && "High-tempo competitive interview testing rapid implementation and pattern recognition."}
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-[#EFFAFD]/30 border border-[#DCE7F2]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display flex items-center gap-1.5">
                <Clock size={14} className="text-[#4A8BDF]" />
                <span>Session Duration</span>
              </label>
              <span className="text-xs font-bold bg-[#EFF7FD] text-[#4A8BDF] border border-[#4A8BDF]/20 px-3 py-0.5 rounded-full font-mono">
                {durationMins} Min (≈ {minutesPerProblem}m / problem)
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="90"
              step="15"
              value={durationMins}
              onChange={(e) => setDurationMins(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-[#DCE7F2] rounded-lg appearance-none cursor-pointer accent-[#4A8BDF] focus:outline-none"
            />
            <div className="flex justify-between text-[11px] text-[#526078] font-mono">
              <span>30 Min</span>
              <span>45 Min</span>
              <span>60 Min</span>
              <span>75 Min</span>
              <span>90 Min</span>
            </div>

            {/* Pacing Breakdown Gauge */}
            <div className="pt-2 border-t border-[#DCE7F2]/60 flex items-center justify-between text-[11px] font-mono text-[#526078]">
              <span>Clarification: 5m</span>
              <span>Coding: {Math.max(10, minutesPerProblem - 10)}m</span>
              <span>Defense & Hints: 5m</span>
            </div>
          </div>

        </div>

        {/* Summary Review & Launch Action Bar */}
        <div className="pt-4 border-t border-[#DCE7F2] flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2]">
          <div className="space-y-1 text-left w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#11183D] font-display">Session Plan:</span>
              <span className="text-xs font-mono font-bold text-[#4A8BDF] bg-white border border-[#DCE7F2] px-2 py-0.5 rounded-md">
                {difficulty} TRACK
              </span>
              <span className="text-xs font-mono font-bold text-[#11183D] bg-white border border-[#DCE7F2] px-2 py-0.5 rounded-md">
                {selectedLanguage.toUpperCase()}
              </span>
              <span className="text-xs font-mono font-bold text-[#168A62] bg-white border border-[#DCE7F2] px-2 py-0.5 rounded-md">
                {problemCount} Qs • {durationMins}m
              </span>
            </div>
            <p className="text-[11px] text-[#526078] font-body">
              {selectedTopics.length} algorithmic pattern{selectedTopics.length !== 1 ? 's' : ''} loaded into Monaco sandbox
            </p>
          </div>

          <Button
            size="lg"
            variant="royal"
            onClick={handleStartCodingInterview}
            disabled={isSubmitting || selectedTopics.length === 0}
            iconRight={<ArrowRight size={16} />}
            className="shadow-md shrink-0 w-full sm:w-auto"
          >
            Launch Coding Studio →
          </Button>
        </div>

      </Card>

      {/* Security & Sandbox Info Note */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3 text-xs text-[#7B8799] font-body text-center">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={15} className="text-[#168A62]" />
          <span>Anti-Cheat Viewport Sync</span>
        </div>
        <span className="hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5">
          <Cpu size={15} className="text-[#4A8BDF]" />
          <span>Sandboxed Node.js/GCC VM Execution</span>
        </div>
        <span className="hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5">
          <Sparkles size={15} className="text-[#A0006D]" />
          <span>Ava Socratic AI Dialogue Engine</span>
        </div>
      </div>

    </div>
  );
}


