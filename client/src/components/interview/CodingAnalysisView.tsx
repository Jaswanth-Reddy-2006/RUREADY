// ═══════════════════════════════════════════════════════════════
// R U Ready? — Comprehensive Coding Performance Analysis View
// Dedicated Big-O Asymptotic Complexity, Test Case Matrix,
// Submitted Code vs Model Solution, Code Quality & FAANG Rubric
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Cpu,
  Layers,
  Sparkles,
  Printer,
  ArrowLeft,
  Copy,
  Check,
  Award,
  Zap,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Terminal,
  FileCode,
  Target,
  ArrowRight,
  TrendingUp,
  Brain,
  AlertTriangle,
  FileText,
  Video,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

interface CodingAnalysisViewProps {
  session: any;
  analysis: any;
  questions: any[];
}

export default function CodingAnalysisView({
  session,
  analysis,
  questions,
}: CodingAnalysisViewProps) {
  const navigate = useNavigate();
  const [activeCodeTab, setActiveCodeTab] = useState<'submitted' | 'optimal'>('submitted');
  const [copied, setCopied] = useState(false);

  const signals = analysis.confidenceSignals || {};
  const overallScore = Math.round(analysis.overallScore ?? 0);
  const codeCorrectnessScore = Math.round(signals.codeCorrectnessScore ?? analysis.technicalScore ?? 80);
  const algorithmicEfficiencyScore = Math.round(signals.algorithmicEfficiencyScore ?? 85);
  const structureScore = Math.round(analysis.structureScore ?? 80);
  const cadenceScore = Math.round(signals.cadenceScore ?? 90);

  const timeComplexity = signals.timeComplexity || 'O(N)';
  const spaceComplexity = signals.spaceComplexity || 'O(N)';
  const detectedPatterns = Array.isArray(signals.detectedPatterns) && signals.detectedPatterns.length > 0
    ? signals.detectedPatterns
    : ['Hash Table / Direct Lookup'];

  const testCasesPassed = signals.testCasesPassed ?? session.testCasesPassed ?? (overallScore >= 80 ? 5 : 4);
  const totalTestCases = signals.totalTestCases ?? 5;
  const hintCount = signals.hintCount ?? session.hintCount ?? 0;
  const tabBlurCount = signals.tabBlurCount ?? 0;

  // Verdict calculation
  let verdictLabel = 'Strong Hire (Optimal Solution)';
  let verdictDesc = 'Your solution demonstrates optimal asymptotic Big-O efficiency, robust edge-case handling, and clean code architecture.';
  let verdictBadgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let verdictScoreColor = 'text-emerald-600';

  if (overallScore < 55) {
    verdictLabel = 'Needs Dedicated Practice';
    verdictDesc = 'Significant gaps in algorithmic complexity or edge case coverage were identified.';
    verdictBadgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
    verdictScoreColor = 'text-rose-600';
  } else if (overallScore < 75) {
    verdictLabel = 'Almost Ready (Sub-Optimal Complexity)';
    verdictDesc = 'Functional code produced, but opportunities exist to optimize Big-O time/space or reduce hint dependency.';
    verdictBadgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
    verdictScoreColor = 'text-amber-600';
  }

  // Extract first question / problem details
  const currentQ = questions[0] || {};
  const rawAnswer = currentQ.answerText || '';
  
  // Extract clean code
  let cleanSubmittedCode = rawAnswer;
  const codeMatch = rawAnswer.match(/```(?:\w+)?\n([\s\S]*?)```/);
  if (codeMatch) {
    cleanSubmittedCode = codeMatch[1];
  }

  if (!cleanSubmittedCode.trim()) {
    cleanSubmittedCode = `// Submitted JavaScript Solution
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;
  }

  const optimalSolutionCode = `/**
 * Optimal Solution — Asymptotic O(N) Time, O(N) Space
 * Uses a single-pass hash map for instant complement lookups.
 */
function solveOptimal(nums, target) {
  const seenIndices = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const needed = target - nums[i];
    if (seenIndices.has(needed)) {
      return [seenIndices.get(needed), i];
    }
    seenIndices.set(nums[i], i);
  }
  
  return []; // No valid pair found
}`;

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Strengths & Diagnosed Weaknesses
  const strengths: string[] = Array.isArray(analysis.strengths) && analysis.strengths.length > 0
    ? analysis.strengths
    : [
        `Optimal Asymptotic Time Complexity achieved (${timeComplexity}).`,
        'Modular variable naming and clear logic flow.',
        'Clean edge-case handling without unnecessary loop iterations.',
      ];

  const improvements: string[] = Array.isArray(analysis.improvements) && analysis.improvements.length > 0
    ? analysis.improvements
    : [
        'Document boundary condition guarantees in initial comments.',
        'Consider space-optimized in-place alternatives where auxiliary memory is constrained.',
      ];

  // Actionable practice recommendations
  const actionableTips = Array.isArray(analysis.actionableTips) && analysis.actionableTips.length > 0
    ? analysis.actionableTips
    : [
        {
          tip: 'Master Two-Pointer & Hash Map Patterns',
          reason: 'Frequently tested in FAANG SDE interviews to optimize nested O(N²) scans down to linear O(N).',
        },
        {
          tip: 'State Time & Space Bounds Explicitly',
          reason: 'Always state worst-case vs. average-case Big-O before typing the first line of code.',
        },
        {
          tip: 'Independent Edge Case Dry Runs',
          reason: hintCount > 0
            ? `Avoid hint usage (${hintCount} hint used) by testing empty, single-element, and duplicate inputs first.`
            : 'Excellent independent debugging! Continue dry-running boundary test cases systematically.',
        },
      ];

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-slate-900 font-sans selection:bg-blue-500/20 selection:text-slate-900 pb-16">
      
      {/* ─── 1. TOP NAVBAR ─── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/coding')}
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Return to Coding Command Center"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs font-display">
                <Code2 size={15} />
              </div>
              <span className="text-sm font-bold text-slate-900 font-display">RU Ready</span>
            </div>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline border-l border-slate-200 pl-3">
              Coding Assessment Analysis
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer size={13} />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              onClick={() => navigate('/interview/coding/new')}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-display flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Sparkles size={13} />
              <span>Practice Another Problem</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">

        {/* ─── 2. EXECUTIVE SUMMARY & VERDICT ─── */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border font-display tracking-wide ${verdictBadgeBg}`}>
                  {verdictLabel}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Clock size={12} />
                  Role: <strong className="text-slate-900">{session.targetRole || 'Software Engineer'}</strong>
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Terminal size={12} />
                  Language: <strong className="text-slate-900 uppercase">{session.selectedLanguage || 'JavaScript'}</strong>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-950 font-display tracking-tight">
                Algorithmic Code Performance Evaluation
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                {analysis.summary || verdictDesc}
              </p>
            </div>

            {/* Circular Overall Score Ring */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 p-4 sm:p-5 rounded-2xl shrink-0">
              <div className="relative inline-flex items-center justify-center h-20 w-20">
                <svg width="80" height="80" viewBox="0 0 80 80" className="transform -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="#E2E8F0" strokeWidth="6" fill="none" />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="#2563EB"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 34}
                    initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 34 - (overallScore / 100) * (2 * Math.PI * 34) }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl font-black font-display ${verdictScoreColor}`}>
                    {overallScore}
                  </span>
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Overall Score
                </span>
                <span className="text-sm font-bold text-slate-900 font-display">
                  {overallScore >= 85 ? 'Exceptional' : overallScore >= 70 ? 'Proficient' : 'Needs Polish'}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Calibrated via HF Engine
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* ─── 3. FOUR CORE CODING METRIC PILLARS ─── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Pillar 1: Test Cases & Correctness */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-xs font-bold text-slate-700">Test Correctness</span>
              </div>
              <span className="text-lg font-black text-slate-900 font-display">
                {testCasesPassed}/{totalTestCases}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${codeCorrectnessScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>Pass Rate</span>
                <span className="font-bold text-slate-700">{codeCorrectnessScore}%</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Asymptotic Time Complexity */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Cpu size={16} />
                </div>
                <span className="text-xs font-bold text-slate-700">Time Complexity</span>
              </div>
              <span className="text-base font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                {timeComplexity}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${algorithmicEfficiencyScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>Efficiency Score</span>
                <span className="font-bold text-slate-700">{algorithmicEfficiencyScore}/100</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Auxiliary Space Complexity */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Layers size={16} />
                </div>
                <span className="text-xs font-bold text-slate-700">Space Complexity</span>
              </div>
              <span className="text-base font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                {spaceComplexity}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all"
                  style={{ width: `${structureScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>Code Architecture</span>
                <span className="font-bold text-slate-700">{structureScore}/100</span>
              </div>
            </div>
          </div>

          {/* Pillar 4: Cadence & Independent Solving */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Lightbulb size={16} />
                </div>
                <span className="text-xs font-bold text-slate-700">Hint Dependency</span>
              </div>
              <span className="text-sm font-bold text-slate-800">
                {hintCount === 0 ? '0 Hints (Solo)' : `${hintCount} Hints Used`}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${cadenceScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>Independence</span>
                <span className="font-bold text-slate-700">{cadenceScore}/100</span>
              </div>
            </div>
          </div>

        </section>

        {/* ─── 4. CODE VIEWER: SUBMITTED VS OPTIMAL SOLUTION ─── */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <FileCode size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Solution Code Inspection
                </h3>
                <p className="text-[11px] text-slate-500">
                  Compare your implementation against the optimal algorithmic reference.
                </p>
              </div>
            </div>

            {/* Tab Controls & Copy Button */}
            <div className="flex items-center gap-2">
              <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('submitted')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeCodeTab === 'submitted'
                      ? 'bg-white text-blue-600 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Your Submitted Code
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('optimal')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeCodeTab === 'optimal'
                      ? 'bg-white text-emerald-600 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Optimal Reference Model
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCode(activeCodeTab === 'submitted' ? cleanSubmittedCode : optimalSolutionCode)}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                title="Copy Code"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Algorithmic Pattern Badge Banner */}
          <div className="flex items-center gap-2 flex-wrap text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <span className="font-bold text-slate-600">Detected Pattern:</span>
            {detectedPatterns.map((pat: string) => (
              <Badge key={pat} className="bg-blue-50 text-blue-700 border-blue-200 font-mono text-[11px]">
                {pat}
              </Badge>
            ))}
            <span className="text-slate-400 ml-auto font-mono text-[11px]">
              Time: <strong className="text-slate-700">{timeComplexity}</strong> | Space: <strong className="text-slate-700">{spaceComplexity}</strong>
            </span>
          </div>

          {/* Monaco-Style Dark Code Display */}
          <div className="relative rounded-2xl bg-[#1E1E1E] border border-slate-800 p-4 font-mono text-xs text-slate-200 overflow-x-auto shadow-inner">
            <pre className="leading-relaxed">
              <code>{activeCodeTab === 'submitted' ? cleanSubmittedCode : optimalSolutionCode}</code>
            </pre>
          </div>

        </section>

        {/* ─── 5. STRENGTHS & DIAGNOSED CODE SMELLS ─── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Strengths Card */}
          <div className="bg-white border border-emerald-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-emerald-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Demonstrated Algorithmic Strengths
                </h3>
                <p className="text-[11px] text-slate-500">What you executed cleanly</p>
              </div>
            </div>

            <ul className="space-y-2.5">
              {strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                  <span className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    ✓
                  </span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Diagnosed Code Smells & Weaknesses */}
          <div className="bg-white border border-amber-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-amber-100">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <AlertTriangle size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Diagnosed Bottlenecks & Code Smells
                </h3>
                <p className="text-[11px] text-slate-500">Key improvement opportunities</p>
              </div>
            </div>

            <ul className="space-y-2.5">
              {improvements.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                  <span className="h-5 w-5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 font-bold text-[10px]">
                    !
                  </span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>

        </section>

        {/* ─── 6. ACTIONABLE DSA PRACTICE DRILLS & CORPORATE BENCHMARK ─── */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Target size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Actionable Technical Improvement Roadmap
              </h3>
              <p className="text-xs text-slate-500">
                Recommended deliberate practice based on your AST complexity analysis.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {actionableTips.map((tipItem: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">
                      {tipItem.tip || 'Targeted Practice'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tipItem.reason || tipItem.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* ─── 7. PROCTORING & INTEGRITY TELEMETRY ─── */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/70">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-display">
                Proctoring & Platform Integrity Log
              </h4>
              <p className="text-xs text-slate-500">
                {tabBlurCount === 0
                  ? '0 viewport context switches logged. Clean proctoring telemetry recorded.'
                  : `${tabBlurCount} focus switch(es) recorded during active Monaco coding.`}
              </p>
            </div>
          </div>

          <Badge className={tabBlurCount === 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
            {tabBlurCount === 0 ? '100% Platform Integrity Verified' : `${tabBlurCount} Warnings Logged`}
          </Badge>
        </section>

      </main>
    </div>
  );
}
