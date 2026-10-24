// ═══════════════════════════════════════════════════════════════
// RU Ready? — Gamified Online Challenges Hub (/challenges)
// Production DSA 1v1 Overhaul: Real Matchmaking, Direct Invites & History
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
  Plus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Clock,
  Loader2,
  X,
  ChevronRight,
  UserPlus,
  Send,
  CheckCircle2,
  XCircle,
  History,
  RotateCcw,
  Globe,
  Bug,
  HelpCircle,
  Layout,
  Calendar,
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
  type ChallengeInvitation,
  type MatchHistoryItem,
} from '../../api/challenges';
import { useChallengesSocket } from '../../hooks/useChallengesSocket';

export default function OnlineChallengesHub() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const socket = useChallengesSocket();

  // User Stats & History
  const [stats, setStats] = useState<ChallengeUserStats>({
    userId: user?.id || 'usr_guest',
    rating: 1200,
    wins: 0,
    losses: 0,
    matchesPlayed: 0,
    winRate: 0,
    rankTier: 'BRONZE',
  });
  const [matchHistory, setMatchHistory] = useState<MatchHistoryItem[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<ChallengeInvitation[]>([]);
  const [publicRooms, setPublicRooms] = useState<ChallengeRoom[]>([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [seasonMeta, setSeasonMeta] = useState<LeaderboardPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'arena' | 'history' | 'lobbies' | 'leaderboard'>('arena');
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'weekly' | 'monthly' | 'all_time'>('weekly');
  const [roomFilter, setRoomFilter] = useState<'ALL' | 'BATTLE_1V1' | 'CONTEST' | 'QUIZ'>('ALL');

  // Matchmaking State
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchDifficulty, setSearchDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD' | 'MIXED'>('MEDIUM');
  const [searchTimer, setSearchTimer] = useState<number>(0);

  // Direct 1v1 Invite Modal State
  const [inviteModalOpen, setInviteModalOpen] = useState<boolean>(false);
  const [inviteRecipientId, setInviteRecipientId] = useState<string>('');
  const [inviteDifficulty, setInviteDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD' | 'MIXED'>('MEDIUM');
  const [inviteTopic, setInviteTopic] = useState<string>('DSA');
  const [isSendingInvite, setIsSendingInvite] = useState<boolean>(false);

  // Create Room Modal State
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
      const [hubRes, lbRes, historyRes, invitesRes] = await Promise.all([
        challengesApi.getHubOverview(user?.id),
        challengesApi.getLeaderboard(activeLeaderboardTab, undefined, 5),
        user?.id ? challengesApi.getUserHistory(user.id) : Promise.resolve({ success: true, data: [] }),
        user?.id ? challengesApi.getPendingInvitations(user.id) : Promise.resolve({ success: true, data: [] }),
      ]);

      if (hubRes.success && hubRes.data) {
        if (hubRes.data.userStats) setStats(hubRes.data.userStats);
        if (hubRes.data.publicRooms) setPublicRooms(hubRes.data.publicRooms);
      }

      if (lbRes.success && lbRes.data) {
        setWeeklyLeaderboard(lbRes.data.entries);
        setSeasonMeta(lbRes.data);
      }

      if (historyRes.success && historyRes.data) {
        setMatchHistory(historyRes.data);
      }

      if (invitesRes.success && invitesRes.data) {
        setPendingInvitations(invitesRes.data);
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
    // Match found event from matchmaking
    const unsubMatchFound = socket.on('matchmaking:match_found', (data: any) => {
      setIsSearching(false);
      toast.success('Opponent found! Match starting...', { icon: '⚔️' });
      navigate(`/challenges/match/${data.matchId}`);
    });

    // Direct invitation received
    const unsubInviteReceived = socket.on('invite:received', (inv: ChallengeInvitation) => {
      setPendingInvitations((prev) => [inv, ...prev.filter((item) => item.id !== inv.id)]);
      toast(`⚔️ ${inv.fromUserName} challenged you to a 1v1 duel!`, {
        duration: 8000,
        icon: '⚔️',
      });
    });

    // Invitation accepted (both users redirected to arena)
    const unsubInviteAccepted = socket.on('invite:accepted', (data: any) => {
      toast.success('Duel accepted! Entering arena...', { icon: '🏆' });
      navigate(`/challenges/match/${data.matchId}`);
    });

    // Invitation declined
    const unsubInviteDeclined = socket.on('invite:declined', (data: any) => {
      toast.error('The challenger declined your invitation.');
    });

    // Room update
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
      unsubInviteReceived();
      unsubInviteAccepted();
      unsubInviteDeclined();
      unsubRoomUpdate();
    };
  }, [socket, navigate]);

  // Matchmaking actions
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

  // Send Direct Friend Invitation
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to challenge a friend');
      return;
    }
    const cleanId = inviteRecipientId.trim();
    if (!cleanId) {
      toast.error('Please enter your opponent\'s User ID or handle');
      return;
    }
    if (cleanId === user.id) {
      toast.error('You cannot challenge yourself');
      return;
    }

    try {
      setIsSendingInvite(true);
      const res = await challengesApi.sendInvitation({
        fromUserId: user.id,
        fromUserName: user.name || 'Challenger',
        fromUserAvatar: (user as any).avatarUrl,
        toUserId: cleanId,
        toUserName: cleanId,
        difficulty: inviteDifficulty,
        topic: inviteTopic,
        language: 'all',
      });

      if (res.success && res.data) {
        toast.success(`Challenge sent to ${cleanId}!`, { icon: '⚔️' });
        socket.sendInvite({
          toUserId: cleanId,
          toUserName: cleanId,
          difficulty: inviteDifficulty,
          topic: inviteTopic,
        });
        setInviteModalOpen(false);
        setInviteRecipientId('');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send challenge');
    } finally {
      setIsSendingInvite(false);
    }
  };

  // Accept incoming invite
  const handleAcceptInvite = async (inv: ChallengeInvitation) => {
    if (!user) return;
    try {
      const res = await challengesApi.acceptInvitation(inv.id, {
        userId: user.id,
        userName: user.name || 'Challenger',
        userAvatar: (user as any).avatarUrl,
      });

      if (res.success && res.data?.match) {
        toast.success('Duel accepted! Entering match...', { icon: '⚔️' });
        socket.acceptInvite(inv.id);
        navigate(`/challenges/match/${res.data.match.id}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to accept invitation');
    }
  };

  // Decline incoming invite
  const handleDeclineInvite = async (inv: ChallengeInvitation) => {
    if (!user) return;
    try {
      await challengesApi.declineInvitation(inv.id, user.id);
      socket.declineInvite(inv.id);
      setPendingInvitations((prev) => prev.filter((item) => item.id !== inv.id));
      toast('Challenge declined');
    } catch (err: any) {
      toast.error('Failed to decline invitation');
    }
  };

  // Create room
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

  // Join by code
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
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">DSA 1v1 Challenge Arena</h1>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-200 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  LIVE COMPETITIVE
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Authoritative real-time algorithmic battles with hidden test execution & synchronized Elo ranking
              </p>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-3">
            {/* Join Code Input Form */}
            <form onSubmit={handleJoinByCode} className="relative flex items-center">
              <input
                type="text"
                placeholder="Enter room code..."
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                maxLength={8}
                className="w-36 sm:w-44 pl-3 pr-8 py-1.5 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all uppercase placeholder:normal-case placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
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
              onClick={() => setInviteModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <UserPlus size={14} />
              <span>Invite Friend</span>
            </button>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Create Lobby</span>
            </button>
          </div>
        </div>
      </div>

      {/* Incoming Invitations Banner (if any) */}
      <AnimatePresence>
        {pendingInvitations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-50 border-b border-amber-200"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2">
              {pendingInvitations.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white rounded-xl p-3 border border-amber-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                      ⚔️
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        <span className="text-blue-600">{inv.fromUserName}</span> ({inv.fromUserRating} Elo) challenged you to a 1v1 duel!
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold uppercase text-amber-700">Difficulty: {inv.difficulty}</span>
                        <span>•</span>
                        <span>Topic: {inv.topic}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-400">5-min countdown</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleAcceptInvite(inv)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                    >
                      <CheckCircle2 size={13} />
                      <span>Accept Challenge</span>
                    </button>
                    <button
                      onClick={() => handleDeclineInvite(inv)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <span className="text-xs text-slate-400 font-medium">/ {stats.matchesPlayed} battles</span>
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
                <span className="text-[10px] text-emerald-600 font-bold">
                  {stats.matchesPlayed > 0 ? '● Active' : '○ Provisional'}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Flame size={20} />
            </div>
          </div>

          {/* Leaderboard Shortcut */}
          <div
            onClick={() => setActiveTab('leaderboard')}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-md shadow-blue-600/15 flex items-center justify-between cursor-pointer hover:opacity-95 transition-all group"
          >
            <div>
              <span className="text-[11px] font-bold text-blue-100 uppercase tracking-wider">Leaderboards</span>
              <div className="text-sm font-bold text-white mt-1 flex items-center gap-1">
                <span>View Global Ranks</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white">
              <Zap size={20} />
            </div>
          </div>
        </div>

        {/* Primary Matchmaking & Challenge Action Center */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Swords size={18} className="text-blue-600" />
                <span>Instant 1v1 Competitive Matchmaking</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Queue up with a single click. Our matchmaking algorithm pairs you with real opponents in your rating range.
              </p>
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Difficulty:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {(['EASY', 'MEDIUM', 'HARD', 'MIXED'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSearchDifficulty(diff)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      searchDifficulty === diff
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => handleStartQuickMatch(searchDifficulty)}
              disabled={isSearching}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Swords size={16} />
              <span>Find 1v1 Opponent ({searchDifficulty})</span>
            </button>

            <button
              onClick={() => setInviteModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <UserPlus size={16} />
              <span>Direct Friend Challenge</span>
            </button>

            <div className="sm:ml-auto text-xs text-slate-400 font-medium">
              Queue Status: <span className="font-bold text-slate-700">{isSearching ? 'Searching...' : 'Ready'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs: Arena History, Public Lobbies, Full Leaderboard */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('arena')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'arena'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Swords size={14} />
            <span>Challenge Modes</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History size={14} />
            <span>Recent Battles ({matchHistory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('lobbies')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'lobbies'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe size={14} />
            <span>Public Lobbies ({publicRooms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Trophy size={14} />
            <span>Top Challengers</span>
          </button>
        </div>

        {/* TAB 1: 5 GAMIFIED ARENA FORMATS */}
        {activeTab === 'arena' && (
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

              <div className="mt-4 pt-3 border-t border-slate-100">
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
        )}

        {/* TAB 2: PERSISTED MATCH HISTORY (100% REAL DB RECORDS) */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your 1v1 Battle History</h3>
                <p className="text-xs text-slate-500">Persisted match results, opponent Elo, and rating adjustments</p>
              </div>
              <button
                onClick={loadHubData}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="Refresh history"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {matchHistory.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <History size={22} />
                </div>
                <h4 className="text-sm font-bold text-slate-700">No battle records yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Queue up for a 1v1 duel or invite a friend above to start building your competitive record!
                </p>
                <button
                  onClick={() => handleStartQuickMatch('MEDIUM')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Play First Match
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-3 px-3">Result</th>
                      <th className="py-3 px-3">Problem</th>
                      <th className="py-3 px-3">Opponent</th>
                      <th className="py-3 px-3">Tests Passed</th>
                      <th className="py-3 px-3">Rating Change</th>
                      <th className="py-3 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {matchHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                              item.result === 'WIN'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                : item.result === 'LOSS'
                                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                : 'bg-blue-50 text-blue-600 border border-blue-200'
                            }`}
                          >
                            {item.result === 'WIN' ? 'VICTORY' : item.result === 'LOSS' ? 'DEFEAT' : 'TIED'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          <div>{item.problemTitle}</div>
                          <span className="text-[10px] text-slate-400 font-mono">{item.difficulty}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-800">{item.opponent?.userName || 'Opponent'}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{item.opponent?.rating || 1200} Elo</div>
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                          {item.passedTests} / {item.totalTests}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold">
                          <span className={item.ratingDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                            {item.ratingDelta >= 0 ? `+${item.ratingDelta}` : item.ratingDelta}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => navigate(`/challenges/match/${item.matchId}`)}
                            className="text-blue-600 hover:text-blue-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <span>Review</span>
                            <ChevronRight size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PUBLIC LOBBIES */}
        {activeTab === 'lobbies' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Globe size={16} className="text-blue-600" />
                <span>Active Public Lobbies ({filteredRooms.length})</span>
              </h3>

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
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                  <Swords size={20} />
                </div>
                <h4 className="text-sm font-bold text-slate-700">No open lobbies found</h4>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => {
                      if (room.type === 'QUIZ') navigate(`/challenges/quiz/${room.id}`);
                      else navigate(`/challenges/room/${room.id}`);
                    }}
                    className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
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
        )}

        {/* TAB 4: GLOBAL LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Competitive Leaderboard</h3>
                <p className="text-xs text-slate-500">Official ranking computed from authoritative Elo match results</p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {(['weekly', 'monthly', 'all_time'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveLeaderboardTab(tab)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all uppercase font-mono cursor-pointer ${
                      activeLeaderboardTab === tab
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab === 'weekly' ? 'Weekly' : tab === 'monthly' ? 'Monthly' : 'All-Time'}
                  </button>
                ))}
              </div>
            </div>

            {weeklyLeaderboard.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No challengers ranked for this timeframe yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {weeklyLeaderboard.map((entry, idx) => (
                  <div key={entry.userId} className="py-3 px-2 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black font-mono ${
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
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{entry.userName}</span>
                          {entry.currentStreak && entry.currentStreak > 1 && (
                            <span className="text-[10px] font-black text-amber-600 font-mono">
                              🔥{entry.currentStreak} streak
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {entry.wins}W - {entry.losses}L ({entry.winRate}% win rate)
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900 font-mono">
                        {entry.seasonPoints ? `${entry.seasonPoints} pts` : entry.rating} Elo
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${getTierColor(entry.rankTier)}`}>
                        {entry.rankTier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
              <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-blue-500/15 animate-pulse" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Swords size={28} className="animate-bounce" />
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-1">Searching for Opponent...</h3>
              <p className="text-xs text-slate-500 mb-4">
                Expanding search range: <span className="font-bold text-slate-700">±100 → ±500 Elo</span>
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold mb-6">
                <Clock size={14} className="text-blue-600 animate-spin" />
                <span>Elapsed: {searchTimer}s</span>
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
          INVITE FRIEND MODAL (DIRECT 1V1 DUEL)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {inviteModalOpen && (
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
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus size={18} className="text-blue-600" />
                  <span>Challenge a Friend (1v1 Duel)</span>
                </h3>
                <button
                  onClick={() => setInviteModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSendInvite} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Opponent User ID or Handle
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. usr_123 or friend handle"
                    value={inviteRecipientId}
                    onChange={(e) => setInviteRecipientId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Your opponent will receive a real-time prompt with a 5-minute window to accept.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
                    <select
                      value={inviteDifficulty}
                      onChange={(e: any) => setInviteDifficulty(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                      <option value="MIXED">Mixed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Problem Topic</label>
                    <select
                      value={inviteTopic}
                      onChange={(e) => setInviteTopic(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    >
                      <option value="DSA">Data Structures & Algorithms</option>
                      <option value="Arrays & HashMaps">Arrays & HashMaps</option>
                      <option value="Dynamic Programming">Dynamic Programming</option>
                      <option value="Graphs & Trees">Graphs & Trees</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setInviteModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingInvite || !inviteRecipientId.trim()}
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSendingInvite ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    <span>Send Challenge</span>
                  </button>
                </div>
              </form>
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
                <h3 className="text-base font-bold text-slate-900">Create Challenge Lobby</h3>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateRoom} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lobby Title</label>
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
                    <span>Create & Launch Lobby</span>
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
