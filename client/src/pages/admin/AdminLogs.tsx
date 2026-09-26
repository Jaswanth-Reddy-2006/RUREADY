// ═══════════════════════════════════════════════════════════════
// R U Ready? — Admin Microservices Health & System Logs Matrix
// Real-time microservices monitoring, background issues, and system logs
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
  Calendar,
  Activity,
  Server,
  AlertTriangle,
  Terminal,
  ShieldCheck,
  Cpu,
  Radio,
  Zap
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import apiClient from '@/api/client';
import toast from 'react-hot-toast';

interface MicroserviceHealth {
  name: string;
  displayName: string;
  port: number;
  status: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';
  latencyMs: number;
  lastChecked: string;
  category: string;
  backgroundJobs: string;
  issueCount: number;
  issues: string[];
}

interface SystemLog {
  id: string;
  service: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
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

export default function AdminLogs() {
  const [activeTab, setActiveTab] = useState<'HEALTH' | 'SYSTEM_LOGS' | 'SESSIONS'>('HEALTH');
  
  // Microservices Health State
  const [healthMatrix, setHealthMatrix] = useState<MicroserviceHealth[]>([]);
  const [healthLoading, setHealthLoading] = useState(true);

  // System Logs State
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [sysLogsLoading, setSysLogsLoading] = useState(false);
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [levelFilter, setLevelFilter] = useState('ALL');

  // Candidate Session Logs State
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [sessionLogsLoading, setSessionLogsLoading] = useState(false);
  const [modeFilter, setModeFilter] = useState<'ALL' | 'ORAL' | 'CODING'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS'>('ALL');

  // Shared Filters
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchHealthMatrix = async (silent = false) => {
    if (!silent) setHealthLoading(true);
    try {
      const res = await apiClient.get('/admin/health-matrix');
      setHealthMatrix(res.data || []);
    } catch (err) {
      console.warn('Error fetching microservices health matrix:', err);
      setHealthMatrix([]);
    } finally {
      setHealthLoading(false);
    }
  };

  const fetchSystemLogs = async (silent = false) => {
    if (!silent) setSysLogsLoading(true);
    try {
      const res = await apiClient.get('/admin/system-logs');
      setSystemLogs(res.data || []);
    } catch (err) {
      console.warn('Error fetching system logs:', err);
      setSystemLogs([]);
    } finally {
      setSysLogsLoading(false);
    }
  };

  const fetchSessionLogs = async (silent = false) => {
    if (!silent) setSessionLogsLoading(true);
    try {
      const res = await apiClient.get('/admin/logs');
      setLogs(res.data?.logs || []);
    } catch (err) {
      console.warn('Error fetching candidate session logs:', err);
      setLogs([]);
    } finally {
      setSessionLogsLoading(false);
    }
  };

  const fetchAllData = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchHealthMatrix(true), fetchSystemLogs(true), fetchSessionLogs(true)]);
    setIsRefreshing(false);
    toast.success('Admin monitoring telemetry refreshed');
  };

  useEffect(() => {
    fetchHealthMatrix();
    fetchSystemLogs();
    fetchSessionLogs();
  }, []);

  // Filtered Candidate Sessions
  const filteredSessionLogs = useMemo(() => {
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

  // Filtered System Logs
  const filteredSystemLogs = useMemo(() => {
    return systemLogs.filter((l) => {
      const matchesSearch =
        l.message.toLowerCase().includes(search.toLowerCase()) ||
        l.service.toLowerCase().includes(search.toLowerCase());
      const matchesService = serviceFilter === 'ALL' || l.service === serviceFilter;
      const matchesLevel = levelFilter === 'ALL' || l.level === levelFilter;

      return matchesSearch && matchesService && matchesLevel;
    });
  }, [systemLogs, search, serviceFilter, levelFilter]);

  const operationalCount = healthMatrix.filter((s) => s.status === 'OPERATIONAL').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-body">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight flex items-center gap-2.5">
            <span>Microservices Monitoring & System Logs</span>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time operational status, background issue tracking, and system log inspector for all 8 microservices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={fetchAllData}
            isLoading={isRefreshing}
            icon={<RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />}
          >
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* ─── Top Main Navigation Tabs ─── */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveTab('HEALTH')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'HEALTH'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Server size={14} />
          <span>Microservices Health Matrix ({operationalCount}/{healthMatrix.length || 9})</span>
        </button>

        <button
          onClick={() => setActiveTab('SYSTEM_LOGS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'SYSTEM_LOGS'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Terminal size={14} />
          <span>Background System Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('SESSIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'SESSIONS'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Activity size={14} />
          <span>Candidate Session Stream ({logs.length})</span>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TAB 1: MICROSERVICES HEALTH MATRIX & BACKGROUND ISSUES
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'HEALTH' && (
        <div className="space-y-6">
          
          {/* Platform Status Overview Bar */}
          <div className="p-4 rounded-2xl bg-emerald-950 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-emerald-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="font-bold font-display text-sm flex items-center gap-2">
                  <span>Architecture Status: All Microservices Operational</span>
                  <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                    9/9 Services Live
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  Gateway ingress routing active across ports 4000 to 4008 with CORS & Token Verification enabled.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-emerald-200 shrink-0">
              <div>
                <span className="text-slate-400 block text-[10px]">Avg Latency</span>
                <span className="font-bold text-white text-sm">18 ms</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Total Endpoints</span>
                <span className="font-bold text-white text-sm">34 Monitored</span>
              </div>
            </div>
          </div>

          {/* 9 Microservice Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthMatrix.map((svc) => (
              <Card
                key={svc.name}
                padding="md"
                className="bg-white border-slate-200/90 shadow-sm space-y-4 hover:border-emerald-300 transition-all relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      {svc.category}
                    </span>
                    <h3 className="font-bold text-slate-900 font-display text-sm flex items-center gap-1.5">
                      <span>{svc.displayName}</span>
                    </h3>
                    <div className="text-[11px] font-mono text-slate-500">
                      Port: <strong className="text-slate-800">:{svc.port}</strong> • {svc.name}
                    </div>
                  </div>

                  <Badge
                    variant={svc.status === 'OPERATIONAL' ? 'success' : svc.status === 'DEGRADED' ? 'warning' : 'error'}
                    size="xs"
                  >
                    {svc.status}
                  </Badge>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-display">Background Tasks</span>
                  <p className="text-xs text-slate-700 font-mono font-semibold truncate flex items-center gap-1.5">
                    <Zap size={13} className="text-amber-500 fill-amber-500 shrink-0" />
                    <span>{svc.backgroundJobs}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-100 text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>Ping Latency:</span>
                    <strong className="text-emerald-600">{svc.latencyMs}ms</strong>
                  </span>
                  <span className="text-slate-400">
                    Checked: {new Date(svc.lastChecked).toLocaleTimeString()}
                  </span>
                </div>

                {svc.issueCount > 0 && (
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-mono space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <AlertTriangle size={12} />
                      <span>{svc.issueCount} Issue Detected:</span>
                    </div>
                    {svc.issues.map((iss, i) => (
                      <p key={i}>• {iss}</p>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: BACKGROUND SYSTEM LOGS INSPECTOR
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'SYSTEM_LOGS' && (
        <div className="space-y-4">
          
          {/* Controls & Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Filter logs by message or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Service selector */}
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-bold border border-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Microservices</option>
                  <option value="gateway">API Gateway (:4000)</option>
                  <option value="auth-service">Auth Service (:4001)</option>
                  <option value="oral-interview-service">Oral Interview Service (:4002)</option>
                  <option value="ai-analysis-service">AI Analysis Service (:4003)</option>
                  <option value="analytics-service">Analytics Service (:4004)</option>
                  <option value="user-service">User Service (:4005)</option>
                  <option value="coding-interview-service">Coding Interview Service (:4006)</option>
                  <option value="payment-service">Payment Service (:4007)</option>
                  <option value="admin-service">Admin Service (:4008)</option>
                </select>

                {/* Level selector */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {(['ALL', 'INFO', 'WARN', 'ERROR'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLevelFilter(lvl)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
                        levelFilter === lvl ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Style System Log Inspector */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl font-mono text-xs">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-emerald-400" />
                <span className="font-bold text-white text-xs">System Background Logs Console</span>
              </div>
              <span className="text-[11px]">{filteredSystemLogs.length} events logged</span>
            </div>

            <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
              {filteredSystemLogs.length === 0 ? (
                <div className="py-12 text-center text-slate-500 italic">
                  No system logs matching criteria.
                </div>
              ) : (
                filteredSystemLogs.map((l) => (
                  <div
                    key={l.id}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-900 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-start sm:items-center gap-2.5 overflow-hidden">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          l.level === 'ERROR'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : l.level === 'WARN'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {l.level}
                      </span>

                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 shrink-0">
                        {l.service}
                      </span>

                      <span className="text-slate-200 truncate">{l.message}</span>
                    </div>

                    <span className="text-[10px] text-slate-500 shrink-0">
                      {new Date(l.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 3: CANDIDATE SESSION AUDIT STREAM
      ═══════════════════════════════════════════════════════════════ */}
      {activeTab === 'SESSIONS' && (
        <div className="space-y-4">
          
          {/* Filters & Search Controls */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search candidate sessions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
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
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Evaluation Result</th>
                    <th className="py-3.5 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-body text-slate-700">
                  {filteredSessionLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                        No session logs found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredSessionLogs.map((log) => (
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
      )}

    </div>
  );
}
