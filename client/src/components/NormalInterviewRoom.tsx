import React, { useEffect, useRef } from 'react';
import AIAvatar, { type AvatarState } from './interview/AIAvatar';
import { type OculusViseme } from './interview/visemeMapper';
import { type VideoAnalysisMetrics } from '../hooks/useVideoAnalysisML';
import { Maximize2, Mic, ShieldAlert, Sparkles } from 'lucide-react';

interface NormalInterviewRoomProps {
  mediaStream: MediaStream | null;
  aiIsSpeaking: boolean;
  avatarState: AvatarState;
  mouthOpenness: number;
  spokenWord: string;
  activeVisemeShape?: OculusViseme;
  currentQuestionText: string;
  candidateTranscription?: string;
  onSubmitAnswer: (answer: string) => void;
  onEndInterview: () => void;
  isProcessing: boolean;
  processingLabel: string;
  questionIndex?: number;
  totalQuestions?: number;
  questionDifficulty?: string;
  focusArea?: string;
  silenceCountdown?: number | null;
  isFullscreen?: boolean;
  onReEnterFullscreen?: () => void;
  onTranscriptionChange?: (text: string) => void;
  videoMLMetrics?: VideoAnalysisMetrics;
}

export default function NormalInterviewRoom({
  mediaStream,
  aiIsSpeaking,
  avatarState,
  mouthOpenness,
  spokenWord,
  activeVisemeShape,
  currentQuestionText,
  onEndInterview,
  isProcessing,
  processingLabel,
  candidateTranscription,
  isFullscreen = true,
  onReEnterFullscreen,
  silenceCountdown,
  videoMLMetrics,
}: NormalInterviewRoomProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Bind candidate media stream (strictly locked on)
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch((err) => {
        console.warn('[NormalInterviewRoom] Video play deferred:', err);
      });
    }
  }, [mediaStream]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#EFFAFD] text-[#11183D] font-sans select-none overflow-hidden">
      
      {/* ─── 0. STRICT FULL-SCREEN LOCKDOWN OVERLAY (If Exited) ─── */}
      {!isFullscreen && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl p-6 text-white text-center select-none animate-fadeIn">
          <div className="max-w-md w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">Full-Screen Security Lockdown</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-body">
                For complete proctoring integrity, this interview must remain in full-screen mode at all times. Tab switches, multi-window events, and external processes are monitored.
              </p>
            </div>
            <button
              type="button"
              onClick={onReEnterFullscreen}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-2xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 font-display"
            >
              <Maximize2 size={16} />
              <span>Return to Full-Screen Mode</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── 1. TOP MINIMAL BRAND & EXIT BAR ─── */}
      <header className="px-6 py-3 shrink-0 border-b border-[#DCE7F2] bg-white shadow-xs z-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#4A8BDF] to-[#2459A8] flex items-center justify-center text-white font-bold text-xs shadow-xs font-display">
            RU
          </div>
          <span className="text-sm font-bold text-[#11183D] font-display">
            RU Ready
          </span>
        </div>

        {/* Right Controls: AI State Pill + End Call */}
        <div className="flex items-center gap-3">
          {/* Live AI State Pill */}
          {aiIsSpeaking ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold font-mono shadow-xs animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span>Ava Speaking...</span>
            </div>
          ) : isProcessing ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold font-mono shadow-xs">
              <div className="h-2.5 w-2.5 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
              <span>Thinking & Processing...</span>
            </div>
          ) : avatarState === 'listening' ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold font-mono shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>
                {(silenceCountdown ?? 0) > 0
                  ? `Listening (Submitting in ${silenceCountdown}s)...`
                  : 'Listening to you...'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold font-mono shadow-xs">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span>Ready</span>
            </div>
          )}

          {/* Discreet End Call */}
          <button
            type="button"
            onClick={onEndInterview}
            className="bg-[#D64545] hover:bg-[#D64545]/90 text-white px-4 py-1.5 rounded-full font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95 font-display"
          >
            End Call
          </button>
        </div>
      </header>

      {/* ─── 2. MAIN 2-PANEL EQUAL STAGE ─── */}
      <main className="flex-1 w-full max-w-[1750px] mx-auto p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch min-h-0 relative overflow-hidden">
        
        {/* ─── LEFT: AVA'S STAGE ─── */}
        <div className="w-full h-full flex flex-col bg-white border border-[#DCE7F2] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
          
          {/* 3D Avatar Canvas */}
          <div className="relative flex-1 min-h-[260px] w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0e172e] via-[#090e1c] to-[#04060c]">
            <AIAvatar
              state={avatarState}
              expression={
                aiIsSpeaking ? 'SPEAKING' :
                isProcessing ? 'THINKING' :
                avatarState === 'listening' ? 'INTERESTED' :
                avatarState === 'pleased' ? 'ENCOURAGING' :
                avatarState === 'concerned' ? 'CONCERNED' :
                'NEUTRAL'
              }
              isSpeaking={aiIsSpeaking}
              mouthOpenness={mouthOpenness}
              activeVisemeShape={activeVisemeShape}
              currentWord={spokenWord}
              persona="AVA"
              className="w-full h-full object-cover"
            />

            {/* Clean Ava Tag */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#11183D]/80 backdrop-blur-md border border-white/10 text-white text-xs font-bold font-display shadow-md">
              Ava
            </div>
          </div>

          {/* ─── AVA'S BOTTOM CAPTION BOX ─── */}
          <div className="bg-[#11183D] p-5 shrink-0 z-10">
            <div className="min-h-[72px] max-h-36 overflow-y-auto pr-1 flex flex-col justify-center">
              {aiIsSpeaking ? (
                <div>
                  <span className="text-[10px] font-mono text-[#7dd3fc] uppercase tracking-wider block mb-1">
                    Ava Speaking
                  </span>
                  <p className="text-sm sm:text-base text-white font-medium leading-relaxed font-body">
                    {currentQuestionText || 'Preparing question...'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-bold text-[#38bdf8] font-display tracking-tight">
                    Ava is listening — please respond whenever you're ready
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed font-body line-clamp-2">
                    {currentQuestionText}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ─── RIGHT: CANDIDATE STAGE ─── */}
        <div className="w-full h-full flex flex-col bg-white border border-[#DCE7F2] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
          
          {/* Candidate Webcam Feed Area (Clean, full height) */}
          <div className="relative flex-1 bg-[#11183D] min-h-[260px] flex items-center justify-center overflow-hidden">
            {mediaStream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="text-center space-y-2 p-6">
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse mx-auto" />
                <p className="text-xs text-white/70 font-medium font-body">Camera Active</p>
              </div>
            )}

            {/* Clean You Tag */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#11183D]/80 backdrop-blur-md border border-white/10 text-white text-xs font-bold font-display shadow-md">
              You
            </div>

            {/* Multiple People Integrity Warning */}
            {(videoMLMetrics?.multipleFacesDetected || (videoMLMetrics?.faceCount && videoMLMetrics.faceCount > 1)) && (
              <div className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-red-600/95 backdrop-blur-md border border-red-400 text-white text-xs font-bold font-display shadow-xl flex items-center gap-1.5 animate-bounce">
                <span>⚠️ Multiple People Detected</span>
              </div>
            )}

            {/* Pause / Auto-submit Countdown Badge */}
            {(silenceCountdown ?? 0) > 0 && !videoMLMetrics?.multipleFacesDetected && (
              <div className="absolute top-4 right-4 z-10 px-3.5 py-1.5 rounded-full bg-amber-500/95 backdrop-blur-md border border-amber-300 text-white text-xs font-bold font-mono shadow-lg flex items-center gap-2 animate-pulse">
                <div className="h-2 w-2 rounded-full bg-white" />
                <span>Submitting in {silenceCountdown}s (speak to continue)</span>
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}


