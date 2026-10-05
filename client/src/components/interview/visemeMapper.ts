// ═══════════════════════════════════════════════════════════════
// R U Ready? — Oculus Visemes & ARKit Blendshapes Mapping Engine
// Calibrated for natural, human-like speech kinematics (Wav2Lip / Audio2Face)
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
  mouthPressLeft: number;
  mouthPressRight: number;
  mouthLowerDownLeft: number;
  mouthLowerDownRight: number;
  mouthUpperUpLeft: number;
  mouthUpperUpRight: number;
  mouthDimpleLeft: number;
  mouthDimpleRight: number;
  mouthFrownLeft: number;
  mouthFrownRight: number;
  browInnerUp: number;
  browOuterUpLeft: number;
  browOuterUpRight: number;
  browDownLeft: number;
  browDownRight: number;
  cheekSquintLeft: number;
  cheekSquintRight: number;
  eyeSquintLeft: number;
  eyeSquintRight: number;
  eyeWideLeft: number;
  eyeWideRight: number;
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
  tongueOut: number;
}

export const DEFAULT_ARKIT_BLENDSHAPES: ARKitBlendshapes = {
  jawOpen: 0,
  mouthFunnel: 0,
  mouthPucker: 0,
  mouthSmileLeft: 0.08,
  mouthSmileRight: 0.08,
  mouthStretchLeft: 0,
  mouthStretchRight: 0,
  mouthRollLower: 0,
  mouthRollUpper: 0,
  mouthPressLeft: 0,
  mouthPressRight: 0,
  mouthLowerDownLeft: 0,
  mouthLowerDownRight: 0,
  mouthUpperUpLeft: 0,
  mouthUpperUpRight: 0,
  mouthDimpleLeft: 0,
  mouthDimpleRight: 0,
  mouthFrownLeft: 0,
  mouthFrownRight: 0,
  browInnerUp: 0.04,
  browOuterUpLeft: 0,
  browOuterUpRight: 0,
  browDownLeft: 0,
  browDownRight: 0,
  cheekSquintLeft: 0,
  cheekSquintRight: 0,
  eyeSquintLeft: 0,
  eyeSquintRight: 0,
  eyeWideLeft: 0,
  eyeWideRight: 0,
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
  tongueOut: 0,
};

// Morph weights for each Oculus Viseme (Biophysically calibrated for natural, conversational speech)
export const OCULUS_VISEME_WEIGHTS: Record<OculusViseme, Partial<ARKitBlendshapes>> = {
  viseme_sil: { 
    jawOpen: 0, 
    mouthPucker: 0, 
    mouthFunnel: 0,
    mouthPressLeft: 0,
    mouthPressRight: 0,
    mouthSmileLeft: 0.06,
    mouthSmileRight: 0.06,
  },
  viseme_PP: { 
    // Plosive: P, B, M - lips pressed gently
    jawOpen: 0.0, 
    mouthPucker: 0.04, 
    mouthPressLeft: 0.22, 
    mouthPressRight: 0.22, 
    mouthRollLower: 0.12, 
    mouthRollUpper: 0.08 
  },
  viseme_FF: { 
    // Labiodental: F, V - lower lip tucked under upper incisors
    jawOpen: 0.04, 
    mouthRollLower: 0.18, 
    mouthUpperUpLeft: 0.06, 
    mouthUpperUpRight: 0.06, 
    mouthStretchLeft: 0.10, 
    mouthStretchRight: 0.10 
  },
  viseme_TH: { 
    // Dental: TH - tongue tip between teeth, relaxed mouth
    jawOpen: 0.07, 
    mouthFunnel: 0.04, 
    mouthStretchLeft: 0.08, 
    mouthStretchRight: 0.08,
    tongueOut: 0.18
  },
  viseme_DD: { 
    // Alveolar: T, D, N - tongue to ridge behind upper teeth
    jawOpen: 0.09, 
    mouthStretchLeft: 0.12, 
    mouthStretchRight: 0.12,
    mouthLowerDownLeft: 0.06,
    mouthLowerDownRight: 0.06
  },
  viseme_kk: { 
    // Velar: K, G, NG - mouth slightly open, tongue raised at back
    jawOpen: 0.12, 
    mouthStretchLeft: 0.14, 
    mouthStretchRight: 0.14,
    mouthLowerDownLeft: 0.06,
    mouthLowerDownRight: 0.06
  },
  viseme_CH: { 
    // Affricate: CH, J, SH - teeth together, lips slightly flared
    jawOpen: 0.08, 
    mouthPucker: 0.16, 
    mouthFunnel: 0.12,
    mouthUpperUpLeft: 0.06,
    mouthUpperUpRight: 0.06
  },
  viseme_SS: { 
    // Sibilant: S, Z - incisors together, lips pulled in gentle horizontal stretch
    jawOpen: 0.04, 
    mouthStretchLeft: 0.18, 
    mouthStretchRight: 0.18, 
    mouthSmileLeft: 0.12, 
    mouthSmileRight: 0.12 
  },
  viseme_nn: { 
    // Nasal: N, L - tongue pressed up, mouth partially parted
    jawOpen: 0.08, 
    mouthStretchLeft: 0.10, 
    mouthStretchRight: 0.10,
    mouthLowerDownLeft: 0.04,
    mouthLowerDownRight: 0.04
  },
  viseme_RR: { 
    // Rhotic: R - pursed and rounded
    jawOpen: 0.08, 
    mouthPucker: 0.18, 
    mouthFunnel: 0.12,
    mouthRollLower: 0.06
  },
  viseme_aa: { 
    // Low back vowel: AA, AH, AW - natural conversational jaw opening
    jawOpen: 0.22, 
    mouthFunnel: 0.08, 
    mouthLowerDownLeft: 0.08, 
    mouthLowerDownRight: 0.08,
    mouthStretchLeft: 0.06, 
    mouthStretchRight: 0.06 
  },
  viseme_E: { 
    // Mid front vowel: EH, EY, AE - wide subtle smile, mild jaw drop
    jawOpen: 0.15, 
    mouthStretchLeft: 0.20, 
    mouthStretchRight: 0.20, 
    mouthSmileLeft: 0.14, 
    mouthSmileRight: 0.14,
    mouthUpperUpLeft: 0.08,
    mouthUpperUpRight: 0.08
  },
  viseme_I: { 
    // High front vowel: EE, IH, Y - gentle horizontal stretch, teeth visible
    jawOpen: 0.10, 
    mouthStretchLeft: 0.24, 
    mouthStretchRight: 0.24, 
    mouthSmileLeft: 0.16, 
    mouthSmileRight: 0.16,
    mouthUpperUpLeft: 0.08,
    mouthUpperUpRight: 0.08
  },
  viseme_O: { 
    // Mid back rounded: OH, OA, AW - natural circular aperture
    jawOpen: 0.18, 
    mouthFunnel: 0.24, 
    mouthPucker: 0.16, 
    mouthRollUpper: 0.04,
    mouthRollLower: 0.04
  },
  viseme_U: { 
    // High back rounded: OO, W, UW - subtle circular funnel
    jawOpen: 0.08, 
    mouthPucker: 0.26, 
    mouthFunnel: 0.16,
    mouthRollUpper: 0.06,
    mouthRollLower: 0.06
  },
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

/**
 * Maps standard VisemeId from speech analysis to OculusViseme
 */
export function mapVisemeIdToOculus(visemeId: string): OculusViseme {
  switch (visemeId) {
    case 'REST': return 'viseme_sil';
    case 'VIS_A': return 'viseme_aa';
    case 'VIS_E': return 'viseme_E';
    case 'VIS_I': return 'viseme_I';
    case 'VIS_O': return 'viseme_O';
    case 'VIS_U': return 'viseme_U';
    case 'VIS_FV': return 'viseme_FF';
    case 'VIS_MBP': return 'viseme_PP';
    case 'VIS_SZ': return 'viseme_SS';
    case 'VIS_L': return 'viseme_nn';
    default: return 'viseme_sil';
  }
}
