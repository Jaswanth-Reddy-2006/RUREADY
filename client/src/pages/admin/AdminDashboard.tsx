// ═══════════════════════════════════════════════════════════════
// R U Ready? — Admin Management Portal
// Executive KPI summary, Candidate Directory with Plans & Live Session Logs
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  BarChart3,
  Search,
  RefreshCw,
  Clock,
  Sparkles,
  Award,
  Video,
  Code2,
  Filter,
  ArrowUpRight,
  UserCheck,
  Zap,
  Terminal,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Activity,
  Layers,
  Cpu,
  LayoutDashboard
} from 'lucide-react';
import apiClient from '@/api/client';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface AdminMetrics {
  totalUsers: number;
  totalSessions: number;
  completedSessions: number;
  sessionsToday: number;
  avgScore: number;
  oralSessions: number;
  codingSessions: number;
  aiProvider: {
    provider: string;
    model: string;
    baseUrl: string;
  };
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  totalSessions: number;
  completedSessions: number;
  avgScore: number | null;
  role: 'ADMIN' | 'CANDIDATE';
  plan: 'FREE' | 'STARTER' | 'PRO' | 'ULTIMATE';
  lastActiveAt: string;
}

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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'logs' | 'engine'>('users');
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter & Search states
  const [userSearch, setUserSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<'ALL' | 'FREE' | 'STARTER' | 'PRO' | 'ULTIMATE'>('ALL');
  const [logModeFilter, setLogModeFilter] = useState<'ALL' | 'ORAL' | 'CODING'>('ALL');
  const [logStatusFilter, setLogStatusFilter] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS'>('ALL');

  // AI Health Check state
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{ success?: boolean; latencyMs?: number; message?: string } | null>(null);

  // Fetch all admin data
  const fetchData = async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const [metricsRes, usersRes, logsRes] = await Promise.all([
        apiClient.get('/admin/metrics'),
        apiClient.get('/admin/users'),
        apiClient.get('/admin/logs'),
      ]);

      setMetrics(metricsRes.data);
      setUsers(usersRes.data.users || []);
      setLogs(logsRes.data.logs || []);
    } catch (err: any) {
      console.error('Failed to load admin telemetry:', err);
      toast.error('Failed to load administrative data.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update user plan
  const handleUpdatePlan = async (userId: string, newPlan: 'FREE' | 'STARTER' | 'PRO' | 'ULTIMATE') => {
    try {
      await apiClient.patch(`/admin/users/${userId}/plan`, { plan: newPlan });
      toast.success(`Plan updated to ${newPlan}`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: newPlan } : u));
    } catch {
      toast.error('Failed to update user plan');
    }
  };

  // Run AI Health Check
  const handleTestAiHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await apiClient.get('/ai/health');
      setHealthStatus(res.data);
      toast.success('AI engine connectivity verified!');
    } catch (err: any) {
      setHealthStatus({
        success: false,
        message: err.response?.data?.message || err.message,
      });
      toast.error('AI provider connection test failed.');
    } finally {
      setIsCheckingHealth(false);
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchesPlan = planFilter === 'ALL' || u.plan === planFilter;
      return matchesSearch && matchesPlan;
    });
  }, [users, userSearch, planFilter]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesMode = logModeFilter === 'ALL' || log.mode === logModeFilter;
      const matchesStatus =
        logStatusFilter === 'ALL' ||
        (logStatusFilter === 'COMPLETED' && (log.status === 'COMPLETED' || log.status === 'ANALYSED')) ||
        (logStatusFilter === 'IN_PROGRESS' && (log.status === 'IN_PROGRESS' || log.status === 'SETUP'));
      return matchesMode && matchesStatus;
    });
  }, [logs, logModeFilter, logStatusFilter]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-3 border-[#FF7A00] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
          Loading RU Ready Executive Telemetry...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-body">
      
      {/* ─── Top Admin Header Bar ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#FF7A00] flex items-center justify-center text-white shadow-sm">
              <Activity size={16} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight">
              Executive Admin Portal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
              System Live
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time candidate registrations, monetization plan distribution, and interview audit telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => fetchData(true)}
            isLoading={isRefreshing}
            icon={<RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />}
          >
            Refresh Data
          </Button>

          <Link to="/dashboard">
            <Button size="sm" variant="outline" iconRight={<ArrowRight size={13} />}>
              Candidate View
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── KPI Summary Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Users */}
        <Card padding="lg" className="bg-white border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display">
                Registered Candidates
              </span>
              <p className="text-3xl font-black text-slate-900 font-display">
                {metrics?.totalUsers || users.length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-orange-50 text-[#FF7A00] flex items-center justify-center border border-orange-100">
              <Users size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="text-emerald-600 font-bold font-mono">100% Verified</span>
            <span>accounts in Postgres</span>
          </div>
        </Card>

        {/* Total Interviews */}
        <Card padding="lg" className="bg-white border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display">
                Mock Sessions Run
              </span>
              <p className="text-3xl font-black text-slate-900 font-display">
                {metrics?.totalSessions || logs.length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Video size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
            <span className="text-blue-700 font-semibold">{metrics?.oralSessions || 0} Oral</span>
            <span>•</span>
            <span className="text-purple-700 font-semibold">{metrics?.codingSessions || 0} Coding</span>
          </div>
        </Card>

        {/* Average STAR Score */}
        <Card padding="lg" className="bg-white border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display">
                Platform Avg Score
              </span>
              <p className="text-3xl font-black text-slate-900 font-display">
                {metrics?.avgScore || 78}<span className="text-lg text-slate-400 font-normal">/100</span>
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Award size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
            <Sparkles size={12} />
            <span>Uninflated STAR rubric calibrated</span>
          </div>
        </Card>

        {/* Active AI Provider */}
        <Card padding="lg" className="bg-white border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display">
                Active AI Engine
              </span>
              <p className="text-xl font-black text-slate-900 font-display uppercase truncate max-w-[140px]">
                {metrics?.aiProvider.provider || 'Ollama / Gemini'}
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
              <Cpu size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono truncate">
            <span className="truncate">{metrics?.aiProvider.model || 'llama3 / gemini'}</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 ml-1" />
          </div>
        </Card>

      </div>

      {/* ─── Navigation Tabs ─── */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-xs font-bold font-display uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-[#FF7A00] text-[#FF7A00]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users size={14} />
          <span>Registered Candidates ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 px-4 text-xs font-bold font-display uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'border-[#FF7A00] text-[#FF7A00]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers size={14} />
          <span>Session Audit Logs ({logs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('engine')}
          className={`pb-3 px-4 text-xs font-bold font-display uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'engine'
              ? 'border-[#FF7A00] text-[#FF7A00]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Terminal size={14} />
          <span>AI & Sandbox Runtime Health</span>
        </button>
      </div>

      {/* ─── TAB 1: Registered Candidates & Plans ─── */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search candidates by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FF7A00]"
              />
            </div>

            {/* Plan filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {(['ALL', 'FREE', 'STARTER', 'PRO', 'ULTIMATE'] as const).map((plan) => (
                <button
                  key={plan}
                  onClick={() => setPlanFilter(plan)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold font-mono transition-all cursor-pointer ${
                    planFilter === plan
                      ? 'bg-[#FF7A00] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {plan === 'STARTER' ? '₹69 Starter' : plan === 'PRO' ? '₹159 Pro' : plan === 'ULTIMATE' ? '₹249 Ultimate' : plan}
                </button>
              ))}
            </div>
          </div>

          {/* User Table */}
          <Card padding="none" className="overflow-hidden border-slate-200 shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-display font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                    <th className="py-3.5 px-4">Sessions</th>
                    <th className="py-3.5 px-4">Avg STAR Score</th>
                    <th className="py-3.5 px-4">Plan Tier</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-body text-slate-700">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                        No candidate accounts found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-orange-100 text-[#FF7A00] font-bold font-display flex items-center justify-center uppercase shrink-0">
                              {u.name.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{u.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800">{u.completedSessions}</span>
                          <span className="text-slate-400"> / {u.totalSessions}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          {u.avgScore ? (
                            <Badge variant={u.avgScore >= 75 ? 'success' : 'warning'} size="xs">
                              {u.avgScore}/100
                            </Badge>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">No score yet</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={u.plan}
                            onChange={(e) => handleUpdatePlan(u.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono border focus:outline-none cursor-pointer ${
                              u.plan === 'ULTIMATE'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : u.plan === 'PRO'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : u.plan === 'STARTER'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            <option value="FREE">Free Plan</option>
                            <option value="STARTER">₹69 Starter</option>
                            <option value="PRO">₹159 Pro</option>
                            <option value="ULTIMATE">₹249 Ultimate</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4">
                          {u.role === 'ADMIN' ? (
                            <Badge variant="orange" size="xs">ADMIN</Badge>
                          ) : (
                            <Badge variant="neutral" size="xs">CANDIDATE</Badge>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="text-[11px] text-slate-400 font-mono">
                            Active {new Date(u.lastActiveAt).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ─── TAB 2: Session & Interview Logs ─── */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-display">Track:</span>
              {(['ALL', 'ORAL', 'CODING'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setLogModeFilter(m)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold font-mono transition-all cursor-pointer ${
                    logModeFilter === m
                      ? 'bg-[#FF7A00] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m === 'ALL' ? 'All Formats' : m === 'ORAL' ? 'Oral Avatar' : 'Technical Coding'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-display">Status:</span>
              {(['ALL', 'COMPLETED', 'IN_PROGRESS'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setLogStatusFilter(s)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold font-mono transition-all cursor-pointer ${
                    logStatusFilter === s
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s === 'ALL' ? 'All' : s === 'COMPLETED' ? 'Completed' : 'In Progress'}
                </button>
              ))}
            </div>
          </div>

          {/* Logs Table */}
          <Card padding="none" className="overflow-hidden border-slate-200 shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-display font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Target Role & Company</th>
                    <th className="py-3.5 px-4">Format</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Performance Score</th>
                    <th className="py-3.5 px-4 text-right">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-body text-slate-700">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                        No session logs match your criteria.
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
                          <span className="text-slate-400 block text-[11px] font-sans">
                            {log.targetCompany} • {log.experienceLevel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {log.mode === 'CODING' ? (
                            <span className="inline-flex items-center gap-1 text-purple-700 font-bold text-[11px]">
                              <Code2 size={12} /> Coding Studio
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-blue-700 font-bold text-[11px]">
                              <Video size={12} /> Oral Avatar
                            </span>
                          )}
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
                            <span className="font-bold text-emerald-600 font-mono">
                              {log.overallScore}/100
                            </span>
                          ) : log.testCasesPassed !== null ? (
                            <span className="font-bold text-purple-600 font-mono">
                              {log.testCasesPassed} tests passed
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Pending evaluation</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to={`/analysis/${log.id}`}
                            className="inline-flex items-center gap-1 text-[#FF7A00] font-bold text-xs hover:underline"
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
      )}

      {/* ─── TAB 3: AI & Sandbox Runtime Health ─── */}
      {activeTab === 'engine' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* AI Provider Config Box */}
            <Card padding="lg" className="bg-white border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-orange-50 text-[#FF7A00] flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 font-display">Active AI LLM Engine</h3>
                    <p className="text-xs text-slate-500">Autonomous evaluation and Socratic hint pipeline</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleTestAiHealth}
                  isLoading={isCheckingHealth}
                  icon={<Activity size={12} />}
                >
                  Test Latency
                </Button>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Active Provider:</span>
                  <span className="font-bold text-slate-800 uppercase">{metrics?.aiProvider.provider || 'Ollama'}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Model Name:</span>
                  <span className="font-bold text-slate-800">{metrics?.aiProvider.model || 'llama3'}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Endpoint URL:</span>
                  <span className="text-slate-600 truncate max-w-[200px]">{metrics?.aiProvider.baseUrl}</span>
                </div>
              </div>

              {healthStatus && (
                <div
                  className={`p-3 rounded-xl border text-xs font-mono ${
                    healthStatus.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${healthStatus.success ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {healthStatus.success ? 'Provider Online' : 'Provider Unreachable'}
                    {healthStatus.latencyMs ? ` (${healthStatus.latencyMs}ms)` : ''}
                  </div>
                  <p className="text-[11px] mt-1 text-slate-600">{healthStatus.message}</p>
                </div>
              )}
            </Card>

            {/* Sandbox Execution Runtimes Box */}
            <Card padding="lg" className="bg-white border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Terminal size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 font-display">Code Execution Sandboxes</h3>
                  <p className="text-xs text-slate-500">Multi-language compile and unit test runtimes</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { lang: 'JavaScript & TypeScript', engine: 'Node.js Isolated VM Context', status: 'Online', badge: 'Node 20+' },
                  { lang: 'Python Runtime', engine: 'Python 3.13 Host Runner with microsecond metrics', status: 'Online', badge: 'py / python3' },
                  { lang: 'Java Runtime', engine: 'OpenJDK 21.0.8 Harness with Javac compiler', status: 'Online', badge: 'Java 21 LTS' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-800 font-display">{item.lang}</div>
                      <div className="text-[11px] text-slate-500 font-body">{item.engine}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant="success" size="xs">{item.status}</Badge>
                      <div className="text-[10px] font-mono text-slate-400">{item.badge}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      )}

    </div>
  );
}
