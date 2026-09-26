// ═══════════════════════════════════════════════════════════════
// R U Ready? — Admin Candidate Directory & Plan Management
// Full candidate management, search, online filter, and slide-over profile
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  RefreshCw,
  Award,
  Zap,
  IndianRupee,
  Calendar,
  Layers,
  ArrowUpRight,
  X,
  Clock,
  Video,
  Code2,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import apiClient from '@/api/client';
import toast from 'react-hot-toast';

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

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<'ALL' | 'ONLINE' | 'FREE' | 'STARTER' | 'PRO' | 'ULTIMATE'>('ALL');
  
  // Slide-over drawer state
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerUserSessions, setDrawerUserSessions] = useState<any[]>([]);

  const fetchUsers = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await apiClient.get('/admin/users');
      if (res.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data.users || []);
        setUsers(list);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.warn('Error fetching candidate directory:', err);
      setUsers([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCandidateDrawer = async (u: AdminUser) => {
    setSelectedUser(u);
    setDrawerLoading(true);
    try {
      const res = await apiClient.get(`/admin/users/${u.id}`);
      if (res.data?.user?.sessions) {
        setDrawerUserSessions(res.data.user.sessions);
      } else {
        setDrawerUserSessions([]);
      }
    } catch {
      setDrawerUserSessions([]);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleUpdatePlan = async (userId: string, newPlan: 'FREE' | 'STARTER' | 'PRO' | 'ULTIMATE') => {
    try {
      await apiClient.patch(`/admin/users/${userId}/plan`, { plan: newPlan });
      toast.success(`Plan updated to ${newPlan}`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: newPlan } : u));
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(prev => prev ? { ...prev, plan: newPlan } : null);
      }
    } catch {
      toast.error('Failed to update subscription tier');
    }
  };

  // Filter users by search, plan tier, or live online status
  const filteredUsers = useMemo(() => {
    const now = new Date().getTime();
    const twentyMins = 20 * 60 * 1000;

    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (planFilter === 'ONLINE') {
        const lastActiveTime = new Date(u.lastActiveAt).getTime();
        // user is online if active in last 20m or is admin
        return (now - lastActiveTime) <= twentyMins || u.role === 'ADMIN';
      }

      if (planFilter === 'ALL') return true;
      return u.plan === planFilter;
    });
  }, [users, search, planFilter]);

  const paidUsersCount = users.filter(u => u.plan !== 'FREE').length;
  const onlineCandidatesCount = users.filter(u => {
    const lastActiveTime = new Date(u.lastActiveAt).getTime();
    return (Date.now() - lastActiveTime) <= (20 * 60 * 1000) || u.role === 'ADMIN';
  }).length;

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="h-10 w-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-slate-500">Loading candidate directory...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-body">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight">
            Candidate Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage registered candidates, review interview activity, and calibrate subscription tiers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => fetchUsers(true)}
            isLoading={isRefreshing}
            icon={<RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />}
          >
            Refresh Roster
          </Button>
        </div>
      </div>

      {/* ─── Quick Stats Summary Bar ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="md" className="bg-white border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 font-display">Total Candidates</span>
            <p className="text-2xl font-black text-slate-900 font-display">{users.length}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users size={18} />
          </div>
        </Card>

        <Card padding="md" className="bg-white border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 font-display">Online Candidates</span>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-black text-emerald-600 font-display">{onlineCandidatesCount}</p>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Zap size={18} />
          </div>
        </Card>

        <Card padding="md" className="bg-white border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 font-display">Paid Subscribers</span>
            <p className="text-2xl font-black text-[#FF7A00] font-display">{paidUsersCount} Active</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <IndianRupee size={18} />
          </div>
        </Card>
      </div>

      {/* ─── Search & Filter Controls ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search candidates by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['ALL', 'ONLINE', 'FREE', 'STARTER', 'PRO', 'ULTIMATE'] as const).map((plan) => (
            <button
              key={plan}
              onClick={() => setPlanFilter(plan)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                planFilter === plan
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {plan === 'ONLINE' && <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />}
              {plan === 'ONLINE' ? 'Live Online' : plan === 'STARTER' ? '₹69 Starter' : plan === 'PRO' ? '₹159 Pro' : plan === 'ULTIMATE' ? '₹249 Ultimate' : plan}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Candidate Directory Table ─── */}
      <Card padding="none" className="overflow-hidden border-slate-200 shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-display font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Sessions</th>
                <th className="py-3.5 px-4">Avg Score</th>
                <th className="py-3.5 px-4">Plan Tier</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-body text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                    No candidates found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isOnline = (Date.now() - new Date(u.lastActiveAt).getTime()) <= (20 * 60 * 1000) || u.role === 'ADMIN';

                  return (
                    <tr
                      key={u.id}
                      onClick={() => openCandidateDrawer(u)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold font-display flex items-center justify-center uppercase shrink-0">
                              {u.name.charAt(0) || 'C'}
                            </div>
                            {isOnline && (
                              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isOnline && (
                                <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-700 px-1 py-0.2 rounded">
                                  ONLINE
                                </span>
                              )}
                            </div>
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
                          <span className="text-slate-400 italic text-[11px]">No score</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
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
                          <option value="FREE">Free</option>
                          <option value="STARTER">₹499 Starter</option>
                          <option value="PRO">₹1,299 Pro</option>
                          <option value="ULTIMATE">₹2,499 Ultimate</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        {u.role === 'ADMIN' ? (
                          <Badge variant="orange" size="xs">ADMIN</Badge>
                        ) : (
                          <Badge variant="neutral" size="xs">CANDIDATE</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(u.lastActiveAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openCandidateDrawer(u);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ─── Candidate Profile Slide-Over Drawer ─── */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200"
              >
                {/* Drawer Header */}
                <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white font-extrabold font-display flex items-center justify-center text-lg shadow-md shadow-emerald-600/20">
                      {selectedUser.name.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900 font-display">
                        {selectedUser.name}
                      </h2>
                      <p className="text-xs text-slate-500 font-mono">{selectedUser.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-slate-400">
                          Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Drawer Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* Subscription Tier Modifier */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 font-display uppercase tracking-wider">
                        Subscription Tier
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-600">
                        {selectedUser.plan === 'STARTER' ? '₹69 Starter' : selectedUser.plan === 'PRO' ? '₹159 Pro' : selectedUser.plan === 'ULTIMATE' ? '₹249 Ultimate' : 'Free Tier'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {(['FREE', 'STARTER', 'PRO', 'ULTIMATE'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => handleUpdatePlan(selectedUser.id, p)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition-all text-center cursor-pointer ${
                            selectedUser.plan === p
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {p === 'STARTER' ? '₹69 Starter' : p === 'PRO' ? '₹159 Pro' : p === 'ULTIMATE' ? '₹249 Ultimate' : 'Free Tier'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Candidate Metrics */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-display">Sessions</span>
                      <p className="text-lg font-black text-slate-900 font-display mt-0.5">
                        {selectedUser.completedSessions}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-display">Avg Score</span>
                      <p className="text-lg font-black text-emerald-600 font-display mt-0.5">
                        {selectedUser.avgScore ? `${selectedUser.avgScore}/100` : 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-display">Role</span>
                      <p className="text-xs font-bold text-slate-700 font-mono mt-1">
                        {selectedUser.role}
                      </p>
                    </div>
                  </div>

                  {/* Interview Session History */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900 font-display uppercase tracking-wider">
                        Interview History
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        {drawerUserSessions.length} total runs
                      </span>
                    </div>

                    {drawerLoading ? (
                      <div className="py-8 flex flex-col items-center justify-center space-y-2">
                        <div className="h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-mono text-slate-400">Loading session history...</span>
                      </div>
                    ) : drawerUserSessions.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-4 text-center bg-slate-50 rounded-2xl border border-slate-100">
                        No sessions recorded for this candidate yet.
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {drawerUserSessions.map((sess: any) => (
                          <div
                            key={sess.id}
                            className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs hover:border-emerald-300 transition-all"
                          >
                            <div className="space-y-1 overflow-hidden pr-2">
                              <div className="font-bold text-slate-800 truncate">
                                {sess.targetRole}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                                <span>{sess.mode === 'CODING' ? 'Coding' : 'Oral'}</span>
                                <span>•</span>
                                <span>{new Date(sess.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {sess.analysis?.overallScore ? (
                                <Badge variant="success" size="xs">
                                  {sess.analysis.overallScore}/100
                                </Badge>
                              ) : (
                                <Badge variant="neutral" size="xs">
                                  {sess.status}
                                </Badge>
                              )}
                              <Link
                                to={`/admin/session/${sess.id}`}
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                                title="Inspect Session"
                              >
                                <ArrowUpRight size={13} />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Drawer Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">Candidate ID: {selectedUser.id.substring(0, 8)}...</span>
                  <Button size="sm" variant="secondary" onClick={() => setSelectedUser(null)}>
                    Close
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
