// ═══════════════════════════════════════════════════════════════
// RU Ready? — Challenge Microservice Entry Point (Port 4012)
// ═══════════════════════════════════════════════════════════════

import express, { Express } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import challengeRoutes from './routes/challenge.routes.js';
import { setupSocketServer } from './socket/socket.server.js';

dotenv.config();

const app: Express = express();
const server = http.createServer(app);

// Security & Parsing Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'challenge-service',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/challenges', challengeRoutes);

// Setup Socket.IO
const io = setupSocketServer(server);

const PORT = process.env.PORT || 4012;

server.listen(PORT, () => {
  console.log(`[Challenge Service] Running on port ${PORT}`);
  console.log(`[Challenge Service] Socket.IO mounted at /socket.io`);
});

export { app, server, io };
