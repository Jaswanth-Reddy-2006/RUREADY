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
import userRoutes from './routes/user.routes.js';

const app: express.Express = express();
const PORT = parseInt(process.env.USER_SERVICE_PORT || '4005', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'User Microservice',
    port: PORT,
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/user', userRoutes);
app.use('/', userRoutes);

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

  console.error(`[UserService ${requestId}] Internal Error:`, err);
  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred in User Service',
    requestId,
  });
});

app.listen(PORT, () => {
  console.log(`[User Service] Running on http://localhost:${PORT}`);
});

export default app;
