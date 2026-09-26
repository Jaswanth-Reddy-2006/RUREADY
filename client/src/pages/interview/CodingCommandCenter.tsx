import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code2,
  Plus,
  Play,
  Clock,
  Award,
  TrendingUp,
  BarChart3,
  Terminal,
  ChevronRight,
  Target,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Layers,
  ArrowRight,
  Database,
  Bug,
  Cpu,
  FileCode,
  Check,
  Search,
  MessageSquare,
  FileText,
  Lightbulb,
  Keyboard,
  FlaskConical,
  Binary,
} from 'lucide-react';
import apiClient from '../../api/client';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

// ─── MINI BAR GRAPH COMPONENT (REAL DATA ONLY) ───
function MiniBarGraph({ color = 'bg-blue-400' }: { color?: string }) {
  return (
    <div className="flex items-end gap-1 h-8 shrink-0">
      <div className={`w-1.5 h-3 ${color} opacity-30 rounded-t`} />
      <div className={`w-1.5 h-5 ${color} opacity-50 rounded-t`} />
      <div className={`w-1.5 h-4 ${color} opacity-40 rounded-t`} />
      <div className={`w-1.5 h-7 ${color} opacity-80 rounded-t`} />
      <div className={`w-1.5 h-6 ${color} rounded-t`} />
    </div>
  );
}

export default function CodingCommandCenter() {
  const navigate = useNavigate();
  const [codingSessions, setCodingSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCodingSessions() {
      try {
        const response = await apiClient.get('/interview/sessions');
        const allSessions = response.data || [];
        const codingOnly = allSessions.filter(
          (s: any) => s.interviewType === 'CODING'
        );
        codingOnly.sort(
          (a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        setCodingSessions(codingOnly);
      } catch (err) {
        console.warn('Failed to fetch coding interview history:', err);
        setCodingSessions([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCodingSessions();
  }, []);

  const completedSessions = codingSessions.filter(
    (s) => s.status === 'COMPLETED' || s.status === 'ANALYSED'
  );
  const totalCoding = completedSessions.length;
  const hasHistory = completedSessions.length > 0;
  const latestSession = hasHistory ? completedSessions[0] : null;

  const avgScore = hasHistory
    ? Math.round(
        completedSessions.reduce(
          (acc, s) => acc + (s.evalScore || s.analysis?.overallScore || 0),
          0
        ) / completedSessions.length
      )
    : 0;

  const totalMins = completedSessions.reduce((acc, s) => acc + (s.durationMins || 0), 0);
  const hoursCoded = Math.floor(totalMins / 60);
  const minsCoded = totalMins % 60;
  const codingTimeDisplay = hasHistory ? `${hoursCoded}h ${minsCoded > 0 ? `${minsCoded}m` : ''}`.trim() : '0h';

  const latestScoreDisplay = latestSession
    ? `${Math.round(latestSession.evalScore || latestSession.analysis?.overallScore || 0)}%`
    : '—';

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-slate-900 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ─── 1. HERO CODING COMMAND CENTER BANNER ─── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EBF3FE] via-[#EDF5FF] to-[#E6F1FE] border border-blue-100 shadow-sm min-h-[340px] md:min-h-[320px]">
          
          {/* Left / Background 3D Illustration */}
          <div className="absolute inset-y-0 left-0 w-full sm:w-[50%] lg:w-[45%] pointer-events-none overflow-hidden z-0">
            <img
              src="/images/coding_hero_3d.jpg"
              alt="3D Coding Interview Avatar"
              className="w-full h-full object-cover object-[center_15%] filter brightness-[1.02]"
            />
            {/* Desktop Fade Gradient to text area */}
            <div className="hidden sm:block absolute inset-y-0 right-0 w-44 bg-gradient-to-r from-transparent via-[#EDF5FF]/90 to-[#EDF5FF]" />
            {/* Mobile Gradient Scrim */}
            <div className="sm:hidden absolute inset-0 bg-gradient-to-b from-transparent via-[#EDF5FF]/90 to-[#EDF5FF]" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 lg:p-10 lg:pl-[42%] flex flex-col justify-between space-y-6 h-full">
            
            {/* Header Text & Badges */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200/80 text-pink-700 text-xs font-bold tracking-wide shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                  <span>AI-Powered Coding Interview Practice</span>
                </div>

                {/* Slogan on Right */}
                <div className="hidden lg:flex flex-col items-end">
                  <span className="font-extrabold text-xs text-slate-800 tracking-tight">
                    Code Practice Smarter
                  </span>
                  <span className="font-extrabold text-xs text-purple-600 tracking-tight">
                    Get Hired!
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-950 tracking-tight font-display leading-tight">
                  Coding Interview Command Center
                </h1>
                <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed max-w-xl">
                  Solve algorithmic problems in an observed Monaco IDE. Ava tracks your coding speed, edge case coverage, and debugging approach.
                </p>
              </div>
            </div>

            {/* 4 Feature Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              <div className="flex items-center gap-2.5 p-2.5 px-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/90 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-extrabold text-slate-900 block leading-tight">Real-time AI Evaluation</span>
                  <span className="text-[10px] font-medium text-slate-600 block leading-tight">Live code analysis</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 px-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/90 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-extrabold text-slate-900 block leading-tight">Detailed Feedback</span>
                  <span className="text-[10px] font-medium text-slate-600 block leading-tight">Code quality, test cases</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 px-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/90 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-extrabold text-slate-900 block leading-tight">Multiple Challenge Types</span>
                  <span className="text-[10px] font-medium text-slate-600 block leading-tight">DSA, System Design, Debugging</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 px-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/90 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-extrabold text-slate-900 block leading-tight">Track Your Progress</span>
                  <span className="text-[10px] font-medium text-slate-600 block leading-tight">See improvement over time</span>
                </div>
              </div>
            </div>

            {/* Main CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/interview/coding/new')}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-blue-500/25 transition-all cursor-pointer active:scale-98"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Start New Coding Session</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

          </div>
        </div>

        {/* ─── 2. FOUR PERFORMANCE STAT CARDS ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Coding Sessions */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all hover:border-slate-300">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileCode className="w-4 h-4" />
                </div>
                <span>Coding Sessions</span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-display">
                {totalCoding}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Challenges completed
              </p>
            </div>
            <MiniBarGraph color="bg-emerald-500" />
          </div>

          {/* Card 2: Average Score */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all hover:border-slate-300">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <span>Average Score</span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-display">
                {hasHistory ? `${avgScore}%` : '—'}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {hasHistory ? 'Across all submissions' : 'Complete a session to unlock'}
              </p>
            </div>
            <MiniBarGraph color="bg-amber-500" />
          </div>

          {/* Card 3: Coding Time */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all hover:border-slate-300">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <span>Coding Time</span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-display">
                {codingTimeDisplay}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Hours in IDE
              </p>
            </div>
            <MiniBarGraph color="bg-blue-500" />
          </div>

          {/* Card 4: Latest Score */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all hover:border-slate-300">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-600 font-semibold text-xs">
                <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span>Latest Score</span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-display">
                {latestScoreDisplay}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {hasHistory ? 'Recent performance' : 'Your first score will appear here'}
              </p>
            </div>
            <MiniBarGraph color="bg-pink-500" />
          </div>

        </div>

        {/* ─── 3. START YOUR CODING JOURNEY TRACKS ─── */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          
          {/* Section Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight">
                Start Your Coding Journey
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Choose a challenge type below. You'll code live in Monaco while Ava observes your solution logic.
            </p>
          </div>

          {/* 4 Track Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Track 1: DSA Algorithmic Challenge */}
            <div className="relative flex flex-col justify-between p-5 rounded-2xl bg-white border border-blue-200/80 shadow-xs hover:shadow-md transition-all hover:border-blue-300 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                    Recommended
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900 font-display group-hover:text-blue-600 transition-colors">
                    DSA Algorithmic Challenge
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Solve real algorithmic problems with live observation, edge case analysis and complexity checks.
                  </p>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    15–30 mins
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                    All Levels
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/interview/coding/new?focus=DSA')}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Start DSA Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Track 2: Low-Level Design */}
            <div className="relative flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-slate-300 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900 font-display group-hover:text-emerald-600 transition-colors">
                    Low-Level Design
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Design scalable components like LRU Cache, Rate Limiter, or In-Memory File System.
                  </p>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    30–45 mins
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                    Intermediate+
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/interview/coding/new?focus=MachineCoding')}
                  className="w-full py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-blue-700 border border-blue-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Start LLD Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Track 3: Database & SQL Lab */}
            <div className="relative flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-slate-300 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900 font-display group-hover:text-pink-600 transition-colors">
                    Database & SQL Lab
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Write complex queries, optimize performance, and work with real schema-based problems.
                  </p>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    15–30 mins
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                    All Levels
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/interview/coding/new?focus=SQL')}
                  className="w-full py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-blue-700 border border-blue-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Start SQL Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Track 4: Code Debugging & Refactoring */}
            <div className="relative flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:border-slate-300 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Bug className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900 font-display group-hover:text-amber-600 transition-colors">
                    Code Debugging & Refactoring
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Identify bugs, memory leaks, and concurrency issues in real codebases.
                  </p>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    15–30 mins
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                    All Levels
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/interview/coding/new?focus=Debugging')}
                  className="w-full py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-blue-700 border border-blue-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Start Debug Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ─── 4. WHAT AVA OBSERVES IN THE LIVE MONACO IDE ─── */}
        <div className="bg-white border border-blue-100/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight">
              What Ava Observes in the Live Monaco IDE
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Unlike standard coding platforms, Ava evaluates your entire problem-solving process.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch gap-6">
            
            {/* Left Code Editor Preview Widget */}
            <div className="w-full lg:w-72 bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-md flex flex-col justify-between relative overflow-hidden shrink-0 min-h-[160px]">
              <div className="space-y-2">
                {/* 3 Top Editor Dots */}
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                {/* Code lines simulation */}
                <div className="space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-slate-600">1</span>
                    <span className="text-purple-400">function</span>
                    <span className="text-blue-400">solve</span>
                    <span className="text-slate-300">(nums) &#123;</span>
                  </div>
                  <div className="flex items-center gap-2 pl-3 text-slate-400">
                    <span className="text-slate-600">2</span>
                    <span className="text-pink-400">const</span>
                    <span className="text-slate-200">map = </span>
                    <span className="text-amber-300">new Map();</span>
                  </div>
                  <div className="flex items-center gap-2 pl-3 text-slate-400">
                    <span className="text-slate-600">3</span>
                    <span className="text-emerald-400">// Asymptotic O(N)</span>
                  </div>
                </div>
              </div>

              {/* Floating Highlight Pill */}
              <div className="mt-4 p-2.5 rounded-xl bg-white/95 text-slate-900 border border-slate-200 shadow-lg flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-3.5 h-3.5" />
                </div>
                <div className="text-[10px] font-bold leading-tight">
                  Real-world coding environment in your browser
                </div>
              </div>
            </div>

            {/* Right 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
              
              {/* Pillar 1: Keystroke & Flow */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Keyboard className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-display">
                  Keystroke & Flow
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Tracks thinking pauses, refactoring frequency, and structured coding.
                </p>
              </div>

              {/* Pillar 2: Code Quality */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-display">
                  Code Quality
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Analyzes clean code practices, modularization and readability.
                </p>
              </div>

              {/* Pillar 3: Test Case Handling */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-display">
                  Test Case Handling
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Verifies edge case coverage and correctness of your solution.
                </p>
              </div>

              {/* Pillar 4: Problem-Solving Approach */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-display">
                  Problem-Solving Approach
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Understands your logic, complexity analysis and optimization decisions.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* ─── 5. RECENT CODING SESSIONS HISTORY (IF ANY) ─── */}
        {hasHistory && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Recent Coding Sessions
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {completedSessions.length} completed
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {completedSessions.slice(0, 5).map((sess) => {
                const score = Math.round(sess.evalScore || sess.analysis?.overallScore || 0);
                const scoreColor = score >= 80 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : score >= 60 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-slate-700 bg-slate-50 border-slate-200';
                
                return (
                  <div
                    key={sess.id}
                    onClick={() => navigate(`/interview/${sess.id}/analysis`)}
                    className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-3 -mx-3 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-mono font-bold text-xs">
                        <Code2 size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {sess.targetRole || 'Technical Coding Assessment'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {sess.focusAreas?.join(', ') || 'DSA & Algorithms'} • {sess.createdAt ? new Date(sess.createdAt).toLocaleDateString() : 'Recent'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${scoreColor}`}>
                        {score > 0 ? `${score}% Score` : 'Evaluated'}
                      </span>
                      <ChevronRight size={16} className="text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
