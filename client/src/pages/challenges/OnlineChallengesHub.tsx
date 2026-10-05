// ═══════════════════════════════════════════════════════════════
// RU Ready? — Gamified Online Challenges Hub (/challenges)
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Swords,
  Trophy,
  Zap,
  Users,
  Flame,
  Code2,
  HelpCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  Lock,
  Globe,
  CheckCircle2,
  Clock,
  Loader2,
  X,
  ChevronRight,
  Bug,
  Layout,
  Calendar,
  TrendingUp,
  Award,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import {
  challengesApi,
  type ChallengeRoom,
  type ChallengeUserStats,
  type LeaderboardEntry,
  type LeaderboardPayload,
} from '../../api/challenges';
import { useChallengesSocket } from '../../hooks/useChallengesSocket';

export default function OnlineChallengesHub() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const socket = useChallengesSocket();

  // State
  const [stats, setStats] = useState<ChallengeUserStats>({
    userId: user?.id || 'usr_guest',
    rating: 1200,
    wins: 0,
    losses: 0,
    matchesPlayed: 0,
    winRate: 0,
    rankTier: 'BRONZE',
  });
  const [publicRooms, setPublicRooms] = useState<ChallengeRoom[]>([]);
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'weekly' | 'monthly' | 'all_time'>('weekly');
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [seasonMeta, setSeasonMeta] = useState<LeaderboardPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [roomFilter, setRoomFilter] = useState<'ALL' | 'BATTLE_1V1' | 'CONTEST' | 'QUIZ'>('ALL');

  // Matchmaking modal state
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchDifficulty, setSearchDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD' | 'MIXED'>('MEDIUM');
  const [searchTimer, setSearchTimer] = useState<number>(0);

  // Create Room modal
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [roomTitle, setRoomTitle] = useState<string>('');
  const [roomType, setRoomType] = useState<'BATTLE_1V1' | 'CONTEST' | 'QUIZ'>('BATTLE_1V1');
  const [roomDifficulty, setRoomDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD' | 'MIXED'>('MEDIUM');
  const [roomTopic, setRoomTopic] = useState<string>('DSA');
  const [roomVisibility, setRoomVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [roomDuration, setRoomDuration] = useState<number>(30);
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);

  // Join by code
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [isJoiningCode, setIsJoiningCode] = useState<boolean>(false);

  // Fetch initial hub data
  const loadHubData = async () => {
    try {
      setIsLoading(true);
      const [hubRes, lbRes] = await Promise.all([
        challengesApi.getHubOverview(user?.id),
        challengesApi.getLeaderboard(activeLeaderboardTab, undefined, 5),
      ]);

      if (hubRes.success && hubRes.data) {
        if (hubRes.data.userStats) setStats(hubRes.data.userStats);
        if (hubRes.data.publicRooms) setPublicRooms(hubRes.data.publicRooms);
      }

      if (lbRes.success && lbRes.data) {
        setWeeklyLeaderboard(lbRes.data.entries);
        setSeasonMeta(lbRes.data);
      }
    } catch (err: any) {
      console.error('Failed to load challenges overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHubData();
  }, [user, activeLeaderboardTab]);

  // Matchmaking timer
  useEffect(() => {
    let interval: any;
    if (isSearching) {
      interval = setInterval(() => {
        setSearchTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setSearchTimer(0);
    }
    return () => clearInterval(interval);
  }, [isSearching]);

  // Socket event listeners
  useEffect(() => {
    const unsubMatchFound = socket.on('matchmaking:match_found', (data: any) => {
      setIsSearching(false);
      toast.success(`Opponent found! Match starting...`, { icon: '⚔️' });
      navigate(`/challenges/match/${data.matchId}`);
    });

    const unsubRoomUpdate = socket.on('room:updated', (updatedRoom: ChallengeRoom) => {
      setPublicRooms((prev) => {
        const idx = prev.findIndex((r) => r.id === updatedRoom.id);
        if (idx !== -1) {
          const clone = [...prev];
          clone[idx] = updatedRoom;
          return clone;
        }
        return [updatedRoom, ...prev];
      });
    });

    return () => {
      unsubMatchFound();
      unsubRoomUpdate();
    };
  }, [socket, navigate]);

  // Actions
  const handleStartQuickMatch = (difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED' = 'MEDIUM') => {
    setSearchDifficulty(difficulty);
    setIsSearching(true);
    socket.joinMatchmaking({
      difficulty,
      topic: 'DSA',
      language: 'all',
    });
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    socket.leaveMatchmaking();
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to create a room');
      return;
    }
    try {
      setIsCreatingRoom(true);
      const res = await challengesApi.createRoom({
        hostId: user.id,
        hostName: user.name || 'Player 1',
        hostAvatar: (user as any).avatarUrl,
        title: roomTitle || `${user.name || 'Student'}'s Arena`,
        type: roomType,
        visibility: roomVisibility,
        difficulty: roomDifficulty,
        topic: roomTopic,
        durationMinutes: roomDuration,
      });

      if (res.success && res.data) {
        toast.success(`Room created! Code: ${res.data.roomCode}`);
        setCreateModalOpen(false);
        if (roomType === 'QUIZ') {
          navigate(`/challenges/quiz/${res.data.id}`);
        } else {
          navigate(`/challenges/room/${res.data.id}`);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create room');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = joinCodeInput.trim().toUpperCase();
    if (!cleanCode || cleanCode.length < 4) {
      toast.error('Please enter a valid 6-character room code');
      return;
    }

    try {
      setIsJoiningCode(true);
      const res = await challengesApi.getRoom(cleanCode);
      if (res.success && res.data) {
        if (res.data.type === 'QUIZ') {
          navigate(`/challenges/quiz/${res.data.id}`);
        } else {
          navigate(`/challenges/room/${res.data.id}`);
        }
      } else {
        toast.error('Room not found or expired');
      }
    } catch (err: any) {
      toast.error('Room not found. Check the code and try again.');
    } finally {
      setIsJoiningCode(false);
    }
  };

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

  const filteredRooms = publicRooms.filter((r) => {
    if (roomFilter === 'ALL') return true;
    return r.type === roomFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 font-sans">
      {/* Top Banner Header */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Swords size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">Online Challenges Arena</h1>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-200 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  LIVE COMPETITION
                </span>
              </div>
              <p className="text-xs text-slate-500">Real-time 1v1 DSA duels, speed coding, bug hunts & technical quiz battles</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {/* Join Code Input Form */}
            <form onSubmit={handleJoinByCode} className="relative flex items-center">
              <input
                type="text"
                placeholder="Enter 6-char code..."
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                maxLength={8}
                className="w-40 sm:w-48 pl-3 pr-8 py-1.5 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all uppercase placeholder:normal-case placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={isJoiningCode || !joinCodeInput}
                className="absolute right-1 text-slate-400 hover:text-blue-600 disabled:opacity-30 p-1 cursor-pointer"
                title="Join room"
              >
                {isJoiningCode ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
              </button>
            </form>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Create Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gamified Weekly Season & Streak Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border-b border-indigo-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Flame size={26} className="animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-300 uppercase tracking-widest font-mono">
                    {seasonMeta?.seasonLabel || 'WEEKLY SPRINT SEASON'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-800/80 text-indigo-200 text-[10px] font-bold border border-indigo-700 font-mono">
                    TIER AWARDS ACTIVE
                  </span>
                </div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Climb the Weekly Ladder — Win Badges & Score Streak Multipliers
                </h2>
              </div>
            </div>

            {/* Streak Multiplier & Leaderboard Shortcut */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 text-center">
                <span className="text-[10px] uppercase font-bold text-indigo-200 block">Streak Bonus</span>
                <span className="text-xs font-black text-amber-300 font-mono">🔥 1.5× Multiplier</span>
              </div>
              <button
                onClick={() => navigate('/challenges/leaderboard')}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trophy size={14} />
                <span>Full Leaderboards</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* User Stats Command Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Rating & Tier */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Elo Rating</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900 font-mono">{stats.rating}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase ${getTierColor(stats.rankTier)}`}>
                  {stats.rankTier}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Trophy size={20} />
            </div>
          </div>

          {/* Battles Won */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Battles Won</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-600 font-mono">{stats.wins}</span>
                <span className="text-xs text-slate-400 font-medium">/ {stats.matchesPlayed} played</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck size={20} />
            </div>
          </div>

          {/* Win Rate */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Win Rate</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-black text-slate-900 font-mono">{stats.winRate}%</span>
                <span className="text-[10px] text-emerald-600 font-bold">● Active</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Flame size={20} />
            </div>
          </div>

          {/* Leaderboard CTA */}
          <div
            onClick={() => navigate('/challenges/leaderboard')}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-md shadow-blue-600/15 flex items-center justify-between cursor-pointer hover:opacity-95 transition-all group"
          >
            <div>
              <span className="text-[11px] font-bold text-blue-100 uppercase tracking-wider">Rankings Hub</span>
              <div className="text-sm font-bold text-white mt-1 flex items-center gap-1">
                <span>Weekly & Monthly</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white">
              <Zap size={20} />
            </div>
          </div>
        </div>

        {/* 5 Gamified Challenge Game Modes */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-blue-600" />
              <span>Select Challenge Mode</span>
            </h2>
            <span className="text-xs font-semibold text-slate-400">5 Live Arena Formats</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* 1. 1v1 Code Duel */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all p-5 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Swords size={20} />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-50 text-blue-600 border border-blue-200/60 font-mono">
                    1V1 ELO
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 mb-1">1v1 Code Duel</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Real-time head-to-head algorithm duel. Solve DSA problems and pass test cases first.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={() => handleStartQuickMatch('MEDIUM')}
                  className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Zap size={13} />
                  <span>Find Duel</span>
                </button>
              </div>
            </div>

            {/* 2. Multiplayer Quiz Royale */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all p-5 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <HelpCircle size={20} />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-50 text-amber-600 border border-amber-200/60 font-mono">
                    QUIZ ROYALE
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 mb-1">Quiz Royale</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Fast-paced synchronized MCQs covering OS, DBMS, Networks, and DSA theory.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate('/challenges/quizzes')}
                  className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Zap size={13} />
                  <span>Play Quiz</span>
                </button>
              </div>
            </div>

            {/* 3. Speed Bug Hunter */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all p-5 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Bug size={20} />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-50 text-rose-600 border border-rose-200/60 font-mono">
                    DEBUG SPEED
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 mb-1">Speed Bug Hunter</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Spot memory leaks, off-by-one errors, and async bugs against a ticking clock.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleStartQuickMatch('HARD')}
                  className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Bug size={13} />
                  <span>Hunt Bugs</span>
                </button>
              </div>
            </div>

            {/* 4. Architecture Sprint */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all p-5 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Layout size={20} />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-50 text-indigo-600 border border-indigo-200/60 font-mono">
                    SYS DESIGN
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 mb-1">Architecture Sprint</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Rapid system design scenarios: rate limiting, caching tiers, and microservice scale.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setRoomType('CONTEST');
                    setRoomTopic('SYSTEM_DESIGN');
                    setCreateModalOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Host Sprint</span>
                </button>
              </div>
            </div>

            {/* 5. Daily Algo Sprint */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all p-5 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Calendar size={20} />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200/60 font-mono">
                    DAILY 2× XP
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 mb-1">Daily Algo Sprint</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Solve today's featured puzzle to protect your streak and score 2× leaderboard points.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleStartQuickMatch('EASY')}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Flame size={13} />
                  <span>Daily Puzzle</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Active Public Rooms & Leaderboard Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Active Public Rooms (2 Columns) */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Globe size={16} className="text-blue-600" />
                <span>Live Public Lobbies ({filteredRooms.length})</span>
              </h3>

              {/* Lobby Type Filter Pills */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {(['ALL', 'BATTLE_1V1', 'CONTEST', 'QUIZ'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setRoomFilter(filter)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      roomFilter === filter
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {filter === 'ALL' ? 'All' : filter === 'BATTLE_1V1' ? '1v1' : filter === 'CONTEST' ? 'Contest' : 'Quiz'}
                  </button>
                ))}
              </div>
            </div>

            {filteredRooms.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                  <Swords size={20} />
                </div>
                <h4 className="text-sm font-bold text-slate-700">No open lobbies in this category</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Host your own room or queue up for instant 1v1 matchmaking above!
                </p>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Create New Room
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => {
                      if (room.type === 'QUIZ') navigate(`/challenges/quiz/${room.id}`);
                      else navigate(`/challenges/room/${room.id}`);
                    }}
                    className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono uppercase">
                          {room.roomCode}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            room.difficulty === 'EASY'
                              ? 'bg-emerald-50 text-emerald-700'
                              : room.difficulty === 'HARD'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {room.difficulty}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {room.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Host: {room.hostName || 'Challenger'}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1 font-semibold">
                        <Users size={13} className="text-slate-400" />
                        <span>
                          {room.participants?.length || 1} / {room.maxParticipants}
                        </span>
                      </div>
                      <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Join Battle <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mini Weekly Leaderboard Widget (1 Column) */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {(['weekly', 'monthly', 'all_time'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveLeaderboardTab(tab)}
                    className={`px-2 py-0.5 text-[10px] font-black rounded-lg transition-all uppercase font-mono cursor-pointer ${
                      activeLeaderboardTab === tab
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab === 'weekly' ? 'Weekly' : tab === 'monthly' ? 'Monthly' : 'All-Time'}
                  </button>
                ))}
              </div>
              <button
                onClick={() => navigate('/challenges/leaderboard')}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>View Full</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {weeklyLeaderboard.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 text-center shadow-xs">
                <Trophy size={24} className="text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No ranked matches in this timeframe</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Play a duel to claim the #1 rank!</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
                {weeklyLeaderboard.slice(0, 5).map((entry, idx) => (
                  <div key={entry.userId} className="p-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black font-mono ${
                          idx === 0
                            ? 'bg-amber-100 text-amber-700'
                            : idx === 1
                            ? 'bg-slate-200 text-slate-700'
                            : idx === 2
                            ? 'bg-amber-700/15 text-amber-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <span>{entry.userName}</span>
                          {entry.currentStreak && entry.currentStreak > 1 && (
                            <span className="text-[10px] font-black text-amber-600 font-mono">
                              🔥{entry.currentStreak}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {entry.wins}W - {entry.losses}L ({entry.winRate}%)
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-slate-900 font-mono">
                        {entry.seasonPoints ? `${entry.seasonPoints} pts` : entry.rating}
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${getTierColor(entry.rankTier)}`}>
                        {entry.rankTier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MATCHMAKING RADAR MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100 relative"
            >
              {/* Animated Radar Graphic */}
              <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-blue-500/15 animate-pulse" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Swords size={28} className="animate-bounce" />
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-1">Searching for Opponent...</h3>
              <p className="text-xs text-slate-500 mb-4">
                Matching with candidates in rating range: <span className="font-bold text-slate-700">±100 - ±500</span>
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold mb-6">
                <Clock size={14} className="text-blue-600 animate-spin" />
                <span>Time elapsed: {searchTimer}s</span>
              </div>

              <div className="flex justify-center gap-2 text-[11px] font-bold text-slate-400 mb-6 uppercase">
                <span>Tier: {stats.rankTier}</span>
                <span>•</span>
                <span>Diff: {searchDifficulty}</span>
              </div>

              <button
                type="button"
                onClick={handleCancelSearch}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel Search
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          CREATE ROOM MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {createModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Create Challenge Room</h3>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateRoom} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Room Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google Mock DSA Battle"
                    value={roomTitle}
                    onChange={(e) => setRoomTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mode</label>
                    <select
                      value={roomType}
                      onChange={(e: any) => setRoomType(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    >
                      <option value="BATTLE_1V1">1v1 DSA Battle</option>
                      <option value="CONTEST">Coding Contest (Multiplayer)</option>
                      <option value="QUIZ">Technical Quiz Arena</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
                    <select
                      value={roomDifficulty}
                      onChange={(e: any) => setRoomDifficulty(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                      <option value="MIXED">Mixed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Visibility</label>
                    <select
                      value={roomVisibility}
                      onChange={(e: any) => setRoomVisibility(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    >
                      <option value="PUBLIC">Public (Listed)</option>
                      <option value="PRIVATE">Private (Invite Only)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Mins)</label>
                    <input
                      type="number"
                      min={10}
                      max={90}
                      value={roomDuration}
                      onChange={(e) => setRoomDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingRoom}
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer flex items-center gap-2"
                  >
                    {isCreatingRoom && <Loader2 size={14} className="animate-spin" />}
                    <span>Create & Launch Room</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
