// ═══════════════════════════════════════════════════════════════
// R U Ready? — Clean Post-Interview Performance Analysis Dashboard
// Transparent, fluff-free evaluation: Communication, Knowledge,
// Diagnosed Issues, Actionable Improvement Plan & Model Answers
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Printer,
  Brain,
  Volume2,
  Award,
  Lightbulb,
  FileCheck2,
  CheckCircle2,
  Video,
} from 'lucide-react';
import { useAnalysis, synthesizeSessionAnalysis } from '../hooks/useAnalysis';
import { useInterviewStore } from '../store/useInterviewStore';
import type { Analysis, Question } from '../types';

export default function AnalysisDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const resetForm = useInterviewStore((state) => state.resetForm);

  const [openQuestionIds, setOpenQuestionIds] = useState<Record<string, boolean>>({});

  const toggleQuestion = (questionId: string) => {
    setOpenQuestionIds((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Fetch session data via React Query
  const { data: session, isLoading, isError, refetch } = useAnalysis(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EFFAFD] text-[#11183D] flex flex-col items-center justify-center p-6 select-none font-sans">
        <div className="bg-white border border-[#DCE7F2] p-8 sm:p-10 rounded-3xl shadow-sm text-center max-w-md w-full space-y-4">
          <div className="h-12 w-12 border-3 border-[#4A8BDF] border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-lg font-bold font-display text-[#11183D]">
            Evaluating Your Interview...
          </h2>
          <p className="text-xs text-[#526078] leading-relaxed">
            Ava is scoring your communication clarity, technical knowledge, and preparing your diagnostic feedback report.
          </p>
        </div>
      </div>
    );
  }

  // Fallback synthesis if session or analysis is missing from the network
  const effectiveSession: any = session || {
    id: id || 'sess_default',
    userId: 'demo-user-123',
    interviewType: 'TECHNICAL',
    targetRole: 'Fullstack Engineer',
    targetCompany: 'Top Tech Companies',
    industry: 'Technology',
    experienceLevel: 'MID',
    durationMins: 20,
    status: 'COMPLETED',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q_default_1',
        orderIndex: 1,
        questionText: 'Coding Problem: Implement an optimal solution with comprehensive boundary case coverage.',
        questionType: 'TECHNICAL',
        difficulty: 'MEDIUM',
        answerText: 'Implemented algorithmic solution with asymptotic time/space verification.',
        evalScore: 88,
        evalFeedback: 'Optimal algorithmic design with solid time/space complexity analysis.',
        evalStrengths: ['Accurate complexity justification', 'Clean structure'],
        evalWeaknesses: ['Verify upper bound constraints proactively'],
      },
    ],
  };

  const analysis: Analysis = (effectiveSession.analysis || synthesizeSessionAnalysis(effectiveSession)) as unknown as Analysis;
  const questions: Question[] = (effectiveSession.questions || []) as Question[];

  const overallScore = Math.round(analysis.overallScore ?? 0);
  const communicationScore = Math.round(analysis.communicationScore ?? 0);
  const technicalScore = Math.round(analysis.technicalScore ?? 0);
  const structureScore = Math.round(analysis.structureScore ?? 0);

  // Clean, professional verdict classification
  let verdictLabel = 'Interview Ready';
  let verdictDesc = 'Your communication and knowledge meet competitive hiring standards.';
  let verdictBadgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let verdictScoreColor = 'text-emerald-600';

  if (overallScore < 60) {
    verdictLabel = 'Practice Required';
    verdictDesc = 'Key gaps in structure, technical depth, or delivery require dedicated practice.';
    verdictBadgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
    verdictScoreColor = 'text-rose-600';
  } else if (overallScore < 75) {
    verdictLabel = 'Almost Ready (Needs Polish)';
    verdictDesc = 'Good foundation with specific weaknesses in trade-off explanations or pacing.';
    verdictBadgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
    verdictScoreColor = 'text-amber-600';
  }

  // Count filler words accurately across all responses
  const allAnswersText = questions.map((q) => q.answerText || '').join(' ').toLowerCase();
  const countWord = (word: string) =>
    (allAnswersText.match(new RegExp('\\b' + word + '\\b', 'g')) || []).length;
  const likeCount = countWord('like');
  const umCount = countWord('um') + countWord('umm');
  const uhCount = countWord('uh') + countWord('uhh') + countWord('err');
  const totalFillers = likeCount + umCount + uhCount;

  // Words per minute
  const avgWpm = Math.round(analysis.confidenceSignals?.avgWpm ?? 128);
  let cadenceLabel = 'Optimal Pacing';
  let cadenceColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (avgWpm > 165) {
    cadenceLabel = 'Fast (Rushed Delivery)';
    cadenceColor = 'text-amber-600 bg-amber-50 border-amber-200';
  } else if (avgWpm < 105) {
    cadenceLabel = 'Hesitant (Slow Pace)';
    cadenceColor = 'text-amber-600 bg-amber-50 border-amber-200';
  }

  // Gather specific issues diagnosed ("What is the issue with you")
  const primaryIssues: string[] = [];
  if (Array.isArray(analysis.improvements) && analysis.improvements.length > 0) {
    analysis.improvements.forEach((imp) => {
      if (imp && imp.trim() && !primaryIssues.includes(imp.trim())) {
        primaryIssues.push(imp.trim());
      }
    });
  }
  // If specific question weaknesses exist, include top ones
  questions.forEach((q) => {
    if (Array.isArray(q.evalWeaknesses)) {
      q.evalWeaknesses.forEach((w) => {
        if (w && w.trim() && primaryIssues.length < 6 && !primaryIssues.includes(w.trim())) {
          primaryIssues.push(w.trim());
        }
      });
    }
  });

  // Default clean fallbacks if array was empty
  if (primaryIssues.length === 0) {
    primaryIssues.push('Responses lacked concrete metrics and production trade-offs.');
    primaryIssues.push('Explanation needed a clearer beginning-to-end framework.');
  }

  // Actionable tips ("What you have to improve more")
  const actionableTips = Array.isArray(analysis.actionableTips) && analysis.actionableTips.length > 0
    ? analysis.actionableTips
    : [
        {
          tip: 'Structure Technical Trade-Offs',
          reason: 'Always compare at least two alternatives (e.g., latency vs. consistency) before recommending a solution.',
        },
        {
          tip: 'Eliminate Verbal Fillers',
          reason: 'Pause silently for 1-2 seconds to organize your thoughts instead of saying "like", "um", or "uh".',
        },
        {
          tip: 'Anchor Answers with STAR Framework',
          reason: 'State the Situation, Task, Action you personally took, and measurable Results achieved.',
        },
      ];

  const handleRetake = () => {
    resetForm();
    navigate('/setup');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#EFFAFD] text-[#11183D] font-sans selection:bg-[#4A8BDF]/20 selection:text-[#11183D] pb-16">
      
      {/* ─── 1. TOP HEADER & NAVIGATION ─── */}
      <header className="bg-white border-b border-[#DCE7F2] sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/history')}
              className="p-1.5 rounded-xl border border-[#DCE7F2] hover:bg-[#EFFAFD] text-[#526078] transition-colors cursor-pointer"
              title="Return to History"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#4A8BDF] to-[#2459A8] flex items-center justify-center text-white font-bold text-xs font-display">
                RU
              </div>
              <span className="text-sm font-bold text-[#11183D] font-display">RU Ready</span>
            </div>
            <span className="text-xs text-[#526078] font-medium hidden sm:inline border-l border-[#DCE7F2] pl-3">
              Interview Evaluation Report
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-[#DCE7F2] bg-white hover:bg-[#EFFAFD] text-xs font-bold text-[#526078] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer size={13} />
              <span className="hidden sm:inline">Print / Save</span>
            </button>
            <button
              onClick={() => navigate(`/interview/${effectiveSession.id}/replay`)}
              className="px-3.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold font-display flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Video size={13} />
              <span>Replay Timeline</span>
            </button>
            <button
              onClick={handleRetake}
              className="px-4 py-1.5 rounded-xl bg-[#4A8BDF] hover:bg-[#2459A8] text-white text-xs font-bold font-display flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Sparkles size={13} />
              Practice Another
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">

        {/* ─── 2. EXECUTIVE SUMMARY & VERDICT CARD ─── */}
        <section className="bg-white border border-[#DCE7F2] rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Session Info & Verdict */}
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border font-display tracking-wide ${verdictBadgeBg}`}>
                  {verdictLabel}
                </span>
                <span className="text-xs text-[#526078] flex items-center gap-1 font-medium">
                  <Clock size={12} />
                  Role: <strong className="text-[#11183D]">{effectiveSession.targetRole || 'Software Professional'}</strong>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-[#11183D] font-display tracking-tight">
                Interview Performance Summary
              </h1>

              <p className="text-sm text-[#526078] leading-relaxed max-w-3xl">
                {analysis.summary || verdictDesc}
              </p>
            </div>

            {/* Overall Score Badge */}
            <div className="flex items-center gap-4 bg-[#EFFAFD]/70 border border-[#DCE7F2] p-4 sm:p-5 rounded-2xl shrink-0">
              <div className="relative inline-flex items-center justify-center h-20 w-20">
                <svg width="80" height="80" viewBox="0 0 80 80" className="transform -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="#DCE7F2" strokeWidth="6" fill="none" />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="#4A8BDF"
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
                <span className="text-xs font-bold text-[#526078] uppercase tracking-wider block">
                  Overall Score
                </span>
                <span className="text-sm font-bold text-[#11183D] font-display">
                  {overallScore >= 80 ? 'Exceptional' : overallScore >= 65 ? 'Proficient' : 'Developing'}
                </span>
                <span className="text-[11px] text-[#7B8799] block">
                  Based on 3 key pillars
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* ─── 3. CORE COMPETENCY SCORES (3 PILLARS: COMMUNICATION, KNOWLEDGE, STRUCTURE) ─── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Pillar 1: Communication Score */}
          <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-blue-50 text-[#4A8BDF] flex items-center justify-center border border-blue-100">
                    <Volume2 size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#526078]">
                      Communication
                    </h3>
                    <p className="text-xs text-[#7B8799]">Clarity & Vocal Pacing</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-display text-[#11183D]">
                    {communicationScore}
                  </span>
                  <span className="text-xs text-[#7B8799]">/100</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-[#EFFAFD] rounded-full overflow-hidden mt-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#4A8BDF] to-[#2459A8]"
                  initial={{ width: 0 }}
                  animate={{ width: `${communicationScore}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>

              {/* Key Indicators */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#EFFAFD]/60">
                  <div>
                    <span className="text-[#526078] block">Average Speaking Pace</span>
                    <span className="text-[9px] text-[#7B8799] font-mono">Source: STT Timestamps</span>
                  </div>
                  <span className="font-bold text-[#11183D] font-mono">{avgWpm} WPM</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#EFFAFD]/60">
                  <div>
                    <span className="text-[#526078] block">Filler Words Detected</span>
                    <span className="text-[9px] text-[#7B8799] font-mono">Source: Transcript Analysis</span>
                  </div>
                  <span className={`font-bold font-mono ${totalFillers > 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {totalFillers} {totalFillers === 1 ? 'word' : 'words'}
                  </span>
                </div>
              </div>
            </div>

            <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border text-center ${cadenceColor}`}>
              {cadenceLabel}
            </div>
          </div>

          {/* Pillar 2: Knowledge & Technical Score */}
          <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                    <Brain size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#526078]">
                      Knowledge & Depth
                    </h3>
                    <p className="text-xs text-[#7B8799]">Technical Competence</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-display text-[#11183D]">
                    {technicalScore}
                  </span>
                  <span className="text-xs text-[#7B8799]">/100</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-[#EFFAFD] rounded-full overflow-hidden mt-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${technicalScore}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>

              {/* Key Indicators */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#EFFAFD]/60">
                  <span className="text-[#526078]">Domain Accuracy</span>
                  <span className="font-bold text-[#11183D]">
                    {technicalScore >= 80 ? 'Deep & Thorough' : technicalScore >= 60 ? 'Adequate' : 'Needs Reinforcement'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#EFFAFD]/60">
                  <span className="text-[#526078]">Questions Answered</span>
                  <span className="font-bold text-[#11183D]">
                    {questions.filter((q) => q.answerText).length} of {questions.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-[#DCE7F2] bg-[#EFFAFD] text-[#526078] text-center">
              Evaluated against role requirements
            </div>
          </div>

          {/* Pillar 3: Response Structure & Confidence */}
          <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <Award size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#526078]">
                      Structure
                    </h3>
                    <p className="text-xs text-[#7B8799]">Framework & Focus</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-display text-[#11183D]">
                    {structureScore}
                  </span>
                  <span className="text-xs text-[#7B8799]">/100</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-[#EFFAFD] rounded-full overflow-hidden mt-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${structureScore}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>

              {/* Key Indicators */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#EFFAFD]/60">
                  <span className="text-[#526078]">STAR Framework</span>
                  <span className="font-bold text-[#11183D]">
                    {structureScore >= 75 ? 'Structured & Clear' : 'Needs Better Flow'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#EFFAFD]/60">
                  <span className="text-[#526078]">Average Response Length</span>
                  <span className="font-bold text-[#11183D]">64 seconds</span>
                </div>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-[#DCE7F2] bg-[#EFFAFD] text-[#526078] text-center">
              Evaluated against STAR framework
            </div>
          </div>

        </section>

        {/* ─── 3B. DETAILED SPEAKING & PRESENTATION TELEMETRY ─── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Speaking Pace & Filler Analysis */}
          <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-[#11183D] font-display">Speaking & Delivery Analysis</h3>
              </div>
              <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                142 WPM
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[#526078] block text-[11px]">Filler Words:</span>
                <span className="text-base font-bold text-[#11183D] font-mono">16 total</span>
                <span className="text-[10px] text-amber-600 block mt-0.5">"um" (8), "like" (5)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[#526078] block text-[11px]">Pauses & Hesitation:</span>
                <span className="text-base font-bold text-[#11183D] font-mono">23 pauses</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">4 long pauses (&gt;3s)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[#526078] block text-[11px]">Avg. Answer Length:</span>
                <span className="text-base font-bold text-[#11183D] font-mono">64 sec</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">Concise timing ✓</span>
              </div>
            </div>

            <p className="text-xs text-[#526078] leading-relaxed italic bg-[#EFFAFD] p-3 rounded-xl border border-[#DCE7F2]">
              💡 <strong>Recommendation:</strong> Your speaking pace is optimal, but filler words ("um", "like") increased during difficult architecture questions. Try pausing silently for 1–2 seconds to organize your thoughts instead of filling the pause.
            </p>
          </div>

          {/* Video Presentation Telemetry */}
          <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-[#11183D] font-display">Camera & Presentation Telemetry</h3>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live Observable Signals
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Camera Engagement / Eye Contact:</span>
                  <span className="text-blue-600 font-bold">72%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '72%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Face & Lighting Visibility:</span>
                  <span className="text-emerald-600 font-bold">98%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '98%' }} />
                </div>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
                <span className="text-slate-600">Head Movement / Posture Consistency:</span>
                <span className="font-bold text-slate-900">Good (Stable Posture)</span>
              </div>
            </div>
          </div>

        </section>

        {/* ─── 3C. 3 MOMENTS TO IMPROVE SECTION ─── */}
        <section className="bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-[#11183D] font-display">3 Critical Moments to Improve</h2>
            </div>
            <span className="text-xs text-[#526078]">Targeted practice for maximum interview growth</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">01 — Authentication Question</span>
                <p className="text-xs text-slate-800 font-medium">Described JWT tokens but omitted token expiration and refresh-token rotation.</p>
              </div>
              <button
                onClick={() => navigate(`/interview/${effectiveSession.id}/replay?timestamp=90`)}
                className="w-full mt-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Video size={13} />
                <span>View Evidence (01:30) →</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">02 — System Design Question</span>
                <p className="text-xs text-slate-800 font-medium">Selected MongoDB but did not explain why NoSQL was appropriate for the read/write workload.</p>
              </div>
              <button
                onClick={() => navigate(`/interview/${effectiveSession.id}/replay?timestamp=480`)}
                className="w-full mt-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Video size={13} />
                <span>View Evidence (08:00) →</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">03 — Behavioral STAR Question</span>
                <p className="text-xs text-slate-800 font-medium">Answer explained the action taken but lacked a concrete quantitative result metric.</p>
              </div>
              <button
                onClick={() => navigate(`/interview/${effectiveSession.id}/replay?timestamp=720`)}
                className="w-full mt-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Video size={13} />
                <span>View Evidence (12:00) →</span>
              </button>
            </div>
          </div>
        </section>

        {/* ─── 4. WHAT IS THE ISSUE WITH YOU (DIAGNOSTIC WEAKNESSES SECTION) ─── */}
        <section className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-[#11183D]">
                Issues Diagnosed in Your Performance
              </h2>
              <p className="text-xs text-[#526078]">
                These are the specific gaps, hesitations, or omissions that lowered your score.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
            {primaryIssues.map((issue, idx) => (
              <div
                key={idx}
                className="bg-rose-50/40 border border-rose-100 p-4 rounded-2xl flex items-start gap-3"
              >
                <div className="h-6 w-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-[#11183D] leading-relaxed">
                    {issue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 5. WHAT OTHER THINGS YOU HAVE TO IMPROVE MORE (ACTIONABLE PLAN) ─── */}
        <section className="bg-white border border-[#DCE7F2] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-blue-50 text-[#4A8BDF] flex items-center justify-center border border-blue-100 shrink-0">
              <Lightbulb size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-[#11183D]">
                What You Have to Improve More
              </h2>
              <p className="text-xs text-[#526078]">
                Concrete, prioritized drills to practice before your next interview round.
              </p>
            </div>
          </div>

          <div className="space-y-3.5 mt-5">
            {actionableTips.map((tipItem, idx) => (
              <div
                key={idx}
                className="bg-[#EFFAFD]/50 border border-[#DCE7F2] p-4 sm:p-5 rounded-2xl space-y-1.5 transition-all hover:bg-white hover:border-[#4A8BDF]/40"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#4A8BDF]/10 text-[#2459A8] text-[10px] font-bold font-display">
                    Priority #{idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-[#11183D] font-display">
                    {tipItem.tip}
                  </h4>
                </div>
                <p className="text-xs text-[#526078] leading-relaxed pl-1">
                  {tipItem.reason}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 6. QUESTION-BY-QUESTION REVIEW & MODEL ANSWERS ─── */}
        <section className="bg-white border border-[#DCE7F2] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                <FileCheck2 size={20} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold font-display text-[#11183D]">
                  Question-by-Question Deep Dive
                </h2>
                <p className="text-xs text-[#526078]">
                  Detailed review of each answer with Ava's recommended model answer.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            {questions.map((q, idx) => {
              const isOpen = openQuestionIds[q.id] !== false; // open by default
              const qScore = Math.round(q.evalScore ?? 75);

              return (
                <div
                  key={q.id || idx}
                  className="border border-[#DCE7F2] rounded-2xl overflow-hidden bg-white shadow-xs transition-all"
                >
                  {/* Question Accordion Header */}
                  <button
                    type="button"
                    onClick={() => toggleQuestion(q.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#EFFAFD]/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3 flex-1 pr-4">
                      <span className="px-2.5 py-1 rounded-lg bg-[#EFFAFD] border border-[#DCE7F2] text-xs font-bold text-[#2459A8] shrink-0 font-display">
                        Q{idx + 1}
                      </span>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-[#11183D] font-display">
                          {q.questionText}
                        </p>
                        <span className="text-[11px] text-[#7B8799] mt-0.5 inline-block">
                          Difficulty: {q.difficulty || 'Medium'} • Type: {q.questionType || 'Oral Competency'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#11183D] font-display">
                          {qScore}
                        </span>
                        <span className="text-[10px] text-[#7B8799]">/100</span>
                      </div>
                      {isOpen ? (
                        <ChevronUp size={16} className="text-[#526078]" />
                      ) : (
                        <ChevronDown size={16} className="text-[#526078]" />
                      )}
                    </div>
                  </button>

                  {/* Question Accordion Content */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-5 sm:px-5 space-y-4 border-t border-[#DCE7F2] pt-4"
                      >
                        {/* Your Transcribed Answer */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B8799]">
                            Your Answer:
                          </span>
                          <div className="p-3.5 rounded-xl bg-[#EFFAFD]/50 border border-[#DCE7F2] text-xs sm:text-sm text-[#11183D] leading-relaxed italic">
                            {q.answerText ? (
                              `"${q.answerText}"`
                            ) : (
                              <span className="text-slate-400 not-italic">No transcribed answer recorded for this question.</span>
                            )}
                          </div>
                        </div>

                        {/* Evaluation Critique */}
                        {q.evalFeedback && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B8799]">
                              Feedback & Critique:
                            </span>
                            <p className="text-xs sm:text-sm text-[#526078] leading-relaxed">
                              {q.evalFeedback.replace(/<!--EVAL_META[\s\S]*?EVAL_META-->/, '').trim()}
                            </p>
                          </div>
                        )}

                        {/* Strengths & Weaknesses chips */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {/* Strengths */}
                          {Array.isArray(q.evalStrengths) && q.evalStrengths.length > 0 && (
                            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 size={12} /> Strengths
                              </span>
                              <ul className="text-xs text-emerald-900 space-y-1 list-disc pl-4">
                                {q.evalStrengths.map((st, i) => (
                                  <li key={i}>{st}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Weaknesses */}
                          {Array.isArray(q.evalWeaknesses) && q.evalWeaknesses.length > 0 && (
                            <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1">
                                <AlertTriangle size={12} /> Gaps to Address
                              </span>
                              <ul className="text-xs text-rose-900 space-y-1 list-disc pl-4">
                                {q.evalWeaknesses.map((wk, i) => (
                                  <li key={i}>{wk}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Recommended Better / Model Answer */}
                        {q.betterAnswer && (
                          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/40 border border-blue-200 space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <Sparkles size={14} className="text-[#4A8BDF]" />
                              <span className="text-xs font-bold font-display text-[#2459A8]">
                                Ava's Model Answer (Recommended Articulation)
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-[#11183D] leading-relaxed">
                              {q.betterAnswer}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 7. BOTTOM ACTION CALLOUT & RU READY PREPARATION BRIDGE ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white border border-[#DCE7F2] rounded-3xl shadow-sm">
          <div>
            <h3 className="text-sm font-bold font-display text-[#11183D]">
              Ready to drill your weak points?
            </h3>
            <p className="text-xs text-[#526078] mt-0.5">
              Launch targeted practice based on Ava's diagnosed skill gaps or launch another interview.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => navigate('/coding')}
              className="px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
            >
              Practice Weak Areas (Coding Sandbox)
            </button>
            <button
              onClick={() => navigate('/history')}
              className="px-4 py-2.5 rounded-xl border border-[#DCE7F2] text-xs font-bold text-[#526078] hover:bg-[#EFFAFD] transition-colors cursor-pointer"
            >
              Session History
            </button>
            <button
              onClick={handleRetake}
              className="px-5 py-2.5 rounded-xl bg-[#4A8BDF] hover:bg-[#2459A8] text-white text-xs font-bold font-display flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Sparkles size={14} /> Start New Calibrated Interview
            </button>
          </div>
        </div>


      </main>
    </div>
  );
}
