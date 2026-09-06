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
      className={`flex items-center gap-4 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Timer */}
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-lg">
        {/* Recording dot */}
        <motion.div
          className="h-2 w-2 rounded-full bg-red-500"
          animate={{
            opacity: isRunning ? [1, 0.3, 1] : 0.3,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <span className="font-mono text-sm font-medium text-white/90 tabular-nums">
          {timeStr}
        </span>
      </div>

    </motion.div>
  );
};

export default React.memo(InterviewTimer);
