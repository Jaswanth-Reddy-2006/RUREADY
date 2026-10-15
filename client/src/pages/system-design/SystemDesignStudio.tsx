// ═══════════════════════════════════════════════════════════════
// R U Ready? — System Design Studio (Live Whiteboard & Socratic Interview)
// Harmonized Header, Dual-Stage Video Dock, Full Proctoring, Theme Toggle
// ═══════════════════════════════════════════════════════════════

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Layers,
  Bot,
  Calculator,
  ShieldAlert,
  Scale,
  FileText,
  Clock,
  ArrowLeft,
  Award,
  Sparkles,
  ChevronRight,
  Maximize2,
  Minimize2,
  Camera,
  VideoOff,
  PhoneOff,
  Sun,
  Moon,
  Mic,
  MicOff,
  Network,
  PanelRightClose,
  PanelRightOpen,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useSystemDesignStore } from '../../store/useSystemDesignStore';
import ComponentPalette from '../../components/system-design/ComponentPalette';
import ArchitectureCanvas from '../../components/system-design/ArchitectureCanvas';
import AIInterviewerPanel from '../../components/system-design/AIInterviewerPanel';
import CapacityCalculatorPanel from '../../components/system-design/CapacityCalculatorPanel';
import ArchitectureInspector from '../../components/system-design/ArchitectureInspector';
import TradeOffAnalysisPanel from '../../components/system-design/TradeOffAnalysisPanel';
import SystemDesignReportModal from '../../components/system-design/SystemDesignReportModal';
import AIAvatar from '../../components/interview/AIAvatar';
import { stopAllSpeech } from '../../lib/speech';

interface InterviewVideoDockProps {
  isMicOn: boolean;
  isCameraOn: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

function InterviewVideoDock({
  isMicOn,
  isCameraOn,
  onToggleMic,
  onToggleCamera,
  isMinimized,
  onToggleMinimize,
}: InterviewVideoDockProps) {
  const candidateVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (!navigator.mediaDevices?.getUserMedia) {
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        stream = mediaStream;
        mediaStreamRef.current = mediaStream;
        setCameraReady(true);
        if (candidateVideoRef.current) {
          candidateVideoRef.current.srcObject = mediaStream;
        }
      })
      .catch(() => setCameraReady(false));

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMicOn;
      });
    }
  }, [isMicOn]);

  useEffect(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = isCameraOn;
      });
    }
  }, [isCameraOn]);

  if (isMinimized) {
    return (
      <div className="absolute right-4 bottom-4 z-20 flex items-center gap-2 p-1.5 rounded-2xl bg-white/95 dark:bg-[#0D1117]/95 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Ava & Candidate</span>
        </div>
        <button
          onClick={onToggleMinimize}
          className="px-2.5 py-1 text-xs font-bold rounded-xl bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Expand Dock
        </button>
      </div>
    );
  }

  return (
    <div className="absolute right-4 bottom-4 z-20 grid w-[min(26rem,32vw)] grid-cols-2 gap-2 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-[#0D1117]/95 p-2.5 shadow-2xl backdrop-blur-md transition-all">
      {/* Ava AI Tile */}
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
        <AIAvatar
          state="idle"
          expression="NEUTRAL"
          persona="AVA"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Ava (AI Architect)</span>
        </div>
      </div>

      {/* Candidate Live Stream Tile */}
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900 border border-slate-800">
        {cameraReady && isCameraOn ? (
          <video
            ref={candidateVideoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover transform -scale-x-100"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-400 space-y-1">
            <VideoOff size={22} className="text-slate-500" />
            <span className="text-[10px] font-mono">Camera Off</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
          <span className={`w-1.5 h-1.5 rounded-full ${isMicOn ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span>You</span>
        </div>

        {/* Quick Media Toggles & Minimize */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <button
            onClick={onToggleMic}
            className={`p-1 rounded-md text-white backdrop-blur-xs transition-colors ${
              isMicOn ? 'bg-black/50 hover:bg-black/70' : 'bg-rose-600'
            }`}
            title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
          >
            {isMicOn ? <Mic size={11} /> : <MicOff size={11} />}
          </button>
          <button
            onClick={onToggleCamera}
            className={`p-1 rounded-md text-white backdrop-blur-xs transition-colors ${
              isCameraOn ? 'bg-black/50 hover:bg-black/70' : 'bg-rose-600'
            }`}
            title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
          >
            {isCameraOn ? <Camera size={11} /> : <VideoOff size={11} />}
          </button>
          <button
            onClick={onToggleMinimize}
            className="p-1 rounded-md bg-black/50 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
            title="Minimize video dock"
          >
            <Minimize2 size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SystemDesignStudio() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const {
    session,
    isLoadingSession,
    loadSession,
    activeTab,
    setActiveTab,
    currentStage,
    finishInterview,
    validationReport,
  } = useSystemDesignStore();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isVideoDockMinimized, setIsVideoDockMinimized] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [showEndModal, setShowEndModal] = useState(false);
  const [tabBlurCount, setTabBlurCount] = useState(0);

  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  };

  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    }
  }, [sessionId, loadSession]);

  // Session interview stopwatch timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Guarantee all speech is stopped on unmount
  useEffect(() => {
    return () => {
      stopAllSpeech();
    };
  }, []);

  // Proctoring tab blur switch detector
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabBlurCount((prev) => prev + 1);
        toast.error('Proctoring Notice: Context blur detected. Please stay focused on the whiteboard.', {
          icon: '⚠️',
          duration: 3500,
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.warn('[SystemDesignStudio] Fullscreen request was not available:', error);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndInterviewConfirm = () => {
    stopAllSpeech();
    setShowEndModal(false);
    finishInterview(elapsedSeconds);
  };

  const problem = session?.problem;
  const issuesCount = validationReport?.issues?.length || 0;

  if (isLoadingSession && !session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFD] dark:bg-[#000000]">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-4 border-[#4A8BDF] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Initializing System Design Studio & Whiteboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen min-h-0 bg-white dark:bg-[#000000] text-slate-900 dark:text-slate-100 overflow-hidden select-none transition-colors">
      
      {/* ─── 1. HARMONIZED INTERVIEW ROOM HEADER ─── */}
      <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1117] flex items-center justify-between px-3 sm:px-4 shrink-0 z-30 transition-colors">
        
        {/* Left: RU Ready Brand, Proctor Pill, Problem Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            to="/system-design"
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 shrink-0"
            title="Return to System Design Arena"
          >
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs font-display">
              <Network size={15} />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white font-display hidden sm:inline">
              RU Ready
            </span>
          </Link>

          <span className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:inline" />

          {/* Proctoring Active Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-400 font-mono shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden xs:inline">Proctoring Active</span>
          </div>

          {/* Problem Title & Difficulty Badge */}
          <div className="flex items-center gap-2 truncate">
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-sans truncate max-w-[130px] sm:max-w-xs md:max-w-md">
              {problem?.title || 'Distributed Architecture Whiteboard'}
            </h1>
            {problem?.difficulty && (
              <span
                className={clsx(
                  'px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider shrink-0',
                  problem.difficulty === 'EASY'
                    ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                    : problem.difficulty === 'MEDIUM'
                    ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                    : 'bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300'
                )}
              >
                {problem.difficulty}
              </span>
            )}
          </div>
        </div>

        {/* Center: Stage Progress Tracker */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Current Phase:</span>
          <span className="font-bold text-[#4A8BDF]">
            {currentStage === 1 && '1. Requirements Scoping'}
            {currentStage === 2 && '2. Scale & Capacity'}
            {currentStage === 3 && '3. High-Level Architecture'}
            {currentStage === 4 && '4. Deep Dive & Data Models'}
            {currentStage === 5 && '5. Scalability & Failure'}
            {currentStage === 6 && '6. Trade-offs & CAP'}
          </span>
        </div>

        {/* Right: Audio/Mic state, Timer, Tools Toggle, Theme Toggle, Fullscreen, End Call */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Candidate Mic Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300">
            <Mic size={12} className={isMicOn ? 'text-emerald-500' : 'text-rose-500'} />
            <span>{isMicOn ? 'Mic On' : 'Muted'}</span>
          </div>

          {/* Stopwatch Timer */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-[#161B22] rounded-xl text-xs font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
            <Clock size={13} className="text-slate-400" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          {/* Right Panel Toggle Button */}
          <button
            type="button"
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className={`p-2 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer ${
              isRightPanelOpen
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                : 'bg-white dark:bg-[#161B22] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title={isRightPanelOpen ? 'Collapse AI Tools Panel' : 'Expand AI Tools Panel'}
          >
            {isRightPanelOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
          </button>

          {/* Theme Toggle (☀️ / 🌙) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B22] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B22] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer hidden sm:block"
            title={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          {/* Prominent Red End Call Button */}
          <button
            type="button"
            onClick={() => setShowEndModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold font-sans shadow-xs transition-all cursor-pointer"
          >
            <PhoneOff size={13} />
            <span>End Call</span>
          </button>
        </div>
      </header>

      {/* ─── 2. 3-COLUMN STUDIO BODY ─── */}
      <div className="relative flex-1 flex overflow-hidden">
        
        {/* Left Column: Component Palette */}
        <ComponentPalette />

        {/* Center Column: Interactive React Flow Canvas */}
        <div className="relative flex-1 h-full min-w-0 bg-[#F8FAFD] dark:bg-[#000000] overflow-hidden">
          <ArchitectureCanvas />

          {/* Floating Dual Video Dock */}
          <InterviewVideoDock
            isMicOn={isMicOn}
            isCameraOn={isCameraOn}
            onToggleMic={() => setIsMicOn(!isMicOn)}
            onToggleCamera={() => setIsCameraOn(!isCameraOn)}
            isMinimized={isVideoDockMinimized}
            onToggleMinimize={() => setIsVideoDockMinimized(!isVideoDockMinimized)}
          />
        </div>

        {/* Right Column: Multi-tab Socratic AI & Tools Panel (Collapsible) */}
        {isRightPanelOpen && (
          <div className="w-80 lg:w-96 flex flex-col h-full border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1117] shrink-0 z-20 transition-all">
            {/* Tab Navigation */}
            <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#161B22]/80 p-1 shrink-0 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('interviewer')}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer',
                  activeTab === 'interviewer'
                    ? 'bg-white dark:bg-[#0D1117] text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                )}
              >
                <Bot size={13} />
                <span>Ava AI</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('capacity')}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer',
                  activeTab === 'capacity'
                    ? 'bg-white dark:bg-[#0D1117] text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                )}
              >
                <Calculator size={13} />
                <span>Scale</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('inspector')}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-bold rounded-xl transition-all relative cursor-pointer',
                  activeTab === 'inspector'
                    ? 'bg-white dark:bg-[#0D1117] text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                )}
              >
                <ShieldAlert size={13} />
                <span>Health</span>
                {issuesCount > 0 && (
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tradeoffs')}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer',
                  activeTab === 'tradeoffs'
                    ? 'bg-white dark:bg-[#0D1117] text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                )}
              >
                <Scale size={13} />
                <span>CAP</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('problem')}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer',
                  activeTab === 'problem'
                    ? 'bg-white dark:bg-[#0D1117] text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                )}
              >
                <FileText size={13} />
                <span>Specs</span>
              </button>
            </div>

            {/* Active Tab Content Area */}
            <div className="flex-1 overflow-hidden bg-white dark:bg-[#0D1117]">
              {activeTab === 'interviewer' && <AIInterviewerPanel />}
              {activeTab === 'capacity' && <CapacityCalculatorPanel />}
              {activeTab === 'inspector' && <ArchitectureInspector />}
              {activeTab === 'tradeoffs' && <TradeOffAnalysisPanel />}
              {activeTab === 'problem' && (
                <div className="p-4 space-y-4 overflow-y-auto h-full text-xs text-slate-800 dark:text-slate-200 select-none">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{problem?.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{problem?.description}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono text-[11px]">
                      Functional Requirements
                    </h4>
                    <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
                      {problem?.functionalRequirements?.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#4A8BDF] font-bold">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono text-[11px]">
                      Non-Functional Requirements
                    </h4>
                    <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
                      {problem?.nonFunctionalRequirements?.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── 3. END INTERVIEW CONFIRMATION MODAL ─── */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <PhoneOff size={22} />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                End System Design Interview?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your component topology, wiring, capacity estimation, and Socratic defenses will be compiled into your performance scorecard.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEndModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Keep Designing
              </button>
              <button
                type="button"
                onClick={handleEndInterviewConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                End & Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Interview 11-Dimension Report Modal */}
      <SystemDesignReportModal />
    </div>
  );
}
