export type AIProviderType = 'ollama' | 'openai' | 'gemini' | 'custom' | 'mock';

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
    model: process.env.AI_OLLAMA_MODEL || 'llama3',
    requiresKey: false,
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o',
    requiresKey: true,
  },
  gemini: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    model: 'gemini-1.5-flash',
    requiresKey: true,
  },
  custom: {
    baseUrl: process.env.AI_API_BASE_URL || 'http://127.0.0.1:8000/v1',
    model: process.env.AI_MODEL || 'default',
    requiresKey: false,
  },
  mock: {
    baseUrl: 'mock://local',
    model: 'mock-engine-v1',
    requiresKey: false,
  },
};

class AIProviderManager {
  private config: AIProviderConfig;

  constructor() {
    const envProvider = (process.env.AI_PROVIDER?.toLowerCase() as AIProviderType) || 'mock';
    const initialProvider: AIProviderType = ['ollama', 'openai', 'gemini', 'custom', 'mock'].includes(envProvider)
      ? envProvider
      : (process.env.AI_API_KEY && process.env.AI_API_KEY.length > 20 ? 'openai' : 'mock');

    const providerDefaults = DEFAULT_CONFIGS[initialProvider] || DEFAULT_CONFIGS.mock;

    this.config = {
      provider: initialProvider,
      baseUrl: process.env.AI_API_BASE_URL || providerDefaults.baseUrl,
      apiKey: process.env.AI_API_KEY || 'ollama-local-key',
      model: process.env.AI_MODEL || providerDefaults.model,
      temperature: 0.7,
      timeoutMs: 30000,
    };
  }

  public getConfig(): AIProviderConfig {
    return { ...this.config };
  }

  public async callChatCompletion(systemPrompt: string, userPrompt: string, timeoutMsOverride?: number): Promise<string> {
    if (this.config.provider === 'mock') {
      throw new Error('AI_PROVIDER is mock. Use mock generator logic.');
    }

    const timeout = timeoutMsOverride || this.config.timeoutMs;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const base = this.config.baseUrl.replace(/\/+$/g, '');
      const url = base.endsWith('/chat/completions') ? base : `${base}/chat/completions`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: this.config.temperature,
          ...(this.config.maxTokens ? { max_tokens: this.config.maxTokens } : {}),
        }),
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
      console.warn(`[AIProviderManager] Request to ${this.config.provider} failed:`, error.message);
      throw error;
    }
  }

  public async generateText(prompt: string): Promise<string> {
    if (this.config.provider === 'mock') {
      throw new Error('AI_PROVIDER is mock mode.');
    }
    return this.callChatCompletion('You are an expert AI assistant.', prompt);
  }
}

export const aiProviderManager = new AIProviderManager();
