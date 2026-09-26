// ═══════════════════════════════════════════════════════════════
// RU Ready? — Premium Gamified Placement Command Center
// Clean SaaS Interface, Real Data XP Ledger, Streaks, Missions & Tree
// Zero 3D/Cartoon Illustrations — 100% Professional Developer SaaS
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Target,
  Flame,
  Zap,
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Code2,
  MessageSquare,
  BookOpen,
  Users,
  Binary,
  Layers,
  Cpu,
  Calculator,
  Volume2,
  Globe,
  ChevronRight,
  BarChart3,
  Calendar,
  Compass,
  FileText,
  Video,
  Play,
  Check,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Lock,
} from 'lucide-react';
import apiClient from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/useProfileStore';
import { computeGamificationData, type GamificationState, type Mission, type SkillProgress, type AchievementBadge } from '../../lib/gamificationEngine';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<any[]>([]);
  const [prepStats, setPrepStats] = useState<{ quizzesCompleted?: number; topicsMastered?: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetch real sessions and activities
  useEffect(() => {
    let isMounted = true;
    async function fetchDashboardData() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [sessRes, prepRes] = await Promise.allSettled([
          apiClient.get('/interview/sessions'),
          apiClient.get('/prep/stats').catch(() => ({ data: { quizzesCompleted: 0, topicsMastered: 0 } })),
        ]);

        if (!isMounted) return;

        if (sessRes.status === 'fulfilled' && Array.isArray(sessRes.value.data)) {
          setSessions(sessRes.value.data);
        } else {
          setSessions([]);
        }

        if (prepRes.status === 'fulfilled' && prepRes.value?.data) {
          setPrepStats(prepRes.value.data);
        }
      } catch (err: any) {
        console.warn('Failed to load dashboard data:', err);
        if (isMounted) {
          setLoadError('Failed to load telemetry. Displaying local data.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute real dynamic progression
  const gamification: GamificationState = computeGamificationData(sessions, prepStats, profile || {});

  const completedSessions = sessions.filter(
    (s) => s.status === 'COMPLETED' || s.status === 'ANALYSED'
  );

  const targetRole = profile?.targetRole || (user as any)?.targetRole || 'Full Stack Software Engineer';
  const userName = user?.name || profile?.name || 'Candidate';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7FC] flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white border border-slate-200/90 p-8 sm:p-10 rounded-3xl shadow-xs text-center max-w-md w-full space-y-4">
          <div className="h-10 w-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-base font-bold text-slate-900 font-display">
            Loading Placement Command Center...
          </h2>
          <p className="text-xs text-slate-500">
            Synchronizing your XP ledger, daily missions, and skill telemetry.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-slate-900 py-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500/20 selection:text-slate-900 pb-20">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ─── 1. HERO SECTION — WELCOME BACK & READINESS SUMMARY ─── */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left Section: User Info & Placement Chips */}
            <div className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/80 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>YOUR PLACEMENT COMMAND CENTER</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-display tracking-tight">
                  Welcome back, {userName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
                  Build your skills, complete daily missions, and track your placement readiness.
                </p>
              </div>

              {/* Compact Information Chips Row */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium">
                  <Target className="w-3.5 h-3.5 text-blue-600" />
                  <span>Target Role: <strong className="text-slate-900">{targetRole}</strong></span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200/80 text-xs text-purple-700 font-medium">
                  <Zap className="w-3.5 h-3.5 text-purple-600" />
                  <span>Level: <strong className="text-purple-900">Level {gamification.level}</strong></span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/80 text-xs text-indigo-700 font-medium">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Total XP: <strong className="text-indigo-900">{gamification.totalXP.toLocaleString()} XP</strong></span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-800 font-medium">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>Streak: <strong className="text-amber-900">{gamification.currentStreak}-Day Streak</strong></span>
                </div>
              </div>
            </div>

            {/* Right Section: Gamification Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-5 shrink-0 shadow-2xs">
              
              {/* Readiness Circle Indicator */}
              <div className="relative inline-flex items-center justify-center h-20 w-20 shrink-0">
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
                    animate={{ strokeDashoffset: 2 * Math.PI * 34 - ((gamification.readinessScore || 0) / 100) * (2 * Math.PI * 34) }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-slate-900 font-display">
                    {gamification.readinessScore > 0 ? `${gamification.readinessScore}%` : '—'}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Readiness</span>
                </div>
              </div>

              {/* Level & XP Details */}
              <div className="space-y-2 min-w-[200px]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 font-display">
                    Level {gamification.level} — {gamification.levelTitle}
                  </span>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    {gamification.currentStreak}d 🔥
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${gamification.progressToNextLevel}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>{gamification.currentLevelXP.toLocaleString()} / {gamification.xpForNextLevel.toLocaleString()} XP</span>
                    <span>{gamification.progressToNextLevel}%</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/preparation')}
                  className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Continue Learning</span>
                  <ArrowRight size={13} />
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* ─── 2. PLAYER PROGRESSION — XP & LEVEL SYSTEM CARD ─── */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-700 block">
                PLAYER PROGRESSION SYSTEM
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 font-display">
                LEVEL {gamification.level} — {gamification.levelTitle.toUpperCase()}
              </h3>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="font-semibold text-slate-600">
                {gamification.currentLevelXP.toLocaleString()} / {gamification.xpForNextLevel.toLocaleString()} XP
              </span>
              <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                {gamification.xpNeededForNextLevel} XP to Level {gamification.level + 1}
              </Badge>
            </div>
          </div>

          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${gamification.progressToNextLevel}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5">
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span>Next Milestone: <strong className="text-slate-800">{gamification.nextMilestoneText}</strong></span>
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Earn XP by completing coding challenges, oral interviews, and quizzes.
            </span>
          </div>
        </section>

        {/* ─── 3. TODAY'S MISSIONS (PRIMARY GAMIFICATION SECTION) ─── */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CheckCircle2 size={15} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  Today's Missions
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Complete your daily goals to earn XP and build your streak.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">
                {gamification.completedMissionsCount} of {gamification.totalMissionsCount} completed
              </span>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-mono text-xs">
                +{gamification.todayEarnedXP} XP Earned Today
              </Badge>
            </div>
          </div>

          {/* 4 Mission Cards Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {gamification.missions.map((mission) => {
              const isDone = mission.isCompleted;
              return (
                <div
                  key={mission.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    isDone
                      ? 'bg-emerald-50/40 border-emerald-200/80 shadow-2xs'
                      : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                        {mission.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        +{mission.rewardXP} XP
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-1.5">
                        {isDone && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                        <span>{mission.title}</span>
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {mission.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-medium text-slate-500">
                        <span>Progress</span>
                        <span className="font-bold text-slate-700">
                          {mission.current} / {mission.target}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isDone ? 'bg-emerald-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${(mission.current / mission.target) * 100}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(mission.actionHref)}
                      className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                      }`}
                    >
                      <span>{mission.actionText}</span>
                      {!isDone && <ArrowRight size={12} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 4. SKILL PROGRESSION — SKILL TREE JOURNEY ─── */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Compass size={15} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  Your Skill Journey
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Track verified mastery across essential software engineering and placement domains.
              </p>
            </div>

            <Link
              to="/preparation"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Explore All Modules</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* 8 Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {gamification.skills.map((skill) => {
              return (
                <div
                  key={skill.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        {skill.iconName === 'Binary' && <Binary size={16} />}
                        {skill.iconName === 'Code2' && <Code2 size={16} />}
                        {skill.iconName === 'Layers' && <Layers size={16} />}
                        {skill.iconName === 'Cpu' && <Cpu size={16} />}
                        {skill.iconName === 'Calculator' && <Calculator size={16} />}
                        {skill.iconName === 'Users' && <Users size={16} />}
                        {skill.iconName === 'Volume2' && <Volume2 size={16} />}
                        {skill.iconName === 'Globe' && <Globe size={16} />}
                      </div>
                      <Badge className={skill.isStarted ? 'bg-blue-50 text-blue-700 border-blue-200 text-[10px]' : 'bg-slate-100 text-slate-500 border-slate-200 text-[10px]'}>
                        {skill.levelLabel}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 font-display group-hover:text-blue-600 transition-colors">
                        {skill.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {skill.completedCount} / {skill.totalTarget} activities completed
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-medium text-slate-500">
                        <span>Progress</span>
                        <span className="font-bold text-slate-700">{skill.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(skill.actionHref)}
                      className="w-full py-1.5 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>{skill.actionText}</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 5. TWO-COLUMN: WEEKLY CHALLENGE & PRACTICE STREAK ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Weekly Challenge Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wide">
                  WEEKLY CHALLENGE
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  +{gamification.weeklyChallenge.rewardXP} XP
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {gamification.weeklyChallenge.title}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {gamification.weeklyChallenge.description}
                </p>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>Weekly Progress</span>
                  <span className="font-bold text-slate-900">
                    {gamification.weeklyChallenge.current} / {gamification.weeklyChallenge.target} Problems
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                    style={{ width: `${gamification.weeklyChallenge.percentage}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/coding/new?focus=DSA')}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{gamification.weeklyChallenge.isCompleted ? 'Challenge Completed ✓' : 'Start Challenge'}</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Right Column: Practice Streak Tracker */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Flame size={16} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Practice Streak
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Best: <strong className="text-slate-800">{gamification.longestStreak} Days</strong>
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/50 border border-amber-200/70">
                <div className="space-y-0.5">
                  <span className="text-2xl font-black text-amber-900 font-display">
                    {gamification.currentStreak}-Day Streak
                  </span>
                  <p className="text-[11px] text-amber-800 font-medium">
                    {gamification.daysPracticedThisWeek} days practiced this week
                  </p>
                </div>
                <div className="text-2xl">🔥</div>
              </div>

              {/* 7-Day Activity Calendar */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  This Week's Practice Activity:
                </span>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {gamification.weeklyCalendar.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${
                        item.isPracticed
                          ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                          : item.isToday
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] font-bold">{item.day}</span>
                      <span className="text-xs">
                        {item.isPracticed ? '✓' : '○'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              Complete any coding challenge, oral interview, or prep quiz daily to maintain your streak.
            </p>
          </div>

        </section>

        {/* ─── 6. PERFORMANCE OVERVIEW (SKILL ANALYTICS) ─── */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="space-y-0.5 border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <BarChart3 size={15} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Performance Overview
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Calibrated competency ratings based on verified assessment telemetry.
            </p>
          </div>

          {completedSessions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/70 text-center space-y-3">
              <BarChart3 size={32} className="text-slate-400 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">No Assessment Data Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Your performance insights will appear here after you complete an interview or assessment.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/oral/new')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Start First Assessment</span>
                <ArrowRight size={12} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: 'Technical Knowledge', val: gamification.performanceOverview.technicalKnowledge, color: 'bg-blue-600' },
                { label: 'Problem Solving', val: gamification.performanceOverview.problemSolving, color: 'bg-purple-600' },
                { label: 'System Design', val: gamification.performanceOverview.systemDesign, color: 'bg-indigo-600' },
                { label: 'Communication', val: gamification.performanceOverview.communication, color: 'bg-emerald-600' },
                { label: 'Behavioral Responses', val: gamification.performanceOverview.behavioralResponses, color: 'bg-amber-600' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{item.label}</span>
                    <span className="font-bold font-mono text-slate-700">
                      {item.val != null ? `${item.val}/100` : 'Not Assessed'}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${item.color}`}
                      style={{ width: `${item.val || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ─── 7. YOUR INTERVIEW HISTORY ─── */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText size={15} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  Your Interview History
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Verified records of all oral and coding assessments completed on the platform.
              </p>
            </div>

            {completedSessions.length > 0 && (
              <span className="text-xs text-slate-500 font-semibold">
                {completedSessions.length} total sessions
              </span>
            )}
          </div>

          {completedSessions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/70 text-center space-y-3">
              <FileText size={32} className="text-slate-400 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">No interviews completed yet.</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Complete your first mock interview to unlock performance insights and interview-based recommendations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/oral/new')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Start Your First Interview</span>
                <ArrowRight size={12} />
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px]">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Interview Type</th>
                    <th className="py-3 px-3">Role / Focus</th>
                    <th className="py-3 px-3">Duration</th>
                    <th className="py-3 px-3">Score</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedSessions.slice(0, 6).map((sess) => {
                    const score = Math.round(sess.evalScore || sess.analysis?.overallScore || 0);
                    const isCoding = sess.interviewType === 'CODING';
                    const scoreBadge = score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : score >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200';
                    return (
                      <tr key={sess.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3 font-medium text-slate-700">
                          {sess.createdAt ? new Date(sess.createdAt).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] font-mono border ${isCoding ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                            {isCoding ? 'Coding Sandbox' : 'Oral Interview'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-slate-900">
                          {sess.targetRole || 'Software Engineer'}
                        </td>
                        <td className="py-3.5 px-3 text-slate-500 font-mono">
                          {sess.durationMins || 20}m
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${scoreBadge}`}>
                            {score > 0 ? `${score}%` : 'Evaluated'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <Badge variant="success" size="xs">COMPLETED</Badge>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/interview/${sess.id}/analysis`)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ─── 8. ACHIEVEMENTS AND BADGES ─── */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Award size={15} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  Achievements
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Earn verified placement milestone badges as you prepare.
              </p>
            </div>

            <span className="text-xs text-slate-500 font-medium">
              {gamification.achievements.filter((a) => a.isUnlocked).length} of {gamification.achievements.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gamification.achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all space-y-2 flex flex-col justify-between ${
                  ach.isUnlocked
                    ? 'bg-purple-50/30 border-purple-200 shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200/70 opacity-70'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      ach.isUnlocked ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {ach.iconName === 'Zap' && <Zap size={16} />}
                      {ach.iconName === 'Award' && <Award size={16} />}
                      {ach.iconName === 'ShieldCheck' && <ShieldCheck size={16} />}
                      {ach.iconName === 'Flame' && <Flame size={16} />}
                      {ach.iconName === 'Layers' && <Layers size={16} />}
                      {ach.iconName === 'MessageSquare' && <MessageSquare size={16} />}
                    </div>

                    <Badge className={ach.isUnlocked ? 'bg-purple-100 text-purple-800 border-purple-200 text-[10px]' : 'bg-slate-200 text-slate-600 border-slate-300 text-[10px]'}>
                      {ach.isUnlocked ? 'Unlocked ✓' : 'Locked'}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-display">
                      {ach.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Requirement: <strong className="text-slate-700">{ach.unlockCondition}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 9. PLACEMENT ROADMAP (CAREER PROGRESSION) ─── */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Compass size={15} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  Placement Roadmap
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Structured 6-stage milestone path calibrated for your target role.
              </p>
            </div>

            <Link
              to="/roadmap"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View Full Career Roadmap</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                num: 1,
                title: 'Build Foundations',
                desc: 'Language syntax, Big-O fundamentals, and git workflows.',
                status: 'Completed',
                progress: 100,
                href: '/preparation',
                actionText: 'Review Basics',
              },
              {
                num: 2,
                title: 'Strengthen DSA',
                desc: 'Arrays, Two Pointers, Trees, Graphs, DP & Bit manipulation.',
                status: completedSessions.length > 0 ? 'In Progress' : 'In Progress',
                progress: Math.min(100, Math.max(25, completedSessions.length * 20)),
                href: '/coding/new?focus=DSA',
                actionText: 'Practice DSA',
              },
              {
                num: 3,
                title: 'Master Core Subjects',
                desc: 'Operating Systems, DBMS & SQL, Computer Networks, OOP.',
                status: 'In Progress',
                progress: 40,
                href: '/preparation',
                actionText: 'Study Subjects',
              },
              {
                num: 4,
                title: 'Practice Interviews',
                desc: 'Live observed Monaco coding challenges & oral AI assessments.',
                status: completedSessions.length > 0 ? 'In Progress' : 'Up Next',
                progress: Math.min(100, completedSessions.length * 25),
                href: '/oral/new',
                actionText: 'Mock Interview',
              },
              {
                num: 5,
                title: 'Build Real Projects',
                desc: 'End-to-end production systems & ATS resume optimization.',
                status: 'Up Next',
                progress: 15,
                href: '/ats',
                actionText: 'ATS Resume Scan',
              },
              {
                num: 6,
                title: 'Company Drives',
                desc: 'FAANG, Product & Tier-1 mock placement placement tracks.',
                status: 'Locked',
                progress: 0,
                href: '/interviews/company-wise',
                actionText: 'Company Tracks',
              },
            ].map((stage) => (
              <div
                key={stage.num}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-mono font-bold text-xs flex items-center justify-center border border-blue-200">
                      {stage.num}
                    </span>
                    <Badge
                      className={
                        stage.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]'
                          : stage.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 border-blue-200 text-[10px]'
                          : 'bg-slate-100 text-slate-500 border-slate-200 text-[10px]'
                      }
                    >
                      {stage.status}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-display">
                      {stage.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${stage.progress}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(stage.href)}
                    className="w-full py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{stage.actionText}</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 10. QUICK ACTIONS ─── */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Quick Actions
            </h3>
            <p className="text-xs text-slate-500">
              Jump directly into your next high-impact preparation activity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <button
              type="button"
              onClick={() => navigate('/oral/new')}
              className="p-3.5 rounded-2xl bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200 text-left transition-all flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <MessageSquare size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-700 transition-colors">
                  Start Oral Interview
                </span>
                <span className="text-[10px] text-slate-500 block">AI Recruiter Practice</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/coding/new')}
              className="p-3.5 rounded-2xl bg-indigo-50/60 hover:bg-indigo-100/70 border border-indigo-200 text-left transition-all flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Code2 size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900 block group-hover:text-indigo-700 transition-colors">
                  Start Coding Interview
                </span>
                <span className="text-[10px] text-slate-500 block">Observed Monaco Sandbox</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/coding/new?focus=DSA')}
              className="p-3.5 rounded-2xl bg-purple-50/60 hover:bg-purple-100/70 border border-purple-200 text-left transition-all flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Binary size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-700 transition-colors">
                  Practice DSA
                </span>
                <span className="text-[10px] text-slate-500 block">Algorithmic Drills</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/preparation')}
              className="p-3.5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200 text-left transition-all flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <BookOpen size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700 transition-colors">
                  Continue Learning
                </span>
                <span className="text-[10px] text-slate-500 block">Core CS & Quizzes</span>
              </div>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
