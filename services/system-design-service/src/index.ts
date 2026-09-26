// ═══════════════════════════════════════════════════════════════
// RU Ready? — Interactive AI System Design Microservice
// Port: 4013
// ═══════════════════════════════════════════════════════════════

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import systemDesignRoutes from './routes/systemDesign.routes.js';

dotenv.config();

const app: express.Express = express();
const PORT = parseInt(process.env.PORT || '4013', 10);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Ingress logging
app.use((req: Request, _res: Response, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[SystemDesignService] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Health check
app.get('/api/system-design/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'System Design Studio Microservice',
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/system-design', systemDesignRoutes);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error('[SystemDesignService] Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal System Design Service Error',
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('  ╔═══════════════════════════════════════════════════╗');
    console.log(`  ║    RU Ready? — AI System Design Studio Microservice ║`);
    console.log('  ╠═══════════════════════════════════════════════════╣');
    console.log(`  ║  🚀 Running at: http://localhost:${PORT}             ║`);
    console.log(`  ║  📦 Status: Operational                           ║`);
    console.log('  ╚═══════════════════════════════════════════════════╝');
    console.log('');
  });
}

export default app;
