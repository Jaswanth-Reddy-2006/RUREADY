import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Clock, Code2, AlertTriangle, 
  ArrowLeft, Shield, Terminal, Check, ArrowRight
} from 'lucide-react';
import { z } from 'zod';
import { useCodingInterviewStore } from '../../store/useCodingInterviewStore';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const ALGORITHMIC_PATTERNS = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack & Queues',
  'Binary Search',
  'Trees & Graphs',
  'Dynamic Programming',
  'Backtracking',
  'Greedy Algorithms',
  'Bit Manipulation',
];

const DIFFICULTY_METADATA = {
  EASY: {
    title: 'Easy Track',
    desc: 'Standard arrays, lookup operations, hash tables, and elementary two-pointer array loops.',
    icon: Code2,
    badgeVariant: 'teal' as const,
  },
  MEDIUM: {
    title: 'Medium Track',
    desc: 'Dynamic programming, sliding windows, graphs traversal, tree lookups, and algorithmic search nodes.',
    icon: Sparkles,
    badgeVariant: 'orange' as const,
  },
  HARD: {
    title: 'Hard Track',
    desc: 'Advanced graph algorithms, composite DP matrices, string parsers, and adversarial Socratic follow-ups.',
    icon: Terminal,
    badgeVariant: 'red' as const,
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

      const goalMeta = `[Mode: CODING][Problems: ${problemCount}][Difficulty: ${difficulty}][Topics: ${selectedTopics.join(',')}]`;

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

      toast.success('Coding room ready!', { id: setupToast });
      resetStore();
      navigate(`/interview/coding/${sessionId}`);
    } catch (err: any) {
      console.error('Failed to initialize coding interview session:', err);
      const errMessage = err.response?.data?.message || 'Failed to initialize coding environment.';
      setValidationError(errMessage);
      toast.error(errMessage, { id: setupToast });
      setSubmitting(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#11183D]/70 backdrop-blur-md">
          <div className="mx-4 max-w-md w-full rounded-3xl border border-[#DCE7F2] bg-[#11183D] p-8 text-center shadow-xl">
            <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-[#4A8BDF] border-t-transparent" />
            <h3 className="text-lg font-bold font-display text-white mb-2">
              Preparing Monaco IDE
            </h3>
            <p className="text-xs text-[#DCE7F2] font-body">
              Generating problem test suites and test matrices...
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mb-6">
        <Link 
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#526078] hover:text-[#11183D] transition-colors font-display"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 text-center max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#11183D] font-display tracking-tight mb-2">
          Configure Coding Track
        </h1>
        <p className="text-sm text-[#526078] font-body">
          Calibrate algorithmic difficulty, problem count, and data structure topics.
        </p>
      </div>

      {/* Main Card */}
      <Card padding="lg" className="shadow-sm border-[#DCE7F2] bg-white space-y-7">
        
        {/* Validation Alert */}
        {validationError && (
          <div className="flex items-start gap-3 rounded-2xl bg-[#FDF0F0] border border-[#D64545]/25 p-4 text-xs text-[#D64545] shadow-sm font-body">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-bold font-display block mb-0.5">Configuration Alert:</span>
              <span>{validationError}</span>
            </div>
          </div>
        )}

        {/* 1. Difficulty Tiers */}
        <div className="space-y-3.5">
          <div className="border-b border-[#DCE7F2] pb-3">
            <h3 className="text-sm font-bold font-display text-[#11183D]">
              1. Difficulty Tier
            </h3>
            <p className="text-xs text-[#526078] font-body mt-0.5">
              Determines algorithmic test case rigor and follow-up depth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[140px] cursor-pointer group ${
                    isSelected
                      ? 'border-[#4A8BDF] bg-[#EFF7FD] ring-1 ring-[#4A8BDF]/30 shadow-sm'
                      : 'border-[#DCE7F2] bg-white hover:border-[#4A8BDF]/30 hover:bg-[#EFFAFD]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-[#4A8BDF] text-white shadow-sm' : 'bg-[#EFFAFD] text-[#11183D]'}`}>
                      <IconComponent size={16} />
                    </div>
                    <Badge variant={meta.badgeVariant} size="xs">
                      {tier}
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-1">
                    <h4 className="text-xs font-bold font-display text-[#11183D]">{meta.title}</h4>
                    <p className="text-[11px] leading-relaxed text-[#526078] font-body">
                      {meta.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Bounds & Session Timers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#DCE7F2]">
          
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#526078] font-display">
                Problem Count
              </label>
              <span className="text-xs font-bold bg-[#EFF7FD] text-[#4A8BDF] border border-[#4A8BDF]/20 px-2.5 py-0.5 rounded-full font-mono">
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
            <div className="flex justify-between text-[10px] text-[#7B8799] font-mono">
              <span>1 Problem</span>
              <span>3 Problems</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#526078] font-display flex items-center gap-1">
                <Clock size={12} className="text-[#4A8BDF]" />
                <span>Session Duration</span>
              </label>
              <span className="text-xs font-bold bg-[#EFF7FD] text-[#4A8BDF] border border-[#4A8BDF]/20 px-2.5 py-0.5 rounded-full font-mono">
                {durationMins} Minutes
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
            <div className="flex justify-between text-[10px] text-[#7B8799] font-mono">
              <span>30 Min</span>
              <span>90 Min</span>
            </div>
          </div>

        </div>

        {/* 3. Algorithmic Patterns */}
        <div className="space-y-3 pt-4 border-t border-[#DCE7F2]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#526078] font-display">
              Algorithmic Focus Topics <span className="text-[#D64545]">*</span>
            </h3>
            <span className="text-[11px] text-[#7B8799] font-body">Select at least one</span>
          </div>

          <div className="flex flex-wrap gap-2 p-4 rounded-2xl border border-[#DCE7F2] bg-[#EFFAFD]/40 max-h-48 overflow-y-auto">
            {ALGORITHMIC_PATTERNS.map((topic) => {
              const isSelected = selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleTopicToggle(topic)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#4A8BDF] text-white border-[#4A8BDF] shadow-sm'
                      : 'bg-white text-[#526078] border-[#DCE7F2] hover:border-[#4A8BDF]/40 hover:text-[#4A8BDF] hover:bg-[#EFFAFD]'
                  }`}
                >
                  {isSelected && <Check size={12} />}
                  <span>{topic}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-[#DCE7F2] flex justify-end">
          <Button
            size="lg"
            onClick={handleStartCodingInterview}
            disabled={isSubmitting}
            iconRight={<ArrowRight size={16} />}
          >
            Start Coding Assessment →
          </Button>
        </div>

      </Card>

      {/* Security Note */}
      <div className="mt-6 flex justify-center items-center gap-2 text-xs text-[#7B8799] font-body">
        <Shield size={14} className="text-[#168A62]" />
        <span>Anti-Cheat Viewport Sync Active • Sandboxed Node.js VM Execution</span>
      </div>

    </div>
  );
}
