import React, { useState, useCallback } from 'react';
import AvatarEngine3D, { AvatarPersona, AvatarState as AvatarEngineState, FacialExpression } from './AvatarEngine3D';
import { OculusViseme } from './visemeMapper';
import { VisemeShape } from '../../lib/visemeEngine';

export type AvatarState = 'idle' | 'thinking' | 'speaking' | 'listening' | 'pleased' | 'concerned';

interface AIAvatarProps {
  state: AvatarState;
  expression?: FacialExpression;
  isSpeaking?: boolean;
  mouthOpenness?: number;
  activeVisemeShape?: OculusViseme | VisemeShape;
  currentWord?: string;
  persona?: AvatarPersona;
  subtitleText?: string;
  onPersonaChange?: (newPersona: AvatarPersona) => void;
  className?: string;
}

const AIAvatar: React.FC<AIAvatarProps> = ({
  state,
  expression,
  isSpeaking = false,
  mouthOpenness = 0.5,
  activeVisemeShape,
  currentWord,
  persona = 'AVA',
  subtitleText = '',
  onPersonaChange,
  className = '',
}) => {
  const [captionWords, setCaptionWords] = useState<{ text: string; isSpoken: boolean }[]>([]);

  let mappedState: AvatarEngineState = 'IDLE';
  let mappedExpression: FacialExpression = expression || 'NEUTRAL';

  if (isSpeaking || state === 'speaking') {
    mappedState = 'SPEAKING';
    if (!expression) mappedExpression = 'FOCUSED';
  } else if (state === 'thinking') {
    mappedState = 'THINKING';
    if (!expression) mappedExpression = 'THINKING';
  } else if (state === 'listening') {
    mappedState = 'LISTENING';
    if (!expression) mappedExpression = 'INTERESTED';
  } else if (state === 'pleased') {
    mappedState = 'REACTING';
    if (!expression) mappedExpression = 'ENCOURAGING';
  } else if (state === 'concerned') {
    mappedState = 'REACTING';
    if (!expression) mappedExpression = 'CONCERNED';
  }

  const volume = Math.round(mouthOpenness * 100);

  let oculusViseme: OculusViseme | undefined = undefined;
  if (typeof activeVisemeShape === 'string') {
    oculusViseme = activeVisemeShape as OculusViseme;
  }

  const handleCaptionWordsUpdate = useCallback((words: { text: string; isSpoken: boolean }[]) => {
    setCaptionWords(words);
  }, []);

  const displayText = subtitleText || currentWord || '';

  return (
    <div className={`relative flex flex-col w-full h-full ${className}`}>
      {/* Three.js 3D Avatar Render Viewport */}
      <div className="relative flex-1 w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#080d1a] shadow-2xl">
        <AvatarEngine3D
          persona={persona}
          state={mappedState}
          expression={mappedExpression}
          speakingVolume={volume}
          activeVisemeShape={oculusViseme}
          subtitleText={displayText}
          onPersonaChange={onPersonaChange}
          onCaptionWordsUpdate={handleCaptionWordsUpdate}
          className="w-full h-full"
        />

        {/* Live State & Speaker Badge Overlay */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium text-slate-200 shadow-md">
          <span className={`w-2 h-2 rounded-full ${mappedState === 'SPEAKING' ? 'bg-emerald-400 animate-pulse' : mappedState === 'THINKING' ? 'bg-amber-400 animate-ping' : 'bg-blue-400'}`} />
          <span>{persona === 'AVA' ? 'Ava (AI Recruiter)' : 'Ethan (AI Interviewer)'}</span>
        </div>
      </div>

      {/* Synchronized Captions Banner (Placed cleanly beneath character viewport) */}
      {displayText && (
        <div className="mt-3 px-4 py-3 bg-slate-950/90 backdrop-blur-lg border border-slate-800/80 rounded-xl shadow-xl text-center">
          <p className="text-sm md:text-base leading-relaxed font-sans text-slate-300">
            {captionWords.length > 0
              ? captionWords.map((word, idx) => (
                  <span
                    key={idx}
                    className={`transition-colors duration-150 mr-1 ${
                      word.isSpoken
                        ? 'text-blue-400 font-semibold drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                        : 'text-slate-400 opacity-80'
                    }`}
                  >
                    {word.text}
                  </span>
                ))
              : displayText}
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(AIAvatar);
