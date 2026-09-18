// ═══════════════════════════════════════════════════════════════
// R U Ready? — Avatar Controller Master Orchestrator
// Unified State Machine (IDLE, LISTENING, THINKING, SPEAKING, PAUSED, INTERRUPTED)
// ═══════════════════════════════════════════════════════════════

import { FacialController, FacialExpression } from './FacialController';
import { EyeController } from './EyeController';
import { LipSyncController } from './LipSyncController';
import { VoiceController } from './VoiceController';
import { CaptionController } from './CaptionController';
import { OculusViseme } from '../visemeMapper';

export type CharacterState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'PAUSED' | 'INTERRUPTED' | 'REACTING';

export interface AvatarFrameState {
  state: CharacterState;
  expression: FacialExpression;
  viseme: OculusViseme;
  blendshapes: ReturnType<FacialController['getCurrentBlendshapes']>;
  eyeGaze: ReturnType<EyeController['update']>;
  isSpeaking: boolean;
  captionText: string;
}

export class AvatarController {
  public facial: FacialController;
  public eye: EyeController;
  public lipSync: LipSyncController;
  public voice: VoiceController;
  public caption: CaptionController;

  private state: CharacterState = 'IDLE';

  constructor() {
    this.facial = new FacialController();
    this.eye = new EyeController();
    this.lipSync = new LipSyncController();
    this.voice = new VoiceController();
    this.caption = new CaptionController();
  }

  public setState(state: CharacterState): void {
    this.state = state;
    if (state === 'LISTENING') {
      this.facial.setExpression('INTERESTED');
      this.facial.setViseme('viseme_sil');
    } else if (state === 'THINKING') {
      this.facial.setExpression('THINKING');
      this.facial.setViseme('viseme_sil');
    } else if (state === 'IDLE') {
      this.facial.setExpression('NEUTRAL');
      this.facial.setViseme('viseme_sil');
    } else if (state === 'INTERRUPTED' || state === 'PAUSED') {
      this.voice.stop();
      this.lipSync.stopTimeline();
      this.facial.setViseme('viseme_sil');
    }
  }

  public getState(): CharacterState {
    return this.state;
  }

  public speakText(text: string, onComplete?: () => void): void {
    this.setState('SPEAKING');
    this.facial.setExpression('SPEAKING');

    const cleanText = this.voice.sanitizeMarkdown(text);
    this.caption.setCaptionText(cleanText);
    this.lipSync.startTimeline(cleanText);

    this.voice.speak(text, {
      onStart: () => {
        this.setState('SPEAKING');
      },
      onWordBoundary: (_word, charIndex) => {
        this.caption.updateActiveWordByCharIndex(charIndex);
      },
      onEnd: () => {
        this.lipSync.stopTimeline();
        this.facial.setViseme('viseme_sil');
        this.setState('LISTENING');
        onComplete?.();
      },
    });
  }

  public stopSpeaking(): void {
    this.voice.stop();
    this.lipSync.stopTimeline();
    this.facial.setViseme('viseme_sil');
    this.setState('LISTENING');
  }

  public updateFrame(frame: number, externalViseme?: OculusViseme): AvatarFrameState {
    const isSpeaking = this.voice.getIsSpeaking();

    let activeViseme: OculusViseme = 'viseme_sil';
    if (externalViseme) {
      activeViseme = externalViseme;
    } else if (isSpeaking) {
      const elapsedSec = this.voice.getElapsedAudioSeconds();
      const visemeFrame = this.lipSync.getVisemeAtAudioTime(elapsedSec);
      activeViseme = visemeFrame.viseme;
    }

    this.facial.setViseme(activeViseme);

    const blendshapes = this.facial.update(0.24);
    const eyeGaze = this.eye.update(frame, this.state);

    return {
      state: this.state,
      expression: this.facial.getExpression(),
      viseme: activeViseme,
      blendshapes,
      eyeGaze,
      isSpeaking,
      captionText: this.caption.getFullText(),
    };
  }
}
