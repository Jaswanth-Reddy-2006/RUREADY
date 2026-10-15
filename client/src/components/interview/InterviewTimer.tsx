// ═══════════════════════════════════════════════════════════════
// R U Ready? — InterviewTimer Component
// Minimal timer + question counter overlay
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface InterviewTimerProps {
  isRunning: boolean;
  className?: string;
}

const InterviewTimer: React.FC<InterviewTimerProps> = ({
  isRunning,
  className = '',
}) => {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <motion.div
      className={`flex items-center ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-slate-700/60 bg-slate-800/80 backdrop-blur-md shadow-xs text-slate-100">
        <div className="relative flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-500/20 animate-ping" />
        </div>
        <span className="font-mono text-xs font-bold tracking-wider tabular-nums text-slate-100">
          {timeStr}
        </span>
      </div>
    </motion.div>
  );
};

export default React.memo(InterviewTimer);
