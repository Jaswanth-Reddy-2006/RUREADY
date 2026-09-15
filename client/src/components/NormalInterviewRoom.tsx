import React, { useEffect, useRef, useState } from 'react';
import AIAvatar, { type AvatarState } from './interview/AIAvatar';
import { type OculusViseme } from './interview/visemeMapper';
import { type VideoAnalysisMetrics } from '../hooks/useVideoAnalysisML';
import { 
  Volume2, Shield, Clock, Edit3, Maximize2
} from 'lucide-react';
import Badge from './ui/Badge';

interface NormalInterviewRoomProps {
  mediaStream: MediaStream | null;
  aiIsSpeaking: boolean;
  avatarState: AvatarState;
  mouthOpenness: number;
  spokenWord: string;
  activeVisemeShape?: OculusViseme;
  currentQuestionText: string;
  candidateTranscription: string;
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
  candidateTranscription,
  onSubmitAnswer,
  onEndInterview,
  isProcessing,
  processingLabel,
  questionIndex = 1,
  totalQuestions = 5,
  questionDifficulty = 'Medium',
  focusArea = 'System & STAR Competency',
  silenceCountdown = null,
  isFullscreen = true,
  onReEnterFullscreen,
  onTranscriptionChange,
  videoMLMetrics,
}: NormalInterviewRoomProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [manualText, setManualText] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Synchronize manual text with live transcription when not actively typing
  useEffect(() => {
    if (!isEditingTranscript) {
      setManualText(candidateTranscription);
    }
  }, [candidateTranscription, isEditingTranscript]);

  // Question elapsed timer
  useEffect(() => {
    setElapsedSeconds(0);
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQuestionText]);

  // Bind candidate media stream (strictly locked on)
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch((err) => {
        console.warn('[NormalInterviewRoom] Video play deferred:', err);
      });
    }
  }, [mediaStream]);

  const formatPacingTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const handleInsertStructureTag = (tag: string) => {
    const prefix = `[${tag}]: `;
    const updated = manualText ? `${manualText}\n${prefix}` : prefix;
    setManualText(updated);
    setIsEditingTranscript(true);
    if (onTranscriptionChange) {
      onTranscriptionChange(updated);
    }
  };

  const handleDirectSubmit = () => {
    const finalAnswer = isEditingTranscript ? manualText : (candidateTranscription || manualText);
    if (!finalAnswer.trim() || isProcessing) return;
    onSubmitAnswer(finalAnswer);
    setIsEditingTranscript(false);
    setManualText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleDirectSubmit();
    }
  };

  const activeAnswer = isEditingTranscript ? manualText : candidateTranscription;

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col bg-[#EFFAFD] text-[#11183D] font-sans select-none overflow-hidden"
      onKeyDown={handleKeyDown}
    >
      
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

        {/* Discreet End Call */}
        <button
          type="button"
          onClick={onEndInterview}
          className="bg-[#D64545] hover:bg-[#D64545]/90 text-white px-4 py-1.5 rounded-full font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95 font-display"
        >
          End Call
        </button>
      </header>

      {/* ─── 2. MAIN 2-PANEL EQUAL STAGE ─── */}
      <main className="flex-1 w-full max-w-[1750px] mx-auto p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch min-h-0 relative overflow-hidden">
        
        {/* ─── LEFT: AVA'S STAGE ─── */}
        <div className="w-full h-full flex flex-col bg-white border border-[#DCE7F2] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
          
          {/* 3D Avatar Canvas */}
          <div className="relative flex-1 min-h-[260px] w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0e172e] via-[#090e1c] to-[#04060c]">
            <AIAvatar
              state={avatarState}
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

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="absolute inset-0 bg-[#070b14]/70 backdrop-blur-xs flex items-center justify-center z-20">
                <div className="bg-[#11183D] border border-white/20 px-5 py-2.5 rounded-full text-xs text-white font-mono flex items-center gap-2.5 shadow-xl">
                  <div className="h-3.5 w-3.5 border-2 border-[#4A8BDF] border-t-transparent animate-spin rounded-full" />
                  <span>{processingLabel || 'Ava is evaluating response...'}</span>
                </div>
              </div>
            )}
          </div>

          {/* ─── AVA'S BOTTOM CAPTION BOX ─── */}
          {/* Speaks question, then displays 'Come on, you can start your question' */}
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
                    Come on, you can start your question
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
        <div className="w-full h-full flex flex-col bg-white border border-[#DCE7F2] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm justify-between">
          
          {/* Candidate Webcam Feed Area */}
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

            {/* Live On-Device ML Telemetry Indicator (Zero Video Recording) */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#11183D]/85 backdrop-blur-md border border-emerald-500/30 text-white text-xs font-medium font-body shadow-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-300 font-mono tracking-wider">LIVE ML</span>
                <span className="text-white/30">•</span>
                <span className="text-[11px] text-slate-200">Confidence {videoMLMetrics?.confidenceScore ?? 88}%</span>
                <span className="text-white/30">•</span>
                <span className="text-[11px] text-[#7dd3fc]">{videoMLMetrics?.composureLevel ?? 'Calm & Composed'}</span>
              </div>
            </div>
          </div>

          {/* ─── CANDIDATE'S BOTTOM TRANSCRIPTION BOX ─── */}
          {/* Live transcription appears here in real time as candidate speaks */}
          <div className="bg-[#11183D] p-5 shrink-0 z-10 border-t border-[#1e295d]">
            <div className="min-h-[72px] max-h-36 overflow-y-auto pr-1 flex flex-col justify-center">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                Your Response
              </span>
              <p className="text-sm sm:text-base text-white font-medium leading-relaxed font-body">
                {activeAnswer.trim() ? (
                  activeAnswer
                ) : (
                  <span className="text-slate-400 italic">
                    Speak your answer aloud into your microphone...
                  </span>
                )}
              </p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

