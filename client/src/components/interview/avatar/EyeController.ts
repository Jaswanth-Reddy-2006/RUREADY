// ═══════════════════════════════════════════════════════════════
// R U Ready? — Eye Controller Module
// Biophysiological Eyelid Blinking & Gaze Saccades Dynamics
// ═══════════════════════════════════════════════════════════════

import * as THREE from 'three';

export interface EyeGazeState {
  lookX: number;
  lookY: number;
  blinkWeight: number;
}

export class EyeController {
  private blinkProgress = 0;
  private isBlinking = false;
  private isDoubleBlink = false;
  private timeSinceLastBlink = 0;
  private nextBlinkInterval = 3.2; // seconds between blinks

  private currentLookX = 0;
  private currentLookY = 0;
  private targetLookX = 0;
  private targetLookY = 0;
  private timeSinceLastSaccade = 0;
  private nextSaccadeInterval = 2.5;

  public update(frameOrDelta: number, characterState: string): EyeGazeState {
    // Determine delta time (if delta passed in seconds, e.g. ~0.016s, otherwise assume 60fps)
    const dt = frameOrDelta > 0 && frameOrDelta < 0.5 ? frameOrDelta : 0.016;

    // ─── 1. BIOPHYSIOLOGICAL BLINKING PHYSICS ───
    this.timeSinceLastBlink += dt;

    if (this.timeSinceLastBlink >= this.nextBlinkInterval && !this.isBlinking) {
      this.isBlinking = true;
      this.blinkProgress = 0;
      this.timeSinceLastBlink = 0;
    }

    let blinkWeight = 0;

    if (this.isBlinking) {
      // Human blink duration: ~180ms total (closing ~70ms, opening ~110ms)
      const blinkSpeed = this.isDoubleBlink ? 8.5 : 6.0;
      this.blinkProgress += dt * blinkSpeed;

      if (this.blinkProgress >= 1.0) {
        this.isBlinking = false;
        this.blinkProgress = 0;
        if (!this.isDoubleBlink && Math.random() < 0.25) {
          // 25% chance of realistic double-blink
          this.isDoubleBlink = true;
          this.nextBlinkInterval = 0.12;
        } else {
          this.isDoubleBlink = false;
          // Natural Poisson-like interval between 2.2s and 4.8s
          this.nextBlinkInterval = 2.2 + Math.random() * 2.6;
        }
      } else {
        // Asymmetric sine curve for rapid close, soft open
        if (this.blinkProgress < 0.38) {
          // Closing phase (rapid ease-in)
          blinkWeight = Math.sin((this.blinkProgress / 0.38) * (Math.PI / 2));
        } else {
          // Opening phase (smooth ease-out)
          const openP = (this.blinkProgress - 0.38) / 0.62;
          blinkWeight = Math.cos(openP * (Math.PI / 2));
        }
      }
    }

    // ─── 2. EYE GAZE SACCADES & REALISTIC MICRO-MOVEMENTS ───
    this.timeSinceLastSaccade += dt;

    if (this.timeSinceLastSaccade >= this.nextSaccadeInterval) {
      this.timeSinceLastSaccade = 0;
      this.nextSaccadeInterval = 1.8 + Math.random() * 2.8;

      if (characterState === 'THINKING') {
        // Thoughtful upward-lateral gaze shift
        this.targetLookX = (Math.random() > 0.5 ? 1 : -1) * (0.12 + Math.random() * 0.18);
        this.targetLookY = 0.15 + Math.random() * 0.14;
      } else if (characterState === 'LISTENING') {
        // Direct, attentive eye contact with subtle micro-tracking of speaker
        this.targetLookX = (Math.random() - 0.5) * 0.06;
        this.targetLookY = (Math.random() - 0.5) * 0.04;
      } else if (characterState === 'SPEAKING') {
        // Conversational natural eye contact
        this.targetLookX = (Math.random() - 0.5) * 0.08;
        this.targetLookY = (Math.random() - 0.5) * 0.05;
      } else {
        // Calm resting gaze
        this.targetLookX = (Math.random() - 0.5) * 0.04;
        this.targetLookY = (Math.random() - 0.5) * 0.03;
      }
    }

    this.currentLookX = THREE.MathUtils.lerp(this.currentLookX, this.targetLookX, dt * 10);
    this.currentLookY = THREE.MathUtils.lerp(this.currentLookY, this.targetLookY, dt * 10);

    return {
      lookX: this.currentLookX,
      lookY: this.currentLookY,
      blinkWeight: Math.max(0, Math.min(1, blinkWeight)),
    };
  }
}
