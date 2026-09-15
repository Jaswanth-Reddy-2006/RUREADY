// ═══════════════════════════════════════════════════════════════
// R U Ready? — Candidate Workspace Live Video Feed & Telemetry HUD
// Real-Time Facial Expression, Speaking Confidence & Vocal Prosody
// Positioned directly inside the Coding & Hidden Test Workspace
// ═══════════════════════════════════════════════════════════════

import React, { useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { CandidateAnalysisMetrics } from '../../hooks/useCandidateAnalysis';

interface CandidateWorkspaceFeedProps {
  stream: MediaStream | null;
  isCameraOn: boolean;
  isMicOn: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  metrics: CandidateAnalysisMetrics;
  className?: string;
}

export const CandidateWorkspaceFeed: React.FC<CandidateWorkspaceFeedProps> = ({
  stream,
  isCameraOn,
  isMicOn,
  onToggleMic,
  onToggleCamera,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && stream && isCameraOn) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isCameraOn]);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-[#0A0E1A] border border-white/10 shadow-lg flex flex-col group ${className}`}
    >
      {/* Video Canvas */}
      <div className="relative flex-1 w-full h-full min-h-[140px] bg-slate-950 flex items-center justify-center overflow-hidden">
        {isCameraOn && stream ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 p-4 text-center">
            <VideoOff size={24} className="mb-1 text-slate-600" />
            <span className="text-[11px] font-mono">Camera Paused</span>
          </div>
        )}

        {/* Subtle Hover Hardware Controls */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            type="button"
            onClick={onToggleMic}
            className="p-1.5 rounded-lg bg-black/70 hover:bg-black text-white border border-white/15 transition-colors cursor-pointer"
            title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isMicOn ? <Mic size={12} className="text-emerald-400" /> : <MicOff size={12} className="text-rose-400" />}
          </button>
          <button
            type="button"
            onClick={onToggleCamera}
            className="p-1.5 rounded-lg bg-black/70 hover:bg-black text-white border border-white/15 transition-colors cursor-pointer"
            title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
          >
            {isCameraOn ? <Video size={12} className="text-[#4A8BDF]" /> : <VideoOff size={12} className="text-rose-400" />}
          </button>
        </div>
      </div>
    </div>
  );
};
