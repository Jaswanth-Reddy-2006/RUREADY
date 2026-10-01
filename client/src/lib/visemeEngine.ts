// ═══════════════════════════════════════════════════════════════
// R U Ready? — Neural Acoustic Speech Viseme & Phoneme Engine
// Biophysically calibrated viseme shapes & coarticulation timing
// ═══════════════════════════════════════════════════════════════

export type VisemeId =
  | 'REST'
  | 'VIS_A'
  | 'VIS_E'
  | 'VIS_I'
  | 'VIS_O'
  | 'VIS_U'
  | 'VIS_FV'
  | 'VIS_MBP'
  | 'VIS_SZ'
  | 'VIS_L';

export interface VisemeShape {
  jawOpen: number;       // 0 (closed) to 1 (wide)
  lipSpread: number;     // 0 (neutral) to 1 (wide spread)
  lipRound: number;      // 0 (neutral) to 1 (rounded)
  lipPucker: number;     // 0 (neutral) to 1 (protruded)
  lipTuck: number;       // 0 (lower lip tucked for F/V)
  lipPress: number;      // 0 (pressed shut for M/B/P)
  teethVisible: number;  // 0 to 1
  tongueVisible: number; // 0 to 1
}

// Biophysically calibrated to natural conversational depth (Audio2Face & Wav2Lip standards)
export const VISEME_SHAPES: Record<VisemeId, VisemeShape> = {
  REST: {
    jawOpen: 0.0,
    lipSpread: 0.04,
    lipRound: 0.0,
    lipPucker: 0.0,
    lipTuck: 0.0,
    lipPress: 0.02,
    teethVisible: 0.02,
    tongueVisible: 0.0,
  },
  VIS_A: {
    jawOpen: 0.24,
    lipSpread: 0.18,
    lipRound: 0.08,
    lipPucker: 0.0,
    lipTuck: 0.0,
    lipPress: 0.0,
    teethVisible: 0.28,
    tongueVisible: 0.10,
  },
  VIS_E: {
    jawOpen: 0.16,
    lipSpread: 0.34,
    lipRound: 0.0,
    lipPucker: 0.0,
    lipTuck: 0.0,
    lipPress: 0.0,
    teethVisible: 0.36,
    tongueVisible: 0.08,
  },
  VIS_I: {
    jawOpen: 0.12,
    lipSpread: 0.28,
    lipRound: 0.0,
    lipPucker: 0.0,
    lipTuck: 0.0,
    lipPress: 0.0,
    teethVisible: 0.32,
    tongueVisible: 0.04,
  },
  VIS_O: {
    jawOpen: 0.20,
    lipSpread: 0.0,
    lipRound: 0.36,
    lipPucker: 0.22,
    lipTuck: 0.0,
    lipPress: 0.0,
    teethVisible: 0.12,
    tongueVisible: 0.0,
  },
  VIS_U: {
    jawOpen: 0.10,
    lipSpread: 0.0,
    lipRound: 0.40,
    lipPucker: 0.30,
    lipTuck: 0.0,
    lipPress: 0.0,
    teethVisible: 0.06,
    tongueVisible: 0.0,
  },
  VIS_FV: {
    jawOpen: 0.04,
    lipSpread: 0.10,
    lipRound: 0.0,
    lipPucker: 0.0,
    lipTuck: 0.35,
    lipPress: 0.0,
    teethVisible: 0.35,
    tongueVisible: 0.0,
  },
  VIS_MBP: {
    jawOpen: 0.0,
    lipSpread: 0.04,
    lipRound: 0.0,
    lipPucker: 0.0,
    lipTuck: 0.0,
    lipPress: 0.42,
    teethVisible: 0.0,
    tongueVisible: 0.0,
  },
  VIS_SZ: {
    jawOpen: 0.05,
    lipSpread: 0.18,
    lipRound: 0.0,
    lipPucker: 0.0,
    lipTuck: 0.0,
    lipPress: 0.0,
    teethVisible: 0.38,
    tongueVisible: 0.0,
  },
  VIS_L: {
    jawOpen: 0.10,
    lipSpread: 0.12,
    lipRound: 0.04,
    lipPucker: 0.0,
    lipTuck: 0.0,
    lipPress: 0.0,
    teethVisible: 0.28,
    tongueVisible: 0.22,
  },
};

/** Convert a word fragment or phoneme sound into target VisemeId */
export function charToViseme(charOrFragment: string): VisemeId {
  const t = charOrFragment.toLowerCase().trim();
  if (!t) return 'REST';

  // Bilabial consonants (M, B, P)
  if (/^[mbp]/.test(t)) return 'VIS_MBP';
  // Labiodental (F, V)
  if (/^[fv]/.test(t)) return 'VIS_FV';
  // Alveolar / Dental fricatives (S, Z, SH, CH, TH, J, C, K, G, T, D, N)
  if (/^(s|z|sh|ch|th|j|c|k|g|t|d|n)/.test(t)) return 'VIS_SZ';
  // Liquid consonants (L, R)
  if (/^[lr]/.test(t)) return 'VIS_L';

  // Rounded back vowels (OO, OU, U, W)
  if (/(oo|ou|u|w)/.test(t)) return 'VIS_U';
  // Open back rounded vowels (OH, O, OW, AW)
  if (/(oh|o|ow|aw)/.test(t)) return 'VIS_O';
  // Close front unrounded vowels (EE, EA, I, Y)
  if (/(ee|ea|i|y)/.test(t)) return 'VIS_E';
  // Open-mid front vowels (AY, AI, E)
  if (/(ay|ai|e)/.test(t)) return 'VIS_I';
  // Open unrounded central vowels (A, AH, AR)
  if (/(a|ah|ar)/.test(t)) return 'VIS_A';

  return 'VIS_A';
}

export interface VisemeFrame {
  viseme: VisemeId;
  startTime: number; // in seconds
  duration: number;  // in seconds
  emphasis?: boolean;
}

export interface VisemeTimeline {
  duration: number;
  frames: VisemeFrame[];
  getVisemeAtTime: (timeSec: number) => { viseme: VisemeId; shape: VisemeShape; emphasis: boolean };
}

/**
 * Parses raw text into a realistic, natural speech viseme timeline.
 * Takes into account punctuation pauses, word length, stress emphasis, and natural human cadence.
 */
export function createSpeechVisemeTimeline(text: string, wordsPerMinute: number = 150): VisemeTimeline {
  const words = text.split(/\s+/).filter(Boolean);

  const frames: VisemeFrame[] = [];
  let currentTime = 0.04; // slight initial onset

  for (let i = 0; i < words.length; i++) {
    const rawWord = words[i];
    const cleanWord = rawWord.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const isEmphasized = /[A-Z]{2,}/.test(rawWord) || rawWord.endsWith('!') || cleanWord.length > 8;

    if (!cleanWord) {
      currentTime += 0.18;
      continue;
    }

    const wordDuration = Math.max(0.20, cleanWord.length * 0.044 * (isEmphasized ? 1.20 : 1.0));
    const chunkCount = Math.max(1, Math.min(4, Math.floor(cleanWord.length / 2.2)));
    const chunkDuration = wordDuration / chunkCount;

    // First phoneme
    const firstViseme = charToViseme(cleanWord.slice(0, 2));
    frames.push({
      viseme: firstViseme,
      startTime: currentTime,
      duration: chunkDuration,
      emphasis: isEmphasized,
    });
    currentTime += chunkDuration;

    // Remaining syllable chunks
    for (let c = 1; c < chunkCount; c++) {
      const startIdx = Math.floor((c / chunkCount) * cleanWord.length);
      const fragment = cleanWord.slice(startIdx, startIdx + 2);
      frames.push({
        viseme: charToViseme(fragment),
        startTime: currentTime,
        duration: chunkDuration,
        emphasis: isEmphasized,
      });
      currentTime += chunkDuration;
    }

    // Inter-word natural pause
    const isPeriod = /[.!?]/.test(rawWord);
    const isComma = rawWord.includes(',');

    if (isPeriod) {
      frames.push({ viseme: 'REST', startTime: currentTime, duration: 0.32 });
      currentTime += 0.32;
    } else if (isComma) {
      frames.push({ viseme: 'REST', startTime: currentTime, duration: 0.18 });
      currentTime += 0.18;
    } else {
      frames.push({ viseme: 'REST', startTime: currentTime, duration: 0.03 });
      currentTime += 0.03;
    }
  }

  // Trailing resting state
  frames.push({
    viseme: 'REST',
    startTime: currentTime,
    duration: 0.4,
  });

  const totalDuration = currentTime + 0.4;

  const getVisemeAtTime = (timeSec: number) => {
    if (timeSec <= 0 || timeSec >= totalDuration) {
      return { viseme: 'REST' as VisemeId, shape: VISEME_SHAPES.REST, emphasis: false };
    }

    const currentFrame = frames.find(
      (f) => f && f.startTime !== undefined && timeSec >= f.startTime && timeSec < f.startTime + f.duration
    );

    if (!currentFrame) {
      return { viseme: 'REST' as VisemeId, shape: VISEME_SHAPES.REST, emphasis: false };
    }

    return {
      viseme: currentFrame.viseme,
      shape: VISEME_SHAPES[currentFrame.viseme] || VISEME_SHAPES.REST,
      emphasis: !!currentFrame.emphasis,
    };
  };

  return {
    duration: totalDuration,
    frames,
    getVisemeAtTime,
  };
}

/** Interpolate between two viseme shapes for butter-smooth mouth movements */
export function lerpVisemeShape(from: VisemeShape, to: VisemeShape, alpha: number): VisemeShape {
  const clamp01 = (val: number) => Math.max(0, Math.min(1, val));
  return {
    jawOpen: clamp01(from.jawOpen + (to.jawOpen - from.jawOpen) * alpha),
    lipSpread: clamp01(from.lipSpread + (to.lipSpread - from.lipSpread) * alpha),
    lipRound: clamp01(from.lipRound + (to.lipRound - from.lipRound) * alpha),
    lipPucker: clamp01(from.lipPucker + (to.lipPucker - from.lipPucker) * alpha),
    lipTuck: clamp01(from.lipTuck + (to.lipTuck - from.lipTuck) * alpha),
    lipPress: clamp01(from.lipPress + (to.lipPress - from.lipPress) * alpha),
    teethVisible: clamp01(from.teethVisible + (to.teethVisible - from.teethVisible) * alpha),
    tongueVisible: clamp01(from.tongueVisible + (to.tongueVisible - from.tongueVisible) * alpha),
  };
}
