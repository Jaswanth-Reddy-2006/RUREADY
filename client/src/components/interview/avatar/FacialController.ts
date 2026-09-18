// ═══════════════════════════════════════════════════════════════
// R U Ready? — Facial Controller Module
// 52 ARKit Blendshapes & 15 Oculus Visemes Dynamics Engine
// ═══════════════════════════════════════════════════════════════

import {
  OculusViseme,
  ARKitBlendshapes,
  DEFAULT_ARKIT_BLENDSHAPES,
  OCULUS_VISEME_WEIGHTS,
  lerpBlendshapes,
} from '../visemeMapper';

export type FacialExpression =
  | 'NEUTRAL'
  | 'HAPPY'
  | 'INTERESTED'
  | 'THINKING'
  | 'SURPRISED'
  | 'CONCERNED'
  | 'SPEAKING'
  | 'CURIOUS'
  | 'ENCOURAGING'
  | 'IMPRESSED'
  | 'FOCUSED'
  | 'ACKNOWLEDGING';

export const EXPRESSION_BLENDSHAPES: Record<FacialExpression, Partial<ARKitBlendshapes>> = {
  NEUTRAL: { 
    browInnerUp: 0.05, 
    mouthSmileLeft: 0.15, 
    mouthSmileRight: 0.15,
    cheekSquintLeft: 0.05,
    cheekSquintRight: 0.05,
  },
  HAPPY: { 
    browInnerUp: 0.25, 
    mouthSmileLeft: 0.65, 
    mouthSmileRight: 0.65,
    cheekSquintLeft: 0.48,
    cheekSquintRight: 0.48,
    eyeSquintLeft: 0.22,
    eyeSquintRight: 0.22,
    mouthDimpleLeft: 0.32,
    mouthDimpleRight: 0.32,
  },
  INTERESTED: { 
    browInnerUp: 0.28, 
    browOuterUpLeft: 0.18,
    browOuterUpRight: 0.18,
    eyeWideLeft: 0.15,
    eyeWideRight: 0.15,
    mouthSmileLeft: 0.38, 
    mouthSmileRight: 0.38,
    cheekSquintLeft: 0.2,
    cheekSquintRight: 0.2,
  },
  THINKING: { 
    browInnerUp: 0.35, 
    browOuterUpLeft: 0.4,
    browDownRight: 0.2,
    mouthPucker: 0.18,
    mouthSmileLeft: 0.05, 
    mouthSmileRight: 0.05,
    eyeLookUpRight: 0.35,
    eyeLookOutRight: 0.25,
  },
  SURPRISED: {
    browInnerUp: 0.65,
    browOuterUpLeft: 0.55,
    browOuterUpRight: 0.55,
    eyeWideLeft: 0.45,
    eyeWideRight: 0.45,
    jawOpen: 0.22,
  },
  CONCERNED: { 
    browInnerUp: 0.65, 
    browDownLeft: 0.35,
    browDownRight: 0.35,
    mouthFrownLeft: 0.25, 
    mouthFrownRight: 0.25,
    mouthSmileLeft: 0,
    mouthSmileRight: 0,
  },
  SPEAKING: {
    browInnerUp: 0.18,
    mouthSmileLeft: 0.22,
    mouthSmileRight: 0.22,
    cheekSquintLeft: 0.15,
    cheekSquintRight: 0.15,
  },
  CURIOUS: { 
    browInnerUp: 0.35, 
    browOuterUpLeft: 0.25,
    browOuterUpRight: 0.15,
    eyeWideLeft: 0.1,
    eyeWideRight: 0.1,
    mouthSmileLeft: 0.25, 
    mouthSmileRight: 0.25,
  },
  ENCOURAGING: { 
    browInnerUp: 0.25, 
    mouthSmileLeft: 0.62, 
    mouthSmileRight: 0.62,
    cheekSquintLeft: 0.45,
    cheekSquintRight: 0.45,
  },
  IMPRESSED: { 
    browInnerUp: 0.55, 
    browOuterUpLeft: 0.35,
    browOuterUpRight: 0.35,
    eyeWideLeft: 0.25,
    eyeWideRight: 0.25,
    mouthSmileLeft: 0.55, 
    mouthSmileRight: 0.55,
  },
  FOCUSED: { 
    browInnerUp: 0.15, 
    browDownLeft: 0.22,
    browDownRight: 0.22,
    eyeSquintLeft: 0.25,
    eyeSquintRight: 0.25,
    mouthSmileLeft: 0.1, 
    mouthSmileRight: 0.1,
  },
  ACKNOWLEDGING: { 
    browInnerUp: 0.25, 
    browOuterUpLeft: 0.15,
    browOuterUpRight: 0.15,
    mouthSmileLeft: 0.4, 
    mouthSmileRight: 0.4,
    cheekSquintLeft: 0.25,
    cheekSquintRight: 0.25,
  },
};

export class FacialController {
  private currentBlendshapes: ARKitBlendshapes = { ...DEFAULT_ARKIT_BLENDSHAPES };
  private activeExpression: FacialExpression = 'NEUTRAL';
  private activeViseme: OculusViseme = 'viseme_sil';

  public setExpression(expression: FacialExpression): void {
    this.activeExpression = expression;
  }

  public setViseme(viseme: OculusViseme): void {
    this.activeViseme = viseme;
  }

  public getExpression(): FacialExpression {
    return this.activeExpression;
  }

  public getViseme(): OculusViseme {
    return this.activeViseme;
  }

  public update(lerpFactor = 0.24): ARKitBlendshapes {
    const exprWeights = EXPRESSION_BLENDSHAPES[this.activeExpression] || {};
    const visemeWeights = OCULUS_VISEME_WEIGHTS[this.activeViseme] || {};

    const targetBlendshapes: ARKitBlendshapes = {
      ...DEFAULT_ARKIT_BLENDSHAPES,
      ...exprWeights,
      ...visemeWeights,
    };

    this.currentBlendshapes = lerpBlendshapes(this.currentBlendshapes, targetBlendshapes, lerpFactor);
    return this.currentBlendshapes;
  }

  public getCurrentBlendshapes(): ARKitBlendshapes {
    return this.currentBlendshapes;
  }
}
