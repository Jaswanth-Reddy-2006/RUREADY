// ═══════════════════════════════════════════════════════════════
// R U Ready? — Oculus Visemes & ARKit Blendshapes Mapping Engine
// ═══════════════════════════════════════════════════════════════

export type OculusViseme =
  | 'viseme_sil'
  | 'viseme_PP'
  | 'viseme_FF'
  | 'viseme_TH'
  | 'viseme_DD'
  | 'viseme_kk'
  | 'viseme_CH'
  | 'viseme_SS'
  | 'viseme_nn'
  | 'viseme_RR'
  | 'viseme_aa'
  | 'viseme_E'
  | 'viseme_I'
  | 'viseme_O'
  | 'viseme_U';

export interface ARKitBlendshapes {
  jawOpen: number;
  mouthFunnel: number;
  mouthPucker: number;
  mouthSmileLeft: number;
  mouthSmileRight: number;
  mouthStretchLeft: number;
  mouthStretchRight: number;
  mouthRollLower: number;
  mouthRollUpper: number;
  browInnerUp: number;
  browOuterUpLeft: number;
  browOuterUpRight: number;
  browDownLeft: number;
  browDownRight: number;
  eyeBlinkLeft: number;
  eyeBlinkRight: number;
  eyeLookInLeft: number;
  eyeLookOutLeft: number;
  eyeLookInRight: number;
  eyeLookOutRight: number;
  eyeLookUpLeft: number;
  eyeLookUpRight: number;
  eyeLookDownLeft: number;
  eyeLookDownRight: number;
}

export const DEFAULT_ARKIT_BLENDSHAPES: ARKitBlendshapes = {
  jawOpen: 0,
  mouthFunnel: 0,
  mouthPucker: 0,
  mouthSmileLeft: 0.1,
  mouthSmileRight: 0.1,
  mouthStretchLeft: 0,
  mouthStretchRight: 0,
  mouthRollLower: 0,
  mouthRollUpper: 0,
  browInnerUp: 0,
  browOuterUpLeft: 0,
  browOuterUpRight: 0,
  browDownLeft: 0,
  browDownRight: 0,
  eyeBlinkLeft: 0,
  eyeBlinkRight: 0,
  eyeLookInLeft: 0,
  eyeLookOutLeft: 0,
  eyeLookInRight: 0,
  eyeLookOutRight: 0,
  eyeLookUpLeft: 0,
  eyeLookUpRight: 0,
  eyeLookDownLeft: 0,
  eyeLookDownRight: 0,
};

// Morph weights for each Oculus Viseme
export const OCULUS_VISEME_WEIGHTS: Record<OculusViseme, Partial<ARKitBlendshapes>> = {
  viseme_sil: { jawOpen: 0, mouthPucker: 0, mouthFunnel: 0 },
  viseme_PP: { jawOpen: 0.05, mouthPucker: 0.35, mouthRollLower: 0.2 },
  viseme_FF: { jawOpen: 0.1, mouthStretchLeft: 0.2, mouthStretchRight: 0.2 },
  viseme_TH: { jawOpen: 0.15, mouthFunnel: 0.1, mouthStretchLeft: 0.15, mouthStretchRight: 0.15 },
  viseme_DD: { jawOpen: 0.2, mouthStretchLeft: 0.3, mouthStretchRight: 0.3 },
  viseme_kk: { jawOpen: 0.3, mouthStretchLeft: 0.4, mouthStretchRight: 0.4 },
  viseme_CH: { jawOpen: 0.25, mouthPucker: 0.4, mouthFunnel: 0.3 },
  viseme_SS: { jawOpen: 0.12, mouthStretchLeft: 0.4, mouthStretchRight: 0.4 },
  viseme_nn: { jawOpen: 0.18, mouthStretchLeft: 0.25, mouthStretchRight: 0.25 },
  viseme_RR: { jawOpen: 0.2, mouthPucker: 0.45 },
  viseme_aa: { jawOpen: 0.7, mouthFunnel: 0.3, mouthStretchLeft: 0.1, mouthStretchRight: 0.1 },
  viseme_E: { jawOpen: 0.45, mouthStretchLeft: 0.5, mouthStretchRight: 0.5, mouthSmileLeft: 0.3, mouthSmileRight: 0.3 },
  viseme_I: { jawOpen: 0.35, mouthStretchLeft: 0.6, mouthStretchRight: 0.6, mouthSmileLeft: 0.4, mouthSmileRight: 0.4 },
  viseme_O: { jawOpen: 0.55, mouthFunnel: 0.7, mouthPucker: 0.5 },
  viseme_U: { jawOpen: 0.3, mouthPucker: 0.8, mouthFunnel: 0.4 },
};

/**
 * Linearly interpolates ARKit blendshape weights smoothly between source and target
 */
export function lerpBlendshapes(
  current: ARKitBlendshapes,
  target: ARKitBlendshapes,
  alpha: number
): ARKitBlendshapes {
  const result = { ...current };
  const keys = Object.keys(DEFAULT_ARKIT_BLENDSHAPES) as (keyof ARKitBlendshapes)[];
  for (const key of keys) {
    result[key] = current[key] + (target[key] - current[key]) * Math.min(1, Math.max(0, alpha));
  }
  return result;
}
