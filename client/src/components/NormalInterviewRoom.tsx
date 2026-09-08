import React, { useEffect, useRef, useState } from 'react';
import AIAvatar, { type AvatarState } from './interview/AIAvatar';
import { Mic, MicOff, Video, VideoOff, Volume2, PhoneOff } from 'lucide-react';
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
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);

  // Bind candidate media stream
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch((err) => {
        console.warn('[NormalInterviewRoom] Video play deferred:', err);
      });
    }
  }, [mediaStream]);

  // Handle local track toggle
  const toggleMic = () => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = isMicMuted;
      });
      setIsMicMuted(!isMicMuted);
    }
  };

  const toggleCamera = () => {
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach((track) => {
        track.enabled = isCameraOff;
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white font-sans select-none overflow-hidden">
      
      {/* ─── 1. TOP MINIMAL BAR ─── */}
      <header className="h-16 px-6 sm:px-8 flex items-center justify-between z-20 shrink-0 border-b border-white/5 bg-black">
        {/* Left: Brand */}
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-black tracking-tight font-display text-white">
            R U Ready?
          </span>
        </div>

        {/* Right: Leave Meeting Action */}
        <button
          onClick={onEndInterview}
          className="bg-[#E53935] hover:bg-[#D32F2F] text-white px-5 py-2 rounded-full font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
        >
          <PhoneOff size={16} />
          <span>Leave</span>
        </button>
      </header>

      {/* ─── 2. MAIN 2-PANEL EQUAL STAGE (Desktop Split / Mobile Stacked) ─── */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center min-h-0">
        
        {/* ─── LEFT: 3D AI INTERVIEWER STAGE ─── */}
        <div className="w-full h-full aspect-[4/3] md:aspect-auto bg-[#0A0A0C] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden relative flex items-center justify-center shadow-2xl">
          <AIAvatar
            state={avatarState}
            isSpeaking={aiIsSpeaking}
            mouthOpenness={mouthOpenness}
            currentWord={spokenWord}
            persona="AVA"
            className="w-full h-full object-cover"
          />

          {/* Subtitle / Sub-Caption Overlay (Question or Speech) */}
          {captionsEnabled && (currentQuestionText || candidateTranscription) && (
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <div className="bg-slate-950/85 backdrop-blur-md border border-white/15 px-4 sm:px-5 py-3 rounded-2xl shadow-2xl max-w-xl text-left animate-fade-in flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-white/80">
                  <Volume2 size={12} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed font-body">
                    {aiIsSpeaking ? (spokenWord || currentQuestionText) : (currentQuestionText || candidateTranscription)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-20">
              <div className="bg-slate-900/90 border border-white/10 px-5 py-2.5 rounded-full text-xs text-white/80 font-mono flex items-center gap-2 shadow-2xl">
                <div className="h-3 w-3 border-2 border-white border-t-transparent animate-spin rounded-full" />
                <span>{processingLabel || 'Ava is thinking...'}</span>
              </div>
            </div>
          )}
        </div>

        {/* ─── RIGHT: CANDIDATE WEBCAM STAGE ─── */}
        <div className="w-full h-full aspect-[4/3] md:aspect-auto bg-[#0A0A0C] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden relative flex items-center justify-center shadow-2xl">
          {mediaStream && !isCameraOff ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          ) : (
            <div className="text-center space-y-2 p-6">
              <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/40">
                <VideoOff size={24} />
              </div>
              <p className="text-xs text-white/50 font-medium">Camera Paused</p>
            </div>
          )}
        </div>

      </main>

      {/* ─── 3. BOTTOM MINIMAL FLOATING CONTROLS DOCK ─── */}
      <footer className="h-20 px-6 flex items-center justify-center shrink-0 bg-black border-t border-white/5 z-20">
        <div className="flex items-center gap-3 sm:gap-4 bg-white/5 border border-white/10 p-2 rounded-full shadow-2xl backdrop-blur-md">
          {/* Mic Toggle */}
          <button
            onClick={toggleMic}
            className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isMicMuted
                ? 'bg-rose-600 text-white shadow-lg'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
            title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Camera Toggle */}
          <button
            onClick={toggleCamera}
            className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isCameraOff
                ? 'bg-rose-600 text-white shadow-lg'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
            title={isCameraOff ? 'Turn On Camera' : 'Turn Off Camera'}
          >
            {isCameraOff ? <VideoOff size={18} /> : <Video size={18} />}
          </button>

          {/* Subtitles Toggle */}
          <button
            onClick={() => setCaptionsEnabled(!captionsEnabled)}
            className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              captionsEnabled
                ? 'bg-white text-black font-bold text-xs shadow-lg'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
            title="Toggle Subtitles"
          >
            CC
          </button>

          {/* Submit / Finish Answer Button */}
          {candidateTranscription.trim() && (
            <button
              disabled={isProcessing}
              onClick={() => onSubmitAnswer(candidateTranscription)}
              className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs sm:text-sm hover:bg-slate-200 transition-all cursor-pointer shadow-lg ml-2 animate-fade-in"
            >
              Submit Answer →
            </button>
          )}
        </div>
      </footer>

    </div>
  );
}
