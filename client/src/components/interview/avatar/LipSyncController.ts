// ═══════════════════════════════════════════════════════════════
// R U Ready? — Lip Sync Controller Module
// Audio Clock Timeline & Phoneme-to-Viseme Interpolation Engine
// ═══════════════════════════════════════════════════════════════

import { OculusViseme } from '../visemeMapper';
import { createSpeechVisemeTimeline, VisemeTimeline, VisemeShape, VISEME_SHAPES } from '../../../lib/visemeEngine';

export interface ActiveVisemeFrame {
  viseme: OculusViseme;
  shape: VisemeShape;
  openness: number;
}

export class LipSyncController {
  private timeline: VisemeTimeline | null = null;
  private isSyncActive = false;

  public startTimeline(cleanText: string): void {
    this.timeline = createSpeechVisemeTimeline(cleanText);
    this.isSyncActive = true;
  }

  public stopTimeline(): void {
    this.timeline = null;
    this.isSyncActive = false;
  }

  public getVisemeAtAudioTime(elapsedSeconds: number): ActiveVisemeFrame {
    if (!this.isSyncActive || !this.timeline) {
      return {
        viseme: 'viseme_sil',
        shape: VISEME_SHAPES.REST,
        openness: 0.04,
      };
    }

    const current = this.timeline.getVisemeAtTime(elapsedSeconds);
    const viseme = (current.viseme as OculusViseme) || 'viseme_sil';

    return {
      viseme,
      shape: current.shape,
      openness: current.shape.jawOpen,
    };
  }
}
