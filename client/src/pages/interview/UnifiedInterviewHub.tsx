import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  Code2,
  Play,
  Clock,
  Award,
  TrendingUp,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Brain,
  Building2,
  FileText,
  RotateCcw,
  Zap,
  Target,
  ShieldCheck,
  Search,
} from 'lucide-react';
import clsx from 'clsx';
import apiClient from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/useProfileStore';

interface InterviewSessionSummary {
  id: string;
  interviewType: 'ORAL' | 'CODING' | 'TECHNICAL' | 'BEHAVIORAL';
  role?: string;
  title?: string;
  problemTitle?: string;
  difficulty?: string;
  status: 'DRAFT' | 'READY' | 'IN_PROGRESS' | 'COMPLETED' | 'ANALYSED' | 'ABANDONED';
  durationMins?: number;
  score?: number;
  evalScore?: number;
  createdAt: string;
}

export default function UnifiedInterviewHub() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { profile } = useProfileStore();

  const [sessions, setSessions] = useState<InterviewSessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'ORAL' | 'CODING'>('ALL');

  const candidateName = profile.name || user?.name || 'Candidate';

  useEffect(() => {
    async function fetchSessions() {
      setIsLoading(true);
      try {
        const res = await apiClient.get('/interview/sessions');
        const data: any[] = res.data || [];
        const mapped: InterviewSessionSummary[] = data.map((s) => ({
          id: s.id,
          interviewType: s.interviewType || (s.problemId ? 'CODING' : 'ORAL'),
          role: s.targetRole || s.role || 'Software Engineer',
          title: s.title || s.problemTitle || (s.interviewType === 'CODING' ? 'Coding Assessment' : 'Oral Mock Interview'),
          problemTitle: s.problemTitle,
          difficulty: s.difficulty || 'Medium',
          status: s.status || 'COMPLETED',
          durationMins: s.durationMins || Math.round((s.durationSeconds || 900) / 60),
          score: s.evalScore || s.score || s.analysis?.overallScore,
          createdAt: s.createdAt || new Date().toISOString(),
        }));
        mapped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setSessions(mapped);
      } catch (err) {
        console.warn('Failed to load interview history, using local cache:', err);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSessions();
  }, []);

  // Compute metrics from actual sessions
  const completedSessions = sessions.filter((s) => s.status === 'COMPLETED' || s.status === 'ANALYSED');
  const oralCompleted = completedSessions.filter((s) => s.interviewType === 'ORAL' || s.interviewType === 'BEHAVIORAL' || s.interviewType === 'TECHNICAL').length;
  const codingCompleted = completedSessions.filter((s) => s.interviewType === 'CODING').length;
  const totalCompleted = completedSessions.length;

  const totalMinutes = completedSessions.reduce((acc, s) => acc + (s.durationMins || 15), 0);
  const hoursPracticed = Math.floor(totalMinutes / 60);
  const minsPracticed = totalMinutes % 60;
  const timeFormatted = totalCompleted > 0 ? `${hoursPracticed}h ${minsPracticed > 0 ? `${minsPracticed}m` : ''}`.trim() : '0h';

  const scoredSessions = completedSessions.filter((s) => typeof s.score === 'number' && s.score > 0);
  const avgScore = scoredSessions.length > 0
    ? Math.round(scoredSessions.reduce((acc, s) => acc + (s.score || 0), 0) / scoredSessions.length)
    : 0;

  // Active resumable session
  const activeSession = sessions.find((s) => s.status === 'IN_PROGRESS' || s.status === 'READY');

  const filteredSessions = sessions.filter((s) => {
    if (filterType === 'ORAL') return s.interviewType !== 'CODING';
    if (filterType === 'CODING') return s.interviewType === 'CODING';
    return true;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFD] p-6 space-y-8 select-none max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white overflow-hidden shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A8BDF]/20 border border-[#4A8BDF]/40 text-[#4A8BDF] text-xs font-mono font-bold">
            <Sparkles size={14} />
            <span>AI Placement Interview Command Center</span>
          </div>

          <h1 className="text-3xl font-black font-sans tracking-tight leading-tight">
            Welcome back, {candidateName}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            Prepare for top product companies with realistic AI-conducted oral interviews and observed coding rounds. Practice verbal communication, system reasoning, and live DSA coding with instant evidence-based feedback.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>3D AI Speech & Avatar</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Observed Monaco IDE</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Real Competency Scorecards</span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#4A8BDF]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Active Session Resume Banner if present */}
      {activeSession && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-[#4A8BDF]/40 rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-[#4A8BDF] text-white rounded-2xl shadow-xs">
              {activeSession.interviewType === 'CODING' ? <Code2 size={20} /> : <Video size={20} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  In Progress Session
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Started {new Date(activeSession.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mt-0.5 font-sans">
                {activeSession.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (activeSession.interviewType === 'CODING') {
                navigate(`/interview/coding/${activeSession.id}`);
              } else {
                navigate(`/interview/${activeSession.id}`);
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#4A8BDF] hover:bg-blue-600 text-white rounded-2xl text-xs font-bold font-sans shadow-sm transition-all"
          >
            <span>Resume Interview</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* 3. Primary Interview Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Oral Interview */}
        <div className="bg-white rounded-3xl border border-[#DCE7F2] p-7 shadow-xs hover:shadow-md hover:border-[#4A8BDF]/50 transition-all duration-200 flex flex-col justify-between group text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-sky-50 text-[#4A8BDF] border border-sky-100 group-hover:scale-105 transition-transform">
                <Video size={24} />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider bg-[#F8EAF4] text-[#A0006D]">
                AI Speech & Avatar
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#4A8BDF] transition-colors font-sans">
                Oral Interview
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed mt-1 font-sans">
                Practice real-world verbal interviews with an interactive 3D AI interviewer that listens, analyzes confidence, assesses domain knowledge, and delivers structured follow-up questions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-medium text-slate-700 font-sans">
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span className="truncate">Technical Verbal</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span className="truncate">Behavioral (STAR)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span className="truncate">HR & Culture Fit</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span className="truncate">Resume Deep-Dive</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate('/oral')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Oral Hub & Catalog
            </button>

            <button
              type="button"
              onClick={() => navigate('/oral/new')}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2459A8] to-[#4A8BDF] hover:from-[#1D4A8C] hover:to-[#3B77C4] text-white rounded-2xl text-xs font-bold font-sans shadow-sm transition-all"
            >
              <span>Start Oral Interview</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Card 2: Coding Interview */}
        <div className="bg-white rounded-3xl border border-[#DCE7F2] p-7 shadow-xs hover:shadow-md hover:border-[#4A8BDF]/50 transition-all duration-200 flex flex-col justify-between group text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 group-hover:scale-105 transition-transform">
                <Code2 size={24} />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Observed Monaco IDE
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors font-sans">
                Coding Interview
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed mt-1 font-sans">
                Solve DSA and coding problems in a production-grade Monaco editor while an AI interviewer observes your code, asks about time/space complexity, and provides Socratic hints.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-medium text-slate-700 font-sans">
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span className="truncate">DSA & Algorithms</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span className="truncate">SQL & Database Queries</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span className="truncate">Debugging & Refactoring</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span className="truncate">Backend & Problem Solving</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate('/coding')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Coding Hub & Tracks
            </button>

            <button
              type="button"
              onClick={() => navigate('/coding/new')}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl text-xs font-bold font-sans shadow-sm transition-all"
            >
              <span>Start Coding Interview</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Preparation Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1: Total Completed */}
        <div className="bg-white p-5 rounded-3xl border border-[#DCE7F2] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono uppercase tracking-wider">
            <span>Interviews Completed</span>
            <Award size={16} className="text-[#4A8BDF]" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {totalCompleted}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {oralCompleted} Oral • {codingCompleted} Coding
          </div>
        </div>

        {/* Stat 2: Avg Score */}
        <div className="bg-white p-5 rounded-3xl border border-[#DCE7F2] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono uppercase tracking-wider">
            <span>Average Readiness</span>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {avgScore > 0 ? `${avgScore}%` : '—'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {avgScore >= 80 ? 'Placement Ready' : avgScore >= 60 ? 'Consistent Progress' : 'Initial Assessment'}
          </div>
        </div>

        {/* Stat 3: Practice Time */}
        <div className="bg-white p-5 rounded-3xl border border-[#DCE7F2] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono uppercase tracking-wider">
            <span>Time Practiced</span>
            <Clock size={16} className="text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {timeFormatted}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Focused Mock Practice
          </div>
        </div>

        {/* Stat 4: Company Catalog */}
        <div
          onClick={() => navigate('/interviews/company-wise')}
          className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 p-5 rounded-3xl border border-blue-200 shadow-2xs space-y-1 cursor-pointer hover:border-[#4A8BDF] transition-all"
        >
          <div className="flex items-center justify-between text-blue-800 text-xs font-mono uppercase tracking-wider">
            <span>Company Tracks</span>
            <Building2 size={16} className="text-[#4A8BDF]" />
          </div>
          <div className="text-2xl font-black text-blue-950 font-mono">
            18+ Tracks
          </div>
          <div className="text-[11px] text-[#4A8BDF] font-mono flex items-center gap-1">
            Explore FAANG Tracks <ArrowRight size={11} />
          </div>
        </div>
      </div>

      {/* 5. Recent Sessions & History Table */}
      <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-[#4A8BDF]" />
            <h2 className="font-bold text-sm text-slate-900 font-sans">
              Recent Interview Activity
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {(['ALL', 'ORAL', 'CODING'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={clsx(
                  'px-3 py-1 rounded-xl text-xs font-bold font-mono transition-all',
                  filterType === t
                    ? 'bg-[#11183D] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="h-6 w-6 border-2 border-[#4A8BDF] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-8 text-center space-y-2 bg-slate-50/60 rounded-2xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-700">No interview sessions found</p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Start your first Oral or Coding interview to record speech analytics, code performance, and receive comprehensive feedback reports.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('/oral/new')}
                className="px-3.5 py-1.5 bg-[#EFFAFD] text-[#4A8BDF] rounded-xl text-xs font-bold hover:bg-[#4A8BDF] hover:text-white transition-all"
              >
                Start Oral
              </button>
              <button
                type="button"
                onClick={() => navigate('/coding/new')}
                className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all"
              >
                Start Coding
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSessions.slice(0, 6).map((sess) => {
              const isCoding = sess.interviewType === 'CODING';

              return (
                <div
                  key={sess.id}
                  className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        'p-2.5 rounded-xl border',
                        isCoding ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-sky-50 text-sky-600 border-sky-100'
                      )}
                    >
                      {isCoding ? <Code2 size={16} /> : <Video size={16} />}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 font-sans line-clamp-1">
                        {sess.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {sess.role} • {sess.durationMins || 15} mins • {new Date(sess.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {sess.score !== undefined && sess.score > 0 ? (
                      <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                        {sess.score}% Score
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                        {sess.status}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (sess.status === 'COMPLETED' || sess.status === 'ANALYSED') {
                          navigate(`/interview/${sess.id}/analysis`);
                        } else if (isCoding) {
                          navigate(`/interview/coding/${sess.id}`);
                        } else {
                          navigate(`/interview/${sess.id}`);
                        }
                      }}
                      className="text-xs font-bold text-[#4A8BDF] hover:underline flex items-center gap-1"
                    >
                      {sess.status === 'COMPLETED' || sess.status === 'ANALYSED' ? 'View Report' : 'Resume'} <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
