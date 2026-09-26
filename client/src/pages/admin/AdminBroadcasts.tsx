// ═══════════════════════════════════════════════════════════════
// R U Ready? — Admin Platform Announcements & In-App Broadcasts
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useMemo } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  RefreshCw,
  Eye,
  MousePointerClick,
  CheckCircle2,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  X,
  AlertTriangle,
  Gift,
  Bell,
  Radio
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import apiClient from '@/api/client';
import toast from 'react-hot-toast';

interface BroadcastItem {
  id: string;
  title: string;
  message: string;
  category: 'INFO' | 'PROMOTION' | 'WARNING' | 'PLACEMENT_DRIVE';
  targetAudience: 'ALL' | 'FREE' | 'STARTER' | 'PRO' | 'ULTIMATE';
  bannerType: 'TOP_BANNER' | 'MODAL_BANNER' | 'TOAST';
  actionUrl?: string;
  actionText?: string;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
  impressionsCount: number;
  clicksCount: number;
}

export default function AdminBroadcasts() {
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('ALL');

  // Modal Creation Form State
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<BroadcastItem['category']>('PLACEMENT_DRIVE');
  const [targetAudience, setTargetAudience] = useState<BroadcastItem['targetAudience']>('ALL');
  const [bannerType, setBannerType] = useState<BroadcastItem['bannerType']>('TOP_BANNER');
  const [actionUrl, setActionUrl] = useState('/oral/new');
  const [actionText, setActionText] = useState('Launch Practice');
  const [expiresInDays, setExpiresInDays] = useState(7);

  const fetchBroadcasts = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await apiClient.get('/admin/broadcasts');
      setBroadcasts(res.data?.broadcasts || []);
    } catch (err) {
      console.warn('Failed to fetch broadcasts:', err);
      setBroadcasts([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const handleCreateBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Please enter a title and message');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/admin/broadcasts', {
        title,
        message,
        category,
        targetAudience,
        bannerType,
        actionUrl,
        actionText,
        expiresInDays,
      });

      if (res.data) {
        setBroadcasts([res.data, ...broadcasts]);
        setShowModal(false);
        setTitle('');
        setMessage('');
        toast.success('Announcement broadcast published live!');
      }
    } catch {
      toast.error('Failed to publish broadcast');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await apiClient.patch(`/admin/broadcasts/${id}/toggle`);
      setBroadcasts(prev => prev.map(b => b.id === id ? { ...b, isActive: res.data.isActive } : b));
      toast.success(res.data.isActive ? 'Broadcast activated' : 'Broadcast paused');
    } catch {
      toast.error('Failed to toggle broadcast');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/admin/broadcasts/${id}`);
      setBroadcasts(prev => prev.filter(b => b.id !== id));
      toast.success('Broadcast deleted');
    } catch {
      toast.error('Failed to delete broadcast');
    }
  };

  const filteredBroadcasts = useMemo(() => {
    return broadcasts.filter((b) => {
      const matchSearch =
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.message.toLowerCase().includes(search.toLowerCase());
      const matchAudience = audienceFilter === 'ALL' || b.targetAudience === audienceFilter;
      return matchSearch && matchAudience;
    });
  }, [broadcasts, search, audienceFilter]);

  const activeCount = broadcasts.filter(b => b.isActive).length;
  const totalClicks = broadcasts.reduce((acc, b) => acc + (b.clicksCount || 0), 0);
  const totalImpressions = broadcasts.reduce((acc, b) => acc + (b.impressionsCount || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="h-10 w-10 border-3 border-[#2459A8] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-[#526078]">Loading broadcast center...</p>
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
              <Megaphone size={22} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#11183D] tracking-tight">
              Platform Announcements & In-App Broadcasts
            </h1>
          </div>
          <p className="text-xs text-[#526078]">
            Publish targeted placement drive notices, subscription promos, and urgent candidate updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowModal(true)}
            icon={<Plus size={15} />}
          >
            Create Announcement
          </Button>

          <button
            onClick={() => fetchBroadcasts(true)}
            disabled={isRefreshing}
            className="p-2.5 rounded-2xl bg-[#EFFAFD] text-[#2459A8] hover:bg-[#DCE7F2] border border-[#DCE7F2] transition-colors cursor-pointer"
            title="Refresh Broadcasts"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ─── Metrics Summary ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="md" className="bg-white border-[#DCE7F2] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#526078]">Active Broadcasts</span>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
              {activeCount > 0 && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Radio size={18} />
          </div>
        </Card>

        <Card padding="md" className="bg-white border-[#DCE7F2] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#526078]">Candidate Impressions</span>
            <p className="text-2xl font-black text-[#11183D] mt-1">{totalImpressions}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Eye size={18} />
          </div>
        </Card>

        <Card padding="md" className="bg-white border-[#DCE7F2] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#526078]">Call-to-Action Clicks</span>
            <p className="text-2xl font-black text-[#2459A8] mt-1">{totalClicks}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#EFFAFD] text-[#2459A8] flex items-center justify-center">
            <MousePointerClick size={18} />
          </div>
        </Card>
      </div>

      {/* ─── Search & Filters Bar ─── */}
      <div className="bg-white p-4 rounded-3xl border border-[#DCE7F2] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl text-xs text-[#11183D] focus:ring-2 focus:ring-[#4A8BDF] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-[#526078]">Audience:</span>
          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className="p-2 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] text-xs font-bold text-[#11183D] focus:ring-2 focus:ring-[#4A8BDF] outline-none cursor-pointer"
          >
            <option value="ALL">All Tiers</option>
            <option value="FREE">Free Tier Only</option>
            <option value="STARTER">Starter Plan</option>
            <option value="PRO">Pro Engineer</option>
            <option value="ULTIMATE">Ultimate Suite</option>
          </select>
        </div>
      </div>

      {/* ─── Broadcast List ─── */}
      <div className="space-y-4">
        {filteredBroadcasts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-[#DCE7F2] space-y-2">
            <Megaphone size={28} className="text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-[#11183D]">No Announcements Found</h3>
            <p className="text-xs text-[#526078]">Create a new banner above to broadcast news to candidates.</p>
          </div>
        ) : (
          filteredBroadcasts.map((b) => (
            <Card
              key={b.id}
              padding="lg"
              className={`border transition-all ${
                b.isActive ? 'bg-white border-[#DCE7F2] shadow-sm' : 'bg-slate-50 border-slate-200 opacity-75'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">{b.title}</span>
                    <Badge
                      variant={
                        b.category === 'PLACEMENT_DRIVE' ? 'success' :
                        b.category === 'PROMOTION' ? 'orange' :
                        b.category === 'WARNING' ? 'warning' : 'neutral'
                      }
                      size="xs"
                    >
                      {b.category.replace('_', ' ')}
                    </Badge>
                    <Badge variant="neutral" size="xs">
                      Audience: {b.targetAudience}
                    </Badge>
                    <Badge variant="neutral" size="xs">
                      Format: {b.bannerType.replace('_', ' ')}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#526078] leading-relaxed">{b.message}</p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#526078] pt-1">
                    <span>Created: {new Date(b.createdAt).toLocaleDateString()}</span>
                    <span>Expires: {new Date(b.expiresAt).toLocaleDateString()}</span>
                    {b.actionUrl && (
                      <span className="text-[#2459A8] font-bold">CTA: "{b.actionText || 'Click Here'}" → {b.actionUrl}</span>
                    )}
                  </div>
                </div>

                {/* Right Metrics & Controls */}
                <div className="flex items-center gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 shrink-0">
                  <div className="text-right text-xs font-mono pr-2">
                    <div className="font-bold text-[#11183D]">{b.impressionsCount} views</div>
                    <div className="text-[#2459A8] font-bold">{b.clicksCount} clicks</div>
                  </div>

                  <Button
                    size="sm"
                    variant={b.isActive ? 'secondary' : 'primary'}
                    onClick={() => handleToggle(b.id)}
                  >
                    {b.isActive ? 'Pause' : 'Activate'}
                  </Button>

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Announcement"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* ─── Create Announcement Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl border border-[#DCE7F2] shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
              <div className="flex items-center gap-2">
                <Megaphone size={18} className="text-[#2459A8]" />
                <h3 className="text-base font-bold text-[#11183D]">Compose Platform Announcement</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-[#11183D] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBroadcast} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#11183D]">Announcement Title:</label>
                <input
                  type="text"
                  placeholder="e.g. 🚀 Amazon Summer Placement Drive 2026 is Live!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] text-xs font-bold text-[#11183D] outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#11183D]">Message Body:</label>
                <textarea
                  rows={3}
                  placeholder="Enter the full message text presented to candidates..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] text-xs text-[#11183D] outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#11183D]">Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] text-xs font-bold text-[#11183D] outline-none"
                  >
                    <option value="PLACEMENT_DRIVE">Placement Drive</option>
                    <option value="PROMOTION">Special Promotion</option>
                    <option value="INFO">General Information</option>
                    <option value="WARNING">Platform Notice</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#11183D]">Target Audience:</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] text-xs font-bold text-[#11183D] outline-none"
                  >
                    <option value="ALL">All Candidates</option>
                    <option value="FREE">Free Tier Only</option>
                    <option value="STARTER">Starter Tier</option>
                    <option value="PRO">Pro Tier</option>
                    <option value="ULTIMATE">Ultimate Tier</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#11183D]">Display Format:</label>
                  <select
                    value={bannerType}
                    onChange={(e) => setBannerType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] text-xs font-bold text-[#11183D] outline-none"
                  >
                    <option value="TOP_BANNER">Top Bar Banner</option>
                    <option value="MODAL_BANNER">Modal Pop-up</option>
                    <option value="TOAST">Toast Notification</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#11183D]">CTA Button Text:</label>
                  <input
                    type="text"
                    placeholder="e.g. Start Challenge"
                    value={actionText}
                    onChange={(e) => setActionText(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] text-xs text-[#11183D] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#11183D]">Destination Link URL:</label>
                  <input
                    type="text"
                    placeholder="e.g. /oral/new"
                    value={actionUrl}
                    onChange={(e) => setActionUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] text-xs text-[#11183D] outline-none"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Live Candidate Preview:</span>
                <div className="p-3 rounded-xl bg-[#2459A8] text-white flex items-center justify-between text-xs gap-3 shadow-md">
                  <div>
                    <strong>{title || 'Announcement Title'}</strong>
                    <p className="text-[11px] text-blue-100 mt-0.5">{message || 'Your announcement text will appear here.'}</p>
                  </div>
                  {actionText && (
                    <span className="px-3 py-1 rounded-lg bg-white text-[#2459A8] font-bold text-[11px] shrink-0">
                      {actionText}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
                  Publish Announcement
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
