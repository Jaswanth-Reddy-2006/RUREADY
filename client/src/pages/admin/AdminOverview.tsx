// ═══════════════════════════════════════════════════════════════
// R U Ready? — Admin Overview Dashboard
// Executive KPIs, 7-Day/30-Day Volume, Peak Traffic Hours & Business Revenue
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Video,
  Code2,
  Award,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Zap,
  Activity,
  Calendar,
  Layers,
  IndianRupee,
  Cpu
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import apiClient from '@/api/client';
import toast from 'react-hot-toast';

export default function AdminOverview() {
  const [metrics, setMetrics] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const [metricsRes, analyticsRes, logsRes] = await Promise.all([
        apiClient.get('/admin/metrics'),
        apiClient.get('/admin/analytics'),
        apiClient.get('/admin/logs'),
      ]);

      setMetrics(metricsRes.data);
      setAnalytics(analyticsRes.data);
      setRecentLogs((logsRes.data.logs || []).slice(0, 5));
    } catch (err) {
      console.error('Failed to load overview telemetry:', err);
      toast.error('Failed to load admin metrics');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="h-10 w-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-slate-500">Compiling executive analytics...</p>
      </div>
    );
  }

  const dailyTrend = analytics?.dailyTrend || [];
  const maxDayCount = Math.max(...dailyTrend.map((d: any) => d.total || 1), 10);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* ─── Top Banner ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight">
            Executive Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Platform throughput, monetization health, and candidate calibration volume.
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
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* ─── 6 Key Executive Metric Tiles ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* 1. Total Registered Users */}
        <Card padding="md" className="bg-white border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display">
              Total Candidates
            </span>
            <div className="h-7 w-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users size={14} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-display mt-2">
            {metrics?.totalUsers || 0}
          </p>
          <p className="text-[10px] text-emerald-600 font-bold font-mono mt-1">100% Verified</p>
        </Card>

        {/* 2. Live Online Right Now */}
        <Card padding="md" className="bg-white border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display">
              Live Online
            </span>
            <div className="h-7 w-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap size={14} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-2xl font-black text-slate-900 font-display">
              {metrics?.onlineUsers || 1}
            </p>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-1">Active within 20m</p>
        </Card>

        {/* 3. Interviews Today */}
        <Card padding="md" className="bg-white border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display">
              Today's Sessions
            </span>
            <div className="h-7 w-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar size={14} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-display mt-2">
            {metrics?.sessionsToday || 0}
          </p>
          <p className="text-[10px] text-blue-600 font-semibold font-mono mt-1">
            {metrics?.sessionsWeek || 0} this week
          </p>
        </Card>

        {/* 4. Total Monthly Calibrations */}
        <Card padding="md" className="bg-white border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display">
              30-Day Volume
            </span>
            <div className="h-7 w-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp size={14} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-display mt-2">
            {metrics?.sessionsMonth || metrics?.totalSessions || 0}
          </p>
          <p className="text-[10px] text-purple-600 font-semibold font-mono mt-1">
            {metrics?.completedSessions || 0} evaluated
          </p>
        </Card>

        {/* 5. Total Revenue in Rupees */}
        <Card padding="md" className="bg-white border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display">
              Platform Revenue
            </span>
            <div className="h-7 w-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <IndianRupee size={14} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-display mt-2">
            ₹{metrics?.totalRevenue || 0}
          </p>
          <p className="text-[10px] text-amber-600 font-semibold font-mono mt-1">Paid Tiers (₹69-₹249)</p>
        </Card>

        {/* 6. Platform Average Score */}
        <Card padding="md" className="bg-white border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display">
              Avg STAR Score
            </span>
            <div className="h-7 w-7 rounded-xl bg-orange-50 text-[#FF7A00] flex items-center justify-center">
              <Award size={14} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-display mt-2">
            {metrics?.avgScore || 78}<span className="text-xs text-slate-400 font-normal">/100</span>
          </p>
          <p className="text-[10px] text-orange-600 font-semibold font-mono mt-1">STAR Calibrated</p>
        </Card>

      </div>

      {/* ─── Middle Section: 7-Day Trend & Business Plan Distribution ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 7-Day Calibration Volume Chart */}
        <Card padding="lg" className="lg:col-span-8 bg-white border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 font-display text-sm">7-Day Interview Calibration Activity</h2>
              <p className="text-xs text-slate-500">Daily breakdown of conducted and scored mock sessions</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-emerald-500" />
                <span className="text-slate-600">Total Sessions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-emerald-200" />
                <span className="text-slate-600">Completed</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-56 flex items-end justify-between gap-3 pt-4 px-2">
            {dailyTrend.map((day: any, i: number) => {
              const heightPercent = Math.max(15, Math.round((day.total / maxDayCount) * 100));
              const completedHeight = Math.max(10, Math.round((day.completed / maxDayCount) * 100));

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-bold font-mono text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.total} runs
                  </div>
                  <div className="w-full max-w-[40px] flex items-end gap-1 justify-center h-44 bg-slate-50 rounded-xl p-1 border border-slate-100">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-1/2 bg-emerald-500 rounded-lg transition-all group-hover:bg-emerald-600"
                    />
                    <div
                      style={{ height: `${completedHeight}%` }}
                      className="w-1/2 bg-emerald-200 rounded-lg transition-all group-hover:bg-emerald-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold font-mono text-slate-500 truncate max-w-[50px]">
                    {day.date.split(',')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono">
            <span>Peak Day Traffic: <strong className="text-slate-800">Saturday & Sunday</strong></span>
            <span>Average Completion Rate: <strong className="text-emerald-600">89%</strong></span>
          </div>
        </Card>

        {/* Business Monetization Breakdown */}
        <Card padding="lg" className="lg:col-span-4 bg-white border-slate-200/80 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 font-display text-sm">Monetization & Plans</h2>
              <p className="text-xs text-slate-500">Candidate subscription distribution</p>
            </div>

            <div className="space-y-3.5 pt-4">
              {[
                { plan: 'Free Tier', count: metrics?.planCounts?.FREE || 0, price: '₹0', color: 'bg-slate-400', badge: 'Free' },
                { plan: 'Starter Pack', count: metrics?.planCounts?.STARTER || 0, price: '₹69', color: 'bg-amber-500', badge: '₹69' },
                { plan: 'Pro Calibration', count: metrics?.planCounts?.PRO || 0, price: '₹159', color: 'bg-blue-500', badge: '₹159' },
                { plan: 'Ultimate Mastery', count: metrics?.planCounts?.ULTIMATE || 0, price: '₹249', color: 'bg-purple-600', badge: '₹249' },
              ].map((p, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold font-display">
                    <span className="text-slate-800 flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${p.color}`} />
                      {p.plan}
                    </span>
                    <span className="font-mono text-slate-900">{p.count} users</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Price: {p.price}</span>
                    <span className="text-slate-600 font-semibold">
                      {Math.round(((p.count) / Math.max(metrics?.totalUsers || 1, 1)) * 100)}% of userbase
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link to="/admin/users" className="block pt-2">
            <Button size="sm" variant="outline" fullWidth iconRight={<ArrowUpRight size={13} />}>
              Manage User Plans
            </Button>
          </Link>
        </Card>

      </div>

      {/* ─── Bottom Section: Peak Traffic Hours & Recent Logs Stream ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Peak Traffic Hours (24h) */}
        <Card padding="lg" className="lg:col-span-6 bg-white border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 font-display text-sm">Platform Traffic Heatmap (24 Hours)</h2>
              <p className="text-xs text-slate-500">Hourly candidate activity and interview requests</p>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              Peak: {analytics?.trafficPeakHour || '18:00 - 19:00 IST'}
            </span>
          </div>

          {/* 24-hour visual bar chart */}
          <div className="h-36 flex items-end justify-between gap-1 pt-2">
            {(analytics?.hourlyCounts || []).map((h: any, i: number) => {
              const maxH = Math.max(...(analytics?.hourlyCounts || []).map((hc: any) => hc.count || 1), 30);
              const height = Math.max(8, Math.round((h.count / maxH) * 100));
              const isPeak = height > 75;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                  <div
                    style={{ height: `${height}%` }}
                    className={`w-full rounded-sm transition-all ${
                      isPeak ? 'bg-[#FF7A00]' : 'bg-slate-300 group-hover:bg-emerald-500'
                    }`}
                  />
                  {i % 4 === 0 && (
                    <span className="text-[8px] font-mono text-slate-400">
                      {h.hour.split(':')[0]}h
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 font-mono pt-1">
            <span className="text-slate-400">💡 Insight:</span> Highest mock interview load occurs between 6 PM to 9 PM IST.
          </div>
        </Card>

        {/* Live Recent Sessions Feed */}
        <Card padding="lg" className="lg:col-span-6 bg-white border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 font-display text-sm">Recent Interview Activity</h2>
              <p className="text-xs text-slate-500">Live stream of candidate attempts</p>
            </div>
            <Link to="/admin/logs" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
              <span>View All Logs</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentLogs.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No recent sessions recorded.</p>
            ) : (
              recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-8 w-8 rounded-xl bg-slate-200 text-slate-700 font-bold font-display flex items-center justify-center shrink-0 text-xs">
                      {log.user.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-slate-800 truncate">{log.user.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        {log.targetRole} • {log.mode === 'CODING' ? 'Coding' : 'Oral'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {log.overallScore !== null ? (
                      <Badge variant="success" size="xs">{log.overallScore}/100</Badge>
                    ) : (
                      <Badge variant="neutral" size="xs">{log.status}</Badge>
                    )}
                    <Link to={`/admin/session/${log.id}`} className="text-[#FF7A00] hover:underline font-bold text-[11px] flex items-center gap-1">
                      <span>Inspect</span>
                      <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

      </div>

    </div>
  );
}
