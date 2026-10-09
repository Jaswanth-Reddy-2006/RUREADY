import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { spawn, ChildProcess } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPETITIVE_MATCHER_SCRIPT_PATH = path.resolve(
  __dirname,
  '../../ml/inference/competitive_matcher.py'
);

export interface CompetitiveMatchRequest {
  resumeText: string;
  jobDescription: string;
  role?: string;
  structuredElements?: any[];
}

export interface CompetitiveMatchSignals {
  semanticSimilarity: number;
  skillOverlap: number;
  experienceRelevance: number;
  terminologyMatch: number;
}

export interface CompetitiveMatchResult {
  status: 'MATCHED' | 'NOT_RELEVANT' | 'INSUFFICIENT_JD';
  score: number | null;
  role: string;
  reason?: string;
  model: string;
  modelSource: 'fine-tuned' | 'base-bge';
  weights: Record<string, number>;
  gate: Record<string, number>;
  matchSignals: CompetitiveMatchSignals;
  signalsDetail: {
    rawCosine: number;
    matchedSkills: string[];
    missingSkills: string[];
    resumeSkills: string[];
  };
}

export class CompetitiveMatchError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'CompetitiveMatchError';
    this.statusCode = statusCode;
  }
}

interface QueueItem {
  payload: any;
  startTime: number;
  queueTimer: NodeJS.Timeout | null;
  inferenceTimeoutMs: number;
  resolve: (val: CompetitiveMatchResult) => void;
  reject: (err: Error) => void;
}

interface PendingItem {
  startTime: number;
  inferenceTimer: NodeJS.Timeout;
  resolve: (val: CompetitiveMatchResult) => void;
  reject: (err: Error) => void;
}

// ── Persistent Python worker manager ──────────────────────────────────────────
class BgeWorkerManager {
  private worker: ChildProcess | null = null;
  private isReady = false;
  private readyTimer: NodeJS.Timeout | null = null;
  private queue: QueueItem[] = [];
  private currentPending: PendingItem | null = null;
  private buffer = '';

  private readonly READY_TIMEOUT_MS = 120_000;            // 2 minutes for cold-start model load
  private readonly DEFAULT_INFERENCE_TIMEOUT_MS = 60_000; // 60 seconds per active inference
  private readonly QUEUE_TIMEOUT_MS = 120_000;            // 2 minutes max queue wait time

  private getPythonCmd(): string {
    return process.env.PYTHON_PATH || 'python';
  }

  public ensureWorkerStarted(): void {
    if (this.worker && !this.worker.killed) return;

    try {
      const pythonCmd = this.getPythonCmd();
      this.worker = spawn(pythonCmd, [COMPETITIVE_MATCHER_SCRIPT_PATH, '--server'], {
        windowsHide: true,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      console.log(`[BGE Worker] worker started (PID: ${this.worker.pid || 'unknown'})`);

      this.buffer = '';
      this.isReady = false;

      // Dedicated timer for cold model loading
      if (this.readyTimer) clearTimeout(this.readyTimer);
      this.readyTimer = setTimeout(() => {
        if (!this.isReady) {
          console.error('[BGE Worker] worker failure: ready timeout exceeded during model initialization');
          this.shutdown();
        }
      }, this.READY_TIMEOUT_MS);

      this.worker.stdout?.on('data', (chunk) => {
        this.buffer += chunk.toString('utf-8');
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          try {
            const parsed = JSON.parse(trimmed);
            if (parsed.ready !== undefined) {
              if (this.readyTimer) {
                clearTimeout(this.readyTimer);
                this.readyTimer = null;
              }
              this.isReady = Boolean(parsed.ready);
              console.log('[BGE Worker] model loaded');
              console.log(`[BGE Worker] worker ready (${parsed.model || 'BGE'})`);
              this.processNextInQueue();
              continue;
            }

            if (this.currentPending) {
              const pending = this.currentPending;
              this.currentPending = null;
              clearTimeout(pending.inferenceTimer);
              const duration = Date.now() - pending.startTime;

              if (parsed.success && parsed.data) {
                console.log(`[BGE Worker] inference completed in ${duration}ms`);
                pending.resolve(parsed.data as CompetitiveMatchResult);
              } else {
                console.error('[BGE Worker] worker failure:', parsed.error || 'Competitive match failed');
                pending.reject(new CompetitiveMatchError(parsed.error || 'Competitive match failed', 500));
              }

              this.processNextInQueue();
            }
          } catch (e: any) {
            if (this.currentPending) {
              const pending = this.currentPending;
              this.currentPending = null;
              clearTimeout(pending.inferenceTimer);
              console.error('[BGE Worker] worker failure (parse error):', e.message);
              pending.reject(new CompetitiveMatchError(`Invalid JSON from BGE worker: ${e.message}`, 500));
              this.processNextInQueue();
            }
          }
        }
      });

      this.worker.stderr?.on('data', (data) => {
        const msg = data.toString('utf-8');
        if (!msg.includes('Loading weights') && !msg.includes('warnings.warn')) {
          console.warn('[BGE Worker stderr]', msg.trim());
        }
      });

      this.worker.on('error', (err) => {
        console.error('[BGE Worker] worker failure:', err.message);
        this.cleanup();
      });

      this.worker.on('exit', () => {
        this.cleanup();
      });
    } catch (err: any) {
      console.error('[BGE Worker] worker failure (spawn failed):', err.message);
      this.cleanup();
    }
  }

  private cleanup(): void {
    this.isReady = false;
    if (this.readyTimer) {
      clearTimeout(this.readyTimer);
      this.readyTimer = null;
    }
    this.worker = null;
    if (this.currentPending) {
      const pending = this.currentPending;
      this.currentPending = null;
      clearTimeout(pending.inferenceTimer);
      pending.reject(new CompetitiveMatchError('BGE Worker process exited unexpectedly', 500));
    }
  }

  private processNextInQueue(): void {
    if (!this.isReady || !this.worker || this.currentPending || this.queue.length === 0) {
      return;
    }

    const item = this.queue.shift();
    if (!item) return;

    if (item.queueTimer) {
      clearTimeout(item.queueTimer);
      item.queueTimer = null;
    }

    const inferenceTimer = setTimeout(() => {
      console.error('[BGE Worker] worker failure: operation timed out');
      if (this.currentPending) {
        const pending = this.currentPending;
        this.currentPending = null;
        pending.reject(new Error('BGE worker timeout'));
      }
      // Kill desynchronized worker process so no stale response leaks to future requests
      if (this.worker && !this.worker.killed) {
        try {
          this.worker.kill();
        } catch {
          // ignore
        }
      }
      this.cleanup();
    }, item.inferenceTimeoutMs);

    this.currentPending = {
      resolve: item.resolve,
      reject: item.reject,
      startTime: Date.now(),
      inferenceTimer,
    };

    try {
      console.log('[BGE Worker] inference requested');
      this.worker.stdin?.write(JSON.stringify(item.payload) + '\n');
    } catch (err: any) {
      clearTimeout(inferenceTimer);
      this.currentPending = null;
      console.error('[BGE Worker] worker failure (write error):', err.message);
      item.reject(new CompetitiveMatchError(`Failed to write to BGE worker: ${err.message}`, 500));
      this.processNextInQueue();
    }
  }

  public shutdown(): void {
    if (this.worker && !this.worker.killed) {
      try {
        this.worker.kill();
      } catch {
        // ignore
      }
    }
    this.cleanup();
  }

  public async execute(payload: any, timeoutMs = this.DEFAULT_INFERENCE_TIMEOUT_MS): Promise<CompetitiveMatchResult> {
    this.ensureWorkerStarted();

    return new Promise((resolve, reject) => {
      const queueItem: QueueItem = {
        payload,
        startTime: Date.now(),
        queueTimer: null,
        inferenceTimeoutMs: timeoutMs,
        resolve,
        reject,
      };

      queueItem.queueTimer = setTimeout(() => {
        const idx = this.queue.indexOf(queueItem);
        if (idx !== -1) {
          this.queue.splice(idx, 1);
          console.error('[BGE Worker] worker failure: queue wait timeout exceeded');
          reject(new CompetitiveMatchError('BGE worker queue timeout', 504));
        }
      }, this.QUEUE_TIMEOUT_MS);

      this.queue.push(queueItem);
      this.processNextInQueue();
    });
  }
}

const bgeWorkerManager = new BgeWorkerManager();

export const competitiveMatchService = {
  /**
   * Compute resume <-> JD competitive matching via the BGE-based Python matcher.
   * Leverages persistent worker with warm model cache, with graceful one-shot fallback.
   */
  async match(params: CompetitiveMatchRequest): Promise<CompetitiveMatchResult> {
    if (!params.resumeText || !params.resumeText.trim()) {
      throw new CompetitiveMatchError('Resume text is required for competitive matching.', 400);
    }
    if (!params.jobDescription || !params.jobDescription.trim()) {
      throw new CompetitiveMatchError('Job description is required for competitive matching.', 400);
    }

    const payload = {
      resumeText: params.resumeText,
      jobDescription: params.jobDescription,
      role: params.role || null,
      structuredElements: params.structuredElements || null,
    };

    // Attempt persistent warm-worker execution first
    try {
      return await bgeWorkerManager.execute(payload);
    } catch (workerErr: any) {
      console.warn('[BGE Worker] fallback execution:', workerErr.message);
      return this.matchOneShot(payload);
    }
  },

  async matchOneShot(payload: any): Promise<CompetitiveMatchResult> {
    const tempPayloadPath = path.join(
      os.tmpdir(),
      `competitive_match_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.json`
    );

    await fs.promises.writeFile(tempPayloadPath, JSON.stringify(payload), 'utf-8');
    const pythonCmd = process.env.PYTHON_PATH || 'python';

    return new Promise((resolve, reject) => {
      const child = spawn(pythonCmd, [COMPETITIVE_MATCHER_SCRIPT_PATH, tempPayloadPath], {
        windowsHide: true,
      });

      let stdoutData = '';
      let stderrData = '';

      child.stdout.on('data', (chunk) => {
        stdoutData += chunk.toString('utf-8');
      });

      child.stderr.on('data', (chunk) => {
        stderrData += chunk.toString('utf-8');
      });

      child.on('error', (err) => {
        this.cleanupTemp(tempPayloadPath);
        reject(
          new CompetitiveMatchError(
            `Failed to execute competitive matcher: ${err.message}`,
            500
          )
        );
      });

      child.on('close', () => {
        this.cleanupTemp(tempPayloadPath);

        try {
          const raw = stdoutData.trim();
          const firstBrace = raw.indexOf('{');
          const lastBrace = raw.lastIndexOf('}');
          if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
            throw new Error(
              `Invalid output from competitive matcher: ${raw.substring(0, 300)} ${stderrData.substring(0, 300)}`
            );
          }
          const parsedJson = JSON.parse(raw.substring(firstBrace, lastBrace + 1));

          if (!parsedJson.success) {
            return reject(
              new CompetitiveMatchError(
                parsedJson.error || 'Competitive matching calculation failed.',
                500
              )
            );
          }

          resolve(parsedJson.data as CompetitiveMatchResult);
        } catch (jsonErr: any) {
          reject(
            new CompetitiveMatchError(
              `Failed to parse competitive matcher output: ${jsonErr.message || stdoutData.substring(0, 300)}`,
              500
            )
          );
        }
      });
    });
  },

  async cleanupTemp(filePath: string) {
    if (fs.existsSync(filePath)) {
      try {
        await fs.promises.unlink(filePath);
      } catch {
        // ignore
      }
    }
  },

  shutdown(): void {
    bgeWorkerManager.shutdown();
  },
};

