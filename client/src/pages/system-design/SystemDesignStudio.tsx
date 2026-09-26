import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import clsx from 'clsx';
import { useSystemDesignStore } from '../../store/useSystemDesignStore';
import ComponentPalette from '../../components/system-design/ComponentPalette';
import ArchitectureCanvas from '../../components/system-design/ArchitectureCanvas';
import AIInterviewerPanel from '../../components/system-design/AIInterviewerPanel';
import CapacityCalculatorPanel from '../../components/system-design/CapacityCalculatorPanel';
import ArchitectureInspector from '../../components/system-design/ArchitectureInspector';
import TradeOffAnalysisPanel from '../../components/system-design/TradeOffAnalysisPanel';
import SystemDesignReportModal from '../../components/system-design/SystemDesignReportModal';

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

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const problem = session?.problem;
  const issuesCount = validationReport?.issues?.length || 0;

  if (isLoadingSession && !session) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-[#F8FAFD]">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-4 border-[#4A8BDF] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-500">Initializing System Design Studio & Whiteboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white overflow-hidden">
      {/* Studio Header Bar */}
      <header className="h-14 border-b border-[#DCE7F2] bg-white flex items-center justify-between px-4 shrink-0 z-30">
        {/* Left: Back, Title & Difficulty */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/system-design')}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Back to System Design Arena"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 font-sans truncate max-w-md">
                {problem?.title || 'System Design Whiteboard'}
              </h1>
              {problem?.difficulty && (
                <span
                  className={clsx(
                    'px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider',
                    problem.difficulty === 'EASY'
                      ? 'bg-emerald-100 text-emerald-800'
                      : problem.difficulty === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  )}
                >
                  {problem.difficulty}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Stage {currentStage} / 6 • SDE-2 / Staff Round
            </div>
          </div>
        </div>

        {/* Center: Stage Progress Tracker */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono">
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

        {/* Right: Timer & Grade Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-mono font-bold text-slate-700">
            <Clock size={14} className="text-slate-400" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          <button
            type="button"
            onClick={() => finishInterview(elapsedSeconds)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#2459A8] to-[#4A8BDF] hover:from-[#1D4A8C] hover:to-[#3B77C4] text-white rounded-xl text-xs font-bold font-sans shadow-xs transition-all"
          >
            <Award size={14} />
            <span>Finish Interview</span>
          </button>
        </div>
      </header>

      {/* 3-Column Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Component Palette */}
        <ComponentPalette />

        {/* Center Column: Interactive React Flow Canvas */}
        <ArchitectureCanvas />

        {/* Right Column: Multi-tab Socratic AI & Tools Panel */}
        <div className="w-96 bg-white border-l border-[#DCE7F2] flex flex-col h-full shrink-0 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex items-center border-b border-[#DCE7F2] bg-slate-50/70 p-1 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('interviewer')}
              className={clsx(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-xl transition-all',
                activeTab === 'interviewer'
                  ? 'bg-white text-[#4A8BDF] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <Bot size={14} />
              <span>AI Interv.</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('capacity')}
              className={clsx(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-xl transition-all',
                activeTab === 'capacity'
                  ? 'bg-white text-[#4A8BDF] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <Calculator size={14} />
              <span>Scale</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inspector')}
              className={clsx(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-xl transition-all relative',
                activeTab === 'inspector'
                  ? 'bg-white text-[#4A8BDF] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <ShieldAlert size={14} />
              <span>Health</span>
              {issuesCount > 0 && (
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tradeoffs')}
              className={clsx(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-xl transition-all',
                activeTab === 'tradeoffs'
                  ? 'bg-white text-[#4A8BDF] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <Scale size={14} />
              <span>CAP</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('problem')}
              className={clsx(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-xl transition-all',
                activeTab === 'problem'
                  ? 'bg-white text-[#4A8BDF] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <FileText size={14} />
              <span>Specs</span>
            </button>
          </div>

          {/* Active Tab Content Area */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'interviewer' && <AIInterviewerPanel />}
            {activeTab === 'capacity' && <CapacityCalculatorPanel />}
            {activeTab === 'inspector' && <ArchitectureInspector />}
            {activeTab === 'tradeoffs' && <TradeOffAnalysisPanel />}
            {activeTab === 'problem' && (
              <div className="p-4 space-y-4 overflow-y-auto h-full text-xs text-slate-800 select-none">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">{problem?.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{problem?.description}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider font-mono text-[11px]">
                    Functional Requirements
                  </h4>
                  <ul className="space-y-1.5 text-slate-600">
                    {problem?.functionalRequirements?.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#4A8BDF] font-bold">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider font-mono text-[11px]">
                    Non-Functional Requirements
                  </h4>
                  <ul className="space-y-1.5 text-slate-600">
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
      </div>

      {/* Post-Interview 11-Dimension Report Modal */}
      <SystemDesignReportModal />
    </div>
  );
}
