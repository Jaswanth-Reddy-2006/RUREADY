// ═══════════════════════════════════════════════════════════════
// RU Ready? — Multi-Timeframe Gamified Elo Leaderboard
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Crown,
  Medal,
  Swords,
  ShieldCheck,
  TrendingUp,
  ArrowLeft,
  Search,
  Filter,
  Clock,
  Flame,
  Sparkles,
  Zap,
  Award,
  ChevronRight,
  ArrowUpRight,
  User,
  RotateCcw,
} from 'lucide-react';
import { challengesApi, type LeaderboardEntry, type LeaderboardPayload } from '../../api/challenges';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const TIERS = [
  { id: 'ALL', label: 'All Leagues' },
  { id: 'GRANDMASTER', label: 'Grandmaster', min: 1850, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'DIAMOND', label: 'Diamond', min: 1700, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
  { id: 'PLATINUM', label: 'Platinum', min: 1550, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'GOLD', label: 'Gold', min: 1400, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'SILVER', label: 'Silver', min: 1250, color: 'text-slate-600 bg-slate-100 border-slate-200' },
  { id: 'BRONZE', label: 'Bronze', min: 0, color: 'text-amber-700 bg-amber-50 border-amber-200' },
];

export default function ChallengesLeaderboardPage() {
  const navigate = useNavigate();

  // Timeframe state: 'weekly' | 'monthly' | 'all_time'
  const [activeTimeframe, setActiveTimeframe] = useState<'weekly' | 'monthly' | 'all_time'>('weekly');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [leaderboardPayload, setLeaderboardPayload] = useState<LeaderboardPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Live countdown timer state
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    async function loadLeaderboard() {
      setIsLoading(true);
      try {
        const res = await challengesApi.getLeaderboard(activeTimeframe, selectedTier, 50);
        if (isMounted && res.success && res.data) {
          setLeaderboardPayload(res.data);
          setTimeRemaining(res.data.timeRemainingMs || 0);
        }
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadLeaderboard();
    return () => {
      isMounted = false;
    };
  }, [activeTimeframe, selectedTier]);

  // Live timer tick
  useEffect(() => {
    if (timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeRemaining]);

  const formatCountdown = (ms: number) => {
    if (ms <= 0) return 'Season Ended';
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getTierBadge = (tier: string) => {
    const found = TIERS.find((t) => t.id === (tier || '').toUpperCase());
    return found ? found.color : 'text-slate-600 bg-slate-100 border-slate-200';
  };

  const entries = leaderboardPayload?.entries || [];
  const filteredEntries = entries.filter((entry) =>
    entry.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top3 = filteredEntries.slice(0, 3);
  const remainingEntries = filteredEntries.slice(3);

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header & Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/challenges')}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Arena Hub</span>
          </button>

          <Button
            onClick={() => navigate('/challenges/match/quick-match')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Swords size={14} />
            <span>Queue 1v1 Battle</span>
          </Button>
        </div>

        {/* ─── SEASON HEADER BANNER ─── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#11183D] to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono">
                <Trophy size={14} />
                <span>{leaderboardPayload?.seasonLabel || 'Weekly Sprint Season'}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight font-display text-white">
                Competitive Elo Leaderboard
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Climb the divisions in live 1v1 code duels, multiplayer speed quizzes, and weekly tournaments. Weekly and monthly leaderboards award exclusive Grandmaster badges and streak boosts.
              </p>
            </div>

            {/* Countdown Clock & Reward Capsule */}
            {activeTimeframe !== 'all_time' && (
              <div className="flex flex-col sm:flex-row items-stretch lg:items-center gap-3 shrink-0">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider font-mono">
                    <Clock size={13} />
                    <span>{activeTimeframe === 'weekly' ? 'Weekly Reset' : 'Monthly Reset'}</span>
                  </div>
                  <div className="text-lg sm:text-xl font-black font-mono text-white tracking-wide">
                    {formatCountdown(timeRemaining)}
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Points reset to 0 at season finish
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Background Ambient Glow */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* ─── TIMEFRAME NAVIGATION TABS ─── */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200/80 pb-3">
          
          {/* Main 3 Timeframe Tabs */}
          <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-2xl">
            {[
              { id: 'weekly', label: 'Weekly Season', icon: Flame, badge: 'Active' },
              { id: 'monthly', label: 'Monthly Championship', icon: Trophy, badge: 'Monthly' },
              { id: 'all_time', label: 'All-Time Legends', icon: Crown, badge: 'Career' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTimeframe === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTimeframe(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-amber-500' : 'text-slate-400'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tier Quick Filter Dropdown/Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {TIERS.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer shrink-0 border ${
                  selectedTier === tier.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>

        </div>

        {/* ─── TOP 3 PODIUM CHAMPIONS ─── */}
        {top3.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            {/* Rank 2 - Silver */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col items-center text-center order-2 md:order-1 relative overflow-hidden space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-lg shadow-inner">
                <Medal size={28} className="text-slate-400" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase font-mono">
                  Rank #2 Silver
                </span>
                <h3 className="text-base font-bold text-slate-900">{top3[1].userName}</h3>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {activeTimeframe === 'all_time' ? `${top3[1].rating} Elo` : `${top3[1].seasonPoints || top3[1].rating} Pts`}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${getTierBadge(top3[1].rankTier)}`}>
                  {top3[1].rankTier}
                </span>
                <span className="text-slate-500 font-mono font-medium">
                  {top3[1].wins}W / {top3[1].losses}L ({top3[1].winRate}%)
                </span>
              </div>
            </div>

            {/* Rank 1 - Gold (Champion) */}
            <div className="bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white rounded-3xl p-7 border-2 border-amber-300 shadow-md flex flex-col items-center text-center order-1 md:order-2 relative overflow-hidden space-y-3 scale-102">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-amber-500/30 animate-pulse">
                <Crown size={32} />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase font-mono border border-amber-200 flex items-center gap-1 mx-auto">
                  <Sparkles size={11} />
                  <span>Rank #1 Champion</span>
                </span>
                <h3 className="text-lg font-black text-slate-900">{top3[0].userName}</h3>
                <div className="text-3xl font-black text-amber-600 font-mono">
                  {activeTimeframe === 'all_time' ? `${top3[0].rating} Elo` : `${top3[0].seasonPoints || top3[0].rating} Pts`}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${getTierBadge(top3[0].rankTier)}`}>
                  {top3[0].rankTier}
                </span>
                <span className="text-amber-700 font-mono font-bold flex items-center gap-0.5">
                  <Flame size={13} className="text-amber-500 fill-amber-500" />
                  <span>{top3[0].currentStreak || 5} Win Streak</span>
                </span>
              </div>
            </div>

            {/* Rank 3 - Bronze */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col items-center text-center order-3 relative overflow-hidden space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-700/10 text-amber-800 flex items-center justify-center font-black text-lg shadow-inner">
                <Medal size={28} className="text-amber-700" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 uppercase font-mono">
                  Rank #3 Bronze
                </span>
                <h3 className="text-base font-bold text-slate-900">{top3[2].userName}</h3>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {activeTimeframe === 'all_time' ? `${top3[2].rating} Elo` : `${top3[2].seasonPoints || top3[2].rating} Pts`}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${getTierBadge(top3[2].rankTier)}`}>
                  {top3[2].rankTier}
                </span>
                <span className="text-slate-500 font-mono font-medium">
                  {top3[2].wins}W / {top3[2].losses}L ({top3[2].winRate}%)
                </span>
              </div>
            </div>

          </div>
        )}

        {/* ─── FULL LEADERBOARD TABLE CARD ─── */}
        <Card className="p-6 bg-white border-slate-200/80 shadow-xs rounded-3xl space-y-4">
          
          {/* Table Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-slate-900">
                {activeTimeframe === 'weekly' ? 'Weekly Standings' : activeTimeframe === 'monthly' ? 'Monthly Championship Standings' : 'All-Time Global Standings'}
              </h3>
              <p className="text-xs text-slate-500">
                Rankings update in real-time following every ranked 1v1 battle and quiz arena.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search challenger name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-mono text-[10.5px] uppercase">
                  <th className="pb-3 font-semibold">Rank</th>
                  <th className="pb-3 font-semibold">Challenger</th>
                  <th className="pb-3 font-semibold">Tier Division</th>
                  <th className="pb-3 font-semibold">{activeTimeframe === 'all_time' ? 'Career Elo' : 'Season Points'}</th>
                  <th className="pb-3 font-semibold">Win / Loss</th>
                  <th className="pb-3 font-semibold">Win Rate</th>
                  <th className="pb-3 font-semibold">Streak</th>
                  <th className="pb-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEntries.map((entry) => {
                  const isTop3 = entry.rank <= 3;
                  const rankBadgeClass =
                    entry.rank === 1
                      ? 'bg-amber-100 text-amber-800 font-black'
                      : entry.rank === 2
                      ? 'bg-slate-200 text-slate-800 font-black'
                      : entry.rank === 3
                      ? 'bg-amber-700/10 text-amber-800 font-black'
                      : 'text-slate-600 font-mono font-bold';

                  return (
                    <tr
                      key={entry.userId}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      {/* Rank */}
                      <td className="py-3.5 font-mono">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-xl text-xs ${rankBadgeClass}`}>
                          {entry.rank}
                        </span>
                      </td>

                      {/* Challenger Name & Avatar */}
                      <td className="py-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-xs shrink-0">
                            {entry.userName.charAt(0).toUpperCase()}
                          </div>
                          <span className="group-hover:text-blue-600 transition-colors">
                            {entry.userName}
                          </span>
                        </div>
                      </td>

                      {/* Tier Badge */}
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${getTierBadge(entry.rankTier)}`}>
                          {entry.rankTier}
                        </span>
                      </td>

                      {/* Score / Rating */}
                      <td className="py-3.5 font-mono font-black text-sm text-slate-900">
                        {activeTimeframe === 'all_time' ? `${entry.rating} Elo` : `${entry.seasonPoints || entry.rating} Pts`}
                      </td>

                      {/* Win/Loss */}
                      <td className="py-3.5 font-mono text-slate-600">
                        <span className="text-emerald-600 font-bold">{entry.wins}W</span> / <span className="text-rose-600">{entry.losses}L</span>
                      </td>

                      {/* Win Rate with Bar */}
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${entry.winRate}%` }}
                            />
                          </div>
                          <span className="font-mono text-slate-700 font-bold">{entry.winRate}%</span>
                        </div>
                      </td>

                      {/* Streak */}
                      <td className="py-3.5 font-mono">
                        {entry.currentStreak && entry.currentStreak > 0 ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-[11px]">
                            <Flame size={12} className="fill-amber-500 text-amber-500" />
                            <span>{entry.currentStreak}x</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => navigate('/challenges/match/quick-match')}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Swords size={12} />
                          <span>Duel</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </Card>

      </div>
    </div>
  );
}
