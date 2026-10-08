import { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import { documentParserService, DocumentParserError } from '../services/documentParser.service.js';
import { bgeAtsService, BgeAtsScorerError } from '../services/bgeAts.service.js';
import {
  competitiveMatchService,
  CompetitiveMatchError,
} from '../services/competitiveMatch.service.js';
import { structuredResumeMapperService } from '../services/structuredResumeMapper.service.js';

export const resumeParserController = {
  /**
   * Dedicated endpoint for isolated resume extraction testing using Docling.
   */
  async parseResume(req: Request, res: Response, next: NextFunction) {
    const file = (req as any).file || (req as any).files?.[0];
    const originalFilename = file?.originalname || 'resume_document';
    const ext = path.extname(originalFilename).toLowerCase();
    const mimeType = file?.mimetype || (ext === '.pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

    try {
      if (!file || !file.buffer) {
        console.warn('[Resume Parser] Upload failed: No file provided.');
        throw new DocumentParserError('No resume file was uploaded. Please choose a PDF or DOCX file.', 400);
      }

      if (ext === '.doc') {
        console.warn(`[Resume Parser] Rejected .doc legacy format: ${originalFilename}`);
        throw new DocumentParserError('DOC files are not supported. Please upload a DOCX file.', 400, 'UnsupportedFormatError');
      }

      if (ext !== '.pdf' && ext !== '.docx') {
        console.warn(`[Resume Parser] Unsupported file format '${ext}' for ${originalFilename}`);
        throw new DocumentParserError(`Unsupported format '${ext}'. Please upload a PDF (.pdf) or Word (.docx) document.`, 400, 'UnsupportedFormatError');
      }

      console.log(`[Resume Parser] File received: ${originalFilename}`);
      console.log(`[Resume Parser] File type: ${mimeType}`);
      console.log(`[Resume Parser] File size: ${file.buffer.length} bytes`);
      console.log(`[Resume Parser] Starting Docling extraction`);

      const parsed = await documentParserService.parseBuffer(
        file.buffer,
        originalFilename
      );

      const characterCount = parsed.character_count || parsed.plain_text?.length || parsed.resumeText?.length || 0;

      console.log(`[Resume Parser] Extraction completed`);
      console.log(`[Resume Parser] Characters extracted: ${characterCount}`);

      // Map Docling output onto the ONE canonical StructuredResume consumed by
      // the Resume workspace (editor + preview + ATS + competitive matcher).
      // Pure consumer of Docling output — extraction itself is untouched.
      const structuredResume = structuredResumeMapperService.mapDoclingToStructuredResume(parsed as any);

      let atsScore = null;
      try {
        const plainText = parsed.plain_text || parsed.resumeText || '';
        if (plainText.trim()) {
          atsScore = await bgeAtsService.scoreResume({
            resumeText: plainText,
            structuredElements: parsed.structured_elements || [],
          });
        }
      } catch (atsErr: any) {
        console.warn('[Resume Parser] Initial ATS scoring warning:', atsErr?.message || atsErr);
      }

      res.status(200).json({
        success: true,
        data: {
          filename: originalFilename,
          fileType: ext.replace('.', ''),
          mimeType: mimeType,
          fileSizeBytes: file.buffer.length,
          pageCount: parsed.page_count || 1,
          characterCount: characterCount,
          plainText: parsed.plain_text || parsed.resumeText || '',
          markdown: parsed.markdown || '',
          sections: parsed.sections || [],
          tables: parsed.tables || [],
          structuredContent: parsed.structured_elements || [],
          structuredResume,
          atsScore,
        },
      });
    } catch (err: any) {
      console.error(`[Resume Parser Error] Extraction failed for ${originalFilename}:`, err?.message || err);
      next(err);
    }
  },

  /**
   * Evaluates role-independent ATS compatibility of English resume text
   * using BAAI/bge-large-en-v1.5 and strict structural heuristics.
   */
  async scoreResumeWithBge(req: Request, res: Response, next: NextFunction) {
    try {
      const { resumeText, structuredElements } = req.body;
      if (!resumeText || !resumeText.trim()) {
        throw new BgeAtsScorerError('resumeText is required for ATS scoring.', 400);
      }

      console.log(`[BGE ATS] Scoring resume (${resumeText.length} chars) in role-independent mode`);
      const result = await bgeAtsService.scoreResume({
        resumeText,
        structuredElements,
      });
      console.log(`[BGE ATS] Score computed: ${result.overallScore}/100 using ${result.model}`);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Combined evaluation: role-independent ATS Score (deterministic six-pillar
   * engine) + Competitive Score (BGE-based resume/JD matcher). The two scores
   * are computed independently and returned separately — never merged.
   *
   * Body: { resumeText, structuredElements?, jobDescription, role? }
   * Response data: { ats: {...}, competitive: {...} }
   */
  async evaluateResume(req: Request, res: Response, next: NextFunction) {
    try {
      const { resumeText, structuredElements, jobDescription, role } = req.body;
      if (!resumeText || !resumeText.trim()) {
        throw new BgeAtsScorerError('resumeText is required for evaluation.', 400);
      }
      if (!jobDescription || !jobDescription.trim()) {
        throw new CompetitiveMatchError('jobDescription is required for the Competitive Score.', 400);
      }

      console.log(`[Resume Evaluate] Scoring resume (${resumeText.length} chars): ATS + Competitive`);

      const [ats, competitive] = await Promise.all([
        bgeAtsService.scoreResume({ resumeText, structuredElements }),
        competitiveMatchService.match({ resumeText, jobDescription, role, structuredElements }),
      ]);

      console.log(
        `[Resume Evaluate] ATS ${ats.overallScore}/100 | Competitive ${
          competitive.status === 'MATCHED' ? `${competitive.score}/100` : 'N/A'
        } (${competitive.modelSource})`
      );

      res.status(200).json({
        success: true,
        data: { ats, competitive },
      });
    } catch (err) {
      next(err);
    }
  },
};
