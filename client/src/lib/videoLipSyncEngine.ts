// ═══════════════════════════════════════════════════════════════
// R U Ready? — Real-Time Video Call AI Avatar Lip-Sync & Expression Engine
// Phoneme Frame Interpolation, ARKit Blendshape Mapping, & Micro-Gestures
// ═══════════════════════════════════════════════════════════════

import { VisemeId, VisemeShape, VISEME_SHAPES, createSpeechVisemeTimeline } from './visemeEngine';

export type VideoExpressionState = 'NEUTRAL' | 'SMILING' | 'FOCUSED' | 'THINKING' | 'CONCERNED' | 'ENCOURAGING';
export type VideoAvatarState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'REACTING';

export interface VideoAvatarFrame {
  jawOpen: number;           // 0.0 to 1.0 (Mouth openness)
  lipWidth: number;          // 0.8 to 1.2 (Pucker / smile stretch)
  mouthCornerY: number;      // -0.5 to 0.5 (Smile elevation)
  eyeBlink: number;          // 0.0 (Open) to 1.0 (Closed)
  browRaise: number;         // 0.0 to 1.0 (Inner brow lift)
  headTiltX: number;         // Pitch in degrees
  headTiltY: number;         // Yaw in degrees
  headTiltZ: number;         // Roll in degrees
  expression: VideoExpressionState;
  activeViseme: VisemeId;
}

export type VisemeTimelineType = ReturnType<typeof createSpeechVisemeTimeline>;

/**
 * Calculates real-time video avatar frame pose, facial expression blendshapes,
 * and phoneme mouth lip-sync parameters based on audio clock.
 */
export function calculateVideoAvatarFrame(
  elapsedSec: number,
  timeline: VisemeTimelineType | null,
  avatarState: VideoAvatarState,
  expressionState: VideoExpressionState
): VideoAvatarFrame {
  const currentVisemeObj = timeline ? timeline.getVisemeAtTime(elapsedSec) : null;
  const activeViseme: VisemeId = currentVisemeObj ? currentVisemeObj.viseme : 'REST';
  const shape: VisemeShape = currentVisemeObj ? currentVisemeObj.shape : VISEME_SHAPES.REST;

  // 1. Base Jaw Openness from Viseme
  let jawOpen = shape.jawOpen;

  // 2. Natural Ambient Eye Blinking Cycle (Blinks every 3.5 seconds for ~180ms)
  const blinkCycle = (elapsedSec * 1000) % 3500;
  let eyeBlink = 0.0;
  if (blinkCycle > 3320) {
    const progress = (blinkCycle - 3320) / 180;
    eyeBlink = Math.sin(progress * Math.PI);
  }

  // 3. Ambient Natural Head Movements (Slight micro-gestures)
  let headTiltX = Math.sin(elapsedSec * 0.8) * 1.5;
  let headTiltY = Math.cos(elapsedSec * 0.5) * 2.0;
  let headTiltZ = Math.sin(elapsedSec * 0.6) * 1.0;

  // 4. Expression Blendshape Adjustments
  let lipWidth = 1.0;
  let mouthCornerY = 0.0;
  let browRaise = 0.2;

  switch (expressionState) {
    case 'SMILING':
    case 'ENCOURAGING':
      mouthCornerY = 0.35;
      lipWidth = 1.12;
      browRaise = 0.4;
      headTiltZ += 1.5;
      break;
    case 'FOCUSED':
      mouthCornerY = -0.05;
      lipWidth = 0.96;
      browRaise = 0.1;
      headTiltX -= 2.0;
      break;
    case 'THINKING':
      mouthCornerY = -0.1;
      lipWidth = 0.92;
      browRaise = 0.6;
      headTiltY += 3.5;
      headTiltZ -= 2.5;
      break;
    case 'CONCERNED':
      mouthCornerY = -0.25;
      lipWidth = 0.90;
      browRaise = 0.7;
      headTiltX += 2.0;
      break;
    default:
      mouthCornerY = 0.1;
      lipWidth = 1.0;
      browRaise = 0.2;
      break;
  }

  // 5. State Specific Gestures (e.g. Attentive Head Nods during Listening)
  if (avatarState === 'LISTENING') {
    headTiltX += Math.sin(elapsedSec * 1.2) * 2.5; // Attentive nod
    jawOpen = Math.min(jawOpen, 0.08);
  } else if (avatarState === 'THINKING') {
    headTiltY += Math.sin(elapsedSec * 0.4) * 4.0;
    jawOpen = 0.04;
  } else if (avatarState === 'SPEAKING') {
    headTiltX += Math.sin(elapsedSec * 2.5) * 1.2; // Rhythmic speaking motion
  }

  return {
    jawOpen: Math.max(0.04, Math.min(1.0, jawOpen)),
    lipWidth,
    mouthCornerY,
    eyeBlink: Math.max(0.0, Math.min(1.0, eyeBlink)),
    browRaise,
    headTiltX,
    headTiltY,
    headTiltZ,
    expression: expressionState,
    activeViseme,
  };
}
