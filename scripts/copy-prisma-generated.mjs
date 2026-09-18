// ═══════════════════════════════════════════════════════════════
// R U Ready? — Copy Prisma Generated Client Files to Dist
// Copies src/generated to dist/generated across all microservices
// Ensures compiled JavaScript dist/ modules find runtime client files
// ═══════════════════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const servicesDir = path.resolve(__dirname, '../services');

if (fs.existsSync(servicesDir)) {
  const serviceFolders = fs.readdirSync(servicesDir);
  for (const folder of serviceFolders) {
    const srcGenerated = path.join(servicesDir, folder, 'src', 'generated');
    const distGenerated = path.join(servicesDir, folder, 'dist', 'generated');
    if (fs.existsSync(srcGenerated)) {
      fs.cpSync(srcGenerated, distGenerated, { recursive: true });
      console.log(`[Build] Copied Prisma generated client: ${folder}/src/generated -> ${folder}/dist/generated`);
    }
  }
}
