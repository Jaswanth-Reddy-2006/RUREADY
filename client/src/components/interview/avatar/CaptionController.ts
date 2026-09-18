// ═══════════════════════════════════════════════════════════════
// R U Ready? — Caption Controller Module
// Synchronized Subtitle & Progressive Word Highlighting Engine
// ═══════════════════════════════════════════════════════════════

export interface CaptionWord {
  text: string;
  charIndex: number;
  charLength: number;
  isSpoken: boolean;
}

export class CaptionController {
  private fullText = '';
  private words: CaptionWord[] = [];
  private activeWordIndex = -1;

  public setCaptionText(text: string): void {
    this.fullText = text;
    const splitWords = text.trim().split(/\s+/);
    let currentIndex = 0;

    this.words = splitWords.map((word) => {
      const charIndex = text.indexOf(word, currentIndex);
      if (charIndex !== -1) currentIndex = charIndex + word.length;
      return {
        text: word,
        charIndex: charIndex !== -1 ? charIndex : 0,
        charLength: word.length,
        isSpoken: false,
      };
    });
    this.activeWordIndex = -1;
  }

  public updateActiveWordByCharIndex(charIndex: number): void {
    const idx = this.words.findIndex(
      (w) => charIndex >= w.charIndex && charIndex < w.charIndex + w.charLength + 3
    );
    if (idx !== -1) {
      this.activeWordIndex = idx;
      this.words.forEach((w, i) => {
        w.isSpoken = i <= idx;
      });
    }
  }

  public getFullText(): string {
    return this.fullText;
  }

  public getWords(): CaptionWord[] {
    return this.words;
  }

  public getActiveWordIndex(): number {
    return this.activeWordIndex;
  }

  public clear(): void {
    this.fullText = '';
    this.words = [];
    this.activeWordIndex = -1;
  }
}
