// ═══════════════════════════════════════════════════════════════
// Resume & ATS Microservice — AI Provider Client
// Centralized Architecture: Routes to ai-analysis-service (Meta Llama via Ollama)
// ═══════════════════════════════════════════════════════════════

export type AIProviderType = 'ollama' | 'mock';

export interface AIProviderConfig {
  provider: AIProviderType;
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens?: number;
  timeoutMs: number;
  isAvailable?: boolean;
}

export class AIProviderManager {
  private aiServiceUrl: string;
  private ollamaBaseUrl: string;
  private model: string;
  private config: AIProviderConfig;

  constructor() {
    this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:4003';
    this.ollamaBaseUrl = process.env.AI_OLLAMA_BASE_URL || 'http://127.0.0.1:11434/v1';
    this.model = process.env.AI_OLLAMA_MODEL || 'llama3.1';

    this.config = {
      provider: 'ollama',
      baseUrl: this.aiServiceUrl,
      apiKey: 'ollama-local-key',
      model: this.model,
      temperature: 0.3,
      timeoutMs: 30000,
    };
  }

  public getConfig(): AIProviderConfig {
    return { ...this.config };
  }

  public async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    return this.callChatCompletion(
      systemPrompt || 'You are an elite ATS auditor and Principal Technical Recruiter powered by Meta Llama.',
      prompt
    );
  }

  public async callChatCompletion(systemPrompt: string, userPrompt: string, timeoutMs: number = 30000): Promise<string> {
    // 1. Approach centralized AI Service (ai-analysis-service running Meta Llama)
    try {
      const response = await fetch(`${this.aiServiceUrl}/internal/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          userPrompt,
          temperature: this.config.temperature,
          timeoutMs,
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        if (data.content) return data.content;
      }
    } catch (err: any) {
      console.warn('[Resume AI] Centralized AI service request skipped, attempting direct Ollama Llama:', err.message);
    }

    // 2. Direct local Ollama fallback using Meta Llama
    try {
      const base = this.ollamaBaseUrl.replace(/\/+$/g, '');
      const url = base.endsWith('/chat/completions') ? base : `${base}/chat/completions`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: this.config.temperature,
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      }
    } catch (err: any) {
      console.warn('[Resume AI] Direct Ollama call failed:', err.message);
    }

    throw new Error('Centralized AI analysis service and Ollama Meta Llama are currently unreachable.');
  }
}

export const aiProviderManager = new AIProviderManager();
