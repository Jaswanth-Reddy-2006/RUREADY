// ═══════════════════════════════════════════════════════════════
// R U Ready? — LiveTranscript Component
// Scrolling conversation transcript — combined or split by speaker
// ═══════════════════════════════════════════════════════════════

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TranscriptEntry {
  id: string;
  speaker: 'ai' | 'user';
  text: string;
  timestamp: number;
}

interface LiveTranscriptProps {
  entries: TranscriptEntry[];
  isVisible: boolean;
  className?: string;
  /** When true, show Ava and You in separate columns */
  splitView?: boolean;
}

function TranscriptBubble({
  entry,
  align,
}: {
  entry: TranscriptEntry;
  align: 'left' | 'right';
}) {
  const isAi = entry.speaker === 'ai';
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`mb-2 last:mb-0 ${align === 'right' ? 'text-right' : 'text-left'}`}
    >
      <span
        className={`mb-1 inline-block text-[10px] font-semibold uppercase tracking-wider ${
          isAi ? 'text-[#F5A623]/70' : 'text-[#00897B]/70'
        }`}
      >
        {isAi ? 'Ava (AI)' : 'You'}
      </span>
      <p
        className={`mt-0.5 rounded-lg px-3 py-2 text-sm leading-relaxed ${
          isAi
            ? 'bg-white/5 text-white/85'
            : 'bg-[#00897B]/10 text-white/85'
        } ${align === 'right' ? 'ml-auto' : 'mr-auto'} max-w-full`}
      >
        {entry.text}
      </p>
    </motion.div>
  );
}

const LiveTranscript: React.FC<LiveTranscriptProps> = ({
  entries,
  isVisible,
  className = '',
  splitView = false,
}) => {
  const aiScrollRef = useRef<HTMLDivElement>(null);
  const userScrollRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const aiEntries = entries.filter((e) => e.speaker === 'ai');
  const userEntries = entries.filter((e) => e.speaker === 'user');
  const visibleEntries = entries.slice(-6);

  useEffect(() => {
    const refs = splitView
      ? [aiScrollRef, userScrollRef]
      : [scrollRef];
    refs.forEach((ref) => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    });
  }, [entries, splitView]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`rounded-xl border border-white/5 bg-black/50 backdrop-blur-lg ${className}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {splitView ? (
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:divide-x sm:divide-white/10">
              <div className="px-4 py-3">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#F5A623]/80">
                  Ava — AI Interviewer
                </p>
                <div
                  ref={aiScrollRef}
                  className="max-h-[160px] overflow-y-auto scroll-smooth"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}
                >
                  {aiEntries.length === 0 ? (
                    <p className="text-xs text-white/35">Waiting for Ava to speak…</p>
                  ) : (
                    aiEntries.slice(-8).map((entry) => (
                      <TranscriptBubble key={entry.id} entry={entry} align="left" />
                    ))
                  )}
                </div>
              </div>
              <div className="border-t border-white/10 px-4 py-3 sm:border-t-0">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#00897B]/80">
                  You
                </p>
                <div
                  ref={userScrollRef}
                  className="max-h-[160px] overflow-y-auto scroll-smooth"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}
                >
                  {userEntries.length === 0 ? (
                    <p className="text-xs text-white/35">Your answers will appear here…</p>
                  ) : (
                    userEntries.slice(-8).map((entry) => (
                      <TranscriptBubble key={entry.id} entry={entry} align="right" />
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="max-h-[180px] overflow-y-auto scroll-smooth px-4 py-3"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}
            >
              <AnimatePresence>
                {visibleEntries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: entry.speaker === 'ai' ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mb-2 last:mb-0"
                  >
                    <div className={`flex gap-2 ${entry.speaker === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div
                        className={`mt-1 h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          entry.speaker === 'ai'
                            ? 'bg-[#F5A623]/20 text-[#F5A623]'
                            : 'bg-[#00897B]/20 text-[#00897B]'
                        }`}
                      >
                        {entry.speaker === 'ai' ? 'A' : 'Y'}
                      </div>
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                          entry.speaker === 'ai'
                            ? 'bg-white/5 text-white/85'
                            : 'bg-[#00897B]/10 text-white/85'
                        }`}
                      >
                        <span
                          className={`mb-0.5 block text-[10px] font-semibold uppercase tracking-wider ${
                            entry.speaker === 'ai' ? 'text-[#F5A623]/70' : 'text-[#00897B]/70'
                          }`}
                        >
                          {entry.speaker === 'ai' ? 'Ava' : 'You'}
                        </span>
                        {entry.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(LiveTranscript);
