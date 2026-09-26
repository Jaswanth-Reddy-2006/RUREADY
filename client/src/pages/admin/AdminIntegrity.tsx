// ═══════════════════════════════════════════════════════════════
// R U Ready? — Admin Live Anti-Cheat & Interview Integrity Hub
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Eye,
  Video,
  Code2,
  Search,
  RefreshCw,
  ArrowUpRight,
  Sparkles,
  Award,
  Users,
  Terminal,
  Activity,
  CheckCircle2,
  XCircle,
  Copy,
  Mic,
  Monitor
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import apiClient from '@/api/client';
import toast from 'react-hot-toast';

interface IntegrityScorecard {
  id: string;
  userId: string;
  candidateName: string;
  candidateEmail: string;
  role: string;
  mode: 'ORAL' | 'CODING';
  status: string;
  createdAt: string;
  tabSwitches: number;
  faceLostCount: number;
  audioAnomalies: number;
  pasteEvents: number;
  integrityScore: number;
  verdict: 'CLEAN' | 'SUSPICIOUS' | 'FLAGGED_CHEATING';
}

interface IntegritySummary {
  totalAuditedSessions: number;
  cleanSessionsCount: number;
  suspiciousSessionsCount: number;
  flaggedCheatingCount: number;
  avgIntegrityScore: number;
  tabBlurAlertsToday: number;
  faceLossAlertsToday: number;
  codePasteAnomaliesToday: number;
}

export default function AdminIntegrity() {
  const [summary, setSummary] = useState<IntegritySummary | null>(null);
  const [scorecards, setScorecards] = useState<IntegrityScorecard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [verdictFilter, setVerdictFilter] = useState<'ALL' | 'CLEAN' | 'SUSPICIOUS' | 'FLAGGED_CHEATING'>('ALL');
  const [modeFilter, setModeFilter] = useState<'ALL' | 'ORAL' | 'CODING'>('ALL');

  const fetchIntegrityData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await apiClient.get('/admin/integrity');
      if (res.data) {
        setSummary(res.data.summary);
        setScorecards(res.data.scorecards || []);
      }
    } catch (err) {
      console.warn('Failed to fetch integrity telemetry:', err);
      setSummary({
        totalAuditedSessions: 0,
        cleanSessionsCount: 0,
        suspiciousSessionsCount: 0,
        flaggedCheatingCount: 0,
        avgIntegrityScore: 100,
        tabBlurAlertsToday: 0,
        faceLossAlertsToday: 0,
        codePasteAnomaliesToday: 0,
      });
      setScorecards([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchIntegrityData();
  }, []);

  const filteredScorecards = useMemo(() => {
    return scorecards.filter((s) => {
      const matchSearch =
        s.candidateName.toLowerCase().includes(search.toLowerCase()) ||
        s.candidateEmail.toLowerCase().includes(search.toLowerCase()) ||
        s.role.toLowerCase().includes(search.toLowerCase());

      const matchVerdict = verdictFilter === 'ALL' || s.verdict === verdictFilter;
      const matchMode = modeFilter === 'ALL' || s.mode === modeFilter;

      return matchSearch && matchVerdict && matchMode;
    });
  }, [scorecards, search, verdictFilter, modeFilter]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="h-10 w-10 border-3 border-[#2459A8] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-[#526078]">Compiling anti-cheat proctoring metrics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-12">
      {/* ─── Header ─── */}
      <div className="bg-white p-6 rounded-3xl border border-[#DCE7F2] shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2]">
              <ShieldCheck size={22} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#11183D] tracking-tight">
              Live Anti-Cheat & Interview Integrity Hub
            </h1>
          </div>
          <p className="text-xs text-[#526078]">
            Automated session proctoring, tab focus telemetry, face tracking audit, and Monaco clipboard anomaly detection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchIntegrityData(true)}
            disabled={isRefreshing}
            className="p-2.5 rounded-2xl bg-[#EFFAFD] text-[#2459A8] hover:bg-[#DCE7F2] border border-[#DCE7F2] transition-colors cursor-pointer"
            title="Refresh Integrity Matrix"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ─── 4 Executive KPI Tiles ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" className="bg-white border-[#DCE7F2] shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#526078]">Total Audited Sessions</span>
            <Activity size={16} className="text-[#2459A8]" />
          </div>
          <p className="text-3xl font-black text-[#11183D]">{summary?.totalAuditedSessions || 0}</p>
          <p className="text-[11px] text-[#526078] font-mono">100% telemetry verified</p>
        </Card>

        <Card padding="md" className="bg-white border-[#DCE7F2] shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#526078]">Clean Verified Sessions</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-600">{summary?.cleanSessionsCount || 0}</p>
          <p className="text-[11px] text-emerald-700 font-mono">Zero proctoring flags</p>
        </Card>

        <Card padding="md" className="bg-white border-[#DCE7F2] shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#526078]">Suspicious Sessions</span>
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
          <p className="text-3xl font-black text-amber-500">{summary?.suspiciousSessionsCount || 0}</p>
          <p className="text-[11px] text-amber-700 font-mono">Minor focus / audio warnings</p>
        </Card>

        <Card padding="md" className="bg-white border-[#DCE7F2] shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#526078]">Flagged Malpractice</span>
            <ShieldAlert size={16} className="text-red-500" />
          </div>
          <p className="text-3xl font-black text-red-600">{summary?.flaggedCheatingCount || 0}</p>
          <p className="text-[11px] text-red-700 font-mono">High-risk anomaly detected</p>
        </Card>
      </div>

      {/* ─── 4 Anti-Cheat Detection Vector Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" className="bg-white border-[#DCE7F2] shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Monitor size={16} />
            </div>
            <h3 className="font-bold text-xs text-[#11183D]">Window & Tab Switches</h3>
          </div>
          <p className="text-[11px] text-[#526078]">Monitors background window blurs, full-screen exits, and alt-tabbing.</p>
        </Card>

        <Card padding="md" className="bg-white border-[#DCE7F2] shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Eye size={16} />
            </div>
            <h3 className="font-bold text-xs text-[#11183D]">Webcam Gaze & Face Audit</h3>
          </div>
          <p className="text-[11px] text-[#526078]">Tracks face tracking loss, secondary human faces in frame, and gaze divergence.</p>
        </Card>

        <Card padding="md" className="bg-white border-[#DCE7F2] shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Mic size={16} />
            </div>
            <h3 className="font-bold text-xs text-[#11183D]">Multi-Speaker Voice Stream</h3>
          </div>
          <p className="text-[11px] text-[#526078]">Detects secondary whisper acoustics and automated third-party speech prompting.</p>
        </Card>

        <Card padding="md" className="bg-white border-[#DCE7F2] shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Copy size={16} />
            </div>
            <h3 className="font-bold text-xs text-[#11183D]">Monaco Large Code Paste</h3>
          </div>
          <p className="text-[11px] text-[#526078]">Flags instant multi-line code insertions exceeding natural candidate typing cadence.</p>
        </Card>
      </div>

      {/* ─── Search & Filter Toolbar ─── */}
      <div className="bg-white p-4 rounded-3xl border border-[#DCE7F2] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search candidate by name, email, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl text-xs text-[#11183D] focus:ring-2 focus:ring-[#4A8BDF] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Format selector */}
          <div className="flex items-center gap-1 bg-[#EFFAFD] p-1 rounded-xl border border-[#DCE7F2]">
            {(['ALL', 'ORAL', 'CODING'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setModeFilter(m)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
                  modeFilter === m ? 'bg-white text-[#2459A8] shadow-xs' : 'text-[#526078] hover:text-[#11183D]'
                }`}
              >
                {m === 'ALL' ? 'All Modes' : m === 'ORAL' ? 'Oral Avatar' : 'Coding Studio'}
              </button>
            ))}
          </div>

          {/* Verdict selector */}
          <div className="flex items-center gap-1 bg-[#EFFAFD] p-1 rounded-xl border border-[#DCE7F2]">
            {(['ALL', 'CLEAN', 'SUSPICIOUS', 'FLAGGED_CHEATING'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVerdictFilter(v)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
                  verdictFilter === v ? 'bg-white text-[#11183D] shadow-xs' : 'text-[#526078] hover:text-[#11183D]'
                }`}
              >
                {v === 'ALL' ? 'All Results' : v === 'CLEAN' ? 'Clean' : v === 'SUSPICIOUS' ? 'Suspicious' : 'Flagged'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Scorecards Table ─── */}
      <Card padding="none" className="overflow-hidden border-[#DCE7F2] shadow-sm bg-white rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EFFAFD] border-b border-[#DCE7F2] text-[#526078] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Track & Role</th>
                <th className="py-3.5 px-4">Integrity Confidence Index</th>
                <th className="py-3.5 px-4">Detection Flags</th>
                <th className="py-3.5 px-4">Verdict</th>
                <th className="py-3.5 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE7F2] text-[#11183D]">
              {filteredScorecards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#526078] italic">
                    No session integrity records matching criteria.
                  </td>
                </tr>
              ) : (
                filteredScorecards.map((s) => {
                  const scoreColor =
                    s.integrityScore >= 85 ? 'text-emerald-600 bg-emerald-500' :
                    s.integrityScore >= 60 ? 'text-amber-600 bg-amber-500' : 'text-red-600 bg-red-500';

                  return (
                    <tr key={s.id} className="hover:bg-[#EFFAFD]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#11183D]">{s.candidateName}</div>
                        <div className="text-[10px] text-[#526078] font-mono">{s.candidateEmail}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#11183D]">{s.role}</div>
                        <div className="text-[11px] text-[#526078] flex items-center gap-1">
                          {s.mode === 'CODING' ? (
                            <span className="text-purple-700 font-bold flex items-center gap-1"><Code2 size={11} /> Coding</span>
                          ) : (
                            <span className="text-blue-700 font-bold flex items-center gap-1"><Video size={11} /> Oral Avatar</span>
                          )}
                          <span>• {new Date(s.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1 w-36">
                          <div className="flex justify-between font-bold text-[11px] font-mono">
                            <span className={scoreColor.split(' ')[0]}>{s.integrityScore}%</span>
                            <span className="text-slate-400">Score</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${s.integrityScore}%` }}
                              className={`h-full rounded-full ${scoreColor.split(' ')[1]}`}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {s.tabSwitches > 0 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {s.tabSwitches}x Tab Switch
                            </span>
                          )}
                          {s.faceLostCount > 0 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              {s.faceLostCount}x Face Lost
                            </span>
                          )}
                          {s.pasteEvents > 0 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                              {s.pasteEvents}x Code Paste
                            </span>
                          )}
                          {s.tabSwitches === 0 && s.faceLostCount === 0 && s.pasteEvents === 0 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ✓ Clean Session
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            s.verdict === 'CLEAN' ? 'success' :
                            s.verdict === 'SUSPICIOUS' ? 'warning' : 'error'
                          }
                          size="xs"
                        >
                          {s.verdict.replace('_', ' ')}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/admin/session/${s.id}`}
                          className="inline-flex items-center gap-1 text-[#2459A8] font-bold text-xs hover:underline"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
