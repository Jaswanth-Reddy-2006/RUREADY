// ═══════════════════════════════════════════════════════════════
// Renatus — Video Interview Room UI (Google Meet Experience)
// Clean White Aesthetic, Balanced Dual-Stage Architecture
// Minimal Brand Header, Pure Spoken Prompt, Google Meet Dock
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react';
import AIAvatar, { type AvatarState } from './interview/AIAvatar';
import { type OculusViseme } from './interview/visemeMapper';
import { type VideoAnalysisMetrics } from '../hooks/useVideoAnalysisML';
import { 
  Maximize2, VideoOff, PhoneOff, ShieldAlert, Sun, Moon 
} from 'lucide-react';

function getQuestionFontSize(text: string): string {
  const len = text ? text.length : 0;
  if (len > 220) return 'text-xs sm:text-sm leading-snug';
  if (len > 120) return 'text-sm sm:text-base leading-normal';
  return 'text-base sm:text-lg leading-relaxed';
}

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
  // Interactive Controls & Follow-up Props
  isFollowUpMode?: boolean;
  isMicOn?: boolean;
  isCameraOn?: boolean;
  onToggleMic?: () => void;
  onToggleCamera?: () => void;
  onRepeatQuestion?: () => void;
  onRequestClarification?: () => void;
  onSkipQuestion?: () => void;
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
  processingLabel = 'Ava is considering your response…',
  candidateTranscription = '',
  isFullscreen = true,
  onReEnterFullscreen,
  focusArea = 'Software Engineer',
  isFollowUpMode = false,
  isMicOn = true,
  isCameraOn = true,
  onToggleMic,
  onToggleCamera,
  onSubmitAnswer,
  videoMLMetrics,
}: NormalInterviewRoomProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
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

  // Bind candidate media stream (strictly locked on)
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch((err) => {
        console.warn('[NormalInterviewRoom] Video play deferred:', err);
      });
    }
  }, [mediaStream]);

  // Keyboard shortcut: Press Enter to submit answer immediately if candidate has finished talking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !isProcessing && !aiIsSpeaking) {
        if (candidateTranscription && candidateTranscription.trim().length > 3) {
          e.preventDefault();
          onSubmitAnswer(candidateTranscription);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [candidateTranscription, isProcessing, aiIsSpeaking, onSubmitAnswer]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-sans select-none overflow-hidden transition-colors">
      
      {/* ─── 0. STRICT FULL-SCREEN LOCKDOWN OVERLAY (If Exited) ─── */}
      {!isFullscreen && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl p-6 text-white text-center select-none animate-fadeIn">
          <div className="max-w-md w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-100">Full-Screen Security Lockdown</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-body">
                For complete proctoring integrity, this interview must remain in full-screen mode at all times. Tab switches, multi-window events, and external processes are monitored.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 w-full">
              <button
                type="button"
                onClick={onReEnterFullscreen}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-2xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 font-display"
              >
                <Maximize2 size={16} />
                <span>Return to Full-Screen Mode</span>
              </button>
              <button
                type="button"
                onClick={onEndInterview}
                className="w-full py-2.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              >
                End Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 1. TOP MINIMAL BRAND HEADER WITH PROMINENT END CALL BUTTON ─── */}
      <header className="px-6 py-3.5 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1117] z-20 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#2459A8] to-[#4A8BDF] flex items-center justify-center text-white font-bold text-xs shadow-sm font-display">
              RU
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-white font-display">
              Renatus
            </span>
          </div>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />

          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[240px] sm:max-w-md">
            {focusArea || 'Software Engineer'}
          </span>
        </div>

        {/* Clear End Call Button & Theme Toggle at Top */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl transition-all cursor-pointer border flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-300 border-slate-200 dark:border-slate-700 shadow-xs"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onEndInterview}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer font-display active:scale-95 border border-rose-500/40"
            title="End interview immediately"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>
      </header>

      {/* ─── 2. MAIN 2-PANEL BALANCED STAGE ─── */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-4 sm:p-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch min-h-0 overflow-hidden">
        
        {/* ═══════════ LEFT PANEL: AI INTERVIEWER ═══════════ */}
        <div className="w-full h-full flex flex-col bg-white dark:bg-[#0D1117] border border-slate-200/90 dark:border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm transition-colors">
          
          {/* 3D Avatar Canvas */}
          <div className="relative flex-1 min-h-[220px] w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black">
            <AIAvatar
              state={avatarState}
              expression={
                aiIsSpeaking ? 'SPEAKING' :
                isProcessing ? 'THINKING' :
                isFollowUpMode ? 'INTERESTED' :
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
          </div>

          {/* Question Text Area — STRICT FIXED HEIGHT to prevent video feed jumping or shrinking */}
          <div className="bg-white dark:bg-[#0D1117] border-t border-slate-100 dark:border-slate-800 px-4 py-3 sm:px-5 sm:py-3.5 shrink-0 h-28 sm:h-32 flex flex-col justify-center overflow-hidden transition-colors">
            <div className="overflow-y-auto max-h-full pr-1">
              <p className={`${getQuestionFontSize(currentQuestionText || '')} text-slate-800 dark:text-slate-100 font-medium font-display`}>
                {currentQuestionText || 'Preparing technical question...'}
              </p>
            </div>
          </div>

        </div>

        {/* ═══════════ RIGHT PANEL: CANDIDATE ═══════════ */}
        <div className="w-full h-full flex flex-col bg-white dark:bg-[#0D1117] border border-slate-200/90 dark:border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm relative transition-colors">
          
          {/* Candidate Webcam Feed Area — Clean full-tile view matching video conferencing platforms */}
          <div className="relative flex-1 w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
            {mediaStream && isCameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="text-center space-y-2 p-6">
                <div className="h-14 w-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
                  <VideoOff className="h-7 w-7 text-slate-500" />
                </div>
                <p className="text-sm font-medium text-slate-300">Camera Off</p>
              </div>
            )}

            {/* Subtle "You" badge overlay (Zero distracting transcript) */}
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-slate-900/75 backdrop-blur-md text-white text-xs font-semibold shadow-xs">
                You
              </span>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
