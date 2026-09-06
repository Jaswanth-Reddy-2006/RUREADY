// ═══════════════════════════════════════════════════════════════
// R U Ready? — AI Provider Controller
// Dynamic management and health inspection for Local LLM (Ollama) and Cloud Providers
// ═══════════════════════════════════════════════════════════════

import { Request, Response, NextFunction } from 'express';
import { aiProviderManager, type AIProviderType } from '../lib/ai-provider-manager.js';

export const aiController = {
  /**
   * GET /api/ai/config
   * Returns current active provider configuration and status
   */
  async getConfig(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = aiProviderManager.getConfig();
      // Mask API key for security
      const safeConfig = {
        ...config,
        apiKey: config.apiKey && config.apiKey.length > 8 ? `${config.apiKey.slice(0, 4)}...${config.apiKey.slice(-4)}` : (config.apiKey ? 'configured' : ''),
      };
      res.status(200).json(safeConfig);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/ai/config
   * Updates provider settings dynamically at runtime
   */
  async updateConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { provider, baseUrl, apiKey, model, temperature, maxTokens, timeoutMs } = req.body;

      const validProviders: AIProviderType[] = ['ollama', 'openai', 'gemini', 'custom', 'mock'];
      if (provider && !validProviders.includes(provider)) {
        res.status(400).json({
          error: `Invalid provider '${provider}'. Supported: ${validProviders.join(', ')}`,
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

  /**
   * GET /api/ai/health
   * Performs real-time health check / ping to the active AI endpoint
   */
  async testHealth(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const testResult = await aiProviderManager.testConnection();
      res.status(200).json(testResult);
    } catch (error) {
      next(error);
    }
  },
};
