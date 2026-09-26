// ═══════════════════════════════════════════════════════════════
// RU Ready? — Online Challenges Hub (/challenges)
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { challengesApi, type ChallengeRoom, type ChallengeUserStats, type LeaderboardEntry } from '../../api/challenges';
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
  const [topLeaderboard, setTopLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      const res = await challengesApi.getHubOverview(user?.id);
      if (res.success && res.data) {
        if (res.data.userStats) setStats(res.data.userStats);
        if (res.data.publicRooms) setPublicRooms(res.data.publicRooms);
        if (res.data.topLeaderboard) setTopLeaderboard(res.data.topLeaderboard);
      }
    } catch (err: any) {
      console.error('Failed to load challenges overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHubData();
  }, [user]);

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 font-sans">
      {/* Top Banner Header */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Swords size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">Online Challenges</h1>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-200 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  LIVE ARENA
                </span>
              </div>
              <p className="text-xs text-slate-500">Real-time 1v1 DSA battles, multiplayer contests & technical quizzes</p>
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
                className="absolute right-1 text-slate-400 hover:text-blue-600 disabled:opacity-30 p-1"
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
              <span className="text-[11px] font-bold text-blue-100 uppercase tracking-wider">Global Rankings</span>
              <div className="text-base font-bold text-white mt-1 flex items-center gap-1">
                <span>View Leaderboard</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white">
              <Zap size={20} />
            </div>
          </div>
        </div>

        {/* 3 Main Battle Modes Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3.5 flex items-center gap-2">
            <Sparkles size={16} className="text-blue-600" />
            <span>Select Competition Mode</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. 1v1 Ranked DSA Battle */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Swords size={26} />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200/60 font-mono">
                    RANKED ELO
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">1v1 DSA Battle</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Real-time head-to-head algorithm duel. Solve the problem, pass hidden test cases, and climb the Elo ladder.
                </p>

                {/* Quick Difficulty Pills */}
                <div className="mt-5 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Select Difficulty:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['EASY', 'MEDIUM', 'HARD'] as const).map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => handleStartQuickMatch(diff)}
                        className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                          diff === 'EASY'
                            ? 'border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100'
                            : diff === 'MEDIUM'
                            ? 'border-amber-200 text-amber-700 bg-amber-50/50 hover:bg-amber-100'
                            : 'border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleStartQuickMatch('MEDIUM')}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <Zap size={15} />
                  <span>Find Ranked Match (1v1)</span>
                </button>
              </div>
            </div>

            {/* 2. Multiplayer Coding Arena */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Code2 size={26} />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200/60 font-mono">
                    3 - 10 PLAYERS
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">Coding Contest Arena</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Compete with friends or study groups in custom multiplayer DSA tournaments with live progress leaderboards.
                </p>

                <div className="mt-5 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100/80 text-indigo-900 text-xs flex items-center gap-2.5">
                  <Users size={16} className="text-indigo-600 shrink-0" />
                  <span>Invite friends via 6-character room codes or private direct links.</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setRoomType('CONTEST');
                    setCreateModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Host Coding Contest</span>
                </button>
              </div>
            </div>

            {/* 3. Multiplayer Technical Quiz Arena */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <HelpCircle size={26} />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60 font-mono">
                    TIMED MCQs
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">Technical Quiz Arena</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fast-paced synchronized multiple-choice quiz covering DSA, OS, DBMS, Networks, and System Design.
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {['DSA', 'OS', 'DBMS', 'Networks', 'OOP', 'System Design'].map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate('/challenges/quizzes')}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <Zap size={15} />
                  <span>Enter Quiz Arena</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Active Public Rooms & Global Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Active Public Rooms (2 Columns) */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Globe size={16} className="text-blue-600" />
                <span>Live Public Rooms ({publicRooms.length})</span>
              </h3>
              <button
                onClick={loadHubData}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Refresh
              </button>
            </div>

            {publicRooms.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                  <Swords size={20} />
                </div>
                <h4 className="text-sm font-bold text-slate-700">No active public rooms right now</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Create your own challenge room or queue up for a 1v1 matchmaking battle above!
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
                {publicRooms.map((room) => (
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

          {/* Top Leaderboard Snippet (1 Column) */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Trophy size={16} className="text-amber-500" />
                <span>Top Elo Leaders</span>
              </h3>
              <button
                onClick={() => navigate('/challenges/leaderboard')}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            {topLeaderboard.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 text-center shadow-xs">
                <Trophy size={24} className="text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No ranked matches yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Play your first 1v1 battle to set your Elo rank!</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
                {topLeaderboard.slice(0, 5).map((entry, idx) => (
                  <div key={entry.userId} className="p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-3">
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
                        <div className="text-xs font-bold text-slate-900">{entry.userName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {entry.wins}W - {entry.losses}L ({entry.winRate}%)
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-slate-900 font-mono">{entry.rating}</div>
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
