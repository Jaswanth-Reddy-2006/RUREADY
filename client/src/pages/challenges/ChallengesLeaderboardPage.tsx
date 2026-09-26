// ═══════════════════════════════════════════════════════════════
// RU Ready? — Challenges Elo Leaderboard (/challenges/leaderboard)
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Loader2,
} from 'lucide-react';
import { challengesApi, type LeaderboardEntry } from '../../api/challenges';

export default function ChallengesLeaderboardPage() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const res = await challengesApi.getLeaderboard(50);
        if (res.success && res.data) {
          setLeaderboard(res.data);
        }
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const filteredLeaderboard = leaderboard.filter((entry) =>
    entry.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'GRANDMASTER':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'DIAMOND':
        return 'text-cyan-600 bg-cyan-50 border-cyan-200';
      case 'PLATINUM':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'GOLD':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'SILVER':
        return 'text-slate-600 bg-slate-100 border-slate-200';
      default:
        return 'text-amber-700 bg-amber-50 border-amber-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/challenges')}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Challenges Hub</span>
          </button>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Trophy size={18} />
            </div>
            <h1 className="text-xl font-black text-slate-900">Global Elo Leaderboard</h1>
          </div>
          <p className="text-xs text-slate-500">
            Top competitive programmers ranked by official Elo rating across 1v1 battles and contest tournaments.
          </p>
        </div>

        {/* Top 3 Podium Cards */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Rank 2 - Silver */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col items-center text-center order-2 md:order-1 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-lg mb-2">
                <Medal size={24} className="text-slate-400" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase font-mono">
                Rank #2
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-2">{leaderboard[1].userName}</h3>
              <div className="text-xl font-black text-slate-900 font-mono mt-1">{leaderboard[1].rating} Elo</div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md mt-2 ${getTierColor(leaderboard[1].rankTier)}`}>
                {leaderboard[1].rankTier}
              </span>
            </div>

            {/* Rank 1 - Gold (Champion) */}
            <div className="bg-gradient-to-b from-amber-500/10 to-white rounded-3xl p-6 border-2 border-amber-300 shadow-md flex flex-col items-center text-center order-1 md:order-2 relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center font-black text-xl mb-2 shadow-md shadow-amber-500/30">
                <Crown size={28} />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 uppercase font-mono">
                Rank #1 Champion
              </span>
              <h3 className="text-base font-black text-slate-900 mt-2">{leaderboard[0].userName}</h3>
              <div className="text-2xl font-black text-amber-600 font-mono mt-1">{leaderboard[0].rating} Elo</div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md mt-2 ${getTierColor(leaderboard[0].rankTier)}`}>
                {leaderboard[0].rankTier}
              </span>
            </div>

            {/* Rank 3 - Bronze */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col items-center text-center order-3 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-amber-700/10 text-amber-800 flex items-center justify-center font-black text-lg mb-2">
                <Medal size={24} className="text-amber-700" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 uppercase font-mono">
                Rank #3
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-2">{leaderboard[2].userName}</h3>
              <div className="text-xl font-black text-slate-900 font-mono mt-1">{leaderboard[2].rating} Elo</div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md mt-2 ${getTierColor(leaderboard[2].rankTier)}`}>
                {leaderboard[2].rankTier}
              </span>
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search challengers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Rankings Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 size={28} className="animate-spin text-blue-600 mx-auto" />
            </div>
          ) : filteredLeaderboard.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">No players found matching your search.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              <div className="px-6 py-3 bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider grid grid-cols-12">
                <div className="col-span-2 sm:col-span-1">Rank</div>
                <div className="col-span-6 sm:col-span-5">Challenger</div>
                <div className="col-span-2 text-center hidden sm:block">Record</div>
                <div className="col-span-2 text-center hidden sm:block">Win Rate</div>
                <div className="col-span-4 sm:col-span-2 text-right">Rating</div>
              </div>

              {filteredLeaderboard.map((entry, idx) => (
                <div
                  key={entry.userId}
                  className="px-6 py-4 grid grid-cols-12 items-center hover:bg-slate-50/80 transition-colors text-xs"
                >
                  <div className="col-span-2 sm:col-span-1 font-mono font-black text-slate-700">#{idx + 1}</div>

                  <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      {entry.userName[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{entry.userName}</div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${getTierColor(entry.rankTier)}`}>
                        {entry.rankTier}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 text-center font-mono font-medium text-slate-600 hidden sm:block">
                    {entry.wins}W - {entry.losses}L
                  </div>

                  <div className="col-span-2 text-center font-mono font-bold text-emerald-600 hidden sm:block">
                    {entry.winRate}%
                  </div>

                  <div className="col-span-4 sm:col-span-2 text-right font-mono font-black text-slate-900 text-sm">
                    {entry.rating}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
