import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from './lib/errors.js';
import oralRoutes from './routes/oral.routes.js';

const app: express.Express = express();
const PORT = parseInt(process.env.ORAL_INTERVIEW_SERVICE_PORT || '4002', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use((req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      (req as any).user = payload;
      if (payload.userId && !req.headers['x-user-id']) {
        req.headers['x-user-id'] = payload.userId;
      }
    } catch {
      // Ignore
    }
  }
  next();
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'Oral Interview Microservice',
    port: PORT,
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/interview/oral', oralRoutes);
app.use('/', oralRoutes);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      requestId,
    });
    return;
  }

  console.error(`[OralInterviewService ${requestId}] Internal Error:`, err);
  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred in Oral Interview Service',
    requestId,
  });
});

app.listen(PORT, () => {
  console.log(`[Oral Interview Service] Running on http://localhost:${PORT}`);
});

export default app;
