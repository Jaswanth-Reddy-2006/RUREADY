// ═══════════════════════════════════════════════════════════════
// AI & Analysis Microservice — AI Provider Manager
// Standardized Sole LLM Provider: Meta Llama (Llama 3.1 8B / Llama 3.2 1B via Ollama)
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

class AIProviderManager {
  private config: AIProviderConfig;

  constructor() {
    const envProvider = (process.env.AI_PROVIDER?.toLowerCase() as AIProviderType) || 'ollama';
    const initialProvider: AIProviderType = envProvider === 'mock' ? 'mock' : 'ollama';
    const providerDefaults = DEFAULT_CONFIGS[initialProvider] || DEFAULT_CONFIGS.ollama;

    this.config = {
      provider: initialProvider,
      baseUrl: process.env.AI_OLLAMA_BASE_URL || process.env.AI_API_BASE_URL || providerDefaults.baseUrl,
      apiKey: process.env.AI_API_KEY || 'ollama-local-key',
      model: process.env.AI_OLLAMA_MODEL || process.env.AI_MODEL || providerDefaults.model,
      temperature: 0.7,
      timeoutMs: 30000,
    };
  }

  public getConfig(): AIProviderConfig {
    return { ...this.config };
  }

  public setConfig(updates: Partial<AIProviderConfig>): AIProviderConfig {
    if (updates.provider && DEFAULT_CONFIGS[updates.provider]) {
      const defaults = DEFAULT_CONFIGS[updates.provider];
      this.config.provider = updates.provider;
      if (!updates.baseUrl) this.config.baseUrl = defaults.baseUrl;
      if (!updates.model) this.config.model = defaults.model;
    }

    if (updates.baseUrl !== undefined) this.config.baseUrl = updates.baseUrl;
    if (updates.apiKey !== undefined) this.config.apiKey = updates.apiKey;
    if (updates.model !== undefined) this.config.model = updates.model;
    if (updates.temperature !== undefined) this.config.temperature = updates.temperature;
    if (updates.timeoutMs !== undefined) this.config.timeoutMs = updates.timeoutMs;
    if (updates.maxTokens !== undefined) this.config.maxTokens = updates.maxTokens;

    return this.getConfig();
  }

  public async testConnection(): Promise<{ success: boolean; latencyMs: number; message: string; discoveredModels?: string[] }> {
    if (this.config.provider === 'mock') {
      return { success: true, latencyMs: 1, message: 'Mock AI Engine is always online and verified.' };
    }

    const start = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const base = this.config.baseUrl.replace(/\/+$/g, '');
      if (this.config.provider === 'ollama') {
        const ollamaTagsUrl = base.replace(/\/v1$/i, '') + '/api/tags';
        try {
          const res = await fetch(ollamaTagsUrl, { signal: controller.signal });
          if (res.ok) {
            const data = (await res.json()) as any;
            const models = (data.models || []).map((m: any) => m.name || m.model);
            clearTimeout(timeoutId);
            return {
              success: true,
              latencyMs: Date.now() - start,
              message: `Ollama connected successfully (${models.length} models detected).`,
              discoveredModels: models,
            };
          }
        } catch {
          // Fall through
        }
      }

      const url = base.endsWith('/chat/completions') ? base : `${base}/chat/completions`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const latencyMs = Date.now() - start;

      if (res.ok) {
        return {
          success: true,
          latencyMs,
          message: `Connected to ${this.config.provider.toUpperCase()} (${this.config.model}) in ${latencyMs}ms.`,
        };
      } else {
        const text = await res.text();
        return {
          success: false,
          latencyMs,
          message: `HTTP ${res.status}: ${text.slice(0, 150)}`,
        };
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      return {
        success: false,
        latencyMs: Date.now() - start,
        message: `Connection failed: ${err.message || 'Unknown network error'}.`,
      };
    }
  }

  public async callChatCompletion(
    systemPrompt: string,
    userPrompt: string,
    timeoutMsOverride?: number,
    responseFormatJson?: boolean
  ): Promise<string> {
    if (this.config.provider === 'mock') {
      throw new Error('AI_PROVIDER is mock. Use mock generator logic.');
    }

    const timeout = timeoutMsOverride || this.config.timeoutMs;
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
        temperature: this.config.temperature,
        ...(this.config.maxTokens ? { max_tokens: this.config.maxTokens } : {}),
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
        throw new Error(`AI Provider HTTP ${response.status}: ${errText.slice(0, 200)}`);
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

  public async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    if (this.config.provider === 'mock') {
      throw new Error('AI_PROVIDER is mock mode.');
    }
    return this.callChatCompletion(systemPrompt || 'You are an expert AI assistant powered by Meta Llama.', prompt);
  }
}

export const aiProviderManager = new AIProviderManager();
