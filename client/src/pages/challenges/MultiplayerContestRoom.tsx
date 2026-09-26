// ═══════════════════════════════════════════════════════════════
// RU Ready? — Multiplayer Contest Room (/challenges/room/:roomId)
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Copy,
  Check,
  Play,
  Shield,
  Clock,
  ArrowLeft,
  Crown,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { challengesApi, type ChallengeRoom } from '../../api/challenges';
import { useChallengesSocket } from '../../hooks/useChallengesSocket';

export default function MultiplayerContestRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const socket = useChallengesSocket();

  const [room, setRoom] = useState<ChallengeRoom | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!roomId) return;

    const fetchRoom = async () => {
      try {
        setIsLoading(true);
        const res = await challengesApi.getRoom(roomId);
        if (res.success && res.data) {
          setRoom(res.data);
          // If match is already in progress, redirect to match
          if (res.data.activeMatchId) {
            navigate(`/challenges/match/${res.data.activeMatchId}`);
          }
        }
      } catch (err: any) {
        toast.error('Failed to load room details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, navigate]);

  useEffect(() => {
    if (!roomId || !user) return;

    socket.joinRoom(roomId);

    const unsubRoomUpdate = socket.on('room:updated', (updatedRoom: ChallengeRoom) => {
      setRoom(updatedRoom);
    });

    const unsubMatchStarted = socket.on('room:match_started', (data: { matchId: string }) => {
      toast.success('Contest started! Entering arena...', { icon: '🚀' });
      navigate(`/challenges/match/${data.matchId}`);
    });

    return () => {
      unsubRoomUpdate();
      unsubMatchStarted();
    };
  }, [roomId, user, socket, navigate]);

  const handleCopyCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.roomCode);
    setCopied(true);
    toast.success('Room code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleReady = () => {
    if (!room || !user) return;
    const myParticipant = room.participants.find((p) => p.userId === user.id);
    socket.toggleRoomReady(room.id, !myParticipant?.isReady);
  };

  const handleStartContest = () => {
    if (!room || !user) return;
    socket.startRoomMatch(room.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <AlertCircle size={36} className="text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Room Not Found</h2>
          <p className="text-xs text-slate-500">This contest room no longer exists or has closed.</p>
          <button
            onClick={() => navigate('/challenges')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
          >
            Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  const isHost = room.createdBy === user?.id;
  const myParticipant = room.participants.find((p) => p.userId === user?.id);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/challenges')}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Leave Lobby</span>
          </button>

          {/* Shareable Room Code Pill */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs text-slate-400 font-semibold">Room Code:</span>
            <span className="text-sm font-black font-mono text-slate-900 tracking-wider">{room.roomCode}</span>
            <button
              onClick={handleCopyCode}
              className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Copy Code"
            >
              {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
            </button>
          </div>
        </div>

        {/* Room Banner */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200/60 font-mono uppercase">
                {room.type}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 font-mono uppercase">
                {room.difficulty}
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900">{room.title}</h1>
            <p className="text-xs text-slate-500">
              Host: <span className="font-semibold text-slate-700">{room.hostName || 'Challenger'}</span> • Duration: {room.durationMinutes} mins
            </p>
          </div>

          {/* Action Control */}
          <div className="flex items-center gap-3">
            {!isHost && (
              <button
                type="button"
                onClick={handleToggleReady}
                className={`px-5 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  myParticipant?.isReady
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {myParticipant?.isReady ? '✓ Ready' : 'Click to Ready Up'}
              </button>
            )}

            {isHost && (
              <button
                type="button"
                onClick={handleStartContest}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Play size={15} />
                <span>Start Contest</span>
              </button>
            )}
          </div>
        </div>

        {/* Participant Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Users size={15} className="text-blue-600" />
              <span>Participants ({room.participants.length} / {room.maxParticipants})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {room.participants.map((p) => (
              <div
                key={p.userId}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-sm">
                    {p.userName?.[0]?.toUpperCase() || 'P'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{p.userName}</span>
                      {p.isHost && <Crown size={13} className="text-amber-500" />}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{p.rating} Elo</div>
                  </div>
                </div>

                <div>
                  {p.isReady ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 size={11} /> Ready
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Waiting...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
