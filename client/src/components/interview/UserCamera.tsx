// ═══════════════════════════════════════════════════════════════
// R U Ready? — UserCamera Component
// Circular webcam feed with mic activity indicator
// ═══════════════════════════════════════════════════════════════

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface UserCameraProps {
  stream: MediaStream | null;
  isMicActive: boolean;
  isCameraOn: boolean;
  userName?: string;
  className?: string;
}

const UserCamera: React.FC<UserCameraProps> = ({
  stream,
  isMicActive,
  isCameraOn,
  userName = 'You',
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [micLevel, setMicLevel] = useState(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);

  // Attach stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Audio level analysis for mic indicator
  useEffect(() => {
    if (!stream || !isMicActive) {
      setMicLevel(0);
      return;
    }

    try {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
        setMicLevel(Math.min(1, avg / 128));
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();

      return () => {
        cancelAnimationFrame(animFrameRef.current);
        audioCtx.close();
      };
    } catch {
      // Audio context not available
    }
  }, [stream, isMicActive]);

  const borderGlow = isMicActive && micLevel > 0.05
    ? `0 0 ${12 + micLevel * 20}px rgba(245, 166, 35, ${0.3 + micLevel * 0.5})`
    : '0 0 0px rgba(245, 166, 35, 0)';

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl bg-[#1A1A1A] ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ boxShadow: borderGlow, transition: 'box-shadow 0.15s ease' }}
    >
      {/* Video feed */}
      {isCameraOn && stream ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2A2A2A] ring-2 ring-[#F5A623]/30">
            <span className="text-2xl font-bold text-[#F5A623]">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Name label */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Mic activity dot */}
          <motion.div
            className="h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor: isMicActive ? '#22C55E' : '#D93025',
            }}
            animate={isMicActive ? {
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7],
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <span className="text-sm font-medium text-white/90">{userName}</span>
        </div>
      </div>

      {/* Mic muted overlay indicator */}
      {!isMicActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-600/80 backdrop-blur-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .88-.16 1.72-.46 2.49" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};

export default React.memo(UserCamera);
