import React from 'react';
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

  // Convert legacy VisemeShape if string/object passed
  let oculusViseme: OculusViseme | undefined = undefined;
  if (typeof activeVisemeShape === 'string') {
    oculusViseme = activeVisemeShape as OculusViseme;
  }

  return (
    <AvatarEngine3D
      persona={persona}
      state={mappedState}
      expression={mappedExpression}
      speakingVolume={volume}
      activeVisemeShape={oculusViseme}
      subtitleText={subtitleText || currentWord}
      onPersonaChange={onPersonaChange}
      className={className}
    />
  );
};

export default React.memo(AIAvatar);
