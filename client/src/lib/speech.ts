import { createSpeechVisemeTimeline, VisemeId, VisemeShape, VISEME_SHAPES, charToViseme } from './visemeEngine';

/** Map a spoken character/word to mouth openness 0–1 for backwards compatibility (calibrated for natural speech) */
export function visemeOpenness(fragment: string): number {
  const t = fragment.toLowerCase().trim();
  if (!t) return 0.04;
  if (/[aeiou]/.test(t) && t.length <= 2) return 0.30;
  if (/^(th|oh|ow|ay|ee|oo|ah|uh)/.test(t)) return 0.28;
  if (/[bmpw]/.test(t.charAt(0))) return 0.04;
  if (/[fv]/.test(t.charAt(0))) return 0.10;
  if (/[lr]/.test(t.charAt(0))) return 0.14;
  if (/[sztcndkg]/.test(t)) return 0.12;
  const vowelCount = (t.match(/[aeiou]/g) || []).length;
  if (vowelCount >= 2) return 0.26;
  if (vowelCount === 1) return 0.20;
  return 0.12;
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

  // Clean raw markdown formatting (asterisks, hashtags, backticks, bullet points, links, etc.) for smooth speech flow
  const cleanedText = text
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

  const timeline = createSpeechVisemeTimeline(cleanedText);
  const utterance = new SpeechSynthesisUtterance(cleanedText);
  
  // Smooth, warm, fresh corporate speech calibration
  utterance.rate = 0.95;
  utterance.pitch = 1.04;
  utterance.volume = 1.0;

  const voices = window.speechSynthesis.getVoices();
  // Prioritize modern Neural/Natural high-fidelity voices (Jenny, Aria, Samantha, Google)
  const preferredVoice =
    voices.find((v) => v.lang.startsWith('en') && /natural|neural|online/i.test(v.name) && /female|jenny|aria|ana|samantha|karen|victoria|google/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith('en') && /natural|neural|online/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith('en') && /female|samantha|jenny|aria|ana|google/i.test(v.name)) ||
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
    const fragment = cleanedText.slice(event.charIndex, event.charIndex + event.charLength);
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
