import { prisma } from './lib/prisma.js';

async function main() {
  try {
    console.log('Testing connection to Prisma database and querying predefined problems...');
    const problems = await prisma.preDefinedProblem.findMany();
    console.log('Successfully connected! Problems found:', problems);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
