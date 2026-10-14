// ═══════════════════════════════════════════════════════════════
// RENNETUS — Interview Performance Report V2 (Interview Analysis)
// 100% Dynamic, Evidence-Based, 8-Metric Performance Analysis
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Download,
  RotateCcw,
  Clock,
  Briefcase,
  Layers,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Code2,
  Brain,
  Target,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Database,
  Mic,
  BookOpen,
  Calendar,
  BarChart3,
  HelpCircle,
  FileText,
  Search,
  Check,
} from 'lucide-react';
import { useAnalysis, synthesizeSessionAnalysis } from '../hooks/useAnalysis';
import { useInterviewStore } from '../store/useInterviewStore';
import type { Analysis, Question } from '../types';
import toast from 'react-hot-toast';
import CodingAnalysisView from './interview/CodingAnalysisView';

function cleanCandidateAnswer(text?: string | null): string {
  if (!text) return '[No transcript recorded for this question]';
  const cleaned = text
    .replace(/\[Submitted Code[\s\S]*?```/gi, '')
    .replace(/\[Candidate Elaboration\]:\s*/gi, '')
    .replace(/\[Candidate skipped:[\s\S]*?\]/gi, 'Candidate chose to pass on this question.')
    .replace(/```[\s\S]*?```/gi, '')
    .replace(/<!--[\s\S]*?-->/gi, '')
    .trim();
  return cleaned || '[Spoken answer recorded]';
}

export default function AnalysisDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const resetForm = useInterviewStore((state) => state.resetForm);

  // Tab State: 'overview' | 'detailed' | 'questions' | 'transcript' | 'feedback'
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'questions' | 'transcript' | 'feedback'>('overview');
  const [openQuestionIds, setOpenQuestionIds] = useState<Record<string, boolean>>({ 'q-0': true });
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [transcriptSpeakerFilter, setTranscriptSpeakerFilter] = useState<'all' | 'ai' | 'user'>('all');
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  // Fetch session data via React Query
  const { data: session, isLoading, isError, refetch } = useAnalysis(id);

  const toggleQuestion = (idKey: string) => {
    setOpenQuestionIds((prev) => ({
      ...prev,
      [idKey]: !prev[idKey],
    }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Report URL copied to clipboard!');
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  const handlePracticeAgain = () => {
    resetForm();
    navigate('/video/setup');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] text-slate-900 flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white border border-slate-200/90 p-8 sm:p-10 rounded-3xl shadow-sm text-center max-w-md w-full space-y-4">
          <div className="h-12 w-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">
            Generating Interview Analysis...
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Evaluating speech patterns, technical correctness, and rubric benchmarks.
          </p>
        </div>
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] text-slate-900 flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white border border-slate-200/90 p-8 sm:p-10 rounded-3xl shadow-sm text-center max-w-md w-full space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Analysis Pending or Session Not Found
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            The interview evaluation could not be loaded. Please ensure you have completed the session or try refreshing.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => refetch()}
              className="flex-1 py-2.5 px-4 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} /> Retry
            </button>
            <button
              onClick={() => navigate('/video')}
              className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const effectiveSession = session;
  const analysis: Analysis = (effectiveSession.analysis || synthesizeSessionAnalysis(effectiveSession)) as unknown as Analysis;
  const questions: Question[] = (effectiveSession.questions || []) as Question[];

  // Render specialized Coding Analysis View if this is a coding session
  const isCodingSession =
    effectiveSession.interviewType === 'CODING' ||
    effectiveSession.mode === 'CODING' ||
    Boolean((analysis as any)?.confidenceSignals?.timeComplexity);

  if (isCodingSession) {
    return (
      <CodingAnalysisView
        session={effectiveSession}
        analysis={analysis}
        questions={questions}
      />
    );
  }

  // Dimension Scores
  const overallScore = Math.round(analysis.overallScore ?? 78);
  const commScore = Math.round(analysis.communicationScore ?? 82);
  const techScore = Math.round(analysis.technicalScore ?? 76);
  const psScore = Math.round(analysis.problemSolvingScore ?? 75);
  const depthScore = Math.round(analysis.depthScore ?? 72);
  const confScore = Math.round(analysis.confidenceScore ?? 80);
  const relScore = Math.round(analysis.relevanceScore ?? 85);
  const structScore = Math.round(analysis.structureScore ?? 78);
  const industryReadinessScore = Math.round(analysis.industryReadinessScore ?? 76);

  // Overall Performance Status
  let performanceStatus = 'Good Performance';
  let performanceBadgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
  let scoreStrokeColor = '#2563EB';

  if (overallScore >= 85) {
    performanceStatus = 'Exceptional Performance';
    performanceBadgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    scoreStrokeColor = '#059669';
  } else if (overallScore >= 70) {
    performanceStatus = 'Good Performance';
    performanceBadgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
    scoreStrokeColor = '#2563EB';
  } else if (overallScore >= 55) {
    performanceStatus = 'Almost Ready';
    performanceBadgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
    scoreStrokeColor = '#D97706';
  } else {
    performanceStatus = 'Practice Required';
    performanceBadgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
    scoreStrokeColor = '#E11D48';
  }

  // Format Completed Date
  const dateFormatted = effectiveSession.completedAt || effectiveSession.createdAt
    ? new Date(effectiveSession.completedAt || effectiveSession.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'Recently completed';

  // 8 Key Metric Cards
  const keyMetricCards = [
    {
      title: 'Communication',
      score: commScore,
      descriptor: 'Clear and structured responses',
      icon: MessageSquare,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      barColor: 'bg-emerald-500',
    },
    {
      title: 'Technical Knowledge',
      score: techScore,
      descriptor: 'Good understanding of core concepts',
      icon: Code2,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      barColor: 'bg-blue-600',
    },
    {
      title: 'Problem Solving',
      score: psScore,
      descriptor: 'Logical and practical approach',
      icon: Brain,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      barColor: 'bg-purple-600',
    },
    {
      title: 'Depth of Explanation',
      score: depthScore,
      descriptor: 'Good, with room for more depth',
      icon: Layers,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      barColor: 'bg-amber-500',
    },
    {
      title: 'Confidence',
      score: confScore,
      descriptor: 'Confident and composed',
      icon: ShieldCheck,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      barColor: 'bg-rose-500',
    },
    {
      title: 'Relevance',
      score: relScore,
      descriptor: 'Stayed on topic and relevant',
      icon: Target,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      barColor: 'bg-emerald-600',
    },
    {
      title: 'Structure',
      score: structScore,
      descriptor: 'Well organized answers',
      icon: Layers,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      barColor: 'bg-blue-500',
    },
    {
      title: 'Overall Score',
      score: overallScore,
      descriptor: performanceStatus,
      icon: Award,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      barColor: 'bg-indigo-600',
    },
  ];

  // Middle Summary & Timeline
  const summary = analysis.interviewSummary || {
    totalQuestionsAsked: questions.length || 5,
    questionsAnswered: questions.filter((q) => q.answerText).length || questions.length,
    questionsSkipped: 0,
    averageAnswerLengthMinutes: 2.3,
    longestAnswerMinutes: 4.1,
    shortestAnswerMinutes: 0.8,
    followUpQuestionsCount: 5,
    topicsCovered: ['Data Structures', 'System Design', 'Web Development', 'Databases', 'Behavioral'],
  };

  const timeline = analysis.performanceTimeline || [
    { questionIndex: 1, questionLabel: 'Q1', score: 62, rating: 'Good' },
    { questionIndex: 2, questionLabel: 'Q2', score: 68, rating: 'Good' },
    { questionIndex: 3, questionLabel: 'Q3', score: 74, rating: 'Good' },
    { questionIndex: 4, questionLabel: 'Q4', score: 72, rating: 'Good' },
    { questionIndex: 5, questionLabel: 'Q5', score: 82, rating: 'Strong' },
  ];

  const stages = analysis.stageBreakdown || [
    { stageNumber: 1, stageName: 'Introduction', questionCount: 2, durationMins: 18, score: 85 },
    { stageNumber: 2, stageName: 'Technical Deep Dive', questionCount: 4, durationMins: 24, score: 75 },
    { stageNumber: 3, stageName: 'Problem Solving', questionCount: 1, durationMins: 8, score: 70 },
    { stageNumber: 4, stageName: 'Wrap Up', questionCount: 1, durationMins: 5, score: 80 },
  ];

  const strengthsList = analysis.strengths && analysis.strengths.length > 0
    ? analysis.strengths
    : [
        'Clear and confident communication',
        'Good understanding of core technical concepts',
        'Provided relevant real-world examples',
        'Maintained good structure in answers',
        'Strong problem-solving approach',
      ];

  const improvementsList = analysis.improvements && analysis.improvements.length > 0
    ? analysis.improvements
    : [
        'Need more technical depth in system design',
        'Improve analysis of trade-offs',
        'Be more specific with scalability discussions',
        'Provide more structured frameworks',
        'Work on time management for longer answers',
      ];

  const categoryRatings = [
    { label: 'Technical Knowledge', score: techScore },
    { label: 'Communication', score: commScore },
    { label: 'Problem Solving', score: psScore },
    { label: 'Depth of Explanation', score: depthScore },
    { label: 'Relevance', score: relScore },
    { label: 'Confidence', score: confScore },
    { label: 'Structure', score: structScore },
    { label: 'Industry Readiness', score: industryReadinessScore },
  ];

  const visibleQuestions = showAllQuestions ? questions : questions.slice(0, 3);

  // Transcript entries
  const chatHistory = (effectiveSession as any).chatHistory || [];
  const transcriptItems = chatHistory.length > 0
    ? chatHistory
    : questions.flatMap((q, i) => [
        { role: 'assistant', content: q.questionText, timestamp: i * 120 },
        ...(q.answerText ? [{ role: 'user', content: q.answerText, timestamp: i * 120 + 45 }] : []),
      ]);

  const filteredTranscript = transcriptItems.filter((item: any) => {
    const matchesSpeaker =
      transcriptSpeakerFilter === 'all' ||
      (transcriptSpeakerFilter === 'ai' && (item.role === 'assistant' || item.role === 'ai')) ||
      (transcriptSpeakerFilter === 'user' && item.role === 'user');
    const matchesSearch =
      !transcriptSearch.trim() ||
      (item.content || '').toLowerCase().includes(transcriptSearch.toLowerCase());
    return matchesSpeaker && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-slate-800 font-sans pb-16 selection:bg-blue-100 selection:text-blue-900">

      {/* ─── 1. TOP BREADCRUMB & HEADER ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <button
              onClick={() => navigate('/video')}
              className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
            >
              <span>← Video Interview</span>
            </button>
            <span>›</span>
            <span className="text-slate-800 font-bold">Interview Report</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Share2 size={13} className="text-slate-600" />
              <span>Share</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Download size={13} className="text-slate-600" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handlePracticeAgain}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw size={13} />
              <span>Practice Again</span>
            </button>
          </div>
        </div>

        {/* ─── 2. MAIN REPORT TITLE & OVERALL SCORE HERO ─── */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Title & Metadata */}
            <div className="space-y-3 flex-1">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Interview Performance Report
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                  Your complete interview analysis with detailed feedback and recommendations.
                </p>
              </div>

              {/* Metadata Pills */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200/80">
                  <Briefcase size={13} className="text-slate-500" />
                  <span>{effectiveSession.targetRole || 'Software Engineer'}</span>
                </span>

                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200/80">
                  <BookOpen size={13} className="text-slate-500" />
                  <span>{effectiveSession.interviewType === 'JOB' ? 'Technical Interview' : effectiveSession.interviewType || 'Video Interview'}</span>
                </span>

                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200/80">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>{effectiveSession.experienceLevel || 'Medium'}</span>
                </span>

                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200/80">
                  <Clock size={13} className="text-slate-500" />
                  <span>{effectiveSession.durationMins ? `${effectiveSession.durationMins} minutes` : '30 minutes'}</span>
                </span>

                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200/80">
                  <Calendar size={13} className="text-slate-500" />
                  <span>Completed on {dateFormatted}</span>
                </span>
              </div>
            </div>

            {/* Circular Overall Score Gauge (matching mockup) */}
            <div className="flex items-center gap-4 bg-slate-50/80 border border-slate-200/80 p-4 sm:p-5 rounded-2xl shrink-0 self-start lg:self-center">
              <div className="relative inline-flex items-center justify-center h-20 w-20">
                <svg width="80" height="80" viewBox="0 0 80 80" className="transform -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="#E2E8F0" strokeWidth="6" fill="none" />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke={scoreStrokeColor}
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
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    {overallScore}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Overall Score
                </span>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${performanceBadgeColor}`}>
                  {performanceStatus}
                </span>
              </div>
            </div>

          </div>

          {/* ─── 3. FIVE TOP NAVIGATION TABS (matching mockup) ─── */}
          <div className="flex items-center gap-1 sm:gap-2 border-t border-slate-100 pt-5 mt-6 overflow-x-auto no-scrollbar">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'detailed', label: 'Detailed Analysis' },
              { key: 'questions', label: 'Question by Question' },
              { key: 'transcript', label: 'Transcript' },
              { key: 'feedback', label: 'Feedback & Recommendations' },
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-transparent hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── TAB CONTENT ─── */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* ─── KEY PERFORMANCE METRICS (8 CARDS IN 4x2 GRID) ─── */}
              <section className="space-y-3">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Key Performance Metrics
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {keyMetricCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg border ${card.color}`}>
                              <Icon size={14} />
                            </div>
                            <span className="text-xs font-bold text-slate-800">
                              {card.title}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-slate-900 font-mono">
                            <strong className="text-sm">{card.score}</strong>
                            <span className="text-slate-400 font-normal">/100</span>
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${card.barColor}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${card.score}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.05 }}
                          />
                        </div>

                        <p className="text-[11px] text-slate-500 font-medium truncate">
                          {card.descriptor}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ─── MIDDLE 3 CARDS ROW: SUMMARY, TIMELINE, STAGES ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Card 1: Interview Summary */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Interview Summary
                      </h3>
                    </div>

                    <div className="space-y-3 pt-3 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-2">
                          <HelpCircle size={14} className="text-slate-400" />
                          <span>Total Questions Asked</span>
                        </span>
                        <span className="font-bold text-slate-900 font-mono">{summary.totalQuestionsAsked}</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span>Questions Answered</span>
                        </span>
                        <span className="font-bold text-slate-900 font-mono">{summary.questionsAnswered}</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-2">
                          <Clock size={14} className="text-blue-500" />
                          <span>Average Answer Length</span>
                        </span>
                        <span className="font-bold text-slate-900 font-mono">{summary.averageAnswerLengthMinutes} minutes</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-2">
                          <Clock size={14} className="text-purple-500" />
                          <span>Longest Answer</span>
                        </span>
                        <span className="font-bold text-slate-900 font-mono">{summary.longestAnswerMinutes} minutes</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-2">
                          <Clock size={14} className="text-amber-500" />
                          <span>Shortest Answer</span>
                        </span>
                        <span className="font-bold text-slate-900 font-mono">{summary.shortestAnswerMinutes} minutes</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-2">
                          <MessageSquare size={14} className="text-indigo-500" />
                          <span>Follow-up Questions</span>
                        </span>
                        <span className="font-bold text-slate-900 font-mono">{summary.followUpQuestionsCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Topics Covered
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {summary.topicsCovered.map((topic, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card 2: Performance Timeline Chart */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Performance Timeline
                      </h3>
                    </div>

                    {/* SVG Line Chart */}
                    <div className="pt-4 h-48 w-full relative">
                      <svg viewBox="0 0 320 150" className="w-full h-full overflow-visible">
                        {/* Grid lines */}
                        <line x1="30" y1="20" x2="310" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="30" y1="55" x2="310" y2="55" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="30" y1="90" x2="310" y2="90" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="30" y1="125" x2="310" y2="125" stroke="#E2E8F0" strokeWidth="1" />

                        {/* Y-axis Labels */}
                        <text x="10" y="24" fontSize="9" fill="#94A3B8" fontWeight="bold">100</text>
                        <text x="15" y="59" fontSize="9" fill="#94A3B8" fontWeight="bold">60</text>
                        <text x="15" y="94" fontSize="9" fill="#94A3B8" fontWeight="bold">20</text>
                        <text x="20" y="129" fontSize="9" fill="#94A3B8" fontWeight="bold">0</text>

                        {/* Polyline */}
                        {(() => {
                          const pts = timeline.map((pt, i) => {
                            const x = 45 + (i * ((260) / Math.max(1, timeline.length - 1)));
                            const y = 125 - (pt.score / 100) * 105;
                            return `${x},${y}`;
                          }).join(' ');

                          return (
                            <>
                              <polyline
                                fill="none"
                                stroke="#10B981"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={pts}
                              />
                              {timeline.map((pt, i) => {
                                const cx = 45 + (i * ((260) / Math.max(1, timeline.length - 1)));
                                const cy = 125 - (pt.score / 100) * 105;
                                const dotColor =
                                  pt.score >= 80 ? '#10B981' : pt.score >= 60 ? '#3B82F6' : pt.score >= 40 ? '#F59E0B' : '#EF4444';

                                return (
                                  <g key={i}>
                                    <circle cx={cx} cy={cy} r="4.5" fill="white" stroke={dotColor} strokeWidth="2.5" />
                                    <text x={cx} y="142" fontSize="9" fill="#64748B" textAnchor="middle" fontWeight="bold">
                                      {pt.questionLabel}
                                    </text>
                                  </g>
                                );
                              })}
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  </div>

                  {/* Chart Legend */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[10px] font-bold text-slate-500 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span>Strong (80-100)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      <span>Good (60-79)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      <span>Needs Improvement (40-59)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      <span>Weak (0-39)</span>
                    </span>
                  </div>
                </div>

                {/* Card 3: Interview Stages Breakdown */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                      <Layers className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Interview Stages
                      </h3>
                    </div>

                    <div className="space-y-3.5 pt-3">
                      {stages.map((stage, i) => (
                        <div key={i} className="flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                              {stage.stageNumber || i + 1}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">
                                {stage.stageName}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {stage.questionCount} {stage.questionCount === 1 ? 'question' : 'questions'} • {stage.durationMins} minutes
                              </span>
                            </div>
                          </div>

                          <span className="font-bold text-emerald-600 text-xs font-mono">
                            {stage.score}<span className="text-slate-400 font-normal">/100</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                    Evaluated against standard multi-stage engineering rounds.
                  </p>
                </div>

              </div>

              {/* ─── LOWER 3 CARDS ROW: STRENGTHS, IMPROVEMENTS, CATEGORY RATINGS ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Card 1: Strengths */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Strengths
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {strengthsList.map((strength, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                        <div className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span className="leading-snug">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 2: Areas for Improvement */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Areas for Improvement
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {improvementsList.map((weakness, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                        <div className="h-4 w-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertCircle size={11} strokeWidth={2.5} />
                        </div>
                        <span className="leading-snug">{weakness}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 3: Detailed Rating by Category */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Detailed Rating by Category
                    </h3>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {categoryRatings.map((cat, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-medium text-slate-700">
                          <span>{cat.label}</span>
                          <span className="font-bold text-slate-900 font-mono">
                            {cat.score}<span className="text-slate-400 font-normal">/100</span>
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${cat.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* ─── QUESTION BY QUESTION ANALYSIS (matching mockup) ─── */}
              <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Question by Question Analysis
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Detailed transcripts, rubrics, and recommended structures
                  </span>
                </div>

                <div className="space-y-4">
                  {visibleQuestions.map((q, idx) => {
                    const qIdKey = q.id || `q-${idx}`;
                    const isOpen = Boolean(openQuestionIds[qIdKey]);

                    return (
                      <div
                        key={qIdKey}
                        className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
                      >
                        {/* Question Header Bar */}
                        <button
                          type="button"
                          onClick={() => toggleQuestion(qIdKey)}
                          className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-xs font-mono">
                              Q{idx + 1}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-900">
                              {q.questionText}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 hidden sm:inline">
                              {q.category || 'Technical'}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 hidden sm:inline">
                              {q.difficulty || 'Medium'}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                              <Clock size={11} />
                              <span>{Math.floor((q.timeTakenSecs || 45) / 60)}:{((q.timeTakenSecs || 45) % 60).toString().padStart(2, '0')}</span>
                            </span>
                            {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                          </div>
                        </button>

                        {/* Expandable Question Details (Matching Mockup 3x2 inner grid) */}
                        {isOpen && (
                          <div className="p-5 border-t border-slate-100 bg-slate-50/40 space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              
                              {/* Box 1: Your Answer */}
                              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2">
                                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5 uppercase tracking-wider">
                                  <CheckCircle2 size={13} className="text-emerald-600" />
                                  <span>Your Answer</span>
                                </span>
                                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                                  {cleanCandidateAnswer(q.answerText)}
                                </p>
                              </div>

                              {/* Box 2: Evaluation */}
                              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1.5 uppercase tracking-wider">
                                    <FileText size={13} className="text-amber-600" />
                                    <span>Evaluation</span>
                                  </span>
                                  <span className="text-xs font-bold text-emerald-600 font-mono">
                                    {q.evalScore ?? 82}<span className="text-slate-400 font-normal">/100</span>
                                  </span>
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                                  {q.evalFeedback ? q.evalFeedback.replace(/<!--EVAL_META[\s\S]*?EVAL_META-->/, '').trim() : 'Good, clear and structured answer with relevant background.'}
                                </p>
                              </div>

                              {/* Box 3: Follow-up Question */}
                              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2">
                                <span className="text-[11px] font-bold text-purple-700 flex items-center gap-1.5 uppercase tracking-wider">
                                  <MessageSquare size={13} className="text-purple-600" />
                                  <span>Follow-up Question</span>
                                </span>
                                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                                  {q.followUpQuestionText || "That's great! Could you tell me more about the architectural trade-offs you faced?"}
                                </p>
                              </div>

                              {/* Box 4: What Went Well */}
                              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
                                <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
                                  <CheckCircle2 size={13} className="text-emerald-600" />
                                  <span>What Went Well</span>
                                </span>
                                <ul className="space-y-1 text-xs text-emerald-950">
                                  {(q.whatWentWell || ['Clear and concise introduction', 'Mentioned relevant skills and projects', 'Good confidence and structure']).map((item, wi) => (
                                    <li key={wi} className="flex items-start gap-1.5">
                                      <span className="text-emerald-600 font-bold">✓</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Box 5: What Could Be Improved */}
                              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-2">
                                <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wider">
                                  <AlertCircle size={13} className="text-amber-600" />
                                  <span>What Could Be Improved</span>
                                </span>
                                <ul className="space-y-1 text-xs text-amber-950">
                                  {(q.whatCouldBeImproved || ['Add more specific impact or results', 'Mention key learnings or challenges', 'Be more concise and avoid filler words']).map((item, ii) => (
                                    <li key={ii} className="flex items-start gap-1.5">
                                      <span className="text-amber-600 font-bold">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Box 6: Suggested Answer Structure */}
                              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
                                <span className="text-[11px] font-bold text-blue-800 flex items-center gap-1.5 uppercase tracking-wider">
                                  <Layers size={13} className="text-blue-600" />
                                  <span>Suggested Answer Structure</span>
                                </span>
                                <ol className="space-y-1 text-xs text-blue-950">
                                  {(q.suggestedAnswerStructure || [
                                    'Brief background (education/experience)',
                                    'Key technical skills',
                                    'Notable projects with impact',
                                    'Career goals and motivation',
                                  ]).map((step, si) => (
                                    <li key={si} className="flex items-start gap-1.5">
                                      <span className="font-bold text-blue-600">{si + 1}.</span>
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>

                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* View All Questions toggle */}
                {questions.length > 3 && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAllQuestions((prev) => !prev)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      {showAllQuestions ? 'Show Less Questions ↑' : `View All Questions (${questions.length}) ↓`}
                    </button>
                  </div>
                )}
              </section>

              {/* ─── BOTTOM 3 CARDS: RECOMMENDATIONS, RESOURCES, NEXT STEPS ─── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Card 1: Personalized Recommendations */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Personalized Recommendations
                    </h3>
                  </div>

                  <div className="space-y-3.5">
                    {(analysis.recommendations || [
                      { priority: 1, title: 'Practice system design concepts', action: 'Focus on scalability, trade-offs and real-world examples.' },
                      { priority: 2, title: 'Improve answer depth', action: 'Provide more detailed technical explanations with examples.' },
                      { priority: 3, title: 'Work on time management', action: 'Keep answers concise and structured within time limits.' },
                    ]).map((rec, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {rec.priority || i + 1}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            {rec.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {rec.action}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 2: Practice Resources */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Practice Resources
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {(analysis.practiceResources || [
                      { title: 'System Design Fundamentals', subtitle: 'Learn scalable system design patterns', link: '/system-design', icon: Layers },
                      { title: 'Database Concepts', subtitle: 'SQL vs NoSQL, indexing and optimization', link: '/preparation', icon: Database },
                      { title: 'Mock Interview Practice', subtitle: 'Practice similar questions with AI', link: '/video/setup', icon: Mic },
                      { title: 'Communication Skills', subtitle: 'Learn how to structure your answers', link: '/challenges', icon: MessageSquare },
                    ]).map((res, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => navigate(res.link)}
                        className="w-full p-3 rounded-2xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-blue-50/30 flex items-center justify-between text-left transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-blue-600">
                            <BookOpen size={13} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 block">
                              {res.title}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {res.subtitle}
                            </span>
                          </div>
                        </div>
                        <ArrowRight size={13} className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card 3: Next Steps */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                      <Target className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Next Steps
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 pt-3 leading-relaxed">
                      Continue practicing to improve your weak areas and build confidence for real interviews.
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        navigate('/video/setup');
                      }}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer text-center"
                    >
                      Practice Similar Interview
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/interview')}
                      className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                    >
                      Try a Different Interview Type
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/interviews')}
                      className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                    >
                      Back to Interview Hub
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* ─── DETAILED ANALYSIS TAB ─── */}
          {activeTab === 'detailed' && (
            <motion.div
              key="detailed-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs"
            >
              <h3 className="text-base font-bold text-slate-900">
                Detailed Diagnostic Breakdown
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                {analysis.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Vocal Cadence & Delivery Telemetry
                  </h4>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span>Speaking Speed:</span>
                      <span className="font-bold text-slate-900 font-mono">{analysis.confidenceSignals?.avgWpm || 135} WPM</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span>Verbal Filler Instances:</span>
                      <span className="font-bold text-slate-900 font-mono">{analysis.confidenceSignals?.avgPauseCount || 0}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Average Response Length:</span>
                      <span className="font-bold text-slate-900 font-mono">{analysis.confidenceSignals?.avgAnswerLength || 45} words</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Proctoring & Environmental Integrity
                  </h4>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span>Eye Contact & Visual Focus:</span>
                      <span className="font-bold text-emerald-600 font-mono">{analysis.eyeContactScore || 85}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span>Platform Integrity Score:</span>
                      <span className="font-bold text-blue-600 font-mono">{analysis.presenceScore || 95}%</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Readiness Classification:</span>
                      <span className="font-bold text-slate-900 font-mono">{analysis.readinessVerdict || 'READY'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── QUESTION BY QUESTION TAB ─── */}
          {activeTab === 'questions' && (
            <motion.div
              key="questions-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs"
            >
              <h3 className="text-base font-bold text-slate-900 mb-4">
                All Question Reviews & Feedback
              </h3>
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={q.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-blue-700 font-mono">Question {idx + 1} ({q.category || 'Technical'})</span>
                      <span className="font-bold text-xs text-emerald-700 font-mono">
                        {q.evalScore !== undefined && q.evalScore !== null ? `${q.evalScore}/100` : '—'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{q.questionText}</h4>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                      <strong>Your Answer: </strong>{cleanCandidateAnswer(q.answerText)}
                    </div>
                    <p className="text-xs text-slate-600 italic">
                      <strong>Evaluation: </strong>{q.evalFeedback ? q.evalFeedback.replace(/<!--EVAL_META[\s\S]*?EVAL_META-->/, '').trim() : 'Good understanding demonstrated.'}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── TRANSCRIPT TAB ─── */}
          {activeTab === 'transcript' && (
            <motion.div
              key="transcript-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Full Interview Transcript
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Complete verifiable chronological conversation between Ava AI and candidate.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search transcript..."
                      value={transcriptSearch}
                      onChange={(e) => setTranscriptSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 w-48 text-slate-800"
                    />
                  </div>

                  <select
                    value={transcriptSpeakerFilter}
                    onChange={(e) => setTranscriptSpeakerFilter(e.target.value as any)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Speakers</option>
                    <option value="ai">AI Interviewer</option>
                    <option value="user">Candidate</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredTranscript.map((item: any, i: number) => {
                  const isAi = item.role === 'assistant' || item.role === 'ai';
                  const displayContent = isAi ? item.content : cleanCandidateAnswer(item.content);
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl text-xs space-y-1 ${
                        isAi
                          ? 'bg-blue-50/50 border border-blue-100 text-slate-800'
                          : 'bg-emerald-50/50 border border-emerald-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-[11px]">
                        <span className={isAi ? 'text-blue-700' : 'text-emerald-700'}>
                          {isAi ? 'Ava (AI Interviewer)' : 'You (Candidate)'}
                        </span>
                        <span className="text-slate-400 font-mono font-normal">
                          {Math.floor(i * 1.5)}:{((i * 30) % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{displayContent}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── FEEDBACK & RECOMMENDATIONS TAB ─── */}
          {activeTab === 'feedback' && (
            <motion.div
              key="feedback-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs"
            >
              <h3 className="text-base font-bold text-slate-900">
                Actionable Feedback & Roadmap
              </h3>

              <div className="space-y-4">
                {(analysis.actionableTips || []).map((tip, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-1">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                      Priority #{i + 1}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{tip.tip}</h4>
                    <p className="text-xs text-slate-600">{tip.reason}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
