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
  private nextBlinkFrame = 120;

  private currentLookX = 0;
  private currentLookY = 0;
  private targetLookX = 0;
  private targetLookY = 0;
  private nextSaccadeFrame = 150;

  public update(frame: number, characterState: string): EyeGazeState {
    // ─── 1. BIOPHYSIOLOGICAL BLINKING PHYSICS ───
    let blinkWeight = 0;
    if (frame >= this.nextBlinkFrame && !this.isBlinking) {
      this.isBlinking = true;
      this.blinkProgress = 0;
    }

    if (this.isBlinking) {
      // Swift descent (~75ms), smooth ascent (~125ms)
      this.blinkProgress += this.isDoubleBlink ? 0.24 : 0.17;
      if (this.blinkProgress >= 1) {
        this.isBlinking = false;
        this.blinkProgress = 0;
        if (!this.isDoubleBlink && Math.random() < 0.22) {
          this.isDoubleBlink = true;
          this.nextBlinkFrame = frame + 6;
        } else {
          this.isDoubleBlink = false;
          this.nextBlinkFrame = frame + 150 + Math.floor(Math.random() * 180);
        }
      } else {
        blinkWeight = Math.sin(Math.pow(this.blinkProgress, 0.72) * Math.PI);
      }
    }

    // ─── 2. EYE GAZE SACCADES & DIRECT CAMERA EYE CONTACT ───
    if (frame >= this.nextSaccadeFrame) {
      this.nextSaccadeFrame = frame + 140 + Math.floor(Math.random() * 160);
      if (characterState === 'THINKING') {
        this.targetLookX = (Math.random() > 0.5 ? 1 : -1) * (0.15 + Math.random() * 0.25);
        this.targetLookY = 0.22 + Math.random() * 0.18;
      } else if (characterState === 'LISTENING') {
        this.targetLookX = (Math.random() - 0.5) * 0.10;
        this.targetLookY = (Math.random() - 0.5) * 0.06;
      } else {
        this.targetLookX = (Math.random() - 0.5) * 0.07;
        this.targetLookY = (Math.random() - 0.5) * 0.05;
      }
    }

    this.currentLookX = THREE.MathUtils.lerp(this.currentLookX, this.targetLookX, 0.12);
    this.currentLookY = THREE.MathUtils.lerp(this.currentLookY, this.targetLookY, 0.12);

    return {
      lookX: this.currentLookX,
      lookY: this.currentLookY,
      blinkWeight,
    };
  }
}
