import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import roadmapRoutes from './routes/roadmap.routes.js';
import { seedPublicRoadmaps } from './seed-public-roadmaps.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const app: express.Express = express();
const PORT = Number(process.env.ROADMAP_SERVICE_PORT || 3015);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.get('/health', (_req, res) => res.json({ service: 'roadmap-service', status: 'UP', port: PORT, timestamp: new Date().toISOString() }));
app.use('/api/roadmaps', roadmapRoutes);
app.use('/roadmaps', roadmapRoutes);
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const error = err as { status?: number; statusCode?: number; message?: string; name?: string };
  const status = error.name === 'ZodError' ? 400 : error.statusCode || error.status || 500;
  res.status(status).json({ code: error.name === 'ZodError' ? 'VALIDATION_ERROR' : 'ROADMAP_ERROR', message: error.message || 'Internal server error' });
});
app.listen(PORT, () => {
  console.log(`[Roadmap Service] Listening on port ${PORT}`);
  void seedPublicRoadmaps().catch((error) => {
    console.error('[Roadmap Service] Public roadmap seed failed:', error);
  });
});
export default app;
