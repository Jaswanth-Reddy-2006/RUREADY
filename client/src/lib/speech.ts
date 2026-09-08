import { createSpeechVisemeTimeline, VisemeId, VisemeShape, VISEME_SHAPES, charToViseme } from './visemeEngine';

/** Map a spoken character/word to mouth openness 0–1 for backwards compatibility */
export function visemeOpenness(fragment: string): number {
  const t = fragment.toLowerCase().trim();
  if (!t) return 0.08;
  if (/[aeiou]/.test(t) && t.length <= 2) return 0.85;
  if (/^(th|oh|ow|ay|ee|oo|ah|uh)/.test(t)) return 0.75;
  if (/[bmpw]/.test(t.charAt(0))) return 0.12;
  if (/[fv]/.test(t.charAt(0))) return 0.35;
  if (/[lr]/.test(t.charAt(0))) return 0.45;
  if (/[sztcndkg]/.test(t)) return 0.55;
  const vowelCount = (t.match(/[aeiou]/g) || []).length;
  if (vowelCount >= 2) return 0.8;
  if (vowelCount === 1) return 0.65;
  return 0.4;
}

export type LipSyncCallbacks = {
  onStart?: () => void;
  onEnd?: () => void;
  onViseme?: (openness: number, fragment: string, shape?: VisemeShape, visemeId?: VisemeId) => void;
};

let lipSyncRaf = 0;
let speechStartTime = 0;

export function speakWithLipSync(
  text: string,
  callbacks: LipSyncCallbacks,
): SpeechSynthesisUtterance {
  window.speechSynthesis.cancel();
  if (lipSyncRaf) cancelAnimationFrame(lipSyncRaf);

  const timeline = createSpeechVisemeTimeline(text);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92;
  utterance.pitch = 1.02;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice =
    voices.find((v) => v.lang.startsWith('en') && /female|samantha|zira|jenny|google/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith('en'));
  if (preferredVoice) utterance.voice = preferredVoice;

  let speaking = false;

  const updateVisemeLoop = () => {
    if (!speaking) return;
    const elapsedSec = (performance.now() - speechStartTime) / 1000;
    const current = timeline.getVisemeAtTime(elapsedSec);

    callbacks.onViseme?.(current.shape.jawOpen, '', current.shape, current.viseme);

    if (elapsedSec < timeline.duration + 0.5) {
      lipSyncRaf = requestAnimationFrame(updateVisemeLoop);
    } else {
      speaking = false;
      callbacks.onViseme?.(0.05, '', VISEME_SHAPES.REST, 'REST');
    }
  };

  utterance.onboundary = (event: SpeechSynthesisEvent) => {
    if (event.name !== 'word' || !event.charLength) return;
    const fragment = text.slice(event.charIndex, event.charIndex + event.charLength);
    const visemeId = charToViseme(fragment);
    const shape = VISEME_SHAPES[visemeId] || VISEME_SHAPES.REST;
    callbacks.onViseme?.(shape.jawOpen, fragment, shape, visemeId);
  };

  utterance.onstart = () => {
    speaking = true;
    speechStartTime = performance.now();
    callbacks.onStart?.();
    callbacks.onViseme?.(0.15, '', VISEME_SHAPES.REST, 'REST');
    if (lipSyncRaf) cancelAnimationFrame(lipSyncRaf);
    lipSyncRaf = requestAnimationFrame(updateVisemeLoop);
  };

  utterance.onend = () => {
    speaking = false;
    if (lipSyncRaf) {
      cancelAnimationFrame(lipSyncRaf);
      lipSyncRaf = 0;
    }
    callbacks.onViseme?.(0.05, '', VISEME_SHAPES.REST, 'REST');
    callbacks.onEnd?.();
  };

  utterance.onerror = () => {
    speaking = false;
    if (lipSyncRaf) cancelAnimationFrame(lipSyncRaf);
    callbacks.onViseme?.(0.05, '', VISEME_SHAPES.REST, 'REST');
    callbacks.onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function loadSpeechVoices(): void {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
