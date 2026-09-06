// ═══════════════════════════════════════════════════════════════
// R U Ready? — Upload Middleware
// Multer configuration for resume uploads: 5MB, PDF/DOCX only
// ═══════════════════════════════════════════════════════════════

import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
import { ValidationError } from '../lib/errors.js';

// ─── Resolve upload directory ────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store uploads in <project-root>/uploads
const UPLOAD_DIR = path.resolve(__dirname, '../../../uploads');

// Ensure upload directory exists
mkdirSync(UPLOAD_DIR, { recursive: true });

// ─── Allowed MIME types ──────────────────────────────────────

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
]);

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.docx']);

// ─── Size limit ──────────────────────────────────────────────

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ─── Storage configuration ───────────────────────────────────

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    // Generate a unique filename: timestamp-randomhex-originalname
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = file.originalname
      .replace(ext, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);
    cb(null, `${uniqueSuffix}-${safeName}${ext}`);
  },
});

// ─── File filter ─────────────────────────────────────────────

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(new ValidationError('Invalid file type. Only PDF and DOCX files are allowed.'));
    return;
  }

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    cb(new ValidationError('Invalid file extension. Only .pdf and .docx files are allowed.'));
    return;
  }

  cb(null, true);
};

// ─── Multer instance ─────────────────────────────────────────

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1, // Only one file at a time
  },
});

/**
 * Middleware for single resume file upload.
 * Expects the file field to be named "resume".
 * Validates: PDF/DOCX only, max 5MB.
 */
export const uploadResume: import('express').RequestHandler = upload.single('resume');

export { UPLOAD_DIR };
