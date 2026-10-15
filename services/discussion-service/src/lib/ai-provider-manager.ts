// ═══════════════════════════════════════════════════════════════
// Discussion Service — AI Provider Client
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

export interface ChatCompletionOptions {
  responseFormatJson?: boolean;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

const DEFAULT_CONFIGS: Record<AIProviderType, { baseUrl: string; model: string; requiresKey: boolean }> = {
  ollama: {
    baseUrl: process.env.AI_OLLAMA_BASE_URL || 'http://127.0.0.1:11434/v1',
    model: process.env.AI_OLLAMA_MODEL || 'llama3.1',
    requiresKey: false,
  },
  mock: {
    baseUrl: 'mock://local',
    model: 'llama3.1-mock',
    requiresKey: false,
  },
};

export class AIProviderManager {
  private config: AIProviderConfig;
  private aiServiceUrl: string;

  constructor(customConfig?: Partial<AIProviderConfig>) {
    const envProvider = (process.env.AI_PROVIDER?.toLowerCase() as AIProviderType) || 'ollama';
    const initialProvider: AIProviderType = envProvider === 'mock' ? 'mock' : 'ollama';
    const providerDefaults = DEFAULT_CONFIGS[initialProvider] || DEFAULT_CONFIGS.ollama;

    this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:4003';

    this.config = {
      provider: customConfig?.provider || initialProvider,
      baseUrl: customConfig?.baseUrl || process.env.AI_OLLAMA_BASE_URL || providerDefaults.baseUrl,
      apiKey: customConfig?.apiKey || process.env.AI_API_KEY || 'ollama-local-key',
      model: customConfig?.model || process.env.AI_OLLAMA_MODEL || providerDefaults.model,
      temperature: customConfig?.temperature ?? 0.7,
      maxTokens: customConfig?.maxTokens,
      timeoutMs: customConfig?.timeoutMs ?? 30000,
    };
  }

  public getConfig(): AIProviderConfig {
    return { ...this.config };
  }

  public setConfig(updated: Partial<AIProviderConfig>): void {
    this.config = { ...this.config, ...updated };
  }

  public async callChatCompletion(
    systemPrompt: string,
    userPrompt: string,
    optionsOrTimeout?: number | ChatCompletionOptions
  ): Promise<string> {
    if (this.config.provider === 'mock') {
      throw new Error('AI_PROVIDER is mock. Use mock generator logic.');
    }

    const options: ChatCompletionOptions =
      typeof optionsOrTimeout === 'number'
        ? { timeoutMs: optionsOrTimeout }
        : optionsOrTimeout || {};

    const timeout = options.timeoutMs || this.config.timeoutMs;
    const temperature = options.temperature !== undefined ? options.temperature : this.config.temperature;
    const maxTokens = options.maxTokens !== undefined ? options.maxTokens : this.config.maxTokens;
    const responseFormatJson = options.responseFormatJson ?? false;

    // 1. Approach centralized AI Analysis Service (Meta Llama via Ollama)
    try {
      const response = await fetch(`${this.aiServiceUrl}/internal/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          userPrompt,
          temperature,
          maxTokens,
          responseFormatJson,
          timeoutMs: timeout,
        }),
        signal: AbortSignal.timeout(timeout),
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        if (data.content) return data.content;
      }
    } catch (err: any) {
      console.warn('[Discussion AI] Centralized AI service skipped, attempting direct Ollama Llama:', err.message);
    }

    // 2. Direct local Ollama fallback using Meta Llama
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const base = this.config.baseUrl.replace(/\/+$/g, '');
      const url = base.endsWith('/chat/completions') ? base : `${base}/chat/completions`;

      const requestPayload: Record<string, any> = {
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature,
        ...(maxTokens ? { max_tokens: maxTokens } : {}),
      };

      if (responseFormatJson) {
        requestPayload.response_format = { type: 'json_object' };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        const error = new Error(`AI Provider HTTP ${response.status}: ${errText.slice(0, 300)}`);
        (error as any).status = response.status;
        throw error;
      }

      const data = (await response.json()) as any;
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response payload from AI Provider.');
      }

      return content;
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.warn(`[AIProviderManager] Request to ${this.config.provider} (${this.config.model}) failed:`, error.message);
      throw error;
    }
  }

  public async generateText(prompt: string): Promise<string> {
    if (this.config.provider === 'mock') {
      throw new Error('AI_PROVIDER is mock mode.');
    }
    return this.callChatCompletion('You are an expert discussion mentor powered by Meta Llama.', prompt);
  }
}

export const aiProviderManager = new AIProviderManager();
