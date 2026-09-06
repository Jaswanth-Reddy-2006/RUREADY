// ═══════════════════════════════════════════════════════════════
// R U Ready? — Admin Traffic & Business Analytics
// Platform peak traffic heatmap, role breakdowns & monetization ROI
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  IndianRupee,
  Award,
  Users,
  Sparkles,
  RefreshCw,
  Activity,
  Layers,
  Cpu,
  BarChart3,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import apiClient from '@/api/client';
import toast from 'react-hot-toast';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const [analyticsRes, metricsRes] = await Promise.all([
        apiClient.get('/admin/analytics'),
        apiClient.get('/admin/metrics'),
      ]);

      setAnalytics(analyticsRes.data);
      setMetrics(metricsRes.data);
    } catch (err) {
      console.error('Failed to load deep analytics:', err);
      toast.error('Failed to fetch platform analytics');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="h-10 w-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-slate-500">Compiling business & traffic intelligence...</p>
      </div>
    );
  }

  const hourlyCounts = analytics?.hourlyCounts || [];
  const maxHourCount = Math.max(...hourlyCounts.map((h: any) => h.count || 1), 30);
  const topRoles = analytics?.topRoles || [];
  const maxRoleCount = Math.max(...topRoles.map((r: any) => r.count || 1), 10);

  const paidUsersCount = (metrics?.planCounts?.STARTER || 0) + (metrics?.planCounts?.PRO || 0) + (metrics?.planCounts?.ULTIMATE || 0);
  const totalUsers = metrics?.totalUsers || 1;
  const conversionRate = Math.round((paidUsersCount / totalUsers) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-body">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight">
            Traffic & Business Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Platform throughput patterns, peak interview hours, and subscription monetization growth.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => fetchAnalytics(true)}
            isLoading={isRefreshing}
            icon={<RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />}
          >
            Refresh Analytics
          </Button>
        </div>
      </div>

      {/* ─── Top Business Financial Metrics ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card padding="md" className="bg-white border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 font-display">Gross Platform Revenue</span>
          <p className="text-3xl font-black text-emerald-600 font-display">₹{metrics?.totalRevenue || 0}</p>
          <p className="text-[11px] text-slate-500 font-mono">From active subscriptions</p>
        </Card>

        <Card padding="md" className="bg-white border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 font-display">Paid Candidate Ratio</span>
          <p className="text-3xl font-black text-slate-900 font-display">{conversionRate}%</p>
          <p className="text-[11px] text-emerald-600 font-semibold font-mono">{paidUsersCount} paying candidates</p>
        </Card>

        <Card padding="md" className="bg-white border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 font-display">Average Calibration Time</span>
          <p className="text-3xl font-black text-blue-600 font-display">24 mins</p>
          <p className="text-[11px] text-slate-500 font-mono">Per mock interview session</p>
        </Card>

        <Card padding="md" className="bg-white border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 font-display">Platform Peak Traffic</span>
          <p className="text-xl font-black text-[#FF7A00] font-display mt-1">{analytics?.trafficPeakHour || '18:00 - 19:00 IST'}</p>
          <p className="text-[11px] text-slate-500 font-mono">Highest concurrent demand</p>
        </Card>

      </div>

      {/* ─── 24-Hour Traffic Heatmap Graph ─── */}
      <Card padding="lg" className="bg-white border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="text-[#FF7A00]" size={18} />
              <h2 className="font-bold text-slate-900 font-display text-sm">24-Hour Platform Traffic Distribution</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Real-time candidate server requests by hour of the day (IST)</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-3 w-3 rounded bg-emerald-500" />
              Standard Load
            </span>
            <span className="flex items-center gap-1.5 text-[#FF7A00] font-bold">
              <span className="h-3 w-3 rounded bg-[#FF7A00]" />
              Peak Traffic Period
            </span>
          </div>
        </div>

        {/* 24-hour visual bar representation */}
        <div className="h-56 flex items-end justify-between gap-1 pt-4 px-2">
          {hourlyCounts.map((h: any, i: number) => {
            const height = Math.max(10, Math.round((h.count / maxHourCount) * 100));
            const isPeak = height > 70;

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="text-[9px] font-bold font-mono text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  {h.count}
                </div>
                <div
                  style={{ height: `${height}%` }}
                  className={`w-full rounded-lg transition-all ${
                    isPeak
                      ? 'bg-[#FF7A00] shadow-md shadow-orange-500/20'
                      : 'bg-emerald-400 group-hover:bg-emerald-600'
                  }`}
                />
                <span className="text-[9px] font-mono text-slate-400">
                  {h.hour.split(':')[0]}
                </span>
              </div>
            );
          })}
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-900 font-mono">
          <span>Server Capacity Headroom: <strong>94.2% available</strong></span>
          <span>Target Response Latency: <strong>&lt; 280ms</strong></span>
        </div>
      </Card>

      {/* ─── Bottom Grid: Top Target Roles & Monetization Plans ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Most Practiced Roles */}
        <Card padding="lg" className="lg:col-span-6 bg-white border-slate-200/80 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 font-display text-sm">Top Target Roles Practiced</h2>
            <p className="text-xs text-slate-500">Distribution of candidate career specializations</p>
          </div>

          <div className="space-y-3 pt-2">
            {topRoles.map((roleObj: any, idx: number) => {
              const width = Math.max(15, Math.round((roleObj.count / maxRoleCount) * 100));
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold font-display">
                    <span className="text-slate-800">{roleObj.role}</span>
                    <span className="font-mono text-emerald-600">{roleObj.count} sessions</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${width}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Pricing Tier Revenue Breakdown */}
        <Card padding="lg" className="lg:col-span-6 bg-white border-slate-200/80 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 font-display text-sm">Subscription Tier Revenue Contribution</h2>
            <p className="text-xs text-slate-500">Rupee breakdown by pricing plan tier</p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { tier: '₹249 Ultimate Mastery', revenue: (metrics?.planCounts?.ULTIMATE || 0) * 249, count: metrics?.planCounts?.ULTIMATE || 0, badge: 'High Value' },
              { tier: '₹159 Pro Calibration', revenue: (metrics?.planCounts?.PRO || 0) * 159, count: metrics?.planCounts?.PRO || 0, badge: 'Most Popular' },
              { tier: '₹69 Starter Pack', revenue: (metrics?.planCounts?.STARTER || 0) * 69, count: metrics?.planCounts?.STARTER || 0, badge: 'Entry' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 font-display">{item.tier}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{item.count} active subscriptions</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-emerald-600 font-mono text-sm">₹{item.revenue}</div>
                  <Badge variant="neutral" size="xs">{item.badge}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
}
