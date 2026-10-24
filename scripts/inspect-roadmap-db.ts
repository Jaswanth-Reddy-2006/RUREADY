import { prisma } from '../services/roadmap-service/src/lib/prisma.js';

async function main() {
  const tables = ['roadmaps', 'roadmap_nodes', 'roadmap_collaborators', 'roadmap_progress', 'roadmap_shares', 'roadmap_templates'];
  for (const table of tables) {
    try {
      const cols: any = await prisma.$queryRawUnsafe(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = '${table}'
        ORDER BY ordinal_position;
      `);
      console.log(`\n=== Table: ${table} (${cols.length} columns) ===`);
      for (const c of cols) {
        console.log(`  - ${c.column_name} (${c.data_type}, nullable: ${c.is_nullable}, default: ${c.column_default})`);
      }
    } catch (e: any) {
      console.error(`Error querying ${table}:`, e.message);
    }
  }
}

main().finally(() => prisma.$disconnect());
