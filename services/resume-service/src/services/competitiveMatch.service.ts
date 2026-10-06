import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { spawn } from 'node:child_process';
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
  status: 'MATCHED' | 'NOT_RELEVANT';
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

export const competitiveMatchService = {
  /**
   * Compute resume <-> JD competitive matching via the BGE-based Python matcher
   * (fine-tuned model from ml/models/competitive-bge when available, base BGE otherwise).
   * The matcher never trains and never blocks on retraining at startup.
   */
  async match(params: CompetitiveMatchRequest): Promise<CompetitiveMatchResult> {
    if (!params.resumeText || !params.resumeText.trim()) {
      throw new CompetitiveMatchError('Resume text is required for competitive matching.', 400);
    }
    if (!params.jobDescription || !params.jobDescription.trim()) {
      throw new CompetitiveMatchError('Job description is required for competitive matching.', 400);
    }

    const tempPayloadPath = path.join(
      os.tmpdir(),
      `competitive_match_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.json`
    );

    const payload = {
      resumeText: params.resumeText,
      jobDescription: params.jobDescription,
      role: params.role || null,
      structuredElements: params.structuredElements || null,
    };

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

      child.on('close', (code) => {
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
};
