import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the Python document parser script
const PARSER_SCRIPT_PATH = path.resolve(__dirname, '../../parser/document_parser.py');

export interface ParsedResumeDocument {
  filename: string;
  file_type: string;
  file_size_bytes: number;
  page_count: number;
  character_count: number;
  table_count: number;
  section_count: number;
  sections: Array<{
    title: string;
    level: number;
    page_no?: number;
  }>;
  tables: Array<{
    index: number;
    markdown: string;
    html: string;
    rows: number;
    cols: number;
  }>;
  structured_elements: Array<{
    type: string;
    label: string;
    text?: string;
    markdown?: string;
    html?: string;
    level?: number;
    page_no?: number;
  }>;
  markdown: string;
  plain_text: string;
  resumeText: string;
}

export class DocumentParserError extends Error {
  statusCode: number;
  errorType?: string;

  constructor(message: string, statusCode: number = 400, errorType?: string) {
    super(message);
    this.name = 'DocumentParserError';
    this.statusCode = statusCode;
    this.errorType = errorType;
  }
}

export const documentParserService = {
  /**
   * Parse an uploaded resume buffer using the Docling Python parser.
   */
  async parseBuffer(
    buffer: Buffer,
    originalFilename: string
  ): Promise<ParsedResumeDocument> {
    if (!buffer || buffer.length === 0) {
      throw new DocumentParserError('The uploaded file is empty (0 bytes).', 400);
    }

    const ext = path.extname(originalFilename).toLowerCase();
    if (ext === '.doc') {
      throw new DocumentParserError(
        'Legacy Microsoft Word format (.doc) is not supported by Docling. Please save or export your document as .docx or .pdf and upload again.',
        400,
        'UnsupportedFormatError'
      );
    }

    if (ext !== '.pdf' && ext !== '.docx') {
      throw new DocumentParserError(
        `Unsupported file format '${ext}'. Please upload a PDF (.pdf) or Microsoft Word (.docx) document.`,
        400,
        'UnsupportedFormatError'
      );
    }

    const tempDir = os.tmpdir();
    const tempFilePath = path.join(
      tempDir,
      `resume_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`
    );

    try {
      await fs.promises.writeFile(tempFilePath, buffer);
      return await this.parseFilePath(tempFilePath, originalFilename);
    } finally {
      if (fs.existsSync(tempFilePath)) {
        try {
          await fs.promises.unlink(tempFilePath);
        } catch (cleanupErr) {
          console.warn(`[DocumentParser] Failed to clean up temp file: ${tempFilePath}`, cleanupErr);
        }
      }
    }
  },

  /**
   * Parse a file on disk at a given path using Docling.
   */
  async parseFilePath(
    filePath: string,
    originalFilename: string
  ): Promise<ParsedResumeDocument> {
    const pythonCmd = process.env.PYTHON_PATH || 'python';

    return new Promise((resolve, reject) => {
      const child = spawn(pythonCmd, [PARSER_SCRIPT_PATH, filePath, originalFilename], {
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
        reject(
          new DocumentParserError(
            `Failed to execute Docling Python parser: ${err.message}`,
            500
          )
        );
      });

      child.on('close', (code) => {
        if (code !== 0 && !stdoutData.trim()) {
          return reject(
            new DocumentParserError(
              `Docling parser process failed with exit code ${code}: ${stderrData.trim() || 'Unknown error'}`,
              code === 2 ? 400 : 500
            )
          );
        }

        try {
          const raw = stdoutData.trim();
          const firstBrace = raw.indexOf('{');
          const lastBrace = raw.lastIndexOf('}');
          if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
            throw new Error(`No JSON output returned from Python parser: ${raw.substring(0, 300)}`);
          }
          const jsonStr = raw.substring(firstBrace, lastBrace + 1);
          const parsedJson = JSON.parse(jsonStr);

          if (!parsedJson.success) {
            const status = parsedJson.errorType === 'UnsupportedFormatError' ? 400 : 500;
            return reject(
              new DocumentParserError(
                parsedJson.error || 'Docling document extraction failed.',
                status,
                parsedJson.errorType
              )
            );
          }

          resolve(parsedJson.data as ParsedResumeDocument);
        } catch (jsonErr: any) {
          if (stderrData.trim()) {
            console.warn('[Docling Python Subprocess Notice]:', stderrData.trim());
          }
          reject(
            new DocumentParserError(
              `Failed to parse Docling parser output: ${jsonErr.message || stdoutData.substring(0, 300)}`,
              500
            )
          );
        }
      });
    });
  },
};
