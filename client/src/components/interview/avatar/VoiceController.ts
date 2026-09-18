// ═══════════════════════════════════════════════════════════════
// R U Ready? — Voice Controller Module
// TTS Audio Clock, Markdown Sanitization, & Interruption Management
// ═══════════════════════════════════════════════════════════════

export interface VoiceCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onWordBoundary?: (word: string, charIndex: number, charLength: number) => void;
}

export class VoiceController {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private speechStartTime = 0;
  private isSpeaking = false;

  public sanitizeMarkdown(text: string): string {
    return text
      .replace(/^#+\s+/gm, '')                 // Strip headers
      .replace(/\*\*(.*?)\*\*/g, '$1')         // Strip bold **text**
      .replace(/\*(.*?)\*/g, '$1')             // Strip italic *text*
      .replace(/__(.*?)__/g, '$1')             // Strip bold __text__
      .replace(/_(.*?)_/g, '$1')               // Strip italic _text_
      .replace(/`{1,3}(.*?)(`{1,3})?/g, '$1')   // Strip code backticks
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')       // Strip markdown links
      .replace(/^>\s?/gm, '')                  // Strip blockquotes
      .replace(/^[\s*-]+(?=\w)/gm, '')         // Strip bullet points
      .replace(/[-_*]{3,}/g, '')               // Strip horizontal rules
      .replace(/~{2}(.*?)(~{2})?/g, '$1')       // Strip strikethrough
      .replace(/\s+/g, ' ')                    // Collapse extra spaces
      .trim();
  }

  public speak(text: string, callbacks?: VoiceCallbacks): void {
    this.stop();

    const cleanText = this.sanitizeMarkdown(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.04;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang.startsWith('en') && /natural|neural|online/i.test(v.name) && /female|jenny|aria|ana|samantha|karen|victoria|google/i.test(v.name)) ||
      voices.find((v) => v.lang.startsWith('en') && /natural|neural|online/i.test(v.name)) ||
      voices.find((v) => v.lang.startsWith('en') && /female|samantha|jenny|aria|ana|google/i.test(v.name)) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.speechStartTime = performance.now();
      callbacks?.onStart?.();
    };

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (event.name !== 'word' || !event.charLength) return;
      const word = cleanText.slice(event.charIndex, event.charIndex + event.charLength);
      callbacks?.onWordBoundary?.(word, event.charIndex, event.charLength);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      callbacks?.onEnd?.();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      callbacks?.onEnd?.();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public stop(): void {
    window.speechSynthesis.cancel();
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  public getElapsedAudioSeconds(): number {
    if (!this.isSpeaking) return 0;
    return (performance.now() - this.speechStartTime) / 1000;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}
