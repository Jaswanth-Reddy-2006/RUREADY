const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { PrismaClient } = require('./src/generated/client/index.js');
const prisma = new PrismaClient();

async function main() {
  const session = await prisma.oralSession.findUnique({
    where: { id: 'cmvi97qol0005v8wok7aye3x5' },
    include: { questions: true, chatHistory: true }
  });
  console.log(JSON.stringify(session, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
