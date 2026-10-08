import { Request, Response, NextFunction } from 'express';
import { atsService } from '../services/ats.service.js';
import { documentParserService, DocumentParserError } from '../services/documentParser.service.js';

function getUserId(req: Request): string {
  const header = req.headers['x-user-id'];
  if (Array.isArray(header)) return header[0] || 'demo-user-id';
  return header || 'demo-user-id';
}

export const atsController = {
  /**
   * Dedicated endpoint for extracting complete text and structure from an uploaded resume document
   * using Docling without modifying or generating content.
   */
  async extractDocument(req: Request, res: Response, next: NextFunction) {
    const file = (req as any).file || (req as any).files?.[0];
    const filename = file?.originalname || 'document';
    const mimeType = file?.mimetype || 'unknown';

    try {
      if (!file || !file.buffer) {
        console.warn('[Resume] Upload failed: No resume file was uploaded.');
        throw new DocumentParserError('No resume file was uploaded.', 400);
      }

      console.log(`[Resume] File received: ${filename}`);
      console.log(`[Resume] File type: ${mimeType}`);
      console.log(`[Resume] File size: ${file.buffer.length} bytes`);
      console.log(`[Resume] Starting Docling extraction`);

      const parsed = await documentParserService.parseBuffer(
        file.buffer,
        file.originalname || 'resume.pdf'
      );

      console.log(`[Resume] Docling extraction completed`);
      console.log(`[Resume] Extracted characters: ${parsed.character_count || parsed.resumeText?.length || 0}`);
      console.log(`[Resume] Sending response`);

      res.status(200).json({
        success: true,
        data: parsed,
      });
    } catch (err: any) {
      console.error(`[Resume Error] Extraction failed for ${filename}:`, err);
      next(err);
    }
  },

  /**
   * Analyzes candidate resume text against job description for ATS match.
   * If a file is uploaded, extracts high-fidelity text using Docling before analysis.
   */
  async analyze(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      let resumeText = req.body.resumeText || '';
      // Structured Docling elements, when available, are forwarded to the
      // competitive matcher so experience relevance uses real document
      // structure instead of flat-text chunking.
      let structuredElements: any[] | undefined = Array.isArray(req.body.structuredElements)
        ? req.body.structuredElements
        : undefined;

      const file = (req as any).file || (req as any).files?.[0];
      if (file && file.buffer) {
        console.log(`[Resume] File received for ATS analysis: ${file.originalname}`);
        console.log(`[Resume] File type: ${file.mimetype || 'unknown'}`);
        console.log(`[Resume] Starting Docling extraction`);
        
        const parsed = await documentParserService.parseBuffer(
          file.buffer,
          file.originalname || 'resume.pdf'
        );
        resumeText = parsed.resumeText || parsed.plain_text || parsed.markdown || '';
        if (Array.isArray(parsed.structured_elements) && parsed.structured_elements.length) {
          structuredElements = parsed.structured_elements;
        }
        
        console.log(`[Resume] Docling extraction completed`);
        console.log(`[Resume] Extracted characters: ${parsed.character_count || resumeText.length}`);
      }

      const { jobDescription, jobTitle, companyName } = req.body;

      const result = await atsService.analyzeResumeAndJob(
        userId,
        resumeText,
        jobDescription,
        jobTitle,
        companyName,
        structuredElements
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err: any) {
      console.error('[Resume Error] ATS Analysis failed:', err);
      next(err);
    }
  },

  async getAtsMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const id = req.params.id as string;
      const result = await atsService.getAtsMatch(id, userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async launchTailoredSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getUserId(req);
      const id = req.params.id as string;
      const mode = (req.body.mode as 'ORAL' | 'CODING') || 'ORAL';

      const session = await atsService.launchTailoredSession(userId, id, mode);

      res.status(201).json({
        success: true,
        data: session,
      });
    } catch (err) {
      next(err);
    }
  },
};
