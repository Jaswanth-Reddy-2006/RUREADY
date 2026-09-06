import { describe, it, expect } from 'vitest';
import { aiProviderManager } from '../../lib/ai-provider-manager.js';

describe('AI Provider Manager Suite', () => {
  it('should initialize with default configuration', () => {
    const config = aiProviderManager.getConfig();
    expect(config).toBeDefined();
    expect(config.provider).toBeDefined();
    expect(config.baseUrl).toBeDefined();
  });

  it('should allow dynamic runtime provider switching to Ollama', () => {
    aiProviderManager.setConfig({
      provider: 'ollama',
      model: 'deepseek-r1',
    });

    const config = aiProviderManager.getConfig();
    expect(config.provider).toBe('ollama');
    expect(config.model).toBe('deepseek-r1');
    expect(config.baseUrl).toContain('11434');
  });

  it('should allow switching to OpenAI and Gemini providers', () => {
    aiProviderManager.setConfig({
      provider: 'openai',
      apiKey: 'sk-test-key-12345678901234567890',
      model: 'gpt-4o',
    });
    expect(aiProviderManager.getConfig().provider).toBe('openai');
    expect(aiProviderManager.getConfig().model).toBe('gpt-4o');

    aiProviderManager.setConfig({
      provider: 'gemini',
      apiKey: 'test-gemini-key',
      model: 'gemini-1.5-flash',
    });
    expect(aiProviderManager.getConfig().provider).toBe('gemini');
    expect(aiProviderManager.getConfig().model).toBe('gemini-1.5-flash');
  });

  it('should return instant online status for mock provider health ping', async () => {
    aiProviderManager.setConfig({ provider: 'mock' });
    const health = await aiProviderManager.testConnection();
    expect(health.success).toBe(true);
    expect(health.message).toContain('Mock AI Engine');
  });
});
