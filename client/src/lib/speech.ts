// ═══════════════════════════════════════════════════════════════
// Rennetus — AI Speech & Lip-Sync Synthesis Engine
// Pure English, zero-latency, high-fidelity Web Speech API engine
// ═══════════════════════════════════════════════════════════════

import { createSpeechVisemeTimeline, VisemeId, VisemeShape, VISEME_SHAPES, charToViseme } from './visemeEngine';
import { getPlatformVoice, PlatformVoiceId, PLATFORM_VOICES } from './platformConfig';

/** Map a spoken character/word to mouth openness 0–1 for backwards compatibility */
export function visemeOpenness(fragment: string): number {
  const t = fragment.toLowerCase().trim();
  if (!t) return 0.05;
  if (/[aeiou]/.test(t) && t.length <= 2) return 0.48;
  if (/^(th|oh|ow|ay|ee|oo|ah|uh)/.test(t)) return 0.44;
  if (/[bmpw]/.test(t.charAt(0))) return 0.08;
  if (/[fv]/.test(t.charAt(0))) return 0.22;
  if (/[lr]/.test(t.charAt(0))) return 0.28;
  if (/[sztcndkg]/.test(t)) return 0.24;
  const vowelCount = (t.match(/[aeiou]/g) || []).length;
  if (vowelCount >= 2) return 0.42;
  if (vowelCount === 1) return 0.35;
  return 0.22;
}

export type LipSyncCallbacks = {
  onStart?: () => void;
  onEnd?: () => void;
  onViseme?: (openness: number, fragment: string, shape?: VisemeShape, visemeId?: VisemeId) => void;
};

// Legacy type alias
export type KokoroVoice = PlatformVoiceId;

let lipSyncRaf = 0;
let speechStartTime = 0;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let keepAliveInterval: any = null;

/** Clean raw markdown and normalize technical terminology/slang for ultra-smooth, natural pronunciation */
export function cleanMarkdown(text: string): string {
  let cleaned = text
    .replace(/^#+\s+/gm, '')                 // Strip headers (# Header)
    .replace(/\*\*(.*?)\*\*/g, '$1')         // Strip bold **text**
    .replace(/\*(.*?)\*/g, '$1')             // Strip italic *text*
    .replace(/__(.*?)__/g, '$1')             // Strip bold __text__
    .replace(/_(.*?)_/g, '$1')               // Strip italic _text_
    .replace(/`{1,3}(.*?)(`{1,3})?/g, '$1')   // Strip inline & block code backticks
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')       // Strip markdown links [label](url)
    .replace(/^>\s?/gm, '')                  // Strip blockquotes
    .replace(/^[\s*-]+(?=\w)/gm, '')         // Strip bullet points (- or *)
    .replace(/[-_*]{3,}/g, '')               // Strip horizontal rules
    .replace(/~{2}(.*?)(~{2})?/g, '$1')       // Strip strikethrough
    .replace(/\s+/g, ' ')                    // Collapse extra whitespace
    .trim();

  // Phonetic normalization for natural technical terms & slang pronunciation
  const techPhonetics: [RegExp, string][] = [
    [/\bCI\/CD\b/gi, 'C I C D'],
    [/\bk8s\b/gi, 'Kubernetes'],
    [/\bRESTful\b/gi, 'REST-full'],
    [/\basync\/await\b/gi, 'async await'],
    [/\bgRPC\b/gi, 'G R P C'],
    [/\bPostgreSQL\b/gi, 'Postgres Q L'],
    [/\bPostgres\b/gi, 'Postgres'],
    [/\bSQL\b/gi, 'Sequel'],
    [/\bNoSQL\b/gi, 'No Sequel'],
    [/\bUI\/UX\b/gi, 'U I U X'],
    [/\bI\/O\b/gi, 'I O'],
    [/\bOAuth\b/gi, 'O-Auth'],
    [/\bOAuth2\b/gi, 'O-Auth 2'],
    [/\bJWT\b/gi, 'J W T'],
    [/\bLLM\b/g, 'L L M'],
    [/\bLLMs\b/g, 'L L Ms'],
    [/\bRAG\b/g, 'rag'],
    [/\bSRE\b/g, 'S R E'],
    [/\bVite\b/g, 'Veet'],
    [/\bThree\.js\b/gi, 'Three J S'],
    [/\bNode\.js\b/gi, 'Node J S'],
    [/\bNext\.js\b/gi, 'Next J S'],
    [/\bVue\.js\b/gi, 'Vue J S'],
    [/\bGraphQL\b/gi, 'Graph Q L'],
    [/\bAPI\b/g, 'A P I'],
    [/\bAPIs\b/g, 'A P Is'],
    [/\bSDK\b/g, 'S D K'],
    [/\bSDKs\b/g, 'S D Ks'],
    [/\bCLI\b/g, 'C L I'],
    [/\bO\(n\)/gi, 'O of N'],
    [/\bO\(1\)/gi, 'O of 1'],
    [/\bO\(log\s*n\)/gi, 'O of log N'],
    [/\bO\(n\s*log\s*n\)/gi, 'O of N log N'],
    [/\bO\(n\^2\)/gi, 'O of N squared'],
  ];

  for (const [pattern, replacement] of techPhonetics) {
    cleaned = cleaned.replace(pattern, replacement);
  }

  return cleaned;
}

/** Stop any active speech synthesis and reset animation loops */
export function stopAllSpeech(): void {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
    } catch {}
  }

  if (activeUtterance) {
    activeUtterance.onstart = null;
    activeUtterance.onend = null;
    activeUtterance.onerror = null;
    activeUtterance.onboundary = null;
    activeUtterance = null;
  }

  if (lipSyncRaf) {
    cancelAnimationFrame(lipSyncRaf);
    lipSyncRaf = 0;
  }
  speechStartTime = 0;
}

/**
 * Filter and find the best matching English (Male or Female) voice from the browser's native speech synthesis.
 * Prioritizes natural neural, online high-definition human voices and strictly eliminates mechanical/robotic voices.
 */
export function findEnglishBrowserVoice(voiceId?: PlatformVoiceId): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Filter out robotic legacy desktop and synthetic voices
  const isRobotic = (v: SpeechSynthesisVoice) =>
    /desktop|espeak|mumble|sapi|sin-wave|robot/i.test(v.name);

  // STRICT ENGLISH FILTER: Must match en-* or English language code
  const englishVoices = voices.filter(
    (v) => v.lang && (v.lang.toLowerCase().startsWith('en') || v.lang.toLowerCase().includes('en-'))
  );
  const pool = englishVoices.length > 0 ? englishVoices : voices;

  const activeVoiceId = voiceId || getPlatformVoice();
  const voiceMeta = PLATFORM_VOICES.find((v) => v.id === activeVoiceId);
  const isTargetMale = voiceMeta?.gender === 'Male';
  const isMaleName = (name: string) => /david|mark|guy|george|oliver|richard|james|john|michael|alex\s*\(male\)|paul|brian|stefan|daniel|liam|rohan|ravi/i.test(name);
  const isFemaleName = (name: string) => /jenny|aria|samantha|ana|victoria|zira|hazel|sonia|libby|karen|catherine|heera|neerja|priya|chloe|female/i.test(name);

  // 1. Filter pool by requested gender
  const genderPool = pool.filter((v) => {
    if (isTargetMale) {
      return isMaleName(v.name) || (!isFemaleName(v.name) && v.name.toLowerCase().includes('male'));
    } else {
      return !isMaleName(v.name);
    }
  });

  const searchPool = genderPool.length > 0 ? genderPool : pool;

  // 2. High-priority rankings: Natural Neural Online voices (Jenny, Aria, Ava, Google, Apple Enhanced)
  const topTierNatural = [
    /jenny.*(natural|online)/i,
    /aria.*(natural|online)/i,
    /ava.*(natural|online|neural)/i,
    /google.*us.*english/i,
    /google.*uk.*english.*female/i,
    /natural/i,
    /neural/i,
    /online/i,
    /enhanced/i,
    /premium/i,
    /samantha/i,
    /karen/i,
    /serena/i,
    /zoe/i,
  ];

  for (const regex of topTierNatural) {
    const matched = searchPool.find((v) => regex.test(v.name) && !isRobotic(v));
    if (matched) return matched;
  }

  // 3. Fallback to any non-robotic English voice
  const nonRobotic = searchPool.filter((v) => !isRobotic(v));
  if (nonRobotic.length > 0) {
    const enUS = nonRobotic.find((v) => v.lang.toLowerCase() === 'en-us');
    if (enUS) return enUS;
    return nonRobotic[0];
  }

  return searchPool[0] || pool[0];
}

/** Check if speech synthesis is available in the browser */
export function isKokoroReady(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** Compatibility shim */
export async function initKokoroTTS(): Promise<any> {
  loadSpeechVoices();
  return { ready: true };
}

/**
 * Speak text with synchronized 3D lip-sync visemes.
 * 100% English, zero-latency, full volume (1.0), and unmuted.
 */
export function speakWithLipSync(
  text: string,
  callbacks: LipSyncCallbacks,
  voiceChoice?: PlatformVoiceId
): SpeechSynthesisUtterance {
  stopAllSpeech();

  const cleanedText = cleanMarkdown(text);
  if (!cleanedText) {
    callbacks.onEnd?.();
    return new SpeechSynthesisUtterance('');
  }

  if (typeof window === 'undefined' || !window.speechSynthesis) {
    callbacks.onEnd?.();
    return new SpeechSynthesisUtterance('');
  }

  // Resume speech synthesis if paused by browser
  if (window.speechSynthesis.paused) {
    try {
      window.speechSynthesis.resume();
    } catch {}
  }

  const timeline = createSpeechVisemeTimeline(cleanedText);
  let isSpeaking = true;

  // Time-driven fallback viseme loop
  const updateVisemeLoop = () => {
    if (!isSpeaking) return;
    const elapsedSec = (performance.now() - speechStartTime) / 1000;
    const current = timeline.getVisemeAtTime(elapsedSec);

    callbacks.onViseme?.(current.shape.jawOpen, '', current.shape, current.viseme);

    if (elapsedSec < timeline.duration + 0.6) {
      lipSyncRaf = requestAnimationFrame(updateVisemeLoop);
    } else {
      callbacks.onViseme?.(0.05, '', VISEME_SHAPES.REST, 'REST');
    }
  };

  const startVisemeLoop = () => {
    speechStartTime = performance.now();
    callbacks.onStart?.();
    callbacks.onViseme?.(0.20, '', VISEME_SHAPES.REST, 'REST');
    if (lipSyncRaf) cancelAnimationFrame(lipSyncRaf);
    lipSyncRaf = requestAnimationFrame(updateVisemeLoop);
  };

  const handleSpeechEnd = () => {
    if (!isSpeaking) return;
    isSpeaking = false;
    if (lipSyncRaf) {
      cancelAnimationFrame(lipSyncRaf);
      lipSyncRaf = 0;
    }
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
    activeUtterance = null;
    callbacks.onViseme?.(0.05, '', VISEME_SHAPES.REST, 'REST');
    callbacks.onEnd?.();
  };

  const utterance = new SpeechSynthesisUtterance(cleanedText);
  activeUtterance = utterance; // Keep global reference so garbage collection doesn't kill it mid-sentence

  utterance.lang = 'en-US';
  utterance.rate = 0.94; // Conversational human pace
  utterance.pitch = 1.0; // Grounded natural pitch
  utterance.volume = 1.0; // 100% full volume

  const selectedVoice = findEnglishBrowserVoice(voiceChoice);
  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang || 'en-US';
  }

  utterance.onstart = () => {
    startVisemeLoop();
  };

  utterance.onboundary = (event: SpeechSynthesisEvent) => {
    if (event.name !== 'word' || !event.charLength) return;
    const fragment = cleanedText.slice(event.charIndex, event.charIndex + event.charLength);
    const visemeId = charToViseme(fragment);
    const shape = VISEME_SHAPES[visemeId] || VISEME_SHAPES.REST;
    callbacks.onViseme?.(shape.jawOpen, fragment, shape, visemeId);
  };

  utterance.onend = () => {
    handleSpeechEnd();
  };

  utterance.onerror = (e) => {
    if (e.error !== 'canceled' && e.error !== 'interrupted') {
      console.warn('Rennetus Speech Synthesis notification:', e.error);
    }
    handleSpeechEnd();
  };

  // Chromium keep-alive ping for long utterances (>14s)
  if (keepAliveInterval) clearInterval(keepAliveInterval);
  keepAliveInterval = setInterval(() => {
    if (!isSpeaking || !activeUtterance) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
      return;
    }
    if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }, 4000);

  try {
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('SpeechSynthesis speak failed:', err);
    handleSpeechEnd();
  }

  return utterance;
}

/** Preload browser speech synthesis voices */
export function loadSpeechVoices(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
  if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}

// Pre-load voices on script evaluation
loadSpeechVoices();
