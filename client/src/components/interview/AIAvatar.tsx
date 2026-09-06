import React from 'react';
import AvaSvgAvatar from './AvaSvgAvatar';

export type AvatarState = 'idle' | 'thinking' | 'speaking' | 'listening' | 'pleased' | 'concerned';

interface AIAvatarProps {
  state: AvatarState;
  isSpeaking: boolean;
  mouthOpenness?: number;
  currentWord?: string;
  className?: string;
}

const AIAvatar: React.FC<AIAvatarProps> = ({
  state,
  isSpeaking,
  mouthOpenness = 0.08,
  currentWord,
  className = '',
}) => (
  <AvaSvgAvatar
    state={state}
    isSpeaking={isSpeaking}
    mouthOpenness={mouthOpenness}
    currentWord={currentWord}
    className={className}
  />
);

export default React.memo(AIAvatar);
