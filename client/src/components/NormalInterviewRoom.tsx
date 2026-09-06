import React, { useEffect, useRef } from 'react';
import AIAvatar, { type AvatarState } from './interview/AIAvatar';
import { Shield, Volume2, Sparkles, CheckCircle2, Mic, ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { useFaceTelemetry } from '../hooks/useFaceTelemetry';
import { useParams } from 'react-router-dom';

interface NormalInterviewRoomProps {
  mediaStream: MediaStream | null;
  aiIsSpeaking: boolean;
  avatarState: AvatarState;
  mouthOpenness: number;
  spokenWord: string;
  currentQuestionText: string;
  candidateTranscription: string;
  onSubmitAnswer: (answer: string) => void;
  onEndInterview: () => void;
  isProcessing: boolean;
  processingLabel: string;
}

export default function NormalInterviewRoom({
  mediaStream,
  aiIsSpeaking,
  avatarState,
  mouthOpenness,
  spokenWord,
  currentQuestionText,
  candidateTranscription,
  onSubmitAnswer,
  onEndInterview,
  isProcessing,
  processingLabel,
}: NormalInterviewRoomProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const { id: sessionId } = useParams<{ id: string }>();
  const isCameraActive = !!(mediaStream && mediaStream.getVideoTracks().length > 0 && mediaStream.getVideoTracks()[0].enabled);
  const { stressCoefficient, isOffGaze, eyeGazeScore } = useFaceTelemetry(mediaStream, isCameraActive, sessionId);

  // Bind local camera media stream
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      const videoTracks = mediaStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoRef.current.srcObject = new MediaStream(videoTracks);
      }
    }
  }, [mediaStream]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full bg-navy-deep text-white font-body p-4 sm:p-6 select-none overflow-y-auto space-y-5">
      <style>{`
        @keyframes dynamicWave {
          0%, 100% { height: 6px; }
          50% { height: 32px; }
        }
        .elegant-bar {
          width: 4px;
          background: linear-gradient(135deg, #FF8A00 0%, #FF5A1F 100%);
          border-radius: 999px;
          transition: all 0.2s ease;
        }
        .elegant-bar-active-0 { animation: dynamicWave 0.9s ease-in-out infinite 0.1s; }
        .elegant-bar-active-1 { animation: dynamicWave 0.9s ease-in-out infinite 0.3s; }
        .elegant-bar-active-2 { animation: dynamicWave 0.9s ease-in-out infinite 0.5s; }
        .elegant-bar-active-3 { animation: dynamicWave 0.9s ease-in-out infinite 0.2s; }
        .elegant-bar-active-4 { animation: dynamicWave 0.9s ease-in-out infinite 0.4s; }
        .elegant-bar-active-5 { animation: dynamicWave 0.9s ease-in-out infinite 0.6s; }
      `}</style>

      {/* Two-Column Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1 min-h-0">
        
        {/* Left Column: AI Interrogator Card */}
        <div className="bg-navy-dark border border-navy-border/60 p-6 shadow-card-dark flex flex-col justify-between relative rounded-3xl min-h-[380px] md:h-full">
          {/* Header Status Label */}
          <div className="flex items-center justify-between border-b border-navy-border/40 pb-3.5 shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-display">
              AI Interview Coach
            </span>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${aiIsSpeaking ? 'bg-orange-bright animate-pulse' : avatarState === 'thinking' ? 'bg-orange-primary' : 'bg-status-success'}`} />
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-300 font-display">
                {aiIsSpeaking ? 'Speaking' : avatarState}
              </span>
            </div>
          </div>

          {/* AI Avatar Core Frame */}
          <div className="flex-1 w-full flex flex-col items-center justify-center p-4 relative min-h-0">
            <div className="w-full max-w-[260px] aspect-square flex items-center justify-center bg-navy-surface/60 border border-navy-border/50 p-6 rounded-full shadow-inner relative overflow-hidden">
              <AIAvatar
                state={avatarState}
                isSpeaking={aiIsSpeaking}
                mouthOpenness={mouthOpenness}
                currentWord={spokenWord}
                className="w-full h-full object-contain"
              />
              
              {/* Dynamic waveform visual overlay */}
              <div className="absolute bottom-4 flex items-end gap-1.5 h-10 bg-navy-deep/90 border border-navy-border/80 px-3.5 py-2 shadow-lg rounded-2xl select-none">
                <span className="text-[10px] text-orange-primary font-bold uppercase tracking-wider mr-1 font-display flex items-center gap-1">
                  <Volume2 size={12} />
                  Live
                </span>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`elegant-bar ${
                      aiIsSpeaking ? `elegant-bar-active-${i}` : 'h-1.5'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="border-t border-navy-border/40 pt-3 flex justify-between items-center shrink-0">
            <span className="text-[11px] text-slate-500 font-mono">
              Agent: Ava v1.2
            </span>
            <Badge variant="teal" size="xs">
              Live Interrogation
            </Badge>
          </div>

          {/* Computing metrics overlay */}
          {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-deep/95 z-20 p-8 text-center rounded-3xl backdrop-blur-sm">
              <div className="relative h-12 w-12 flex items-center justify-center mb-4">
                <div className="absolute inset-0 rounded-full border-3 border-dashed border-orange-primary animate-spin" />
                <Sparkles size={18} className="text-orange-primary" />
              </div>
              <span className="text-sm font-extrabold font-display tracking-wider text-white mb-1">
                COMPUTING RESPONSE
              </span>
              <p className="text-xs text-slate-400 font-body">
                {processingLabel || 'Evaluating candidate answer...'}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: User webcam capture stream */}
        <div className="bg-navy-dark border border-navy-border/60 p-6 shadow-card-dark flex flex-col justify-between relative rounded-3xl min-h-[380px] md:h-full">
          {/* Header Status Label */}
          <div className="flex items-center justify-between border-b border-navy-border/40 pb-3.5 shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-display">
              Candidate Video Stream
            </span>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-status-success animate-pulse" />
              <span className="text-[11px] text-status-success uppercase font-bold tracking-wider font-display">
                Stream Live
              </span>
            </div>
          </div>

          {/* User Video Frame */}
          <div className="flex-1 w-full flex items-center justify-center p-3 min-h-0">
            <div className="w-full max-w-[340px] aspect-[4/3] bg-navy-surface border border-navy-border overflow-hidden relative rounded-2xl shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
              
              {/* Telemetry overlay badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                <span className="px-2.5 py-1 bg-navy-deep/80 backdrop-blur-sm text-[10px] font-bold text-status-success border border-status-success/30 rounded-lg tracking-wider font-mono">
                  Gaze: {eyeGazeScore}%
                </span>
                <span className={`px-2.5 py-1 bg-navy-deep/80 backdrop-blur-sm text-[10px] font-bold border rounded-lg tracking-wider font-mono ${
                  stressCoefficient > 0.4 ? 'text-status-error border-status-error/30 animate-pulse' : 'text-orange-primary border-orange-primary/30'
                }`}>
                  Stress: {Math.round(stressCoefficient * 100)}%
                </span>
              </div>

              {/* Look-away Warning */}
              {isOffGaze && (
                <div className="absolute inset-0 bg-status-error/20 border-2 border-status-error flex items-center justify-center z-10 pointer-events-none animate-pulse">
                  <span className="bg-status-error text-white text-xs font-bold tracking-wider px-3 py-1.5 uppercase rounded-lg shadow-lg font-display">
                    Look Away Detected
                  </span>
                </div>
              )}

              <div className="absolute bottom-3 left-3 bg-navy-deep/80 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white rounded-full uppercase tracking-wider font-mono">
                Webcam Feed
              </div>
            </div>
          </div>

          {/* User Stream Info Baseline */}
          <div className="border-t border-navy-border/40 pt-3 flex justify-between items-center shrink-0">
            <span className="text-[11px] text-slate-500 font-mono">
              Hardware: Connected
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-status-success font-semibold font-display">
              <Shield size={13} />
              <span>Sandbox Secured</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Subtitle / Captions Bar */}
      <div className="bg-navy-dark border border-navy-border/60 p-6 shadow-card-dark flex flex-col gap-4 shrink-0 rounded-3xl relative">
        <div className="space-y-2">
          <Badge variant="orange" size="xs">
            Ava's Current Question
          </Badge>
          <p className="text-base sm:text-lg font-semibold leading-relaxed text-white font-display">
            {currentQuestionText || 'Establishing secure communication phase...'}
          </p>
        </div>

        {/* Live speech transcription */}
        {candidateTranscription && (
          <div className="border border-navy-border bg-navy-surface/40 px-4 py-3 text-xs text-slate-300 font-body rounded-2xl">
            <span className="text-[10px] font-bold text-orange-primary uppercase tracking-wider block mb-1 font-display">
              Live Speech Capture
            </span>
            <span className="leading-relaxed">{candidateTranscription}</span>
          </div>
        )}

        {/* Action controls */}
        <div className="border-t border-navy-border/40 pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>Security: Active</span>
            <span>•</span>
            <span>Speech Recognizer: Online</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              disabled={isProcessing || !candidateTranscription.trim()}
              onClick={() => {
                if (candidateTranscription.trim()) {
                  onSubmitAnswer(candidateTranscription);
                }
              }}
              size="md"
              iconRight={<ArrowRight size={16} />}
            >
              Finish Speaking & Submit Answer →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
