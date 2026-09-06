/** Map a spoken character/word to mouth openness 0–1 for lip-sync */
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
  onViseme?: (openness: number, fragment: string) => void;
};

let lipSyncRaf = 0;

export function speakWithLipSync(
  text: string,
  callbacks: LipSyncCallbacks,
): SpeechSynthesisUtterance {
  window.speechSynthesis.cancel();
  if (lipSyncRaf) cancelAnimationFrame(lipSyncRaf);

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92;
  utterance.pitch = 1.02;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice =
    voices.find((v) => v.lang.startsWith('en') && /female|samantha|zira|jenny/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith('en'));
  if (preferredVoice) utterance.voice = preferredVoice;

  let boundarySupported = false;
  let speaking = false;
  let phase = 0;

  const pulseWhileSpeaking = () => {
    if (!speaking) return;
    phase += 0.14;
    const base = 0.35 + Math.sin(phase) * 0.22 + Math.sin(phase * 2.7) * 0.12;
    callbacks.onViseme?.(Math.min(0.9, base), '');
    lipSyncRaf = requestAnimationFrame(pulseWhileSpeaking);
  };

  utterance.onboundary = (event: SpeechSynthesisEvent) => {
    if (event.name !== 'word' || !event.charLength) return;
    boundarySupported = true;
    const fragment = text.slice(event.charIndex, event.charIndex + event.charLength);
    callbacks.onViseme?.(visemeOpenness(fragment), fragment);
  };

  utterance.onstart = () => {
    speaking = true;
    callbacks.onStart?.();
    callbacks.onViseme?.(0.15, '');
    if (!lipSyncRaf) pulseWhileSpeaking();
  };

  utterance.onend = () => {
    speaking = false;
    if (lipSyncRaf) {
      cancelAnimationFrame(lipSyncRaf);
      lipSyncRaf = 0;
    }
    callbacks.onViseme?.(0.05, '');
    callbacks.onEnd?.();
  };

  utterance.onerror = () => {
    speaking = false;
    if (lipSyncRaf) cancelAnimationFrame(lipSyncRaf);
    callbacks.onViseme?.(0.05, '');
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
