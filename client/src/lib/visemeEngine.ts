// ═══════════════════════════════════════════════════════════════
// R U Ready? — Speech Viseme & Phoneme Animation Engine
// 10-Viseme Mapping, Speech Timeline Generator & Formant Analyzer
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

export const VISEME_SHAPES: Record<VisemeId, VisemeShape> = {
  REST: {
    jawOpen: 0.0,
    lipSpread: 0.05,
    lipRound: 0.0,
    lipPucker: 0.0,
    lipTuck: 0.0,
    lipPress: 0.05,
    teethVisible: 0.05,
    tongueVisible: 0.0,
  },
  VIS_A: {
    jawOpen: 0.32,
    lipSpread: 0.25,
    lipRound: 0.10,
    lipPucker: 0.0,
    lipTuck: 0.0,
    lipPress: 0.0,
    teethVisible: 0.35,
    tongueVisible: 0.15,
  },
  VIS_E: {
    jawOpen: 0.20,
    lipSpread: 0.45,
    lipRound: 0.0,
    lipPucker: 0.0,
    lipTuck: 0.0,
    lipPress: 0.0,
    teethVisible: 0.45,
    tongueVisible: 0.10,
  },
  VIS_I: {
    jawOpen: 0.14,
    lipSpread: 0.40,
    lipRound: 0.0,
    lipPucker: 0.0,
    lipTuck: 0.0,
    lipPress: 0.0,
    teethVisible: 0.40,
    tongueVisible: 0.05,
  },
  VIS_O: {
    jawOpen: 0.26,
    lipSpread: 0.0,
    lipRound: 0.45,
    lipPucker: 0.30,
    lipTuck: 0.0,
    lipPress: 0.0,
    teethVisible: 0.15,
    tongueVisible: 0.0,
  },
  VIS_U: {
    jawOpen: 0.12,
    lipSpread: 0.0,
    lipRound: 0.50,
    lipPucker: 0.45,
    lipTuck: 0.0,
    lipPress: 0.0,
    teethVisible: 0.08,
    tongueVisible: 0.0,
  },
  VIS_FV: {
    jawOpen: 0.06,
    lipSpread: 0.12,
    lipRound: 0.0,
    lipPucker: 0.0,
    lipTuck: 0.45,
    lipPress: 0.0,
    teethVisible: 0.45,
    tongueVisible: 0.0,
  },
  VIS_MBP: {
    jawOpen: 0.01,
    lipSpread: 0.05,
    lipRound: 0.0,
    lipPucker: 0.0,
    lipTuck: 0.0,
    lipPress: 0.55,
    teethVisible: 0.0,
    tongueVisible: 0.0,
  },
  VIS_SZ: {
    jawOpen: 0.06,
    lipSpread: 0.22,
    lipRound: 0.0,
    lipPucker: 0.0,
    lipTuck: 0.0,
    lipPress: 0.0,
    teethVisible: 0.50,
    tongueVisible: 0.0,
  },
  VIS_L: {
    jawOpen: 0.12,
    lipSpread: 0.16,
    lipRound: 0.05,
    lipPucker: 0.0,
    lipTuck: 0.0,
    lipPress: 0.0,
    teethVisible: 0.35,
    tongueVisible: 0.30,
  },
};

/** Convert a word fragment or phoneme sound into target VisemeId */
export function charToViseme(charOrFragment: string): VisemeId {
  const t = charOrFragment.toLowerCase().trim();
  if (!t) return 'REST';

  // Check consonant groups
  if (/^[mbp]/.test(t)) return 'VIS_MBP';
  if (/^[fv]/.test(t)) return 'VIS_FV';
  if (/^[lr]/.test(t)) return 'VIS_L';
  if (/^(s|z|sh|ch|th|j|c|k|g|t|d|n)/.test(t)) return 'VIS_SZ';

  // Check vowel groups
  if (/(oo|ou|u|w)/.test(t)) return 'VIS_U';
  if (/(oh|o|ow|aw)/.test(t)) return 'VIS_O';
  if (/(ee|ea|i|y)/.test(t)) return 'VIS_E';
  if (/(ay|ai|e)/.test(t)) return 'VIS_I';
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
 * Takes into account punctuation pauses, word length, stress emphasis, and natural speech cadence.
 */
export function createSpeechVisemeTimeline(text: string, wordsPerMinute: number = 155): VisemeTimeline {
  const words = text.split(/\s+/).filter(Boolean);
  const secPerWord = 60 / wordsPerMinute;

  const frames: VisemeFrame[] = [];
  let currentTime = 0.05; // slight initial offset

  for (let i = 0; i < words.length; i++) {
    const rawWord = words[i];
    const cleanWord = rawWord.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const isEmphasized = /[A-Z]{2,}/.test(rawWord) || rawWord.endsWith('!') || cleanWord.length > 8;

    if (!cleanWord) {
      // Pause for standalone punctuation
      currentTime += 0.2;
      continue;
    }

    const wordDuration = Math.max(0.22, cleanWord.length * 0.048 * (isEmphasized ? 1.25 : 1.0));
    
    // Split word into 2-4 syllable/phoneme chunks
    const chunkCount = Math.max(1, Math.min(4, Math.floor(cleanWord.length / 2)));
    const chunkDuration = wordDuration / chunkCount;

    // Start of word lip contact (M/B/P check or initial sound)
    const firstViseme = charToViseme(cleanWord.slice(0, 2));
    frames.push({
      viseme: firstViseme,
      startTime: currentTime,
      duration: chunkDuration,
      emphasis: isEmphasized,
    });
    currentTime += chunkDuration;

    // Middle vowels/consonants
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

    // Inter-word micro pause (natural rhythm)
    const isComma = rawWord.includes(',');
    const isPeriod = /[.!?]/.test(rawWord);

    if (isPeriod) {
      frames.push({
        viseme: 'REST',
        startTime: currentTime,
        duration: 0.38, // natural period pause
      });
      currentTime += 0.38;
    } else if (isComma) {
      frames.push({
        viseme: 'REST',
        startTime: currentTime,
        duration: 0.22, // comma pause
      });
      currentTime += 0.22;
    } else {
      // Tiny 40ms inter-word transition
      frames.push({
        viseme: 'REST',
        startTime: currentTime,
        duration: 0.04,
      });
      currentTime += 0.04;
    }
  }

  // Trailing resting shape
  frames.push({
    viseme: 'REST',
    startTime: currentTime,
    duration: 0.5,
  });

  const totalDuration = currentTime + 0.5;

  const getVisemeAtTime = (timeSec: number) => {
    if (timeSec <= 0 || timeSec >= totalDuration) {
      return { viseme: 'REST' as VisemeId, shape: VISEME_SHAPES.REST, emphasis: false };
    }

    const currentFrame = frames.find(
      (f) => timeSec >= f.startTime && timeSec < f.startTime + f.duration
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
