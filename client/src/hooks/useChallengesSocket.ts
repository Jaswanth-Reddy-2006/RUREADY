// ═══════════════════════════════════════════════════════════════
// RU Ready? — Real-time Challenges WebSocket Hook
// ═══════════════════════════════════════════════════════════════

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

let globalSocket: Socket | null = null;

function getSocketInstance(): Socket {
  if (!globalSocket) {
    const socketUrl = window.location.origin;
    globalSocket = io(socketUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    globalSocket.on('connect', () => {
      console.log('[Challenge Socket] Connected:', globalSocket?.id);
    });

    globalSocket.on('connect_error', (err) => {
      console.warn('[Challenge Socket] Connect error:', err.message);
    });
  }

  return globalSocket;
}

export interface ChallengesSocketHookResult {
  socket: Socket | null;
  isConnected: boolean;
  queueStatus: { inQueue: boolean; waitTimeSec: number; queueSize: number };
  joinMatchmaking: (params: { difficulty?: string; topic?: string; language?: string }) => void;
  leaveMatchmaking: () => void;
  joinRoom: (roomCodeOrId: string) => void;
  toggleRoomReady: (roomId: string, isReady?: boolean) => void;
  startRoomMatch: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  joinMatchRoom: (matchId: string) => void;
  broadcastProgress: (matchId: string, passedTests: number, totalTests: number) => void;
  runSampleTests: (problemId: string, code: string, language: string) => void;
  submitMatchSolution: (matchId: string, code: string, language: string) => void;
  joinQuiz: (sessionCodeOrId: string) => void;
  startQuiz: (sessionId: string) => void;
  submitQuizAnswer: (sessionId: string, questionIndex: number, selectedIndex: number) => void;
  nextQuizQuestion: (sessionId: string) => void;
  on: (event: string, callback: (...args: any[]) => void) => () => void;
}

export function useChallengesSocket(): ChallengesSocketHookResult {
  const { user } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [queueStatus, setQueueStatus] = useState<{ inQueue: boolean; waitTimeSec: number; queueSize: number }>({
    inQueue: false,
    waitTimeSec: 0,
    queueSize: 0,
  });

  useEffect(() => {
    const socket = getSocketInstance();
    socketRef.current = socket;
    setIsConnected(socket.connected);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onQueueStatus = (status: any) => setQueueStatus(status);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('matchmaking:status_update', onQueueStatus);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('matchmaking:status_update', onQueueStatus);
    };
  }, []);

  // Matchmaking Actions
  const joinMatchmaking = useCallback(
    (params: { difficulty?: string; topic?: string; language?: string }) => {
      if (!socketRef.current || !user) return;
      socketRef.current.emit('matchmaking:join', {
        userId: user.id || 'usr_guest',
        userName: user.name || 'Student Challenger',
        userAvatar: (user as any).avatarUrl,
        difficulty: params.difficulty || 'MEDIUM',
        topic: params.topic || 'DSA',
        language: params.language || 'all',
      });
      setQueueStatus((prev) => ({ ...prev, inQueue: true, waitTimeSec: 0 }));
    },
    [user]
  );

  const leaveMatchmaking = useCallback(() => {
    if (!socketRef.current || !user) return;
    socketRef.current.emit('matchmaking:leave', { userId: user.id || 'usr_guest' });
    setQueueStatus({ inQueue: false, waitTimeSec: 0, queueSize: 0 });
  }, [user]);

  // Room Actions
  const joinRoom = useCallback(
    (roomCodeOrId: string) => {
      if (!socketRef.current || !user) return;
      socketRef.current.emit('room:join', {
        roomCodeOrId,
        userId: user.id || 'usr_guest',
        userName: user.name || 'Student Challenger',
        userAvatar: (user as any).avatarUrl,
      });
    },
    [user]
  );

  const toggleRoomReady = useCallback(
    (roomId: string, isReady?: boolean) => {
      if (!socketRef.current || !user) return;
      socketRef.current.emit('room:toggle_ready', {
        roomId,
        userId: user.id || 'usr_guest',
        isReady,
      });
    },
    [user]
  );

  const startRoomMatch = useCallback(
    (roomId: string) => {
      if (!socketRef.current || !user) return;
      socketRef.current.emit('room:start', {
        roomId,
        userId: user.id || 'usr_guest',
      });
    },
    [user]
  );

  const leaveRoom = useCallback(
    (roomId: string) => {
      if (!socketRef.current || !user) return;
      socketRef.current.emit('room:leave', {
        roomId,
        userId: user.id || 'usr_guest',
      });
    },
    [user]
  );

  // Match Battle Actions
  const joinMatchRoom = useCallback(
    (matchId: string) => {
      if (!socketRef.current || !user) return;
      socketRef.current.emit('match:join_room', {
        matchId,
        userId: user.id || 'usr_guest',
      });
    },
    [user]
  );

  const broadcastProgress = useCallback(
    (matchId: string, passedTests: number, totalTests: number) => {
      if (!socketRef.current || !user) return;
      socketRef.current.emit('match:progress', {
        matchId,
        userId: user.id || 'usr_guest',
        passedTests,
        totalTests,
      });
    },
    [user]
  );

  const runSampleTests = useCallback((problemId: string, code: string, language: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('match:run_sample', {
      problemId,
      code,
      language,
    });
  }, []);

  const submitMatchSolution = useCallback(
    (matchId: string, code: string, language: string) => {
      if (!socketRef.current || !user) return;
      socketRef.current.emit('match:submit', {
        matchId,
        userId: user.id || 'usr_guest',
        userName: user.name || 'Student Challenger',
        code,
        language,
      });
    },
    [user]
  );

  // Quiz Arena Actions
  const joinQuiz = useCallback(
    (sessionCodeOrId: string) => {
      if (!socketRef.current || !user) return;
      socketRef.current.emit('quiz:join', {
        sessionCodeOrId,
        userId: user.id || 'usr_guest',
        userName: user.name || 'Quiz Challenger',
        userAvatar: (user as any).avatarUrl,
      });
    },
    [user]
  );

  const startQuiz = useCallback((sessionId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('quiz:start', { sessionId });
  }, []);

  const submitQuizAnswer = useCallback(
    (sessionId: string, questionIndex: number, selectedIndex: number) => {
      if (!socketRef.current || !user) return;
      socketRef.current.emit('quiz:submit_answer', {
        sessionId,
        userId: user.id || 'usr_guest',
        questionIndex,
        selectedIndex,
      });
    },
    [user]
  );

  const nextQuizQuestion = useCallback((sessionId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('quiz:next_question', { sessionId });
  }, []);

  // Generic Event Listener Helper
  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    const socket = getSocketInstance();
    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    queueStatus,
    joinMatchmaking,
    leaveMatchmaking,
    joinRoom,
    toggleRoomReady,
    startRoomMatch,
    leaveRoom,
    joinMatchRoom,
    broadcastProgress,
    runSampleTests,
    submitMatchSolution,
    joinQuiz,
    startQuiz,
    submitQuizAnswer,
    nextQuizQuestion,
    on,
  };
}
