// ═══════════════════════════════════════════════════════════════
// R U Ready? — FloatingControls Component
// Glass-morphism control bar: Mic, Camera, End Call
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

interface FloatingControlsProps {
  isMicOn: boolean;
  isCameraOn: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onEndInterview: () => void;
  className?: string;
}

const FloatingControls: React.FC<FloatingControlsProps> = ({
  isMicOn,
  isCameraOn,
  onToggleMic,
  onToggleCamera,
  onEndInterview,
  className = '',
}) => {
  return (
    <motion.div
      className={`flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 px-6 py-3 backdrop-blur-xl ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
    >
      {/* Mic Toggle */}
      <motion.button
        onClick={onToggleMic}
        className={`group relative flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-200 ${
          isMicOn
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-red-600/80 hover:bg-red-600 text-white'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
      >
        {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
        {/* Tooltip */}
        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/80 px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          {isMicOn ? 'Mute' : 'Unmute'}
        </span>
      </motion.button>

      {/* Camera Toggle */}
      <motion.button
        onClick={onToggleCamera}
        className={`group relative flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-200 ${
          isCameraOn
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-red-600/80 hover:bg-red-600 text-white'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
      >
        {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/80 px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          {isCameraOn ? 'Camera Off' : 'Camera On'}
        </span>
      </motion.button>

      {/* Divider */}
      <div className="h-8 w-px bg-white/20" />

      {/* End Interview */}
      <motion.button
        onClick={onEndInterview}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 transition-colors duration-200 hover:bg-red-500"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="End interview"
      >
        <PhoneOff size={20} />
        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/80 px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          End Interview
        </span>
      </motion.button>
    </motion.div>
  );
};

export default React.memo(FloatingControls);
