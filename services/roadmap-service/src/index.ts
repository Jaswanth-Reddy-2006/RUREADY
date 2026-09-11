import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import roadmapRoutes from './routes/roadmap.routes.js';
import discussRoutes from './routes/discuss.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3010;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ service: 'roadmap-service', status: 'UP' });
});

app.use('/api/roadmap', roadmapRoutes);
app.use('/roadmap', roadmapRoutes);

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
