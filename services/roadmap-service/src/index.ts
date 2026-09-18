import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import roadmapRoutes from './routes/roadmap.routes.js';
import discussRoutes from './routes/discuss.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const app = express();
const PORT = parseInt(process.env.ROADMAP_SERVICE_PORT || '3010', 10);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ service: 'roadmap-service', status: 'UP', port: PORT });
});

// Mount roadmap routes
app.use('/api/roadmap', roadmapRoutes);
app.use('/roadmap', roadmapRoutes);

// Mount discuss routes
app.use('/api/discuss', discussRoutes);
app.use('/discuss', discussRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[RoadmapService Error]:', err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`[Roadmap Microservice] Listening on port ${PORT}`);
});
