import { prisma } from './lib/prisma.js';
import { interviewService } from './services/interview.service.js';

async function main() {
  try {
    console.log('Testing startSession query to diagnose the 500 error...');
    const sessionId = 'cmpf57j110001v8oc59098z5h'; // use the session we created in the previous test
    const userId = 'cmpeeaska0000v8qs52ti4xld';
    
    const result = await interviewService.startSession(sessionId, userId);
    console.log('Successfully started session! First question:', result);
  } catch (error) {
    console.error('Error starting interview session:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
