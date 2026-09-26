import React from 'react';
import AvatarEngine3D, { AvatarPersona, FacialExpression } from './AvatarEngine3D';
import { OculusViseme } from './visemeMapper';
import { VisemeShape } from '../../lib/visemeEngine';
import { CharacterState } from './avatar/AvatarController';
import { getPlatformModel, subscribeToPlatformConfig } from '../../lib/platformConfig';

export type AvatarState = 'idle' | 'thinking' | 'speaking' | 'listening' | 'pleased' | 'concerned';

interface AIAvatarProps {
  state: AvatarState;
  expression?: FacialExpression;
  isSpeaking?: boolean;
  mouthOpenness?: number;
  activeVisemeShape?: OculusViseme | VisemeShape | string;
  currentWord?: string;
  persona?: AvatarPersona;
  subtitleText?: string;
  onPersonaChange?: (newPersona: AvatarPersona) => void;
  className?: string;
}

/** Map lowercase AIAvatar state → uppercase CharacterState for AvatarEngine3D */
function mapToCharacterState(state: AvatarState, isSpeaking: boolean): CharacterState {
  if (isSpeaking) return 'SPEAKING';
  switch (state) {
    case 'speaking': return 'SPEAKING';
    case 'thinking': return 'THINKING';
    case 'listening': return 'LISTENING';
    case 'pleased': return 'REACTING';
    case 'concerned': return 'REACTING';
    case 'idle':
    default: return 'IDLE';
  }
}

const AIAvatar: React.FC<AIAvatarProps> = ({
  state,
  expression,
  isSpeaking = false,
  mouthOpenness = 0.5,
  activeVisemeShape,
  currentWord,
  persona,
  subtitleText = '',
  onPersonaChange,
  className = '',
}) => {
  const [activePersona, setActivePersona] = React.useState<AvatarPersona>(persona || getPlatformModel());

  React.useEffect(() => {
    if (persona) {
      setActivePersona(persona);
    } else {
      setActivePersona(getPlatformModel());
      return subscribeToPlatformConfig(({ model }) => {
        setActivePersona(model);
      });
    }
  }, [persona]);

  return (
    <AvatarEngine3D
      state={mapToCharacterState(state, isSpeaking)}
      expression={expression || 'NEUTRAL'}
      speakingVolume={Math.round(mouthOpenness * 100)}
      activeVisemeShape={activeVisemeShape as OculusViseme}
      persona={activePersona}
      subtitleText={subtitleText || currentWord || ''}
      onPersonaChange={onPersonaChange}
      className={className}
    />
  );
};

export default React.memo(AIAvatar);
