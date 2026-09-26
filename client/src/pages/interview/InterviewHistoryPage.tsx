import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  ArrowLeft,
  Search,
  Filter,
  Video,
  Code2,
  Calendar,
  Clock,
  Award,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';
import apiClient from '../../api/client';

interface SessionItem {
  id: string;
  interviewType: 'ORAL' | 'CODING' | 'TECHNICAL' | 'BEHAVIORAL';
  role: string;
  title: string;
  difficulty?: string;
  status: 'DRAFT' | 'READY' | 'IN_PROGRESS' | 'COMPLETED' | 'ANALYSED' | 'ABANDONED';
  durationMins: number;
  score?: number;
  createdAt: string;
}

export default function InterviewHistoryPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'ORAL' | 'CODING'>('ALL');
  const [sortBy, setSortBy] = useState<'DATE' | 'SCORE'>('DATE');

  useEffect(() => {
    async function loadHistory() {
      setIsLoading(true);
      try {
        const res = await apiClient.get('/interview/sessions');
        const data: any[] = res.data || [];
        const mapped: SessionItem[] = data.map((s) => ({
          id: s.id,
          interviewType: s.interviewType || (s.problemId ? 'CODING' : 'ORAL'),
          role: s.targetRole || s.role || 'Software Engineer',
          title: s.title || s.problemTitle || (s.interviewType === 'CODING' ? 'Coding Assessment' : 'Oral Mock Interview'),
          difficulty: s.difficulty || 'Medium',
          status: s.status || 'COMPLETED',
          durationMins: s.durationMins || Math.round((s.durationSeconds || 900) / 60),
          score: s.evalScore || s.score || s.analysis?.overallScore,
          createdAt: s.createdAt || new Date().toISOString(),
        }));
        setSessions(mapped);
      } catch (err) {
        console.warn('Failed to load history:', err);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, []);

  const filtered = sessions
    .filter((s) => {
      const matchSearch =
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType =
        typeFilter === 'ALL' ||
        (typeFilter === 'CODING' ? s.interviewType === 'CODING' : s.interviewType !== 'CODING');
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      if (sortBy === 'SCORE') {
        return (b.score || 0) - (a.score || 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFD] p-6 space-y-6 select-none max-w-6xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/interview')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white border border-[#DCE7F2] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-sans">
              Unified Interview History & Reports
            </h1>
            <p className="text-xs text-slate-500 font-sans">
              Access your past oral speech transcripts, coding submissions, and comprehensive competency scorecards.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/interview')}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#4A8BDF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold font-sans shadow-xs transition-colors self-start sm:self-auto"
        >
          <Sparkles size={14} />
          <span>New Interview</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#DCE7F2] shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by role, topic, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-[#DCE7F2] rounded-xl focus:outline-none focus:bg-white focus:border-[#4A8BDF] transition-all"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {(['ALL', 'ORAL', 'CODING'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex-1 md:flex-none text-center',
                typeFilter === t
                  ? 'bg-[#11183D] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {t === 'ALL' ? 'All Modes' : t === 'ORAL' ? 'Oral Speech' : 'Observed Coding'}
            </button>
          ))}

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs font-medium text-slate-700 focus:outline-none font-sans"
          >
            <option value="DATE">Newest First</option>
            <option value="SCORE">Highest Score</option>
          </select>
        </div>
      </div>

      {/* Session Cards */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#DCE7F2]">
          <div className="h-8 w-8 border-3 border-[#4A8BDF] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#DCE7F2] space-y-3">
          <History size={32} className="text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No Interview Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search filters or start a new mock interview session to view performance metrics here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((sess) => {
            const isCoding = sess.interviewType === 'CODING';
            const isFinished = sess.status === 'COMPLETED' || sess.status === 'ANALYSED';

            return (
              <div
                key={sess.id}
                onClick={() => {
                  if (isFinished) {
                    navigate(`/interview/${sess.id}/analysis`);
                  } else if (isCoding) {
                    navigate(`/interview/coding/${sess.id}`);
                  } else {
                    navigate(`/interview/${sess.id}`);
                  }
                }}
                className="p-5 bg-white rounded-3xl border border-[#DCE7F2] shadow-2xs hover:shadow-md hover:border-[#4A8BDF]/50 cursor-pointer transition-all space-y-3 text-left"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={clsx(
                      'px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider',
                      isCoding
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-sky-50 text-sky-700 border border-sky-200'
                    )}
                  >
                    {isCoding ? 'Observed Coding IDE' : 'AI Speech & Avatar'}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Calendar size={13} />
                    <span>{new Date(sess.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-sans line-clamp-1">
                    {sess.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">
                    {sess.role} • {sess.durationMins || 15} mins duration
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  {sess.score !== undefined && sess.score > 0 ? (
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                      Score: {sess.score}%
                    </span>
                  ) : (
                    <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                      {sess.status}
                    </span>
                  )}

                  <span className="text-xs font-bold text-[#4A8BDF] flex items-center gap-1">
                    {isFinished ? 'View Report' : 'Resume'} <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
