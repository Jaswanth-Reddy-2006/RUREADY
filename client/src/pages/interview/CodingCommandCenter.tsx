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
  AlertTriangle,
  Cpu,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Brain,
  Layers,
  ArrowRight,
  FileCode,
  Database,
  Bug,
} from 'lucide-react';
import apiClient from '../../api/client';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

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
  const avgScore = completedSessions.length
    ? Math.round(
        completedSessions.reduce(
          (acc, s) => acc + (s.evalScore || s.analysis?.overallScore || 80),
          0
        ) / completedSessions.length
      )
    : 0;
  const hoursCoded = Math.round(
    (completedSessions.reduce((acc, s) => acc + (s.durationMins || 30), 0) / 60) * 10
  ) / 10;

  const starterCodingCards = [
    {
      id: 'dsa',
      badge: 'RECOMMENDED STARTER',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Code2,
      iconColor: 'text-blue-600 bg-blue-100',
      title: 'DSA Algorithmic Blitz',
      desc: 'Observed problem-solving on Arrays, Two Pointers, Hash Maps, and Sliding Windows with real-time asymptotic complexity checks.',
      duration: '15-20 mins • 1 Algorithmic Challenge',
      actionText: 'Start DSA Challenge',
      route: '/interview/coding/new?focus=DSA',
    },
    {
      id: 'machine-coding',
      badge: 'LOW-LEVEL DESIGN',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: Terminal,
      iconColor: 'text-indigo-600 bg-indigo-100',
      title: 'Observed Machine Coding (LLD)',
      desc: 'Build scalable object-oriented components (LRU Cache, Rate Limiter, In-Memory File System) under time constraints.',
      duration: '30 mins • Architectural Coding',
      actionText: 'Start Machine Coding',
      route: '/interview/coding/new?focus=MachineCoding',
    },
    {
      id: 'sql',
      badge: 'DATABASE & DATA LAB',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      icon: Database,
      iconColor: 'text-cyan-600 bg-cyan-100',
      title: 'SQL & Query Optimization Lab',
      desc: 'Write complex JOINs, CTEs, Window Functions, and query index optimizations in an interactive database sandbox.',
      duration: '15 mins • 3 Query Challenges',
      actionText: 'Start SQL Lab',
      route: '/interview/coding/new?focus=SQL',
    },
    {
      id: 'debugging',
      badge: 'CODE REVIEW & DEBUG',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Bug,
      iconColor: 'text-amber-600 bg-amber-100',
      title: 'Live Code Debugging & Refactoring',
      desc: 'Identify off-by-one errors, memory leaks, and concurrency race conditions in a pre-written buggy codebase.',
      duration: '15 mins • Debugging Challenge',
      actionText: 'Start Debug Drill',
      route: '/interview/coding/new?focus=Debugging',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ─── HEADER & CTA ─── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
              <Code2 className="w-3.5 h-3.5" />
              <span>RU READY Coding Interview Sandbox</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Coding Interview Command Center
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
              Solve algorithmic problems in an observed Monaco IDE. Ava tracks your coding speed, edge case coverage, and debugging approach.
            </p>
          </div>

          <Button
            onClick={() => navigate('/interview/coding/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Start New Coding Session</span>
          </Button>
        </div>

        {/* ─── TOP STATISTICS CARDS ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-white border-slate-200/80 shadow-xs rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Coding Sessions</span>
              <Award className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-slate-900">{totalCoding}</span>
              <span className="text-xs text-slate-500 block mt-0.5">Challenges Completed</span>
            </div>
          </Card>

          <Card className="p-5 bg-white border-slate-200/80 shadow-xs rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Big-O Score</span>
              <BarChart3 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-slate-900">
                {totalCoding > 0 ? `${avgScore}%` : '--'}
              </span>
              <span className="text-xs text-emerald-600 font-semibold block mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Asymptotic Target: 80%+
              </span>
            </div>
          </Card>

          <Card className="p-5 bg-white border-slate-200/80 shadow-xs rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Coding Time</span>
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-slate-900">{hoursCoded}h</span>
              <span className="text-xs text-slate-500 block mt-0.5">Hours in IDE</span>
            </div>
          </Card>

          <Card className="p-5 bg-white border-slate-200/80 shadow-xs rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Compiler</span>
              <Cpu className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900">
                {totalCoding > 0 ? '7 Languages' : 'Monaco v0.45'}
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">
                Python, C++, Java, JS, TS, Go, C#
              </span>
            </div>
          </Card>
        </div>

        {/* ─── CONDITION: ZERO CODING INTERVIEWS vs ACTIVE STATE ─── */}
        {totalCoding === 0 ? (
          /* ─── ZERO STATE: STARTER CODING ACTION CARDS & IDE INTRO ─── */
          <div className="space-y-8">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Code2 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      First-Time Coding Journey
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Start Your First Coding Interview Challenge
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Choose a starter challenge below. You'll code live in Monaco while Ava observes your solution logic.
                  </p>
                </div>

                <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-mono text-xs self-start md:self-auto">
                  0 Completed Coding Sessions
                </Badge>
              </div>

              {/* 4 Starter Action Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {starterCodingCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.id}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${card.badgeBg}`}>
                            {card.badge}
                          </span>
                          <div className={`p-2 rounded-xl ${card.iconColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-slate-900">{card.title}</h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{card.desc}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {card.duration}
                        </span>
                        <button
                          onClick={() => navigate(card.route)}
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          <span>{card.actionText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* What Ava Observes in IDE Box */}
            <Card className="p-6 md:p-8 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl space-y-6 shadow-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">What Ava Observes in the Live Monaco IDE</h3>
                  <p className="text-xs text-slate-400">
                    Unlike standard LeetCode environments, Ava evaluates your entire technical problem-solving process.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                    <Clock className="w-4 h-4" />
                    <span>Keystroke & Flow</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tracks thinking pauses, refactoring frequency, and structured function modularization.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                    <FileCode className="w-4 h-4" />
                    <span>Big-O Rigor</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Verifies whether your time complexity meets optimal bounds (e.g. O(N log N) vs O(N^2)).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Boundary Tests</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Executes automated edge-case test suites (empty arrays, max memory limits, duplicate keys).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <Brain className="w-4 h-4" />
                    <span>Socratic Hints</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    If stuck, ask Ava for progressive Socratic hints without revealing the full solution.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* ─── ACTIVE STATE: RECENT CODING SESSIONS & STATS ─── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">Recent Coding Sessions</h2>
                  <button
                    onClick={() => navigate('/history')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View All History <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {completedSessions.slice(0, 5).map((s) => (
                    <div
                      key={s.id}
                      onClick={() => navigate(`/interview/coding/${s.id}`)}
                      className="p-4 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                          <Terminal className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">{s.targetRole} Coding Loop</h3>
                          <span className="text-xs text-slate-500">
                            {s.targetCompany || 'Top Tech'} • {s.durationMins || 30} mins
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-sm font-bold block text-emerald-600">
                            {s.evalScore || s.analysis?.overallScore || 82}%
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-2xl space-y-4">
                <h3 className="font-bold text-base text-slate-900">Supported Compiler Runtimes</h3>
                <div className="space-y-2 text-xs">
                  {['Python 3.12 (CPython)', 'C++17 (GCC 12)', 'Java 17 (JVM)', 'Node.js 20 (TypeScript)', 'Go 1.22'].map((lang) => (
                    <div key={lang} className="p-2.5 rounded-lg bg-slate-50 font-mono font-medium text-slate-700 border border-slate-200 flex justify-between">
                      <span>{lang}</span>
                      <span className="text-emerald-600 font-bold">READY</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
