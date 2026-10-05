// ═══════════════════════════════════════════════════════════════
// AI Client for Structured Roadmap Generation
// Robust LLM Communication Layer with Retry & Schema Validation
// ═══════════════════════════════════════════════════════════════

import { AIProviderManager, aiProviderManager } from '../lib/ai-provider-manager.js';
import {
  parseAndValidateRoadmapAIResponse,
  parseAndValidateAssessmentAIResponse,
  RoadmapParserError,
} from './response-parser.js';
import { GeneratedRoadmapOutput } from '../validators/roadmap-generation.validator.js';
import { GeneratedAssessmentOutput } from '../validators/assessment-generation.validator.js';

export interface RetryConfig {
  maxRetries: number;
  initialBackoffMs: number;
  backoffMultiplier: number;
  maxBackoffMs: number;
}

export interface RoadmapAIGenerateOptions {
  timeoutMs?: number;
  temperature?: number;
  retryConfig?: Partial<RetryConfig>;
  responseFormatJson?: boolean;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 2,
  initialBackoffMs: 150,
  backoffMultiplier: 2,
  maxBackoffMs: 2000,
};

export class RoadmapAIClient {
  private providerManager: AIProviderManager;
  private defaultRetryConfig: RetryConfig;

  constructor(
    providerManager: AIProviderManager = aiProviderManager,
    retryConfig?: Partial<RetryConfig>
  ) {
    this.providerManager = providerManager;
    this.defaultRetryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  }

  /**
   * Helper to determine if an error is transient and safe to retry.
   */
  public isRetryableError(error: unknown): boolean {
    if (!error) return false;

    // HTTP Status check
    const status = (error as any).status || (error as any).statusCode;
    if (typeof status === 'number') {
      // 429 Too Many Requests, 5xx Server Errors are retryable
      if (status === 429 || (status >= 500 && status <= 599)) {
        return true;
      }
      // 4xx Client Errors are non-retryable
      if (status >= 400 && status < 500) {
        return false;
      }
    }

    // Abort/Timeout/Network errors
    const errMessage = (error as Error).message || '';
    const errName = (error as Error).name || '';

    if (
      errName === 'AbortError' ||
      errMessage.includes('aborted') ||
      errMessage.includes('timeout') ||
      errMessage.includes('fetch failed') ||
      errMessage.includes('ECONNREFUSED') ||
      errMessage.includes('ECONNRESET') ||
      errMessage.includes('ETIMEDOUT')
    ) {
      return true;
    }

    // Schema and JSON parsing failures are retryable with the LLM
    if (error instanceof RoadmapParserError) {
      if (error.code === 'INVALID_JSON' || error.code === 'SCHEMA_VALIDATION_ERROR') {
        return true;
      }
      if (error.code === 'EMPTY_RESPONSE') {
        return false;
      }
    }

    return false;
  }

  /**
   * Generates a validated 3-Pillar Career Roadmap from AI with automated retries.
   */
  public async generateRoadmap(
    systemPrompt: string,
    userPrompt: string,
    options?: RoadmapAIGenerateOptions
  ): Promise<GeneratedRoadmapOutput> {
    const config = this.providerManager.getConfig();

    if (config.provider === 'mock') {
      throw new Error('AI Provider is configured in mock mode. Real LLM invocation bypassed.');
    }

    const retrySettings: RetryConfig = {
      ...this.defaultRetryConfig,
      ...options?.retryConfig,
    };

    let attempt = 0;
    let lastError: unknown = null;
    let currentBackoff = retrySettings.initialBackoffMs;

    while (attempt <= retrySettings.maxRetries) {
      try {
        const rawResponse = await this.providerManager.callChatCompletion(systemPrompt, userPrompt, {
          timeoutMs: options?.timeoutMs || config.timeoutMs,
          temperature: options?.temperature ?? config.temperature,
          responseFormatJson: options?.responseFormatJson ?? true,
        });

        // Strict parsing and Zod schema validation
        return parseAndValidateRoadmapAIResponse(rawResponse);
      } catch (err) {
        lastError = err;
        attempt++;

        if (attempt > retrySettings.maxRetries || !this.isRetryableError(err)) {
          break;
        }

        // Wait before next attempt
        await this.sleep(currentBackoff);
        currentBackoff = Math.min(currentBackoff * retrySettings.backoffMultiplier, retrySettings.maxBackoffMs);
      }
    }

    throw lastError;
  }

  /**
   * Generates a validated technical Micro-Assessment from AI with automated retries.
   */
  public async generateAssessment(
    systemPrompt: string,
    userPrompt: string,
    options?: RoadmapAIGenerateOptions
  ): Promise<GeneratedAssessmentOutput> {
    const config = this.providerManager.getConfig();

    if (config.provider === 'mock') {
      throw new Error('AI Provider is configured in mock mode. Real LLM invocation bypassed.');
    }

    const retrySettings: RetryConfig = {
      ...this.defaultRetryConfig,
      ...options?.retryConfig,
    };

    let attempt = 0;
    let lastError: unknown = null;
    let currentBackoff = retrySettings.initialBackoffMs;

    while (attempt <= retrySettings.maxRetries) {
      try {
        const rawResponse = await this.providerManager.callChatCompletion(systemPrompt, userPrompt, {
          timeoutMs: options?.timeoutMs || config.timeoutMs,
          temperature: options?.temperature ?? config.temperature,
          responseFormatJson: options?.responseFormatJson ?? true,
        });

        // Strict parsing and Zod schema validation
        return parseAndValidateAssessmentAIResponse(rawResponse);
      } catch (err) {
        lastError = err;
        attempt++;

        if (attempt > retrySettings.maxRetries || !this.isRetryableError(err)) {
          break;
        }

        // Wait before next attempt
        await this.sleep(currentBackoff);
        currentBackoff = Math.min(currentBackoff * retrySettings.backoffMultiplier, retrySettings.maxBackoffMs);
      }
    }

    throw lastError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const roadmapAIClient = new RoadmapAIClient();
