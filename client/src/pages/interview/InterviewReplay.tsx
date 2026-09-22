import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  Clock,
  Video,
  Code2,
  Terminal,
  MessageSquare,
  Award,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Layers,
  ChevronRight,
  User,
  Brain,
  Volume2,
  ShieldCheck,
  FileCode,
} from 'lucide-react';
import apiClient from '../../api/client';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function InterviewReplay() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Replay Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const initialTimestamp = Number(searchParams.get('timestamp')) || 0;
  const [currentTimeSecs, setCurrentTimeSecs] = useState(initialTimestamp);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState<'TRANSCRIPT' | 'CODE' | 'EVALUATION'>('TRANSCRIPT');

  // Total duration in seconds (defaults to 15 mins / 900s)
  const totalDurationSecs = session?.durationMins ? session.durationMins * 60 : 900;

  // Fetch Session data
  useEffect(() => {
    async function loadSession() {
      try {
        const response = await apiClient.get(`/interview/session/${id}`);
        setSession(response.data || null);
      } catch (err) {
        console.warn('[InterviewReplay] Using fallback session data:', err);
        setSession({
          id: id || 'sess_demo_1',
          targetRole: 'Full Stack Engineer',
          targetCompany: 'Google',
          interviewType: 'CODING',
          durationMins: 15,
          createdAt: new Date().toISOString(),
          evalScore: 84,
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, [id]);

  // Timer loop for playback
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSecs((prev) => {
          if (prev >= totalDurationSecs) {
            setIsPlaying(false);
            return totalDurationSecs;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalDurationSecs]);

  // Format seconds -> MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Mock Event Timeline Snapshots (Synced across video, code, transcript)
  const replayEvents = [
    {
      timestampSecs: 15,
      timeFormatted: '00:15',
      eventType: 'INTERVIEWER_SPOKE',
      speaker: 'AVA',
      text: 'Welcome! Let us start by discussing how you would implement an LRU Cache with O(1) time complexity.',
      codeSnapshot: '# Initial solution scaffold\nclass LRUCache:\n    def __init__(self, capacity: int):\n        pass',
      evaluationNote: {
        type: 'HINT',
        title: 'Problem Introduced',
        details: 'Ava presented LRU Cache requirements: O(1) get & put.',
      },
    },
    {
      timestampSecs: 90,
      timeFormatted: '01:30',
      eventType: 'CANDIDATE_SPOKE',
      speaker: 'CANDIDATE',
      text: 'I will use a Doubly LinkedList for fast nodes order update combined with a Hash Map for O(1) key lookup.',
      codeSnapshot: '# Candidate approach outline\n# HashMap: key -> DoublyLinkedListNode\n# DoublyLinkedList: head (MRU) <-> tail (LRU)',
      evaluationNote: {
        type: 'STRONG',
        title: 'Optimal Approach Identified',
        details: 'Correctly identified Hash Map + Doubly LinkedList pattern.',
      },
    },
    {
      timestampSecs: 240,
      timeFormatted: '04:00',
      eventType: 'CODE_SNAPSHOT',
      speaker: 'CANDIDATE',
      text: 'Coding doubly linked list node structure and pointer updates...',
      codeSnapshot: `class Node:
    def __init__(self, key, val):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {} # Map key -> Node
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head`,
      evaluationNote: {
        type: 'STRONG',
        title: 'Dummy Head & Tail Guard',
        details: 'Used sentinel head/tail nodes to simplify pointer operations.',
      },
    },
    {
      timestampSecs: 480,
      timeFormatted: '08:00',
      eventType: 'COMPILER_TEST',
      speaker: 'CANDIDATE',
      text: 'Running test cases for capacity eviction...',
      codeSnapshot: `    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self._add(node)
        self.cache[key] = node
        if len(self.cache) > self.cap:
            lru = self.head.next
            self._remove(lru)
            del self.cache[lru.key]`,
      evaluationNote: {
        type: 'IMPROVEMENT',
        title: 'Boundary Check Execution',
        details: 'Compiler verified O(1) put eviction logic against 10 test cases.',
      },
    },
    {
      timestampSecs: 720,
      timeFormatted: '12:00',
      eventType: 'HINT_GIVEN',
      speaker: 'AVA',
      text: 'Good. What is the space complexity, and how would you make this thread-safe in a multi-threaded environment?',
      codeSnapshot: `# Final verified solution
# Space Complexity: O(Capacity)
# Time Complexity: O(1) for get and put`,
      evaluationNote: {
        type: 'HINT',
        title: 'Socratic Architecture Probe',
        details: 'Probed thread safety and concurrency lock mechanisms.',
      },
    },
  ];

  // Find active event based on current timestamp
  const activeEventIndex = replayEvents.reduce((acc, evt, idx) => {
    if (currentTimeSecs >= evt.timestampSecs) return idx;
    return acc;
  }, 0);

  const activeEvent = replayEvents[activeEventIndex] || replayEvents[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans select-none flex flex-col">
      {/* ─── 1. TOP HEADER & NAVIGATION BAR ─── */}
      <header className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] font-mono">
                INTERVIEW REPLAY SYSTEM
              </Badge>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-400 font-mono">Session #{session?.id?.slice(0, 10)}</span>
            </div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              {session?.targetRole || 'Full Stack Engineer'} — {session?.targetCompany || 'Google'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs font-mono font-bold">
            Readiness Score: {session?.evalScore || 84}%
          </Badge>
          <Button
            onClick={() => navigate(`/interview/${id}/analysis`)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
          >
            <span>View Full Analysis</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* ─── 2. MAIN 3-PANEL REPLAY LAYOUT ─── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 lg:p-6 overflow-hidden">
        
        {/* LEFT PANEL (4 COLS): VIDEO & AVATAR FEED */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Simulated Candidate Video Box */}
          <Card className="bg-slate-900 border-slate-800 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between h-56 shadow-xl">
            <div className="flex items-center justify-between z-10">
              <span className="px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-[10px] font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" /> Candidate Video Stream
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                1080p HD Synced
              </span>
            </div>

            {/* Video Placeholder Graphics */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80">
              <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
                <User className="w-10 h-10 text-slate-400" />
              </div>
              <span className="text-xs font-semibold text-slate-400 mt-2">Candidate Feed</span>
            </div>

            <div className="z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/70 p-2 rounded-xl backdrop-blur-xs">
              <span>Voice WPM: 142 (Optimal)</span>
              <span>Eye Contact: 88%</span>
            </div>
          </Card>

          {/* Ava AI Interviewer Box */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 p-5 rounded-2xl flex-1 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Ava AI Interviewer</h3>
                  <p className="text-[10px] text-slate-400">Adaptive Socratic Observer</p>
                </div>
              </div>
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                {activeEvent.speaker === 'AVA' ? 'SPOKE AT ' + activeEvent.timeFormatted : 'OBSERVING'}
              </Badge>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-200 leading-relaxed space-y-2">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Interviewer Prompt:</span>
              <p className="italic">"{activeEvent.text}"</p>
            </div>

            {/* Evaluation Highlight Badge & Evidence Drawer */}
            {activeEvent.evaluationNote && (
              <div className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                activeEvent.evaluationNote.type === 'STRONG'
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                  : activeEvent.evaluationNote.type === 'IMPROVEMENT'
                  ? 'bg-amber-950/40 border-amber-800 text-amber-200'
                  : 'bg-blue-950/40 border-blue-800 text-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-current" />
                    {activeEvent.evaluationNote.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700">
                    Source: Event Log Stream
                  </span>
                </div>
                <p className="text-[11px] opacity-90 leading-normal">
                  {activeEvent.evaluationNote.details}
                </p>
                <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px]">
                  <span className="font-mono text-slate-400">
                    Timestamp: {activeEvent.timeFormatted}
                  </span>
                  <button
                    onClick={() => navigate(`/interview/${id}/analysis`)}
                    className="text-blue-400 hover:text-blue-300 font-bold underline flex items-center gap-1"
                  >
                    <span>Why this score? View full rubric →</span>
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT PANEL (8 COLS): CODE SNAPSHOT / TRANSCRIPT VIEWER */}
        <div className="lg:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Tab Selector */}
          <div className="flex items-center justify-between bg-slate-950 px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('TRANSCRIPT')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'TRANSCRIPT'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Transcript Log</span>
              </button>

              <button
                onClick={() => setActiveTab('CODE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'CODE'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>IDE Code Snapshot</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Active Snapshot: <span className="text-cyan-400 font-bold">{activeEvent.timeFormatted}</span>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-5 overflow-y-auto font-mono text-xs text-slate-300">
            {activeTab === 'TRANSCRIPT' ? (
              <div className="space-y-4">
                {replayEvents.map((evt, i) => (
                  <div
                    key={i}
                    onClick={() => setCurrentTimeSecs(evt.timestampSecs)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      i === activeEventIndex
                        ? 'bg-blue-950/50 border-blue-500/80 shadow-md'
                        : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className={evt.speaker === 'AVA' ? 'text-blue-400' : 'text-emerald-400'}>
                        {evt.speaker === 'AVA' ? '🤖 Ava (AI Interviewer)' : '👤 Candidate'}
                      </span>
                      <span className="text-slate-500">{evt.timeFormatted}</span>
                    </div>
                    <p className="font-sans text-xs text-slate-200 leading-relaxed">{evt.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                  <span>Language: Python 3.12</span>
                  <span>Synced at {activeEvent.timeFormatted}</span>
                </div>
                <pre className="text-xs text-cyan-300 font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                  {activeEvent.codeSnapshot || '# No code snapshot captured at this timestamp.'}
                </pre>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ─── 3. BOTTOM SCRUBBABLE TIMELINE CONTROLLER ─── */}
      <footer className="px-6 py-4 bg-slate-900 border-t border-slate-800 space-y-3 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={() => setCurrentTimeSecs(0)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="text-xs font-mono font-bold text-slate-200">
              <span>{formatTime(currentTimeSecs)}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span className="text-slate-500">{formatTime(totalDurationSecs)}</span>
            </div>
          </div>

          {/* Event Track Markers Preview */}
          <div className="flex items-center gap-2">
            {replayEvents.map((evt, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTimeSecs(evt.timestampSecs)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                  idx === activeEventIndex
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {evt.timeFormatted}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Speed:</span>
            {[1, 1.25, 1.5, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                  playbackSpeed === spd ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Slider Range Input */}
        <input
          type="range"
          min={0}
          max={totalDurationSecs}
          value={currentTimeSecs}
          onChange={(e) => setCurrentTimeSecs(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </footer>
    </div>
  );
}
