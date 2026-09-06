// ═══════════════════════════════════════════════════════════════
// R U Ready? — Admin Session Audit Logs
// Chronological stream of candidate mock interview evaluations & tests
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Search,
  RefreshCw,
  Video,
  Code2,
  Filter,
  ArrowUpRight,
  Clock,
  Award,
  CheckCircle2,
  Sparkles,
  Calendar
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import apiClient from '@/api/client';
import toast from 'react-hot-toast';

interface SessionLog {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  targetRole: string;
  targetCompany: string;
  industry: string;
  experienceLevel: string;
  mode: 'ORAL' | 'CODING';
  status: string;
  durationMins: number;
  createdAt: string;
  completedAt: string | null;
  questionsCount: number;
  hintCount: number;
  testCasesPassed: number | null;
  overallScore: number | null;
  verdict: string | null;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState<'ALL' | 'ORAL' | 'CODING'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS'>('ALL');

  const fetchLogs = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await apiClient.get('/admin/logs');
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error('Failed to load session logs:', err);
      toast.error('Failed to fetch session audit logs');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.user.name.toLowerCase().includes(search.toLowerCase()) ||
        log.user.email.toLowerCase().includes(search.toLowerCase()) ||
        log.targetRole.toLowerCase().includes(search.toLowerCase()) ||
        log.targetCompany.toLowerCase().includes(search.toLowerCase());

      const matchesMode = modeFilter === 'ALL' || log.mode === modeFilter;
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'COMPLETED' && (log.status === 'COMPLETED' || log.status === 'ANALYSED')) ||
        (statusFilter === 'IN_PROGRESS' && (log.status === 'IN_PROGRESS' || log.status === 'SETUP'));

      return matchesSearch && matchesMode && matchesStatus;
    });
  }, [logs, search, modeFilter, statusFilter]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="h-10 w-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-slate-500">Retrieving session audit stream...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-body">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight">
            Session Audit Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full chronological stream of candidate mock interview sessions, questions answered, and scores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => fetchLogs(true)}
            isLoading={isRefreshing}
            icon={<RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />}
          >
            Refresh Logs
          </Button>
        </div>
      </div>

      {/* ─── Filters & Search Controls ─── */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search by candidate, company, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Mode selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['ALL', 'ORAL', 'CODING'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setModeFilter(m)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
                    modeFilter === m ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {m === 'ALL' ? 'All Tracks' : m === 'ORAL' ? 'Oral Avatar' : 'Coding Studio'}
                </button>
              ))}
            </div>

            {/* Status selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['ALL', 'COMPLETED', 'IN_PROGRESS'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
                    statusFilter === s ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {s === 'ALL' ? 'All Status' : s === 'COMPLETED' ? 'Completed' : 'In Progress'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Logs Table ─── */}
      <Card padding="none" className="overflow-hidden border-slate-200 shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-display font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Target Role & Company</th>
                <th className="py-3.5 px-4">Format</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Evaluation Result</th>
                <th className="py-3.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-body text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                    No session logs found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{log.user.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.user.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{log.targetRole}</span>
                      <span className="text-slate-400 block text-[11px]">
                        {log.targetCompany} • {log.experienceLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {log.mode === 'CODING' ? (
                        <span className="inline-flex items-center gap-1 text-purple-700 font-bold text-[11px]">
                          <Code2 size={12} /> Coding
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-blue-700 font-bold text-[11px]">
                          <Video size={12} /> Oral
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {log.durationMins} mins
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          log.status === 'COMPLETED' || log.status === 'ANALYSED'
                            ? 'success'
                            : log.status === 'IN_PROGRESS'
                              ? 'warning'
                              : 'neutral'
                        }
                        size="xs"
                      >
                        {log.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      {log.overallScore !== null ? (
                        <div className="flex items-center gap-1.5 font-bold text-emerald-600 font-mono">
                          <Award size={13} />
                          <span>{log.overallScore}/100</span>
                        </div>
                      ) : log.testCasesPassed !== null ? (
                        <div className="flex items-center gap-1.5 font-bold text-purple-600 font-mono">
                          <CheckCircle2 size={13} />
                          <span>{log.testCasesPassed} tests passed</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">In progress</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/session/${log.id}`}
                        className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs hover:underline"
                      >
                        <span>Inspect</span>
                        <ArrowUpRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
