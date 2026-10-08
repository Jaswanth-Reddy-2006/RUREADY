import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BGE_SCORER_SCRIPT_PATH = path.resolve(__dirname, '../../ats/bge_ats_scorer.py');

export interface BgeAtsScoreRequest {
  resumeText: string;
  structuredElements?: any[];
}

export interface BgeAtsScoreResult {
  model: string;
  overallScore: number;
  breakdown: {
    structure: number;
    completeness: number;
    extractability: number;
    skills: number;
    experienceQuality: number;
    formatting: number;
  };
  maxBreakdown: {
    structure: number;
    completeness: number;
    extractability: number;
    skills: number;
    experienceQuality: number;
    formatting: number;
  };
  extractedSkills: string[];
  explicitlyDetectedSkills: string[];
  inferredSkills: string[];
  quantification: {
    densityPercentage: number;
    actionVerbRatio: number;
    quantifiedCount: number;
    totalBullets: number;
  };
  bulletAudits: Array<{
    id: string;
    category?: string;
    original: string;
    hasMetric: boolean;
    hasActionVerb: boolean;
    feedback: string;
  }>;
  strengths: string[];
  improvements: string[];
}

export class BgeAtsScorerError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'BgeAtsScorerError';
    this.statusCode = statusCode;
  }
}

export const bgeAtsService = {
  /**
   * Score an English resume across 6 role-independent ATS pillars (Total 100 max points).
   */
  async scoreResume(params: BgeAtsScoreRequest): Promise<BgeAtsScoreResult> {
    if (!params.resumeText || !params.resumeText.trim()) {
      throw new BgeAtsScorerError('Resume text is required for ATS scoring.', 400);
    }

    const tempDir = os.tmpdir();
    const tempPayloadPath = path.join(
      tempDir,
      `bge_ats_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.json`
    );

    const payload = {
      resumeText: params.resumeText,
      structuredElements: params.structuredElements || null,
    };

    await fs.promises.writeFile(tempPayloadPath, JSON.stringify(payload), 'utf-8');

    const pythonCmd = process.env.PYTHON_PATH || 'python';

    return new Promise((resolve, reject) => {
      const child = spawn(pythonCmd, [BGE_SCORER_SCRIPT_PATH, tempPayloadPath], {
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
          new BgeAtsScorerError(
            `Failed to execute BGE ATS Python scorer: ${err.message}`,
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
            throw new Error(`Invalid output from BGE ATS scorer: ${raw.substring(0, 300)}`);
          }
          const jsonStr = raw.substring(firstBrace, lastBrace + 1);
          const parsedJson = JSON.parse(jsonStr);

          if (!parsedJson.success) {
            return reject(
              new BgeAtsScorerError(
                parsedJson.error || 'BGE ATS scoring calculation failed.',
                500
              )
            );
          }

          resolve(parsedJson.data as BgeAtsScoreResult);
        } catch (jsonErr: any) {
          reject(
            new BgeAtsScorerError(
              `Failed to parse BGE ATS scorer output: ${jsonErr.message || stdoutData.substring(0, 300)}`,
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
      } catch (err) {
        // ignore
      }
    }
  },
};
