// ═══════════════════════════════════════════════════════════════
// Renatus — Video / Oral Interview Room UI (Modern AI Studio)
// Premium Glassmorphic Studio, Dual-Stage Architecture,
// Real-time Audio Level Telemetry, Live Waveform & Sleek Dock
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react';
import AIAvatar, { type AvatarState } from './interview/AIAvatar';
import { type OculusViseme } from './interview/visemeMapper';
import { type VideoAnalysisMetrics } from '../hooks/useVideoAnalysisML';
import { 
  Activity, HelpCircle, Maximize2, Mic, MicOff, PhoneOff, RotateCcw, 
  Send, ShieldAlert, SkipForward, Sun, Video, VideoOff, Moon,
  Volume2, Sparkles, CheckCircle2, Radio, MessageSquareQuote
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
  processingLabel = 'Ava is evaluating your response…',
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
  questionIndex = 1,
  totalQuestions = 5,
  questionDifficulty = 'Medium',
  onRepeatQuestion,
  onRequestClarification,
  onSkipQuestion,
}: NormalInterviewRoomProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Candidate Mic Audio Level Meter (0 - 100)
  const [micVolume, setMicVolume] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

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

  // Audio level analysis for live candidate speech feedback
  useEffect(() => {
    if (!mediaStream || !isMicOn) {
      setMicVolume(0);
      return;
    }

    try {
      const audioTracks = mediaStream.getAudioTracks();
      if (audioTracks.length === 0) return;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(mediaStream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setMicVolume(normalized);
        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (e) {
      console.warn('Audio metering unavailable:', e);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, [mediaStream, isMicOn]);

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

  const difficultyColor = 
    questionDifficulty.toLowerCase() === 'hard'
      ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
      : questionDifficulty.toLowerCase() === 'easy'
      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
      : 'bg-amber-500/10 text-amber-500 border-amber-500/30';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 font-sans select-none overflow-hidden transition-colors">
      
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

      {/* ─── 1. TOP HEADER: RU READY LOGO, ROLE ORAL INTERVIEW, THEME TOGGLE, END CALL ─── */}
      <header className="px-6 py-3 shrink-0 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md z-20 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md font-display ring-1 ring-white/20">
              RU
            </div>
            <span className="text-base font-bold text-white font-display tracking-tight">
              RU Ready
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700/60" />

          {/* Role Oral Interview Title */}
          <span className="text-sm font-semibold text-slate-200">
            {focusArea} Oral Interview
          </span>
        </div>

        {/* Right: Theme Toggle & Prominent End Call Button */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl transition-all cursor-pointer border flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 text-amber-300 border-slate-700 shadow-xs"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onEndInterview}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer font-display active:scale-95 border border-rose-500/40"
            title="End interview immediately"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>
      </header>

      {/* ─── 2. MAIN 2-PANEL BALANCED STAGE ─── */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch min-h-0 overflow-hidden relative">
        
        {/* ═══════════ LEFT PANEL: AI INTERVIEWER (EVA) ═══════════ */}
        <div className="w-full h-full flex flex-col bg-slate-900/90 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl relative transition-all group">
          
          {/* Subtle Ambient Glow Behind Avatar */}
          <div className="absolute inset-0 bg-radial-at-t from-blue-600/10 via-transparent to-transparent pointer-events-none" />

          {/* 3D Avatar Canvas */}
          <div className="relative flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black">
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

            {/* Minimal Eva Status Symbol Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/75 border border-slate-700/60 backdrop-blur-md text-[11px] font-mono text-slate-300 shadow-md">
              {aiIsSpeaking ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  <span className="text-blue-300 font-semibold">Eva speaking</span>
                </>
              ) : isProcessing ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                  <span className="text-purple-300 font-semibold">Eva thinking</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300">Eva listening</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════ RIGHT PANEL: CANDIDATE ═══════════ */}
        <div className="w-full h-full flex flex-col bg-slate-900/90 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl relative transition-all group">
          
          {/* Candidate Webcam Feed Area (Clean, no badges) */}
          <div className="relative flex-1 min-h-0 w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
            {mediaStream && isCameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="text-center space-y-3 p-6">
                <div className="h-16 w-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400 shadow-inner">
                  <VideoOff className="h-8 w-8 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200 font-display">Camera Feed Inactive</p>
                </div>
              </div>
            )}

            {/* Candidate Out-of-Camera Warning Overlay */}
            {videoMLMetrics && !videoMLMetrics.faceDetected && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md p-6 text-center animate-fadeIn">
                <div className="h-14 w-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 animate-pulse">
                  <VideoOff size={28} />
                </div>
                <h3 className="text-base font-bold text-white font-display">
                  Please come to the camera
                </h3>
                <p className="text-xs text-amber-300/90 mt-1 max-w-xs">
                  Your face is not detected in the frame. Answering is paused until you return.
                </p>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* ─── 3. FIXED POSITION TRANSCRIPT & LIVE DIALOGUE PANEL ─── */}
      <footer className="shrink-0 border-t border-slate-800/90 bg-slate-900/95 backdrop-blur-xl px-4 sm:px-6 py-3 z-30 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col gap-2">
          {/* Question / Eva Spoken Prompt */}
          <div className="flex items-start gap-2.5">
            <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Eva
            </span>
            <div className="flex-1 max-h-16 overflow-y-auto pr-1">
              <p className={`${currentQuestionText.length > 200 ? 'text-xs sm:text-sm' : 'text-sm'} text-slate-100 font-display font-medium leading-relaxed`}>
                {currentQuestionText || 'Preparing technical question...'}
              </p>
            </div>
          </div>

          {/* Candidate Live Speech Transcription */}
          <div className="flex items-start gap-2.5 pt-1.5 border-t border-slate-800/70">
            <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              You
            </span>
            <div className="flex-1 max-h-20 overflow-y-auto pr-1">
              {candidateTranscription ? (
                <p className={`${candidateTranscription.length > 220 ? 'text-xs sm:text-sm' : 'text-sm'} text-slate-200 font-sans leading-relaxed`}>
                  <span>{candidateTranscription}</span>
                  <span className="inline-block w-1.5 h-3.5 bg-emerald-400 ml-1.5 animate-pulse align-middle" />
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  {aiIsSpeaking
                    ? 'Eva is speaking...'
                    : isProcessing
                    ? (processingLabel || 'Eva is analyzing your response...')
                    : videoMLMetrics && !videoMLMetrics.faceDetected
                    ? 'Please return to the camera frame to continue answering...'
                    : 'Listening to your voice... Speak your response naturally.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
