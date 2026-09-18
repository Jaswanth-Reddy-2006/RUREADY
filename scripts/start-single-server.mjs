// ═══════════════════════════════════════════════════════════════
// R U Ready? — Memory-Efficient Single-Process Backend Server
// Runs API Gateway + all 10 microservices inside ONE V8 process
// Optimizes RAM usage from 550 MB down to ~75 MB for Render Free Tier (512 MB limit)
// ═══════════════════════════════════════════════════════════════

import '../gateway/dist/index.js';
import '../services/auth-service/dist/index.js';
import '../services/oral-interview-service/dist/index.js';
import '../services/ai-analysis-service/dist/index.js';
import '../services/analytics-service/dist/index.js';
import '../services/user-service/dist/index.js';
import '../services/coding-interview-service/dist/index.js';
import '../services/payment-service/dist/index.js';
import '../services/admin-service/dist/index.js';
import '../services/resume-service/dist/index.js';
import '../services/roadmap-service/dist/index.js';

console.log('🚀 All R U Ready backend microservices & API Gateway running in a single process.');
