// ═══════════════════════════════════════════════════════════════
// AI & Analysis Microservice — AI Controller
// ═══════════════════════════════════════════════════════════════

import { Request, Response, NextFunction } from 'express';
import { aiProviderManager, type AIProviderType } from '../lib/ai-provider-manager.js';

export const aiController = {
  async getConfig(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = aiProviderManager.getConfig();
      const safeConfig = {
        ...config,
        apiKey: config.apiKey && config.apiKey.length > 8 ? `${config.apiKey.slice(0, 4)}...${config.apiKey.slice(-4)}` : (config.apiKey ? 'configured' : ''),
      };
      res.status(200).json(safeConfig);
    } catch (error) {
      next(error);
    }
  },

  async updateConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { provider, baseUrl, apiKey, model, temperature, maxTokens, timeoutMs } = req.body;

      const validProviders: AIProviderType[] = ['ollama', 'mock'];
      if (provider && !validProviders.includes(provider)) {
        res.status(400).json({
          error: `Invalid provider '${provider}'. Supported: ${validProviders.join(', ')} (Meta Llama via Ollama)`,
        });
        return;
      }

      const updated = aiProviderManager.setConfig({
        ...(provider ? { provider } : {}),
        ...(baseUrl !== undefined ? { baseUrl } : {}),
        ...(apiKey !== undefined ? { apiKey } : {}),
        ...(model !== undefined ? { model } : {}),
        ...(temperature !== undefined ? { temperature: Number(temperature) } : {}),
        ...(maxTokens !== undefined ? { maxTokens: Number(maxTokens) } : {}),
        ...(timeoutMs !== undefined ? { timeoutMs: Number(timeoutMs) } : {}),
      });

      res.status(200).json({
        message: `AI provider configured to ${updated.provider.toUpperCase()} (${updated.model})`,
        config: {
          ...updated,
          apiKey: updated.apiKey && updated.apiKey.length > 8 ? `${updated.apiKey.slice(0, 4)}...${updated.apiKey.slice(-4)}` : 'configured',
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async testHealth(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const testResult = await aiProviderManager.testConnection();
      res.status(200).json(testResult);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Universal Chat Completion Endpoint
   * Used by other microservices (Resume, System Design, Admin)
   * Powered by Meta Llama via Ollama.
   */
  async chatCompletion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { systemPrompt, userPrompt, messages, temperature, maxTokens, responseFormatJson, timeoutMs } = req.body;
      let sys = systemPrompt || 'You are an expert AI assistant powered by Meta Llama.';
      let usr = userPrompt;

      if (Array.isArray(messages) && messages.length > 0) {
        const sysMsg = messages.find((m: any) => m.role === 'system');
        if (sysMsg) sys = sysMsg.content;
        const lastUser = [...messages].reverse().find((m: any) => m.role === 'user');
        if (lastUser) usr = lastUser.content;
      }

      const content = await aiProviderManager.callChatCompletion(
        sys,
        usr || '',
        timeoutMs ? Number(timeoutMs) : undefined,
        Boolean(responseFormatJson)
      );

      res.status(200).json({
        content,
        model: aiProviderManager.getConfig().model,
        provider: 'ollama/llama',
      });
    } catch (error: any) {
      next(error);
    }
  },

  /**
   * Universal Text Generation Endpoint
   * Used by other microservices for prompt-in, text-out tasks
   * Powered by Meta Llama via Ollama.
   */
  async generateText(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prompt, systemPrompt, timeoutMs } = req.body;
      if (!prompt) {
        res.status(400).json({ error: 'Prompt is required' });
        return;
      }

      const text = await aiProviderManager.callChatCompletion(
        systemPrompt || 'You are an expert AI assistant powered by Meta Llama.',
        prompt,
        timeoutMs ? Number(timeoutMs) : undefined
      );

      res.status(200).json({
        text,
        model: aiProviderManager.getConfig().model,
        provider: 'ollama/llama',
      });
    } catch (error: any) {
      next(error);
    }
  },
};
